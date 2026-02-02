import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type Profile = Tables<'profiles'>;

type ThemePreference = 'light' | 'dark' | 'system';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: string | null;
  permissions: string[];
  themePreference: ThemePreference;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (metaData?: Record<string, any>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<Profile, "display_name" | "avatar" | "onboarding_completed">>) => Promise<void>;
  updateThemePreference: (theme: ThemePreference) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  signUp: (email: string, password?: string, displayName?: string) => Promise<{ error: Error | null }>;
  // Legacy compatibility
  loginWithEmail: (email: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [themePreference, setThemePreference] = useState<ThemePreference>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme to document
  const applyTheme = (theme: ThemePreference) => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('fresta_theme', theme);
  };

  const fetchProfileAndRole = async (userId: string) => {
    try {
      const [profileRes, roleRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_roles').select('role, permissions').eq('user_id', userId).single()
      ]);

      return {
        profile: profileRes.data as Profile | null,
        role: (roleRes.data as any)?.role ?? 'user',
        permissions: Array.isArray((roleRes.data as any)?.permissions) ? (roleRes.data as any)?.permissions : []
      };
    } catch (err) {
      console.error("fetchProfileAndRole error:", err);
      return { profile: null, role: 'user', permissions: [] };
    }
  };

  const fetchProfile = async (userId: string) => {
    const { profile: p } = await fetchProfileAndRole(userId);
    return p;
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Check if we have a fragment that looks like a Supabase auth response
    // We should NOT release isLoading immediately if we are expecting a session from the URL
    const hasAuthFragment = window.location.hash.includes("access_token=") ||
      window.location.hash.includes("error_description=") ||
      window.location.search.includes("code=");

    if (hasAuthFragment) {
      console.log("AuthProvider: Fragmento de autenticação detectado, aguardando sessão...");
    }

    // 1. Fallback Timeout (Safety Net)
    // We use a local variable to check the state inside the timeout to avoid stale closures
    const timeoutId = setTimeout(() => {
      if (mounted) {
        setIsLoading(current => {
          if (current) {
            console.warn("AuthProvider: Fallback timeout reached. Setting isLoading=false.");
            return false;
          }
          return current;
        });
      }
    }, 5000);

    // 2. Auth State Listener (Single Source of Truth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log("AuthProvider: Auth event observed:", event);

        // Update core state
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Release loading state broadly on key events BEFORE blocking calls
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          // If we have an auth fragment, don't release loading on INITIAL_SESSION if it's null
          // Supabase will emit SIGNED_IN shortly after processing the hash
          if (event === 'INITIAL_SESSION' && !newSession && hasAuthFragment) {
            console.log("AuthProvider: INITIAL_SESSION null but fragment detected, holding loading state...");
          } else {
            console.log("AuthProvider: Releasing loading state via event", event);
            setIsLoading(false);
          }
        }

        // Fetch profile and role if user is logged in
        if (newSession?.user) {
          fetchProfileAndRole(newSession.user.id).then(({ profile: p, role: r, permissions: perms }) => {
            if (mounted) {
              setProfile(p);
              setRole(r);
              setPermissions(perms);
              // Apply theme from profile
              const theme = (p as any)?.theme_preference as ThemePreference || 'system';
              setThemePreference(theme);
              applyTheme(theme);
            }
          });
        } else {
          setProfile(null);
          setRole(null);
          setPermissions([]);
        }
      }
    );

    // 3. Fast check for existing session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;

      if (s) {
        console.log("AuthProvider: Fast path session found");
        setSession(s);
        setUser(s.user);
        setIsLoading(false);
        fetchProfileAndRole(s.user.id).then(({ profile: p, role: r, permissions: perms }) => {
          if (mounted) {
            setProfile(p);
            setRole(r);
            setPermissions(perms);
          }
        });
      } else if (!hasAuthFragment) {
        // Only release loading IF we didn't see an auth fragment
        // If we DO have a fragment, let onAuthStateChange handle it
        console.log("AuthProvider: No session and no fragment, releasing loading");
        setIsLoading(false);
      }
    }).catch(err => {
      console.error("AuthProvider: Erro ao recuperar sessão", err.message);
      if (!hasAuthFragment) setIsLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  // Auto-sync Google Avatar
  useEffect(() => {
    if (user && profile && !profile.avatar) {
      const googleAvatar = user.user_metadata?.avatar_url;
      if (googleAvatar) {
        console.log("AuthProvider: Sincronizando avatar do Google...");
        updateProfile({ avatar: googleAvatar });
      }
    }
  }, [user, profile]);

  // Sign in with magic link
  const signInWithEmail = async (email: string) => {
    setIsLoading(true);

    // SECURITY: Bypass de teste DESABILITADO em produção
    // Para habilitar testes automatizados, defina VITE_ENABLE_TEST_BYPASS=true no .env
    if (email === 'testsprite@fresta.com' && import.meta.env.VITE_ENABLE_TEST_BYPASS === 'true') {
      console.warn('[SEGURANÇA] Bypass de teste ativado - use apenas em ambiente de testes automatizados');
      try {
        const mockUser: any = {
          id: '00000000-0000-0000-0000-000000000000',
          email: 'testsprite@fresta.com',
          user_metadata: { display_name: 'Test Agent' }
        };
        const mockSession: any = { user: mockUser, access_token: 'mock-token' };

        setUser(mockUser);
        setSession(mockSession);
        // SECURITY: Usuário de teste recebe role 'user' por padrão, não 'admin'
        setRole('user');
        setPermissions([]);
        setIsLoading(false);
        return { error: null };
      } catch (err: any) {
        setIsLoading(false);
        return { error: err };
      }
    }

    try {
      // SECURITY: Verificar rate limit antes de permitir login
      type RateLimitResult = { allowed: boolean; attempts: number; max_attempts: number; remaining_seconds: number };

      // Helper para chamar RPC sem erros de TypeScript (funções não estão tipadas)
      const checkRateLimit = async (identifier: string): Promise<RateLimitResult | null> => {
        try {
          const result = await (supabase as any).rpc('check_rate_limit', { p_identifier: identifier });
          return result.data as RateLimitResult | null;
        } catch {
          return null;
        }
      };

      const recordLoginAttempt = (identifier: string, success: boolean) => {
        (supabase as any).rpc('record_login_attempt', {
          p_identifier: identifier,
          p_success: success,
          p_attempt_type: 'email'
        }).catch(() => { });
      };

      const rateLimitData = await checkRateLimit(email.toLowerCase());

      if (rateLimitData && !rateLimitData.allowed) {
        const minutesLeft = Math.ceil((rateLimitData.remaining_seconds || 0) / 60);
        console.warn(`[RATE LIMIT] Email ${email} bloqueado por ${minutesLeft} minutos`);
        setIsLoading(false);
        return {
          error: new Error(`Muitas tentativas de login. Aguarde ${minutesLeft} minuto(s) e tente novamente.`)
        };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
      });

      // SECURITY: Registrar tentativa de login (fire and forget)
      recordLoginAttempt(email.toLowerCase(), !error);

      return { error: error as Error | null };
    } catch (err: any) {
      console.error("AuthProvider: signInWithEmail exception:", err);
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async (metaData?: Record<string, any>) => {
    // Note: Don't set isLoading here - OAuth redirects immediately and setting state causes unnecessary delay
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
          skipBrowserRedirect: false,
          queryParams: metaData ? { ...metaData } : undefined,
          // @ts-ignore - 'data' is valid for metadata in newer runtimes but might be missing in types
          data: metaData,
        },
      });
      return { error: error as Error | null };
    } catch (err: any) {
      console.error("AuthProvider: signInWithGoogle exception:", err);
      return { error: err as Error };
    }
  };

  // Sign out - LIMPA TUDO para evitar auto-login no reload
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();

      // Limpar estado interno
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setPermissions([]);
      setThemePreference('light');

      // SECURITY: Limpar TODOS os dados de localStorage relacionados à auth
      const keysToRemove = [
        'fresta_user_role',
        'fresta_theme',
        'fresta_active_theme',
        'hasSeenOnboarding',
        'sb-olhiedtptokvbbjjmega-auth-token', // Supabase auth token
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Limpar sessionStorage também
      sessionStorage.clear();

      console.log('[AUTH] Logout completo - todos os dados de sessão removidos');
    } catch (err) {
      console.error("AuthProvider: signOut exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (patch: Partial<Pick<Profile, "display_name" | "avatar" | "onboarding_completed">>) => {
    if (!user) return;

    const { error } = await (supabase
      .from('profiles') as any)
      .update(patch)
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      return;
    }

    // Refetch profile
    const { profile: updated } = await fetchProfileAndRole(user.id);
    setProfile(updated);
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    await updateProfile({ onboarding_completed: true });
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  // Sign up
  const signUp = async (email: string, password?: string, displayName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || 'tempPassword123!',
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
      });

      if (error) throw error;

      // Handle profile creation if needed (Supabase trigger usually handles this, but we can be explicit if needed)
      // However, our trigger usually creates the profile. We might want to update it if it just got created.

      return { error: null };
    } catch (err: any) {
      console.error("AuthProvider: signUp exception:", err);
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update theme preference
  const updateThemePreference = async (theme: ThemePreference) => {
    setThemePreference(theme);
    applyTheme(theme);

    if (!user) return;

    try {
      await (supabase
        .from('profiles') as any)
        .update({ theme_preference: theme })
        .eq('id', user.id);
    } catch (err) {
      console.error('Erro ao salvar preferência de tema:', err);
    }
  };

  // Legacy compatibility methods
  const loginWithEmail = (email: string) => {
    signInWithEmail(email);
  };

  const loginWithGoogle = () => {
    signInWithGoogle();
  };

  const logout = async () => {
    await signOut();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      role,
      permissions,
      themePreference,
      isAuthenticated: !!session,
      isLoading,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      updateProfile,
      updateThemePreference,
      completeOnboarding,
      signUp,
      // Legacy
      loginWithEmail,
      loginWithGoogle,
      logout,
    }),
    [user, session, profile, role, permissions, themePreference, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type Profile = Tables<'profiles'>;

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<Profile, "display_name" | "avatar">>) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

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
      console.log("AuthProvider: Auth fragment detected in URL, keeping isLoading=true");
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
          console.log("AuthProvider: Releasing loading state via event", event);
          setIsLoading(false);
        }

        // Fetch profile and role if user is logged in
        if (newSession?.user) {
          fetchProfileAndRole(newSession.user.id).then(({ profile: p, role: r, permissions: perms }) => {
            if (mounted) {
              setProfile(p);
              setRole(r);
              setPermissions(perms);
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
      console.error("AuthProvider: getSession error", err);
      if (!hasAuthFragment) setIsLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with magic link
  const signInWithEmail = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
    });
    setIsLoading(false);
    return { error: error as Error | null };
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
    });
    setIsLoading(false);
    return { error: error as Error | null };
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsLoading(false);
  };

  // Update profile
  const updateProfile = async (patch: Partial<Pick<Profile, "display_name" | "avatar">>) => {
    if (!user) return;

    const { error } = await (supabase
      .from('profiles') as any)
      .update(patch)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    // Refetch profile
    const { profile: updated } = await fetchProfileAndRole(user.id);
    setProfile(updated);
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
      isAuthenticated: !!session,
      isLoading,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      updateProfile,
      // Legacy
      loginWithEmail,
      loginWithGoogle,
      logout,
    }),
    [user, session, profile, role, permissions, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

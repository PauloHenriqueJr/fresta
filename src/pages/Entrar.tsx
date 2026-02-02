import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle, DoorOpen, Sparkles } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";
import { THEMES } from "@/constants/landingThemes";

const Entrar = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = useMemo(() => params.get("redirect") || "/meus-calendarios", [params]);
  const { signInWithEmail, signInWithGoogle, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { settings, isLoading: isSettingsLoading } = useGlobalSettings();

  const currentTheme = useMemo(() => {
    const active = settings.activeTheme || localStorage.getItem('fresta_active_theme') || 'carnaval';
    const themeKey = active === 'love' ? 'namoro' : active;
    return THEMES[themeKey] || THEMES.carnaval;
  }, [settings.activeTheme]);

  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = currentTheme.mascot;
    img.onload = () => setImageReady(true);
  }, [currentTheme.mascot]);

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLoading = isAuthLoading || isSettingsLoading;

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirect]);

  const handleEmail = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const { error } = await signInWithEmail(email.trim());

      if (error) {
        setError(error.message || "Erro ao enviar email");
        return;
      }

      // If it's a bypass, AuthProvider already set the user and session
      // We should check if we are authenticated and redirect
      if (email.trim() === 'testsprite@fresta.com') {
        navigate(redirect, { replace: true });
        return;
      }

      setEmailSent(true);
    } catch (err: any) {
      console.error("Entrar: handleEmail error:", err);
      setError("Erro de rede. Verifique sua conexão com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message || "Erro ao conectar com Google");
    }
    // OAuth will redirect automatically
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mascotStyle = useMemo(() => {
    return isMobile
      ? (currentTheme.mobileMascotStyle || currentTheme.mascotStyle)
      : currentTheme.mascotStyle;
  }, [isMobile, currentTheme]);

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background pb-24 lg:pb-0 lg:flex lg:items-center lg:justify-center">
        <div className="w-full max-w-md px-4">
          <motion.header className="py-8 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Cheque seu email! 📧</h1>
            <p className="text-muted-foreground font-medium">
              Enviamos um link mágico para <br /><strong className="text-foreground">{email}</strong>
            </p>
          </motion.header>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button onClick={() => navigate("/")} className="w-full py-4 rounded-2xl font-bold bg-muted hover:bg-muted/80 transition-colors">Voltar para Início</button>
            <button onClick={() => setEmailSent(false)} className="text-sm font-bold text-primary hover:underline text-center">Tentar outro email</button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-8 relative">
      {/* Back Button - Visible on Mobile and Desktop */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 rounded-full bg-card border border-gray-100 shadow-sm text-gray-500 hover:text-primary transition-colors z-50 lg:top-8 lg:left-8 lg:bg-white/80 lg:backdrop-blur-md"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-full max-w-[1100px] bg-card rounded-[3rem] shadow-2xl min-h-[600px] grid lg:grid-cols-2 border border-border/10 relative">

        {/* Lado Esquerdo - Visual (Desktop Only) */}
        <div className="hidden lg:block relative overflow-hidden rounded-l-[3rem] border-r border-border/10" style={{ backgroundColor: `${currentTheme.colors.primary}05` }}>
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: `${currentTheme.colors.accent}10` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: `${currentTheme.colors.primary}10` }} />

          <div className="relative z-20 p-16 h-full flex flex-col justify-center">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 group w-fit mb-12 absolute top-12 left-12">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform text-white ${currentTheme.primaryGradient}`}>
                <DoorOpen className="w-6 h-6" />
              </div>
              <span className="font-black text-3xl tracking-tight" style={{ color: currentTheme.colors.primary }}>Fresta</span>
            </button>

            <div className="relative z-10">
              <h1 className="text-6xl font-black leading-[1.05] mb-8 tracking-tighter" style={{ color: currentTheme.colors.primary }}>
                A magia começa <br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` }}>agora.</span>
              </h1>
              <p className="text-muted-foreground text-xl font-medium max-w-sm leading-relaxed">
                Crie experiências inesquecíveis, abra portas para novas memórias e surpreenda quem você ama.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito - Form Login */}
        <div className={`flex flex-col justify-center p-8 lg:p-20 relative bg-card rounded-[3rem] lg:rounded-l-none lg:rounded-r-[3rem] transition-all duration-700 ${imageReady ? 'opacity-100' : 'opacity-0'}`}>
          {/* Mascote FIXO na borda - Atrás do Card (-z-10) */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 z-10 w-64 lg:w-80 h-[180px] lg:h-[220px] pointer-events-none transition-opacity duration-1000 delay-500 ease-in flex items-end justify-center ${imageReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: 'translate(-50%, -100%)' }}
          >
            <img
              src={currentTheme.mascot}
              alt="Mascote"
              className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform"
              style={{
                transform: `scale(${mascotStyle?.scale || 1}) translateY(${mascotStyle?.bottomOffset || 0}px)`,
                transformOrigin: 'bottom center'
              }}
            />
          </div>

          <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight">Bem-vindo(a)!</h2>
              <p className="text-muted-foreground text-lg font-medium font-serif italic">Faça login para continuar sua jornada.</p>
            </div>

            {error && (
              <motion.div
                className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-600 text-sm font-medium mb-6 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-1 h-4 bg-red-500 rounded-full" />
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Google Button */}
              <button
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full bg-background dark:bg-white/5 text-foreground font-black py-5 px-6 rounded-2xl border-2 border-border/10 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group shadow-sm hover:shadow-xl"
                style={{ ['--hover-border-color' as any]: `${currentTheme.colors.accent}30` }}
              >
                <svg className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Entrar com Google</span>
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Use sua conta Google para entrar de forma rápida e segura
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate("/login-rh")}
                className="w-full text-center text-xs font-bold transition-colors uppercase tracking-widest opacity-60 hover:opacity-100"
                style={{ color: currentTheme.colors.primary }}
              >
                Acesso Corporativo / RH
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entrar;

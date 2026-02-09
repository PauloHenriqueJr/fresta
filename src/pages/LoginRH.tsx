import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, ArrowRight, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";
import { THEMES } from "@/constants/landingThemes";

export default function LoginRH() {
  const navigate = useNavigate();
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const { settings } = useGlobalSettings();

  const currentTheme = useMemo(() => {
    const active = settings.activeTheme || localStorage.getItem("fresta_active_theme") || "carnaval";
    const themeKey = active === "love" ? "namoro" : active;
    return THEMES[themeKey] || THEMES.carnaval;
  }, [settings.activeTheme]);

  const handleRecovery = async () => {
    if (!recoveryEmail) return;
    setRecoveryStatus("sending");
    setErrorMessage("");

    try {
      // HashRouter-safe redirect
      const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}#/redefinir-senha`;
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, { redirectTo });
      if (error) throw error;
      setRecoveryStatus("sent");
    } catch (err: any) {
      console.error("Recovery error:", err);
      setRecoveryStatus("error");
      setErrorMessage(err.message || "Erro ao enviar e-mail. Tente novamente.");
    }
  };

  const handleLogin = async () => {
    const e = email.trim();
    if (!e || !password) return;
    setLoggingIn(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: e,
        password,
      });
      if (error) throw error;

      // Vai para o Gateway: ele redireciona conforme o role (admin -> /admin, rh -> /b2b).
      navigate("/portal", { replace: true });
    } catch (err: any) {
      console.error("LoginRH login error:", err);
      setErrorMessage(err?.message || "Falha ao entrar. Verifique e-mail e senha.");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Branding/Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at top right, ${currentTheme.colors.primary}, transparent)` }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at bottom left, ${currentTheme.colors.accent}, transparent)` }}
        />
        <div className="absolute inset-0 bg-festive-pattern opacity-10 bg-[length:60px_60px]" />

        <div className="relative z-10 p-20 space-y-8 max-w-xl">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-white leading-tight">
            O futuro do <span className="italic" style={{ color: currentTheme.colors.accent }}>engajamento</span> começa aqui.
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Painel exclusivo para gestores de RH e People Ops.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 bg-background flex flex-col items-center justify-center p-8 md:p-20 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-3 rounded-full bg-muted/50 hover:bg-muted transition-all transition-colors z-50 lg:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="hidden lg:flex absolute top-12 left-12 items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          layout
          className="w-full max-w-md space-y-10"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {isRecovering ? "Recuperar Acesso" : "Acesso Administrativo"}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isRecovering
                ? "Insira seu e-mail para receber um link de redefinição de senha."
                : "Insira suas credenciais corporativas para entrar."}
            </p>
          </div>

          <div className="space-y-6">
            {isRecovering ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {recoveryStatus === "sent" ? (
                  <div className="bg-green-50 rounded-2xl p-6 text-center space-y-4 border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-green-900 text-lg">E-mail Enviado!</h3>
                      <p className="text-sm text-green-700 font-medium">
                        Verifique sua caixa de entrada em <strong>{recoveryEmail}</strong> para redefinir sua senha.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsRecovering(false);
                        setRecoveryStatus("idle");
                      }}
                      className="text-xs font-black uppercase tracking-widest text-green-600 hover:underline"
                    >
                      Voltar ao Login
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">E-mail para Recuperação</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="email"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="rh@suaempresa.com.br"
                          className="w-full bg-muted/30 border border-border/40 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        />
                      </div>
                      {recoveryStatus === "error" && <p className="text-xs text-red-500 font-bold px-2">{errorMessage}</p>}
                    </div>
                    <button
                      onClick={handleRecovery}
                      disabled={recoveryStatus === "sending" || !recoveryEmail}
                      className="w-full py-4 text-white font-black rounded-[1.25rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        boxShadow: `0 10px 25px -5px ${currentTheme.colors.primary}40`,
                      }}
                    >
                      {recoveryStatus === "sending" ? "Enviando..." : "Enviar Link de Recuperação"} <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsRecovering(false)}
                      className="w-full text-center text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancelar e Voltar
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">E-mail Corporativo</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rh@suaempresa.com.br"
                      className="w-full bg-muted/30 border border-border/40 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                      autoComplete="email"
                      disabled={loggingIn}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Senha</label>
                    <button
                      type="button"
                      onClick={() => setIsRecovering(true)}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-muted/30 border border-border/40 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      autoComplete="current-password"
                      disabled={loggingIn}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleLogin();
                      }}
                    />
                  </div>
                  {!!errorMessage && <p className="text-xs text-red-500 font-bold px-2">{errorMessage}</p>}
                </div>

                <button
                  onClick={() => void handleLogin()}
                  disabled={loggingIn || !email.trim() || !password}
                  className="w-full py-4 text-white font-black rounded-[1.25rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    boxShadow: `0 10px 25px -5px ${currentTheme.colors.primary}40`,
                  }}
                >
                  Entrar no Painel <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>

          <div className="pt-8 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Novo por aqui?{" "}
              <button onClick={() => navigate("/contato")} className="text-primary font-black hover:underline">
                Contrate Fresta para sua Empresa
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


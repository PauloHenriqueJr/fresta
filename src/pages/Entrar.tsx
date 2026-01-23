import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";

const Entrar = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = useMemo(() => params.get("redirect") || "/meus-calendarios", [params]);
  const { signInWithEmail, signInWithGoogle, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

    const { error } = await signInWithEmail(email.trim());

    if (error) {
      setError(error.message || "Erro ao enviar email");
      setSubmitting(false);
      return;
    }

    setEmailSent(true);
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message || "Erro ao conectar com Google");
    }
    // OAuth will redirect automatically
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <motion.header
          className="px-4 py-4 flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setEmailSent(false)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Verifique seu email</h1>
          </div>
        </motion.header>

        <div className="px-4">
          <motion.div
            className="bg-card rounded-3xl p-8 shadow-card text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Link enviado!</h2>
            <p className="text-muted-foreground mb-6">
              Enviamos um link mágico para <strong className="text-foreground">{email}</strong>.
              <br />
              Clique no link para entrar.
            </p>
            <p className="text-sm text-muted-foreground">
              Não recebeu? Verifique sua pasta de spam ou{" "}
              <button onClick={() => setEmailSent(false)} className="text-primary font-semibold">
                tente novamente
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0 lg:flex lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-background lg:via-background lg:to-primary/5">
      <div className="w-full lg:max-w-[480px] lg:mx-auto">
        <motion.header
          className="px-4 py-4 flex items-center gap-4 lg:mb-8 lg:p-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors lg:bg-white"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground lg:text-3xl lg:font-black lg:tracking-tighter">Fresta</h1>
            <p className="text-xs text-muted-foreground lg:text-sm lg:font-medium">Acesse sua contagem regressiva mágica</p>
          </div>
        </motion.header>

        <div className="px-4 space-y-4 lg:px-0">
          {error && (
            <motion.div
              className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="bg-card rounded-3xl p-6 shadow-card lg:p-10 lg:rounded-[2.5rem] lg:shadow-2xl lg:shadow-primary/5 lg:border lg:border-border/50 lg:bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center lg:w-12 lg:h-12">
                <Mail className="w-5 h-5 text-primary lg:w-6 lg:h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground lg:text-2xl lg:font-black lg:tracking-tight">Email</h2>
                <p className="hidden lg:block text-sm text-muted-foreground font-medium">Link mágico direto para você</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 lg:hidden">
              Receba um link mágico no seu email para entrar sem senha.
            </p>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-2">Email para acesso</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  disabled={submitting}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmail()}
                  className="w-full p-4 bg-background border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all disabled:opacity-50 lg:bg-muted/30 lg:border-transparent lg:focus:bg-white lg:focus:shadow-xl lg:focus:shadow-primary/10"
                />
              </div>
              <button
                onClick={handleEmail}
                disabled={submitting || !email.trim()}
                className="w-full btn-festive py-5 flex items-center justify-center gap-2 disabled:opacity-50 text-base font-bold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando link...
                  </>
                ) : (
                  "Enviar link mágico"
                )}
              </button>
            </div>
          </motion.div>

          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-sm font-bold text-muted-foreground/30 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <motion.div
            className="bg-card rounded-3xl p-6 shadow-card lg:p-8 lg:rounded-[2rem] lg:shadow-xl lg:bg-white lg:border lg:border-border/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handleGoogle}
              disabled={isLoading}
              className="w-full bg-white text-gray-800 font-bold py-5 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:shadow-black/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continuar com Google</span>
            </button>
          </motion.div>

          <div className="pt-8 border-t border-border/50 space-y-4">
            <p className="text-center text-xs font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-4">
              Para Empresas
            </p>
            <button
              onClick={() => navigate("/login-rh")}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500/5 text-amber-600 font-black text-[10px] tracking-widest uppercase hover:bg-amber-500/10 transition-all border border-amber-500/10"
            >
              Acessar Portal RH / Corporativo
            </button>
            <button
              onClick={() => navigate("/contato")}
              className="w-full text-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              É uma empresa? <span className="underline italic">Contrate o Fresta</span> para seu time
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground py-4 lg:pt-8 font-medium">
            Ao entrar, você concorda com nossos <br className="lg:hidden" />
            <button onClick={() => navigate("/termos")} className="underline hover:text-primary transition-colors">Termos de Uso</button> e <button onClick={() => navigate("/privacidade")} className="underline hover:text-primary transition-colors">Privacidade</button>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Entrar;

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginRH() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex">
            {/* Left Side: Branding/Visual */}
            <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-amber-500/10" />
                <div className="absolute inset-0 bg-festive-pattern opacity-10 bg-[length:60px_60px]" />

                <div className="relative z-10 p-20 space-y-8 max-w-xl">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl">
                        <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-white leading-tight">
                        O futuro do <span className="text-primary italic">engajamento</span> começa aqui.
                    </h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed">
                        Painel exclusivo para gestores de RH e People Ops. Transforme a jornada dos seus colaboradores hoje.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 bg-background flex flex-col items-center justify-center p-8 md:p-20">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-10"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Acesso Administrativo</h1>
                        <p className="text-muted-foreground font-medium">Insira suas credenciais corporativas para entrar.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">E-mail Corporativo</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    placeholder="RH@suaempresa.com.br"
                                    className="w-full bg-muted/30 border border-border/40 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Senha</label>
                                <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Esqueci a senha</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-muted/30 border border-border/40 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/b2b")}
                            className="w-full py-4 bg-primary text-white font-black rounded-[1.25rem] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                        >
                            Entrar no Painel <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="pt-8 text-center">
                        <p className="text-sm text-muted-foreground font-medium">
                            Novo por aqui? <button className="text-primary font-black hover:underline">Contrate Fresta para sua Empresa</button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

import { useEffect } from "react";
import { useAuth } from "@/state/auth/AuthProvider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, User, ChevronRight, ArrowLeft } from "lucide-react";

export default function Gateway() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, role } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated && role) {
            console.log("Gateway: Usuário autenticado com role", role, "- Redirecionando...");
            if (role === 'admin') navigate("/admin");
            else if (role === 'rh') navigate("/b2b");
            else navigate("/meus-calendarios");
        }
    }, [isAuthenticated, isLoading, role, navigate]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-festive-pattern bg-[length:40px_40px] relative overflow-hidden">
            {/* Back Button */}
            <motion.button
                onClick={() => navigate("/")}
                className="absolute top-8 left-8 p-3 rounded-full bg-card/50 backdrop-blur-md border border-border flex items-center gap-2 text-sm font-black hover:bg-card transition-all z-50 lg:top-12 lg:left-12"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-[10px] tracking-widest">VOLTAR AO INÍCIO</span>
            </motion.button>

            {/* Dynamic Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full animate-pulse decoration-5000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full text-center space-y-12 relative z-10"
            >
                <div className="space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-festive mx-auto flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12 hover:rotate-0 transition-transform duration-500">
                        <span className="text-4xl">🚪</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
                        Como deseja <span className="text-primary italic">entrar?</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium max-w-lg mx-auto">
                        Selecione o portal correspondente ao seu perfil para continuar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* B2C Option */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        onClick={() => navigate("/meus-calendarios")}
                        className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl hover:border-primary/50 transition-all group cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <User className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">Portal Pessoal</h3>
                        <p className="text-sm font-medium text-muted-foreground mb-8">
                            Crie e acesse seus calendários individuais, temas sazonais e presentes.
                        </p>
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                            Acessar meus calendários <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </motion.div>

                    {/* B2B Option */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        onClick={() => navigate("/login-rh")}
                        className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl hover:border-amber-500/50 transition-all group cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">Portal Corporativo</h3>
                        <p className="text-sm font-medium text-muted-foreground mb-8">
                            Gestão de RH, campanhas de engajamento e jornadas para colaboradores.
                        </p>
                        <div className="flex items-center gap-2 text-amber-500 font-black uppercase text-xs tracking-widest">
                            Entrar como empresa <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </motion.div>
                </div>

                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">
                    © 2026 Fresta Technologies
                </p>
            </motion.div>
        </div>
    );
}

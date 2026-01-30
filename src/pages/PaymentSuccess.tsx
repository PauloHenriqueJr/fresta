import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
            <FloatingDecorations theme="default" />

            <motion.div
                className="max-w-md w-full bg-card rounded-[3rem] p-10 border border-border/10 shadow-2xl relative z-10 text-center"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative mb-8">
                    <motion.div
                        className="w-24 h-24 rounded-full bg-solidroad-accent/20 flex items-center justify-center mx-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    >
                        <CheckCircle2 className="w-12 h-12 text-solidroad-accent" />
                    </motion.div>

                    <motion.div
                        className="absolute -top-2 -right-2 p-2 bg-solidroad-green rounded-xl shadow-lg rotate-12"
                        animate={{ scale: [1, 1.2, 1], rotate: [12, -12, 12] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Sparkles className="w-5 h-5 text-solidroad-accent" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-black text-foreground tracking-tighter mb-4">
                    Assinatura Ativada! 🥳
                </h1>

                <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                    Parabéns! Agora você é um membro **Plus**. Solte sua criatividade e comece a criar calendários mágicos agora mesmo.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate("/meus-calendarios")}
                        className="w-full h-16 bg-solidroad-accent text-solidroad-text rounded-[1.5rem] font-black text-lg shadow-xl shadow-solidroad-accent/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Calendar className="w-6 h-6" />
                        Ver meus Calendários
                    </button>

                    <button
                        onClick={() => navigate("/criar")}
                        className="w-full h-14 bg-muted text-foreground rounded-[1.25rem] font-bold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all"
                    >
                        Criar novo calendário
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-border/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        Fresta © 2026 • Plus Member
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

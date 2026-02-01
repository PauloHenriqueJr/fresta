import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Gift, Heart, Music, Calendar, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneMockup, QuizAnswer } from "@/components/quiz/PhoneMockup";
import { useAuth } from "@/state/auth/AuthProvider";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { format } from "date-fns";
import { toast } from "sonner";
import confetti from "canvas-confetti";



// Mapeamento de perfil emocional baseado nas respostas
const getProfileName = (answers: QuizAnswer): string => {
    if (answers.recipient === 'namorado' && answers.occasion === 'namoro') return "Conexão Profunda";
    if (answers.occasion === 'aniversario') return "Celebração Especial";
    if (answers.occasion === 'natal') return "Magia das Festas";
    if (answers.recipient === 'mae_pai') return "Gratidão Familiar";
    return "Surpresa Única";
};

export default function CheckoutQuiz() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, signInWithGoogle, isLoading: authLoading } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [showFreeOption, setShowFreeOption] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(true);

    // Parse URL params to build answers object
    const answers: QuizAnswer = {
        recipient: searchParams.get("recipient") || "",
        gender: searchParams.get("gender") || "",
        occasion: searchParams.get("occasion") || "",
        hasMusic: searchParams.get("hasMusic") || "",
        duration: searchParams.get("duration") || "12",
        theme: searchParams.get("theme") || "",
        email: ""
    };

    const profileName = getProfileName(answers);
    const isFromQuiz = searchParams.get("from") === "quiz";

    // Confetti celebration on load from quiz
    useEffect(() => {
        if (isFromQuiz) {
            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#F43F5E', '#10B981', '#3B82F6', '#8B5CF6']
                });
            }, 300);
        }
    }, []);



    // Main CTA: Create FREE calendar and go to VIEWER
    const handleOpenPresent = async () => {
        if (!acceptedTerms) {
            toast.error("Por favor, aceite os termos para abrir seu presente.");
            return;
        }

        setIsCreating(true);

        // Prepare data for the global QuizProcessor in App.tsx
        const quizData = {
            theme: answers.theme || 'surpresa',
            recipient: answers.recipient,
            occasion: answers.occasion,
            timestamp: Date.now()
        };
        localStorage.setItem("fresta_pending_quiz", JSON.stringify(quizData));

        if (!user) {
            // This will trigger a redirect to Google
            await signInWithGoogle();
        } else {
            // If already logged in, we can call processCreation locally or let a trigger handle it.
            // Let's call it locally for immediate feedback if already logged in.
            await processCreation(answers);
            localStorage.removeItem("fresta_pending_quiz");
        }
    };

    const processCreation = async (quizAnswers: QuizAnswer) => {
        if (!user) return;

        try {
            let themeId = quizAnswers.theme || 'surpresa';
            if (quizAnswers.occasion === 'natal') themeId = 'natal';
            if (quizAnswers.occasion === 'aniversario') themeId = 'aniversario';
            if (quizAnswers.recipient === 'namorado' || quizAnswers.occasion === 'namoro') themeId = 'namoro';

            // By default, creating a FREE calendar now for the "WOW" factor
            const calendar = await CalendarsRepository.create({
                ownerId: user.id,
                themeId: themeId,
                title: quizAnswers.recipient === 'namorado' ? "Nosso Amor" :
                    quizAnswers.occasion === 'natal' ? "Feliz Natal" : "Um Presente Especial",
                duration: 7, // Default to 7 days for free tier
                startDate: format(new Date(), "yyyy-MM-dd"),
                privacy: 'private',
                status: 'ativo',
                isPremium: false
            });

            toast.success("Seu presente foi criado!");
            // Redirect to viewer to see the demo of their own gift
            navigate(`/meus-calendarios?from=quiz`);
        } catch (error) {
            console.error("Error creating calendar", error);
            toast.error("Erro ao abrir presente. Tente novamente.");
            setIsCreating(false);
        }
    };





    if (authLoading || isCreating) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-10 h-10 text-rose-500" />
                </motion.div>
                <p className="text-slate-400 font-medium animate-pulse">
                    {isCreating ? "Preparando seu presente..." : "Validando acesso..."}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-rose-500/30 overflow-x-hidden">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 z-50 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </button>

            <div className="container mx-auto px-4 py-12 lg:py-16 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                {/* Left: Mockup */}
                <div className="relative z-10">
                    <div className="absolute -inset-10 bg-rose-500/20 blur-3xl rounded-full opacity-50 animate-pulse" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <PhoneMockup answers={answers} />
                    </motion.div>
                    <p className="text-center text-slate-500 text-xs mt-4 uppercase tracking-widest">Preview do seu gesto</p>
                </div>

                {/* Right: Actions */}
                <div className="max-w-md w-full space-y-6 relative z-20">
                    <AnimatePresence mode="wait">
                        {showFreeOption && user ? (
                            // FREE OPTION SCREEN (after user "gives up")
                            <motion.div
                                key="free-option"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                                        Conta criada!
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold">
                                        Quer testar <span className="text-rose-400">grátis</span>?
                                    </h2>
                                    <p className="text-slate-400 text-sm">
                                        Você já tem uma conta. Experimente o Fresta com um calendário de 7 dias gratuito. Sem compromisso!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleOpenPresent}
                                        variant="outline"
                                        className="w-full py-5 border-slate-700 text-white hover:bg-slate-800"
                                    >
                                        <Gift className="w-5 h-5 mr-2" />
                                        Criar Calendário Grátis (7 dias)
                                    </Button>

                                    <button
                                        onClick={() => setShowFreeOption(false)}
                                        className="w-full py-3 text-slate-500 hover:text-rose-400 text-sm transition-colors"
                                    >
                                        Na verdade, quero o pacote completo →
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            // MAIN CHECKOUT SCREEN
                            <motion.div
                                key="main-checkout"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4 text-center lg:text-left">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Resultado Pronto
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-3xl md:text-4xl font-black tracking-tight leading-tight"
                                    >
                                        Sua surpresa está{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                                            incrível.
                                        </span>
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-slate-400 leading-relaxed"
                                    >
                                        Personalizamos o tema perfeito para emocionar quem você ama.
                                        A trilha sonora vai criar o clima exato.
                                        <br />
                                        <strong className="text-white">Abra seu presente agora e veja como ficou.</strong>
                                    </motion.p>
                                </div>

                                {/* Feature Pills */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-2 justify-center lg:justify-start"
                                >
                                    {[
                                        { icon: Heart, label: `Perfil: ${profileName}` },
                                        { icon: Calendar, label: `${answers.duration || 12} dias` },
                                        { icon: Music, label: "Trilha sonora" },
                                    ].map((item, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs">
                                            <item.icon className="w-3 h-3 text-rose-400" />
                                            {item.label}
                                        </span>
                                    ))}
                                </motion.div>

                                {/* Consent Checkbox */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55 }}
                                    className="pt-2 flex items-start gap-3"
                                >
                                    <Checkbox
                                        id="consent"
                                        checked={acceptedTerms}
                                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                                        className="mt-1 border-slate-600 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                    />
                                    <label
                                        htmlFor="consent"
                                        className="text-xs text-slate-400 leading-tight cursor-pointer"
                                    >
                                        Ao clicar abaixo, aceito os <Link to="/termos" onClick={(e) => e.stopPropagation()} className="text-rose-400 underline">Termos</Link> e concordo em receber comunicações do Fresta por email.
                                    </label>
                                </motion.div>

                                {/* Main CTA */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="pt-2"
                                >
                                    <Button
                                        onClick={handleOpenPresent}
                                        size="lg"
                                        className="w-full h-auto py-5 text-lg font-bold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-xl shadow-rose-500/20 group relative overflow-hidden border-none"
                                    >
                                        {/* Shine Effect */}
                                        <motion.div
                                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                                            initial={{ x: "-150%" }}
                                            animate={{ x: "150%" }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                repeatDelay: 3,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <span className="relative flex items-center gap-3">
                                            Abrir meu Presente
                                            <ChevronRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </motion.div>

                                {/* Footer */}
                                <div className="pt-6 text-center space-y-3">
                                    <p className="text-[10px] text-slate-600">
                                        <Link to="/termos" className="hover:text-slate-400 underline">Termos de Uso</Link>
                                        {" · "}
                                        <Link to="/privacidade" className="hover:text-slate-400 underline">Política de Privacidade</Link>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Gift, ArrowLeft, Check, Sparkles, Music, Calendar, Star, ChevronRight, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useAuth } from "@/state/auth/AuthProvider";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { format } from "date-fns";
import { toast } from "sonner";

// --- Types ---
interface QuizAnswer {
    recipient: string;
    gender: string; // Novo campo
    occasion: string;
    hasMusic: string;
    duration: string;
    email: string;
}

interface StepOption {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

// --- Configuration ---
const STEPS = {
    recipient: {
        question: "Para quem é o presente?",
        subtitle: "Vamos personalizar a experiência para essa pessoa.",
        options: [
            { id: "namorado", label: "Meu Amor", description: "Namorado(a), Marido/Esposa", icon: <Heart className="w-8 h-8" />, color: "bg-rose-50 border-rose-200 text-rose-600" },
            { id: "mae_pai", label: "Família", description: "Mãe, Pai, Avós", icon: <Gift className="w-8 h-8" />, color: "bg-amber-50 border-amber-200 text-amber-600" },
            { id: "amigo", label: "Amigo(a)", description: "Best friend, Irmão(ã)", icon: <Star className="w-8 h-8" />, color: "bg-sky-50 border-sky-200 text-sky-600" },
            { id: "outro", label: "Alguém Especial", description: "Outra pessoa importante", icon: <Sparkles className="w-8 h-8" />, color: "bg-purple-50 border-purple-200 text-purple-600" },
        ] as StepOption[]
    },
    gender: { // Novo Passo
        question: "Essa pessoa é...",
        subtitle: "Ajuda a ajustar os textos e o design.",
        options: [
            { id: "ela", label: "Ela", description: "A homenageada", icon: <User className="w-8 h-8" />, color: "bg-pink-50 border-pink-200 text-pink-600" },
            { id: "ele", label: "Ele", description: "O homenageado", icon: <User className="w-8 h-8" />, color: "bg-blue-50 border-blue-200 text-blue-600" },
        ] as StepOption[]
    },
    occasion: {
        question: "Qual é a ocasião?",
        subtitle: "O tema visual será ajustado para este momento.",
        options: [
            { id: "namoro", label: "Dia dos Namorados", description: "Romântico e apaixonante", icon: <Heart className="w-8 h-8" />, color: "bg-red-50 border-red-200 text-red-600" },
            { id: "aniversario", label: "Aniversário", description: "Festivo e celebração", icon: <Gift className="w-8 h-8" />, color: "bg-blue-50 border-blue-200 text-blue-600" },
            { id: "natal", label: "Natal", description: "Mágico e acolhedor", icon: <Star className="w-8 h-8" />, color: "bg-green-50 border-green-200 text-green-600" },
            { id: "surpresa", label: "Só porque amo", description: "Um gesto espontâneo", icon: <Sparkles className="w-8 h-8" />, color: "bg-pink-50 border-pink-200 text-pink-600" },
        ] as StepOption[]
    },
    hasMusic: {
        question: "Vamos adicionar trilha sonora?",
        subtitle: "Música conecta emoções instantaneamente.",
        options: [
            { id: "spotify", label: "Sim, do Spotify", description: "Playlist ou música favorita", icon: <Music className="w-8 h-8" />, color: "bg-green-50 border-green-200 text-green-600" },
            { id: "youtube", label: "Sim, do YouTube", description: "Vídeo ou clipe especial", icon: <Music className="w-8 h-8" />, color: "bg-red-50 border-red-200 text-red-600" },
            { id: "quero", label: "Decidir depois", description: "Adicionar na edição", icon: <Sparkles className="w-8 h-8" />, color: "bg-slate-50 border-slate-200 text-slate-600" },
        ] as StepOption[]
    },
    duration: {
        question: "Quantos dias de surpresas?",
        subtitle: "Cada dia é uma nova carta ou presente digital para abrir.",
        options: [
            { id: "7", label: "7 Dias", description: "Uma semana perfeita", icon: <Calendar className="w-8 h-8" />, color: "bg-orange-50 border-orange-200 text-orange-600" },
            { id: "12", label: "12 Dias", description: "Jornada emocionante", icon: <Calendar className="w-8 h-8" />, color: "bg-purple-50 border-purple-200 text-purple-600" },
            { id: "30", label: "30 Dias", description: "Um mês inesquecível", icon: <Calendar className="w-8 h-8" />, color: "bg-rose-50 border-rose-200 text-rose-600" },
        ] as StepOption[]
    }
};

// Adicionado 'gender' na ordem
const STEP_ORDER = ["recipient", "gender", "occasion", "hasMusic", "duration"] as const;

// --- Components ---

// 1. Phone Mockup Preview
const PhoneMockup = ({ answers }: { answers: QuizAnswer }) => {
    const themeColors = {
        namoro: "bg-gradient-to-br from-rose-400 to-red-500",
        aniversario: "bg-gradient-to-br from-sky-400 to-blue-500",
        natal: "bg-gradient-to-br from-green-600 to-red-600",
        masculino: "bg-gradient-to-br from-slate-700 to-slate-900",
        feminino: "bg-gradient-to-br from-pink-300 to-rose-400",
        surpresa: "bg-gradient-to-br from-violet-400 to-purple-600",
    };

    // Lógica de Título Dinâmico
    const getTitle = () => {
        if (answers.occasion === 'natal') return "Feliz Natal!";
        if (answers.occasion === 'aniversario') return "Parabéns!";
        if (answers.recipient === 'namorado') return "Para meu Amor";
        if (answers.recipient === 'mae_pai') return "Para Família";
        if (answers.recipient === 'amigo') return "Para Alguém Especial";
        return "Surpresa!";
    };

    // Logica de Seleção de Tema Visual
    const getVisualTheme = () => {
        if (answers.occasion === 'natal') return 'natal';
        if (answers.occasion === 'aniversario') return 'aniversario';
        if (answers.recipient === 'namorado' || answers.occasion === 'namoro') return 'namoro';
        // Fallback baseado em gênero se for surpresa/neutro
        if (answers.gender === 'ele') return 'masculino';
        if (answers.gender === 'ela') return 'feminino';
        return 'surpresa';
    };

    const bgClass = themeColors[getVisualTheme()] || themeColors.surpresa;

    return (
        <div className="relative mx-auto w-[260px] h-[520px] md:w-[280px] md:h-[580px] bg-slate-900 rounded-[2.5rem] border-8 border-slate-900 shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02]">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-2xl z-20"></div>

            {/* Screen Content */}
            <div className={cn("w-full h-full flex flex-col pt-12 relative", bgClass)}>
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Header */}
                <div className="px-6 text-white text-center relative z-10">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        {answers.occasion === 'natal' ? <Star className="text-white w-7 h-7 md:w-8 md:h-8" /> : <Heart className="text-white w-7 h-7 md:w-8 md:h-8 fill-current" />}
                    </div>
                    <h3 className="font-bold text-lg md:text-xl leading-tight mb-1">{getTitle()}</h3>
                    <p className="text-[10px] md:text-xs text-white/80 font-medium tracking-wide uppercase">
                        {answers.duration || "12"} {answers.duration === "1" ? "dia" : "dias"} de surpresas
                    </p>
                </div>

                {/* Days Grid Mockup */}
                <div className="flex-1 px-4 pt-6 md:pt-8 grid grid-cols-3 gap-2 md:gap-3 content-start overflow-hidden relative z-10">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "aspect-[3/4] rounded-xl flex items-center justify-center text-sm font-bold shadow-sm relative overflow-hidden",
                                i === 0 ? "bg-white text-rose-500" : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
                            )}
                        >
                            {i === 0 ? (
                                <span className="text-lg">1</span>
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Bar Mockup */}
                <div className="h-14 md:h-16 bg-black/20 backdrop-blur-md mt-auto flex items-center justify-around px-6">
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform -translate-y-3 md:-translate-y-4">
                        <Heart className="w-5 h-5 md:w-6 md:h-6 text-rose-500 fill-current" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                </div>
            </div>
        </div>
    );
};

const QuizLanding = () => {
    const navigate = useNavigate();
    const { user, signInWithGoogle, isLoading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswer>({
        recipient: "",
        gender: "",
        occasion: "",
        hasMusic: "",
        duration: "",
        email: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Gerando...");
    const containerRef = useRef<HTMLDivElement>(null);

    const stepKey = STEP_ORDER[currentStep];
    const stepConfig = STEPS[stepKey];
    const progress = ((currentStep + 1) / (STEP_ORDER.length + 1)) * 100;

    // Lógica de Recomendação Assertiva
    const getRecommendedTheme = (recipient: string, occasion: string): string => {
        if (occasion === 'natal') return 'natal';
        if (occasion === 'aniversario') return 'aniversario';
        if (recipient === 'namorado') return 'namoro';
        if (occasion === 'namoro') return 'namoro';
        return 'aniversario';
    };

    // Logic moved to global QuizProcessor in App.tsx
    useEffect(() => {
        // No longer needed locally
    }, []);

    // Handler para criar presente
    const handleCreatePresent = async () => {
        const recommendedTheme = getRecommendedTheme(answers.recipient, answers.occasion);

        // Salvar dados no localStorage de forma padronizada
        const quizData = {
            theme: recommendedTheme,
            recipient: answers.recipient,
            occasion: answers.occasion,
            timestamp: Date.now()
        };
        localStorage.setItem("fresta_pending_quiz", JSON.stringify(quizData));

        setIsLoading(true);
        setLoadingMessage("Preparando...");

        if (!user) {
            // Precisa fazer login primeiro
            await signInWithGoogle();
            // Após login, o useEffect vai processar
        } else {
            // Já logado, criar direto
            setLoadingMessage("Criando seu presente...");
            try {
                const themeId = recommendedTheme;
                const duration = Math.min(parseInt(answers.duration || "7"), 7);

                const calendar = await CalendarsRepository.create({
                    ownerId: user.id,
                    themeId: themeId,
                    title: answers.recipient === 'namorado' ? "Nosso Amor" :
                        answers.occasion === 'natal' ? "Feliz Natal" : "Um Presente Especial",
                    duration: duration,
                    startDate: format(new Date(), "yyyy-MM-dd"),
                    privacy: 'private',
                    status: 'ativo',
                    isPremium: false
                });

                localStorage.removeItem("fresta_pending_quiz");
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#F43F5E', '#10B981', '#3B82F6'] });
                toast.success("Presente criado com sucesso!");

                setTimeout(() => {
                    navigate(`/meus-calendarios?from=quiz`);
                }, 1000);
            } catch (e) {
                console.error("Erro ao criar calendário", e);
                toast.error("Erro ao criar. Tente novamente.");
                setIsLoading(false);
            }
        }
    };

    const handleSelect = (optionId: string) => {
        setAnswers(prev => ({ ...prev, [stepKey]: optionId }));
        setTimeout(() => {
            if (currentStep < STEP_ORDER.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                // Quiz completo - redireciona para tela escura de checkout
                const updatedAnswers = { ...answers, [stepKey]: optionId };
                const recommendedTheme = getRecommendedTheme(updatedAnswers.recipient, updatedAnswers.occasion);
                navigate(`/checkout?theme=${recommendedTheme}&duration=${updatedAnswers.duration || '7'}&recipient=${updatedAnswers.recipient}&occasion=${updatedAnswers.occasion}&from=quiz`);
            }
        }, 300);
    };
    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    // --- Render Steps View ---
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-200 z-50">
                <motion.div
                    className="h-full bg-slate-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <div className="bg-white max-w-5xl w-full min-h-[500px] md:min-h-[600px] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex border border-slate-100">

                {/* Left Panel: Static/Decor */}
                <div className="hidden lg:flex w-1/3 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                    <div className="relative z-10">
                        {/* Botão de Voltar Desktop Condicional */}
                        <div className="h-8 flex items-center">
                            {currentStep > 0 && (
                                <div className="flex items-center gap-2 text-white/50 cursor-pointer hover:text-white transition-colors" onClick={handleBack}>
                                    <ArrowLeft className="w-5 h-5" /> <span>Voltar</span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl font-black leading-tight tracking-tight mb-4 mt-4">
                            Crie um gesto<br />inesquecível.
                        </h1>
                        <p className="text-slate-400 leading-relaxed">
                            Em poucos passos, transformamos suas memórias em uma experiência digital emocionante.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px]`}>✨</div>
                                ))}
                            </div>
                            <span className="text-sm font-bold">+12k Gestos Criados</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Interactive Form */}
                <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col relative overflow-hidden">

                    {currentStep > 0 && (
                        <button onClick={handleBack} className="absolute top-6 md:top-8 left-6 md:left-8 p-2 rounded-full hover:bg-slate-100 transition-colors lg:hidden">
                            <ArrowLeft className="w-6 h-6 text-slate-400" />
                        </button>
                    )}

                    <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full pt-12 md:pt-0">
                        <header className="mb-8 md:mb-10 text-center lg:text-left">
                            <span className="text-xs md:text-sm font-bold text-rose-500 uppercase tracking-widest mb-2 block">
                                Passo {currentStep + 1} de {STEP_ORDER.length}
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                {stepConfig.question}
                            </h2>
                            <p className="text-slate-500 text-base md:text-lg">
                                {stepConfig.subtitle}
                            </p>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <AnimatePresence mode="popLayout">
                                {stepConfig.options.map((option, idx) => (
                                    <motion.button
                                        key={option.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => handleSelect(option.id)}
                                        className={cn(
                                            "group text-left p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all duration-300 relative overflow-hidden hover:shadow-xl hover:-translate-y-1",
                                            answers[stepKey] === option.id
                                                ? "border-rose-500 bg-rose-50 ring-4 ring-rose-100"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-colors",
                                            option.color
                                        )}>
                                            {option.icon}
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 leading-tight group-hover:text-rose-600 transition-colors">
                                            {option.label}
                                        </h3>
                                        <p className="text-xs md:text-sm text-slate-500 font-medium">
                                            {option.description}
                                        </p>

                                        {answers[stepKey] === option.id && (
                                            <div className="absolute top-4 right-4 text-rose-500">
                                                <Check className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Legal Footer for Mobile */}
                    <div className="mt-8 text-center lg:hidden pb-4">
                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                            <Link to="/termos">Termos</Link> • <Link to="/privacidade">Privacidade</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QuizLanding;

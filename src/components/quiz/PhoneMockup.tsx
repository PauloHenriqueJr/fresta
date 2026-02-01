import { Heart, Star, Sparkles, Gift, Music, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizAnswer {
    recipient: string;
    gender: string;
    occasion: string;
    hasMusic: string;
    duration: string;
    email: string;
    theme?: string; // Optional override
}

export const PhoneMockup = ({ answers }: { answers: QuizAnswer }) => {
    const themeColors: Record<string, string> = {
        namoro: "bg-gradient-to-br from-rose-400 to-red-500",
        aniversario: "bg-gradient-to-br from-sky-400 to-blue-500",
        natal: "bg-gradient-to-br from-green-600 to-red-600",
        masculino: "bg-gradient-to-br from-slate-700 to-slate-900",
        feminino: "bg-gradient-to-br from-pink-300 to-rose-400",
        surpresa: "bg-gradient-to-br from-violet-400 to-purple-600",
    };

    // Lógica de Seleção de Tema Visual
    const getVisualTheme = () => {
        if (answers.theme) return answers.theme;
        if (answers.occasion === 'natal') return 'natal';
        if (answers.occasion === 'aniversario') return 'aniversario';
        if (answers.recipient === 'namorado' || answers.occasion === 'namoro') return 'namoro';
        // Fallback baseado em gênero
        if (answers.gender === 'ele') return 'masculino';
        if (answers.gender === 'ela') return 'feminino';
        return 'surpresa';
    };

    const bgClass = themeColors[getVisualTheme()] || themeColors.surpresa;

    // Lógica de Título Dinâmico
    const getTitle = () => {
        if (answers.occasion === 'natal') return "Feliz Natal!";
        if (answers.occasion === 'aniversario') return "Parabéns!";
        if (answers.recipient === 'namorado') return "Para meu Amor";
        if (answers.recipient === 'mae_pai') return "Para Família";
        if (answers.recipient === 'amigo') return "Para Alguém Especial";
        return "Surpresa!";
    };

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

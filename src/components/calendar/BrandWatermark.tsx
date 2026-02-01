import { DoorOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandWatermarkProps {
    className?: string;
    theme?: string;
    variant?: 'compact' | 'impact';
}

export const BrandWatermark = ({ className, theme, variant = 'impact' }: BrandWatermarkProps) => {
    // COMPACT VERSION (Header/Top) - More visible with solid background
    if (variant === 'compact') {
        return (
            <a
                href="https://fresta.storyspark.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full",
                    "bg-slate-900/90 backdrop-blur-md border border-slate-700/50",
                    "transition-all hover:scale-105 active:scale-95 group shadow-lg",
                    className
                )}
            >
                <div className="w-5 h-5 rounded-lg bg-solidroad-accent flex items-center justify-center text-solidroad-text">
                    <DoorOpen className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black tracking-tight text-white uppercase drop-shadow-sm">
                    Fresta
                </span>
                <span className="text-[8px] font-bold text-solidroad-accent uppercase tracking-tighter ml-1">
                    Grátis
                </span>
            </a>
        );
    }

    // IMPACT VERSION (Footer) - High visibility with solid dark background
    return (
        <a
            href="https://fresta.storyspark.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group relative flex flex-col items-center gap-3 p-8 rounded-[3rem] transition-all hover:scale-105 active:scale-95",
                "bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl",
                className
            )}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-solidroad-accent flex items-center justify-center text-solidroad-text shadow-glow-accent group-hover:rotate-12 transition-transform duration-500">
                    <DoorOpen className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter text-white leading-none drop-shadow-md">
                        FRESTA
                    </span>
                    <span className="text-[10px] font-black text-solidroad-accent uppercase tracking-widest leading-none mt-1">
                        Crie o seu grátis
                    </span>
                </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Feito com ❤️ em fresta.storyspark.com.br
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
        </a>
    );
};

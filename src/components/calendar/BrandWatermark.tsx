import { DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandWatermarkProps {
    className?: string;
    theme?: string;
}

export const BrandWatermark = ({ className, theme }: BrandWatermarkProps) => {
    return (
        <a
            href="https://fresta.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex flex-col items-center gap-1.5 transition-all hover:scale-105 active:scale-95 group",
                className
            )}
        >
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-solidroad-accent flex items-center justify-center text-solidroad-text shadow-glow-accent group-hover:shadow-xl transition-shadow">
                    <DoorOpen className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-black tracking-tight text-foreground/40 group-hover:text-foreground/70 transition-colors uppercase">
                    Fresta
                </span>
            </div>
            <span className="text-[7px] font-black text-muted-foreground/30 group-hover:text-muted-foreground/50 uppercase tracking-[0.2em] leading-none transition-colors">
                Criado com amor em fresta.com.br
            </span>
        </a>
    );
};

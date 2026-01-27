import { motion } from "framer-motion";
import { DoorOpen } from "lucide-react";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";
import { cn } from "@/lib/utils";

interface LoaderProps {
    text?: string;
    className?: string;
}

const Loader = ({ text, className }: LoaderProps) => {
    // Inside the SaaS, the colors are fixed to match the B2C identity (sidebar/logo)
    // regardless of the seasonal theme applied to the landing page.
    const colors = {
        icon: "text-solidroad-text",   // Dark green/text signature
        iconBg: "bg-solidroad-accent", // Yellow accent signature
        text: "text-solidroad-accent",
        progress: "bg-solidroad-accent"
    };

    return (
        <div className={cn("min-h-screen flex flex-col items-center justify-center bg-background p-6 animate-in fade-in duration-1000", className)}>
            <div className="relative mb-8">
                {/* Glow effect matching brand yellow */}
                <div className="absolute inset-0 blur-3xl rounded-full scale-150 animate-pulse opacity-20 bg-solidroad-accent" />

                <div className="relative w-20 h-20 rounded-[2.5rem] bg-white dark:bg-card flex items-center justify-center border border-primary/10 shadow-2xl shadow-primary/5">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500", colors.iconBg)}>
                        <DoorOpen className={cn("w-6 h-6 animate-bounce", colors.icon)} strokeWidth={2.5} style={{ animationDuration: '2s' }} />
                    </div>
                </div>
            </div>

            <div className="space-y-4 text-center">
                <div className="h-1 w-32 bg-primary/10 rounded-full overflow-hidden mx-auto">
                    <div className={cn("h-full animate-progress-loading", colors.progress)} />
                </div>
                <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 animate-pulse", colors.text)}>
                    {text || "Sua porta está abrindo..."}
                </p>
            </div>
        </div>
    );
};

export default Loader;

/**
 * DynamicCalendarMockup - Renders a realistic iPhone with themed calendar preview
 * Changes automatically based on the active landing page theme
 */

import { motion } from "framer-motion";
import { Heart, Lock, Eye, Home, Grid3x3, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Theme-specific configurations for the mockup
const MOCKUP_THEMES = {
    namoro: {
        id: "namoro",
        name: "Mensagens de amor",
        subtitle: "Uma jornada de amor para nós dois",
        progressLabel: "de puro amor",
        progressPercent: 0,
        colors: {
            bg: "bg-gradient-to-b from-pink-50 to-rose-100",
            headerBg: "bg-rose-50",
            title: "text-rose-600",
            subtitle: "text-gray-600",
            cardBg: "bg-rose-50/80",
            cardBorder: "border-rose-200",
            button: "bg-rose-500 text-white",
            progress: "bg-rose-500",
            progressBg: "bg-rose-200",
            accent: "text-rose-500",
            nav: "bg-pink-50/95 border-pink-100",
            navActive: "text-rose-500",
            navInactive: "text-gray-400"
        },
        decorations: "hearts",
        buttonText: "Abrir ❤️",
    },
    carnaval: {
        id: "carnaval",
        name: "Festival das Luzes",
        subtitle: "Contagem regressiva para a folia!",
        progressLabel: "de festa",
        progressPercent: 25,
        colors: {
            bg: "bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900",
            headerBg: "bg-purple-800/50",
            title: "text-amber-400",
            subtitle: "text-purple-200",
            cardBg: "bg-purple-800/60 backdrop-blur",
            cardBorder: "border-purple-600",
            button: "bg-amber-500 text-purple-900",
            progress: "bg-amber-500",
            progressBg: "bg-purple-700",
            accent: "text-amber-400",
            nav: "bg-purple-900/95 border-purple-700",
            navActive: "text-amber-400",
            navInactive: "text-purple-400"
        },
        decorations: "confetti",
        buttonText: "Revelar 🎉",
    },
    saojoao: {
        id: "saojoao",
        name: "Festa Junina",
        subtitle: "Contagem para o arraial!",
        progressLabel: "de arraiá",
        progressPercent: 50,
        colors: {
            bg: "bg-gradient-to-b from-amber-100 to-orange-100",
            headerBg: "bg-amber-100",
            title: "text-orange-700",
            subtitle: "text-amber-700",
            cardBg: "bg-amber-50/80",
            cardBorder: "border-orange-300",
            button: "bg-orange-600 text-white",
            progress: "bg-orange-500",
            progressBg: "bg-orange-200",
            accent: "text-orange-600",
            nav: "bg-amber-50/95 border-orange-200",
            navActive: "text-orange-600",
            navInactive: "text-amber-400"
        },
        decorations: "flags",
        buttonText: "Abrir 🔥",
    },
    casamento: {
        id: "casamento",
        name: "O Grande Sim!",
        subtitle: "Contagem para o altar",
        progressLabel: "do caminho",
        progressPercent: 90,
        colors: {
            bg: "bg-gradient-to-b from-[#FDFBF7] to-[#F5F0E6]",
            headerBg: "bg-white/50",
            title: "text-[#D4AF37]",
            subtitle: "text-gray-500",
            cardBg: "bg-white/80",
            cardBorder: "border-[#D4AF37]/30",
            button: "bg-[#D4AF37] text-white",
            progress: "bg-[#D4AF37]",
            progressBg: "bg-gray-200",
            accent: "text-[#D4AF37]",
            nav: "bg-white/95 border-[#D4AF37]/20",
            navActive: "text-[#D4AF37]",
            navInactive: "text-gray-400"
        },
        decorations: "flowers",
        buttonText: "Revelar 💍",
    }
};

type MockupThemeKey = keyof typeof MOCKUP_THEMES;

interface DynamicCalendarMockupProps {
    theme?: MockupThemeKey | string;
    className?: string;
}

// Hanging Hearts Decoration
const HangingHeartsDecor = () => (
    <div className="absolute top-0 left-0 right-0 flex justify-around px-2 z-10">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
                key={i}
                className="flex flex-col items-center"
                animate={{ rotate: [-3, 3] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, repeatType: "reverse" }}
            >
                <div className={`w-[1px] bg-gradient-to-b from-rose-300 to-rose-400`} style={{ height: `${8 + Math.random() * 16}px` }} />
                <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 -mt-0.5" />
            </motion.div>
        ))}
    </div>
);

// Confetti Decoration
const ConfettiDecor = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-sm"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][i % 6],
                    transform: `rotate(${Math.random() * 360}deg)`,
                }}
                animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
        ))}
    </div>
);

// Day Card Component for Mockup
const MockupDayCard = ({
    day,
    status,
    theme
}: {
    day: number;
    status: 'locked' | 'open' | 'current';
    theme: typeof MOCKUP_THEMES.namoro;
}) => {
    return (
        <motion.div
            className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden border",
                theme.colors.cardBg,
                theme.colors.cardBorder,
                status === 'current' && "ring-2 ring-offset-1",
                status === 'current' && theme.id === 'namoro' && "ring-rose-400",
                status === 'current' && theme.id === 'carnaval' && "ring-amber-400"
            )}
            whileHover={{ scale: 1.02 }}
        >
            {/* Opened Count Badge */}
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                <Eye className="w-2 h-2 text-white" />
                <span className="text-[8px] font-bold text-white">{Math.floor(Math.random() * 50)}</span>
            </div>

            <span className={cn("font-romantic text-xl", theme.colors.accent, "opacity-90")}>
                Dia {day}
            </span>

            {status === 'locked' ? (
                <div className="flex flex-col items-center mt-1">
                    <Lock className={cn("w-4 h-4 mb-0.5", theme.colors.accent, "opacity-60")} />
                    <span className="text-[8px] opacity-50">em 2h</span>
                </div>
            ) : (
                <button className={cn("text-[9px] font-bold px-3 py-1 rounded-full mt-1 shadow-sm", theme.colors.button)}>
                    {theme.buttonText}
                </button>
            )}
        </motion.div>
    );
};

export function DynamicCalendarMockup({ theme = "namoro", className }: DynamicCalendarMockupProps) {
    // Normalize theme key
    const themeKey = (theme === 'love' ? 'namoro' : theme) as MockupThemeKey;
    const mockupTheme = MOCKUP_THEMES[themeKey] || MOCKUP_THEMES.namoro;

    return (
        <div className={cn("relative", className)}>
            {/* iPhone Frame - Responsive sizing with proper clipping */}
            <div className="relative w-[280px] h-[580px] sm:w-[320px] sm:h-[660px] lg:w-[360px] lg:h-[740px] bg-zinc-900 rounded-[3rem] p-2.5 shadow-2xl" style={{ overflow: 'hidden' }}>
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-50" />

                {/* Screen Content - Slightly inset with matching border radius */}
                <div className={cn("relative w-full h-full rounded-[2.4rem] overflow-hidden", mockupTheme.colors.bg)} style={{ clipPath: 'inset(0 round 2.4rem)' }}>
                    {/* Theme Decorations */}
                    {mockupTheme.decorations === 'hearts' && <HangingHeartsDecor />}
                    {mockupTheme.decorations === 'confetti' && <ConfettiDecor />}

                    {/* Header */}
                    <div className={cn("pt-10 pb-3 px-4 text-center relative z-10", mockupTheme.colors.headerBg)}>
                        <h2 className={cn("font-romantic text-xl leading-tight", mockupTheme.colors.title)}>
                            {mockupTheme.name}
                        </h2>
                        <p className={cn("text-[10px] mt-1", mockupTheme.colors.subtitle)}>
                            {mockupTheme.subtitle}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-3 px-2">
                            <div className="flex justify-between text-[8px] mb-1">
                                <span className={mockupTheme.colors.accent}>{mockupTheme.progressPercent}% {mockupTheme.progressLabel}</span>
                            </div>
                            <div className={cn("h-1.5 rounded-full overflow-hidden", mockupTheme.colors.progressBg)}>
                                <motion.div
                                    className={cn("h-full rounded-full", mockupTheme.colors.progress)}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mockupTheme.progressPercent}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="px-3 py-3 grid grid-cols-2 gap-2 relative z-10">
                        {[1, 2, 3, 4].map((day) => (
                            <MockupDayCard
                                key={day}
                                day={day}
                                status={day === 1 ? 'current' : day < 3 ? 'open' : 'locked'}
                                theme={mockupTheme}
                            />
                        ))}
                    </div>

                    {/* Bottom Navigation - Realistic */}
                    <div className={cn("absolute bottom-0 left-0 right-0 h-14 border-t backdrop-blur-md flex items-center justify-around px-4", mockupTheme.colors.nav)}>
                        <div className="flex flex-col items-center">
                            <Home className={cn("w-5 h-5", mockupTheme.colors.navActive)} />
                            <span className={cn("text-[7px] mt-0.5 font-medium", mockupTheme.colors.navActive)}>Início</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Grid3x3 className={cn("w-5 h-5", mockupTheme.colors.navInactive)} />
                            <span className={cn("text-[7px] mt-0.5", mockupTheme.colors.navInactive)}>Meus</span>
                        </div>
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center -mt-5 shadow-lg", mockupTheme.colors.button)}>
                            <span className="text-lg font-bold">+</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Compass className={cn("w-5 h-5", mockupTheme.colors.navInactive)} />
                            <span className={cn("text-[7px] mt-0.5", mockupTheme.colors.navInactive)}>Explorar</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <User className={cn("w-5 h-5", mockupTheme.colors.navInactive)} />
                            <span className={cn("text-[7px] mt-0.5", mockupTheme.colors.navInactive)}>Perfil</span>
                        </div>
                    </div>
                </div>

                {/* Side Buttons */}
                <div className="absolute right-[-2px] top-32 w-[3px] h-10 bg-zinc-800 rounded-l" />
                <div className="absolute left-[-2px] top-28 w-[3px] h-6 bg-zinc-800 rounded-r" />
                <div className="absolute left-[-2px] top-36 w-[3px] h-10 bg-zinc-800 rounded-r" />
            </div>

            {/* Glow Effect */}
            <div className={cn(
                "absolute -inset-6 rounded-[4rem] blur-3xl opacity-30 -z-10",
                mockupTheme.id === 'namoro' && "bg-rose-400",
                mockupTheme.id === 'carnaval' && "bg-purple-600",
                mockupTheme.id === 'saojoao' && "bg-orange-400",
                mockupTheme.id === 'casamento' && "bg-amber-300"
            )} />
        </div>
    );
}

export default DynamicCalendarMockup;


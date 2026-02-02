// Shared Locked Modal Component
// Used by multiple themes to show a locked day modal with countdown

import { motion } from "framer-motion";
import { Lock, Clock, Bell, Download, PartyPopper, Flame, Gift, Star, Heart, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { canInstallPWA, isPWAInstalled, promptInstall } from "@/lib/push/notifications";

interface LockedModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayNumber: number;
    unlockDate: Date;
    onNotify?: () => void;
    theme?: string;
}

const themeConfigs: Record<string, {
    title: string;
    message: string;
    buttonColor: string;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    descColor: string;
    icon: any;
}> = {
    namoro: {
        title: "Ainda não é hora...",
        message: "O amor é paciente! Esta surpresa especial só estará disponível em breve.",
        buttonColor: "bg-love-red hover:bg-rose-700",
        iconColor: "text-rose-500",
        bgColor: "bg-white dark:bg-zinc-900",
        borderColor: "border-rose-100 dark:border-rose-900",
        textColor: "text-rose-900 dark:text-rose-100",
        descColor: "text-rose-600/80 dark:text-rose-300/80",
        icon: Lock
    },
    casamento: {
        title: "Falta pouco para o Sim!",
        message: "Estamos preparando esta memória com todo carinho. Aguarde a data!",
        buttonColor: "bg-wedding-gold hover:bg-wedding-gold-dark",
        iconColor: "text-wedding-gold",
        bgColor: "bg-[#FDFBF7] dark:bg-zinc-900",
        borderColor: "border-wedding-gold/20 dark:border-wedding-gold/10",
        textColor: "text-wedding-gold-dark dark:text-wedding-gold",
        descColor: "text-slate-500 dark:text-slate-400",
        icon: Lock
    },
    natal: {
        title: "O Papai Noel ainda não chegou!",
        message: "Os elfos ainda estão embrulhando essa surpresa natalina.",
        buttonColor: "bg-red-600 hover:bg-red-700",
        iconColor: "text-red-500",
        bgColor: "bg-[#FFF8E8] dark:bg-zinc-900",
        borderColor: "border-red-100 dark:border-red-900",
        textColor: "text-red-900 dark:text-red-100",
        descColor: "text-red-800/60 dark:text-red-300/60",
        icon: Lock
    },
    carnaval: {
        title: "Segura a empolgação!",
        message: "O bloco ainda não saiu! Essa surpresa é para o momento certo.",
        buttonColor: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
        iconColor: "text-purple-500",
        bgColor: "bg-[#FDF4FF] dark:bg-zinc-900",
        borderColor: "border-purple-200 dark:border-purple-900",
        textColor: "text-purple-900 dark:text-purple-100",
        descColor: "text-purple-600/80 dark:text-purple-300/80",
        icon: PartyPopper
    },
    aniversario: {
        title: "Nem vem! 🎂",
        message: "Essa surpresa está guardada para o momento certo! Segura a ansiedade para a festa.",
        buttonColor: "bg-sky-500 hover:bg-sky-600",
        iconColor: "text-sky-500",
        bgColor: "bg-[#F0F9FF] dark:bg-zinc-900",
        borderColor: "border-sky-200 dark:border-sky-900",
        textColor: "text-sky-900 dark:text-sky-100",
        descColor: "text-sky-700/80 dark:text-sky-300/80",
        icon: PartyPopper
    },
    saojoao: {
        title: "Eita, cabra apressado! 🔥",
        message: "A fogueira ainda não acendeu! Calma que o forró já vai começar.",
        buttonColor: "bg-[#E65100] hover:bg-[#BF360C]",
        iconColor: "text-[#E65100]",
        bgColor: "bg-[#FFF8E1] dark:bg-zinc-900",
        borderColor: "border-[#FFB74D] dark:border-[#E65100]/50",
        textColor: "text-[#5D4037] dark:text-[#FFB74D]",
        descColor: "text-[#8D6E63] dark:text-[#D7CCC8]",
        icon: Flame
    },
    pascoa: {
        title: "O coelhinho ainda não chegou! 🐰",
        message: "Calma, essa surpresa ainda está escondida no jardim. Aguarde o momento certo!",
        buttonColor: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
        iconColor: "text-purple-500",
        bgColor: "bg-[#FDF4FF] dark:bg-zinc-900",
        borderColor: "border-purple-200 dark:border-purple-900",
        textColor: "text-purple-900 dark:text-purple-100",
        descColor: "text-purple-600/80 dark:text-purple-300/80",
        icon: Gift
    },
    metas: {
        title: "Calma, campeão! ⭐",
        message: "Essa meta ainda está guardada. O sucesso vem para quem sabe esperar!",
        buttonColor: "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-indigo-950",
        iconColor: "text-amber-400",
        bgColor: "bg-indigo-950 dark:bg-indigo-950",
        borderColor: "border-amber-400/30 dark:border-amber-400/30",
        textColor: "text-white dark:text-white",
        descColor: "text-indigo-200 dark:text-indigo-200",
        icon: Star
    },
    diadasmaes: {
        title: "Calma, querido(a)! 💐",
        message: "Essa surpresa para a mamãe ainda está sendo preparada com muito amor!",
        buttonColor: "bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600",
        iconColor: "text-pink-500",
        bgColor: "bg-pink-50 dark:bg-zinc-900",
        borderColor: "border-pink-200 dark:border-pink-900",
        textColor: "text-pink-900 dark:text-pink-100",
        descColor: "text-pink-600/80 dark:text-pink-300/80",
        icon: Heart
    },
    diadospais: {
        title: "Calma, campeão! 👔",
        message: "Essa surpresa para o paizão ainda está guardada. Paciência é uma virtude!",
        buttonColor: "bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700",
        iconColor: "text-slate-500",
        bgColor: "bg-slate-50 dark:bg-zinc-900",
        borderColor: "border-slate-200 dark:border-slate-800",
        textColor: "text-slate-900 dark:text-slate-100",
        descColor: "text-slate-600/80 dark:text-slate-300/80",
        icon: Crown
    },
    reveillon: {
        title: "Ainda não é meia-noite! 🎆",
        message: "A contagem regressiva ainda não acabou. Aguarde o momento mágico!",
        buttonColor: "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900",
        iconColor: "text-amber-400",
        bgColor: "bg-slate-900 dark:bg-slate-950",
        borderColor: "border-amber-400/30",
        textColor: "text-white",
        descColor: "text-slate-300",
        icon: Clock
    },
    default: {
        title: "Calma, Coração!",
        message: "Essa surpresa ainda está sendo preparada. Segura a ansiedade!",
        buttonColor: "bg-primary hover:bg-primary/90",
        iconColor: "text-primary",
        bgColor: "bg-white dark:bg-zinc-900",
        borderColor: "border-border/50 dark:border-zinc-800",
        textColor: "text-foreground",
        descColor: "text-muted-foreground",
        icon: Lock
    }
};

export const LockedModal = ({ isOpen, onClose, dayNumber, unlockDate, onNotify, theme = 'namoro' }: LockedModalProps) => {
    if (!isOpen) return null;

    const now = new Date();
    const diff = unlockDate.getTime() - now.getTime();
    const daysLeft = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    const config = themeConfigs[theme] || themeConfigs['default'];
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={cn(
                    "w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative overflow-hidden font-display text-center border-4",
                    config.bgColor,
                    config.borderColor
                )}
            >
                {/* Header Icon */}
                <div className={cn("mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 relative", config.iconColor, "bg-current/10")}>
                    <Icon className="w-8 h-8" />
                    <div className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 rounded-full p-1 shadow-sm">
                        <Clock className="w-4 h-4" />
                    </div>
                </div>

                <h3 className={cn("text-2xl font-black mb-2", config.textColor)}>{config.title}</h3>

                <p className={cn("text-sm mb-6 leading-relaxed", config.descColor)}>
                    {config.message} No <span className="font-bold">Dia {dayNumber}</span> você poderá ver.
                </p>

                {/* Countdown Box */}
                <div className={cn("rounded-xl p-4 mb-6 border", config.bgColor, config.borderColor)}>
                    <div className={cn("flex items-center justify-center gap-2 font-black text-xl", config.textColor)}>
                        <Clock className="w-5 h-5" />
                        <span>{daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}</span>
                    </div>
                    <p className={cn("text-[10px] uppercase tracking-widest mt-1 font-black opacity-60", config.textColor)}>Restantes</p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onNotify}
                        className={cn(
                            "w-full text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs",
                            config.buttonColor
                        )}
                    >
                        <Bell className="w-4 h-4" />
                        Me avise quando abrir
                    </button>

                    {canInstallPWA() && !isPWAInstalled() && (
                        <button
                            onClick={promptInstall}
                            className={cn(
                                "w-full text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs",
                                "bg-zinc-800 hover:bg-black border-2 border-white/10"
                            )}
                        >
                            <Download className="w-5 h-5" />
                            Instalar Aplicativo
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className={cn("text-[10px] font-black uppercase tracking-widest py-2 opacity-60 hover:opacity-100", config.textColor)}
                    >
                        Vou esperar ansiosamente
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Re-export with legacy name for backwards compatibility
export const LoveLockedModal = LockedModal;

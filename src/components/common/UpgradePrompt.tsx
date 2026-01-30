/**
 * UpgradePrompt Component
 * Beautiful modal to prompt users to upgrade to premium
 */

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Sparkles,
    Camera,
    Video,
    Palette,
    Lock,
    Infinity,
    Crown,
    Check,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
    isOpen: boolean;
    onClose: () => void;
    calendarId?: string;
    triggerFeature?: "days" | "photo" | "video" | "theme" | "password";
}

const FEATURE_MESSAGES = {
    days: {
        title: "Precisa de mais dias?",
        subtitle: "Calendários gratuitos têm limite de 5 dias.",
        icon: Infinity,
    },
    photo: {
        title: "Quer adicionar fotos?",
        subtitle: "Fotos são exclusivas do plano Premium.",
        icon: Camera,
    },
    video: {
        title: "Quer incluir vídeos?",
        subtitle: "Embeds de vídeo são exclusivos do Premium.",
        icon: Video,
    },
    theme: {
        title: "Quer esse tema especial?",
        subtitle: "Temas premium são exclusivos do plano pago.",
        icon: Palette,
    },
    password: {
        title: "Quer proteger com senha?",
        subtitle: "Proteção por senha é exclusiva do Premium.",
        icon: Lock,
    },
};

const PREMIUM_FEATURES = [
    { icon: Infinity, text: "Até 365 dias de calendário" },
    { icon: Camera, text: "Upload de fotos ilimitado" },
    { icon: Video, text: "Embeds de YouTube, TikTok, Spotify" },
    { icon: Palette, text: "Todos os temas premium" },
    { icon: Lock, text: "Proteção por senha" },
    { icon: Crown, text: "Sem anúncios, vitalício" },
];

export function UpgradePrompt({
    isOpen,
    onClose,
    calendarId,
    triggerFeature = "days"
}: UpgradePromptProps) {
    const navigate = useNavigate();
    const feature = FEATURE_MESSAGES[triggerFeature];
    const FeatureIcon = feature.icon;

    const handleUpgrade = () => {
        onClose();
        navigate(`/checkout/${calendarId || "new"}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50"
                    >
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                            {/* Header with gradient */}
                            <div className="relative bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 p-6 pb-12">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>

                                {/* Crown icon */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Crown className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* Feature card overlapping */}
                            <div className="-mt-8 mx-4">
                                <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center">
                                        <FeatureIcon className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{feature.title}</h3>
                                        <p className="text-sm text-slate-400">{feature.subtitle}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-4">
                                <h2 className="text-xl font-bold text-white mb-1">
                                    Desbloqueie o Fresta Premium
                                </h2>
                                <p className="text-slate-400 mb-6">
                                    Torne este presente ainda mais especial
                                </p>

                                {/* Features list */}
                                <div className="space-y-3 mb-6">
                                    {PREMIUM_FEATURES.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            </div>
                                            <span className="text-slate-300 text-sm">{item.text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Price */}
                                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-center">
                                    <div className="text-slate-400 text-sm mb-1">Pagamento único</div>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-3xl font-bold text-white">R$ 14,90</span>
                                    </div>
                                    <div className="text-emerald-400 text-sm mt-1">
                                        Vitalício para este calendário
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleUpgrade}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-semibold text-white",
                                        "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500",
                                        "hover:from-amber-400 hover:via-orange-400 hover:to-rose-400",
                                        "shadow-lg shadow-orange-500/30",
                                        "flex items-center justify-center gap-2",
                                        "transition-all duration-300"
                                    )}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Desbloquear Agora
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>

                                {/* Skip link */}
                                <button
                                    onClick={onClose}
                                    className="w-full mt-3 py-2 text-slate-500 text-sm hover:text-slate-400 transition-colors"
                                >
                                    Continuar com o plano gratuito
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default UpgradePrompt;

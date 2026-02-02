// Reveillon (New Year's Eve) Theme - Fireworks Modal
import { motion } from "framer-motion";
import { Sparkles, Star, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import type { BaseModalProps } from "../shared/types";

export const ReveillonFireworksModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    const { toast } = useToast();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Decorations */}
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🎆</div>
            <div className="absolute top-20 right-12 text-3xl animate-pulse">✨</div>
            <div className="absolute bottom-24 left-8 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🥂</div>
            <div className="absolute bottom-32 right-16 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>🎇</div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-amber-400/30"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>

                {/* Header */}
                <div className="h-20 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 w-full relative shrink-0 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-950" />
                        <span className="text-indigo-950 font-black text-lg uppercase tracking-wider">Feliz Ano Novo!</span>
                        <Sparkles className="w-6 h-6 text-indigo-950" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-8 flex flex-col items-center overflow-y-auto overscroll-contain">
                    {/* Media */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-amber-400/50 shadow-lg mb-6 relative shrink-0">
                            {content.type === 'video' ? (
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <Play className="w-12 h-12 text-amber-400" />
                                </div>
                            ) : (
                                <img src={content.mediaUrl} alt="Ano Novo" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}

                    {/* Message */}
                    {content.message && (
                        <p className="text-white text-lg text-center font-medium leading-relaxed mb-6">
                            "{content.message}"
                        </p>
                    )}

                    {/* Badge */}
                    <div className="flex items-center gap-2 bg-amber-400/20 px-4 py-2 rounded-full border border-amber-400/30 mb-4">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">Novo ano, novas conquistas!</span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-indigo-950 font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Continuar 🎆
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config
export const reveillonLockedConfig = {
    title: "Ainda não é meia-noite! ⏰",
    message: "Essa surpresa está guardada para o momento certo da virada!",
    buttonColor: "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600",
    iconColor: "text-amber-400",
    bgColor: "bg-indigo-950 dark:bg-zinc-900",
    borderColor: "border-amber-400/30 dark:border-amber-900",
    textColor: "text-white dark:text-amber-100",
    descColor: "text-amber-200/80 dark:text-amber-300/80",
    icon: Sparkles
};

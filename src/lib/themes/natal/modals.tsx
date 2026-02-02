// Natal (Christmas) Theme - Christmas Modal
import { motion } from "framer-motion";
import { Gift, Star, Snowflake, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import type { BaseModalProps } from "../shared/types";

export const NatalFireworksModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    const { toast } = useToast();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Decorations */}
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🎄</div>
            <div className="absolute top-20 right-12 text-3xl animate-pulse">⭐</div>
            <div className="absolute bottom-24 left-8 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
            <div className="absolute bottom-32 right-16 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>❄️</div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-gradient-to-br from-red-800 via-red-900 to-green-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-amber-400/30"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>

                {/* Header */}
                <div className="h-20 bg-gradient-to-r from-green-600 via-red-600 to-green-600 w-full relative shrink-0 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 text-amber-300 fill-current" />
                        <span className="text-white font-black text-lg uppercase tracking-wider">Feliz Natal!</span>
                        <Star className="w-6 h-6 text-amber-300 fill-current" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-8 flex flex-col items-center overflow-y-auto overscroll-contain">
                    {/* Media */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-amber-400/50 shadow-lg mb-6 relative shrink-0">
                            {content.type === 'video' ? (
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <Play className="w-12 h-12 text-red-400" />
                                </div>
                            ) : (
                                <img src={content.mediaUrl} alt="Natal" className="w-full h-full object-cover" />
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
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-4">
                        <Gift className="w-4 h-4 text-amber-300" />
                        <span className="text-white/90 text-xs font-bold uppercase tracking-wider">Um presente especial!</span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-red-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Abrir Presente 🎁
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config
export const natalLockedConfig = {
    title: "Ho ho ho! 🎅",
    message: "Esse presente ainda está debaixo da árvore!",
    buttonColor: "bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700",
    iconColor: "text-red-500",
    bgColor: "bg-red-950 dark:bg-zinc-900",
    borderColor: "border-red-200/30 dark:border-red-900",
    textColor: "text-white dark:text-red-100",
    descColor: "text-red-200/80 dark:text-red-300/80",
    icon: Gift
};

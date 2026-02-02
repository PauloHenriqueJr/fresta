// Metas Theme - Goal Modal
import { motion } from "framer-motion";
import { X, Star, Play, Sparkles } from "lucide-react";
import type { BaseModalProps } from "../shared/types";

export const MetasGoalModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Decorative Stars */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-amber-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-20 right-20 w-3 h-3 bg-amber-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-20 w-2 h-2 bg-amber-500 rounded-full animate-pulse opacity-70" style={{ animationDelay: '1s' }} />
            <Star className="absolute top-1/4 left-10 w-6 h-6 text-amber-400 opacity-40 animate-pulse" />
            <Star className="absolute top-1/3 right-12 w-5 h-5 text-amber-300 opacity-30 animate-spin" style={{ animationDuration: '8s' }} />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-amber-400/30"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="h-16 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 w-full relative shrink-0 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-indigo-950 fill-current" />
                        <span className="text-indigo-950 font-black text-sm uppercase tracking-widest">Meta Alcançada</span>
                        <Star className="w-5 h-5 text-indigo-950 fill-current" />
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
                                <img src={content.mediaUrl} alt="Meta" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}

                    {/* Message */}
                    {content.message && (
                        <p className="text-white text-lg text-center font-medium leading-relaxed mb-6">
                            "{content.message}"
                        </p>
                    )}

                    {/* Inspirational Badge */}
                    <div className="flex items-center gap-2 bg-amber-400/20 px-4 py-2 rounded-full border border-amber-400/30">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">Continue brilhando!</span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="mt-8 w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-indigo-950 font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Continuar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config for Metas theme
export const metasLockedConfig = {
    title: "Calma, campeão! ⭐",
    message: "Essa meta ainda está guardada. O sucesso vem para quem sabe esperar!",
    buttonColor: "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-indigo-950",
    iconColor: "text-amber-400",
    bgColor: "bg-indigo-950 dark:bg-indigo-950",
    borderColor: "border-amber-400/30 dark:border-amber-400/30",
    textColor: "text-white dark:text-white",
    descColor: "text-indigo-200 dark:text-indigo-200",
    icon: Star
};

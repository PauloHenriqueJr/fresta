// Pascoa (Easter) Theme - Easter Egg Modal
import { motion } from "framer-motion";
import { Egg, Rabbit, Star, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import type { BaseModalProps } from "../shared/types";

export const PascoaEggModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    const { toast } = useToast();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/30 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Decorations */}
            <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🐰</div>
            <div className="absolute top-20 right-12 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🥚</div>
            <div className="absolute bottom-24 left-8 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-32 right-16 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🌷</div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center text-pink-600 transition-colors"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>

                {/* Header */}
                <div className="h-20 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 w-full relative shrink-0 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 left-6 text-white text-2xl">🥚</div>
                        <div className="absolute top-4 right-8 text-white text-xl">🌸</div>
                    </div>
                    <div className="flex items-center gap-2 z-10">
                        <span className="text-2xl">🐰</span>
                        <span className="text-white font-black text-lg uppercase tracking-wider">Feliz Páscoa!</span>
                        <span className="text-2xl">🥚</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-8 flex flex-col items-center bg-gradient-to-b from-pink-50 to-white overflow-y-auto overscroll-contain">
                    {/* Media */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-pink-200 shadow-xl mb-6 relative shrink-0">
                            {content.type === 'video' ? (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-pink-400" />
                                </div>
                            ) : (
                                <img src={content.mediaUrl} alt="Páscoa" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}

                    {/* Message */}
                    {content.message && (
                        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 mb-6 w-full">
                            <p className="text-pink-900 text-lg text-center font-medium leading-relaxed">
                                "{content.message}"
                            </p>
                        </div>
                    )}

                    {/* Easter Badge */}
                    <div className="flex items-center gap-2 text-pink-600 mb-4">
                        <span className="text-lg">🐣</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Com muito carinho!</span>
                        <span className="text-lg">🌷</span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Continuar 🐰
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config
export const pascoaLockedConfig = {
    title: "Ops, coelhinho! 🐰",
    message: "Esse ovo de páscoa ainda está escondido!",
    buttonColor: "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500",
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-zinc-900",
    borderColor: "border-pink-200 dark:border-pink-900",
    textColor: "text-pink-900 dark:text-pink-100",
    descColor: "text-pink-600/80 dark:text-pink-300/80",
    icon: Rabbit
};

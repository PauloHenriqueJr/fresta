// Aniversario (Birthday) Theme - Birthday Card Modal
import { motion } from "framer-motion";
import { PartyPopper, Gift, Star, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import type { BaseModalProps } from "../shared/types";

export const BirthdayCardModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    const { toast } = useToast();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Decorations */}
            <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎉</div>
            <div className="absolute top-20 right-12 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎂</div>
            <div className="absolute bottom-24 left-8 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-32 right-16 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🎁</div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: 2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-600 transition-colors"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>

                {/* Header with confetti pattern */}
                <div className="h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 w-full relative shrink-0 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-2 left-6 text-white text-2xl">🎈</div>
                        <div className="absolute top-4 right-8 text-white text-xl">⭐</div>
                        <div className="absolute bottom-2 left-1/3 text-white text-lg">🎊</div>
                    </div>
                    <div className="flex items-center gap-2 z-10">
                        <PartyPopper className="w-6 h-6 text-white" />
                        <span className="text-white font-black text-xl uppercase tracking-wider">Feliz Aniversário!</span>
                        <PartyPopper className="w-6 h-6 text-white transform -scale-x-100" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-8 flex flex-col items-center bg-gradient-to-b from-purple-50 to-white overflow-y-auto overscroll-contain">
                    {/* Media */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-purple-200 shadow-xl mb-6 relative shrink-0 -rotate-1">
                            {content.type === 'video' ? (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-purple-400" />
                                </div>
                            ) : (
                                <img src={content.mediaUrl} alt="Birthday" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}

                    {/* Message */}
                    {content.message && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 mb-6 w-full">
                            <p className="text-purple-900 text-lg text-center font-medium leading-relaxed">
                                "{content.message}"
                            </p>
                        </div>
                    )}

                    {/* Birthday Badge */}
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
                        <Gift className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700 text-xs font-bold uppercase tracking-wider">Presente especial!</span>
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Continuar a Festa! 🎉
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config
export const aniversarioLockedConfig = {
    title: "Espera aí! 🎂",
    message: "Essa surpresa ainda está sendo preparada para o grande dia!",
    buttonColor: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-zinc-900",
    borderColor: "border-purple-200 dark:border-purple-900",
    textColor: "text-purple-900 dark:text-purple-100",
    descColor: "text-purple-600/80 dark:text-purple-300/80",
    icon: PartyPopper
};

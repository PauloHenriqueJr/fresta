// Casamento (Wedding) Theme - Wedding Card Modal
import { motion } from "framer-motion";
import { Heart, Flower2, Crown, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import type { BaseModalProps } from "../shared/types";

export const WeddingCardModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    const { toast } = useToast();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Decorations */}
            <Heart className="absolute top-1/4 left-10 w-6 h-6 text-[#D4AF37] opacity-40 animate-pulse" />
            <Flower2 className="absolute top-1/3 right-12 w-5 h-5 text-[#D4AF37] opacity-30 animate-bounce" style={{ animationDuration: '3s' }} />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#D4AF37]/30"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] transition-colors"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>

                {/* Elegant Header */}
                <div className="h-20 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/40 to-[#D4AF37]/20 w-full relative shrink-0 flex items-center justify-center border-b border-[#D4AF37]/20">
                    <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-[#D4AF37] fill-current" />
                        <span className="text-[#8B7355] font-serif text-lg tracking-wider">Momento Especial</span>
                        <Heart className="w-5 h-5 text-[#D4AF37] fill-current" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-8 flex flex-col items-center bg-gradient-to-b from-[#FAF8F5] to-white overflow-y-auto overscroll-contain">
                    {/* Media */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-[#D4AF37]/30 shadow-lg mb-6 relative shrink-0">
                            {content.type === 'video' ? (
                                <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-[#D4AF37]" />
                                </div>
                            ) : (
                                <img src={content.mediaUrl} alt="Casamento" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}

                    {/* Message */}
                    {content.message && (
                        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-6 mb-6 w-full">
                            <p className="text-[#8B7355] text-lg text-center font-serif leading-relaxed italic">
                                "{content.message}"
                            </p>
                        </div>
                    )}

                    {/* Elegant Divider */}
                    <div className="flex items-center gap-2 text-[#D4AF37] mb-6">
                        <div className="h-px w-12 bg-[#D4AF37]/40" />
                        <Flower2 className="w-4 h-4" />
                        <div className="h-px w-12 bg-[#D4AF37]/40" />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8963E] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Continuar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config
export const casamentoLockedConfig = {
    title: "Calma, querido! 💍",
    message: "Essa surpresa especial está guardada para o momento certo!",
    buttonColor: "bg-gradient-to-r from-[#D4AF37] to-[#B8963E] hover:from-[#C9A431] hover:to-[#A88A35]",
    iconColor: "text-[#D4AF37]",
    bgColor: "bg-[#FAF8F5] dark:bg-zinc-900",
    borderColor: "border-[#D4AF37]/30 dark:border-[#D4AF37]/20",
    textColor: "text-[#8B7355] dark:text-[#D4AF37]",
    descColor: "text-[#8B7355]/70 dark:text-[#D4AF37]/70",
    icon: Crown
};

// Dia das Mães Theme - Modal
import { motion } from "framer-motion";
import { X, Heart, Flower } from "lucide-react";
import type { BaseModalProps } from "../shared/types";

export const DiadasmaesModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Flowers */}
            <Flower className="absolute top-1/4 left-10 w-8 h-8 text-pink-400 opacity-40 animate-bounce" style={{ animationDuration: '3s' }} />
            <Heart className="absolute top-1/3 right-12 w-6 h-6 text-rose-400 opacity-50 animate-pulse" />
            <Flower className="absolute bottom-1/4 right-20 w-7 h-7 text-pink-300 opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center text-pink-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header with Flowers */}
                <div className="h-20 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 w-full relative shrink-0 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 left-4"><Flower className="w-8 h-8 text-white" /></div>
                        <div className="absolute top-4 right-6"><Flower className="w-6 h-6 text-white" /></div>
                        <div className="absolute bottom-2 left-1/3"><Flower className="w-5 h-5 text-white" /></div>
                    </div>
                    <div className="flex items-center gap-2 z-10">
                        <Heart className="w-5 h-5 text-white fill-white" />
                        <span className="text-white font-black text-sm uppercase tracking-widest">Para a Melhor Mãe</span>
                        <Heart className="w-5 h-5 text-white fill-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-8 flex flex-col items-center bg-gradient-to-b from-pink-50 to-white overflow-y-auto overscroll-contain">
                    {/* Media (Photo frame style) */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-8 border-white shadow-xl mb-6 relative shrink-0 rotate-1">
                            <img src={content.mediaUrl} alt="Presente" className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded-full">
                                <Heart className="w-4 h-4 text-rose-500 fill-current" />
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    {content.message && (
                        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 mb-6 w-full">
                            <p className="text-pink-900 text-lg text-center font-medium leading-relaxed font-festive">
                                "{content.message}"
                            </p>
                        </div>
                    )}

                    {/* Love Badge */}
                    <div className="flex items-center gap-2 text-rose-400 mb-4">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold uppercase tracking-wider">Com todo amor do mundo</span>
                        <Heart className="w-4 h-4 fill-current" />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Continuar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config for Dia das Mães theme
export const diadasmaesLockedConfig = {
    title: "Calma, querido(a)! 💐",
    message: "Essa surpresa para a mamãe ainda está sendo preparada com muito amor!",
    buttonColor: "bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600",
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-zinc-900",
    borderColor: "border-pink-200 dark:border-pink-900",
    textColor: "text-pink-900 dark:text-pink-100",
    descColor: "text-pink-600/80 dark:text-pink-300/80",
    icon: Heart
};

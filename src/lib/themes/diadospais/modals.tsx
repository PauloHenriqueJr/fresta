// Dia dos Pais Theme - Modal
import { motion } from "framer-motion";
import { X, Star, Crown } from "lucide-react";
import type { BaseModalProps } from "../shared/types";

export const DiadospaisModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-40" />
            <Crown className="absolute top-1/4 right-12 w-6 h-6 text-slate-400 opacity-30 animate-pulse" />
            <Star className="absolute bottom-1/3 left-16 w-5 h-5 text-blue-300 opacity-20" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="h-16 bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 w-full relative shrink-0 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-white" />
                        <span className="text-white font-black text-sm uppercase tracking-widest">Para o Melhor Pai</span>
                        <Crown className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-8 flex flex-col items-center bg-gradient-to-b from-slate-50 to-white overflow-y-auto overscroll-contain">
                    {/* Media */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-slate-200 shadow-lg mb-6 relative shrink-0">
                            <img src={content.mediaUrl} alt="Presente" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Message */}
                    {content.message && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 w-full">
                            <p className="text-slate-700 text-lg text-center font-medium leading-relaxed">
                                "{content.message}"
                            </p>
                        </div>
                    )}

                    {/* Badge */}
                    <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold uppercase tracking-wider">Meu herói</span>
                        <Star className="w-4 h-4 fill-current" />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-slate-600 to-blue-600 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Continuar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config for Dia dos Pais theme
export const diadospaisLockedConfig = {
    title: "Calma, campeão! 👔",
    message: "Essa surpresa para o paizão ainda está guardada. Paciência é uma virtude!",
    buttonColor: "bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700",
    iconColor: "text-slate-500",
    bgColor: "bg-slate-50 dark:bg-zinc-900",
    borderColor: "border-slate-200 dark:border-slate-800",
    textColor: "text-slate-900 dark:text-slate-100",
    descColor: "text-slate-600/80 dark:text-slate-300/80",
    icon: Crown
};

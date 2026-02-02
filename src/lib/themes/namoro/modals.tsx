// Namoro (Dating) Theme - Love Letter Modal
import { motion } from "framer-motion";
import { Heart, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import { cn } from "@/lib/utils";
import type { BaseModalProps } from "../shared/types";

export const LoveLetterModal = ({ isOpen, onClose, content, config }: BaseModalProps & { config?: any }) => {
    const { toast } = useToast();
    if (!isOpen) return null;

    const messageFont = config?.layout?.messageFont || "font-festive";
    const titleFont = config?.layout?.titleFont || "font-serif italic";
    const closingFont = config?.layout?.messageFont || "font-festive";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.2)_0%,transparent_70%)] pointer-events-none" />
            <span className="material-symbols-outlined absolute top-1/4 left-10 text-2xl text-love-rose opacity-60 animate-bounce-gentle">♥</span>
            <span className="material-symbols-outlined absolute top-1/3 right-12 text-xl text-love-red opacity-60 animate-pulse">♥</span>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col font-display"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-rose-900/40 transition-colors"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>

                {/* Header with Envelope Pattern */}
                <div className="h-10 bg-[#fdf2f8] w-full relative shrink-0">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg, transparent 50%, #fbcfe8 50%), linear-gradient(225deg, transparent 50%, #fbcfe8 50%)`,
                            backgroundSize: '50% 100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'left top, right top'
                        }}
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[radial-gradient(circle,#f43f5e_0%,#be123c_100%)] flex items-center justify-center shadow-sm z-10">
                        <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                </div>

                {/* Paper Body */}
                <div
                    className="flex-1 px-6 pt-10 pb-6 flex flex-col items-center bg-[#fffafa] overflow-y-auto overscroll-contain"
                    style={{
                        backgroundImage: `
              linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
              linear-gradient(#eee 0.1em, transparent 0.1em)
            `,
                        backgroundSize: '100% 1.2em',
                        backgroundAttachment: 'local'
                    }}
                >
                    {/* Media */}
                    {content.mediaUrl && (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-8 border-white shadow-lg rotate-1 mb-6 relative shrink-0">
                            {content.type === 'video' ? (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            ) : (
                                <img src={content.mediaUrl} alt="Memory" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}

                    {/* Text Content */}
                    <div className="text-center space-y-3 relative z-10 w-full">
                        <h2 className={cn("text-4xl text-rose-900 leading-tight block", titleFont)}>
                            {content.title || "Uma Surpresa para Você"}
                        </h2>

                        <div className="px-2">
                            <p className={cn("text-xl text-rose-800 leading-relaxed block break-words", messageFont)}>
                                {content.message || "Às vezes as palavras não são suficientes para expressar o que eu sinto..."}
                            </p>
                        </div>

                        <div className="pt-8">
                            <span className={cn("text-3xl text-rose-700 block", closingFont)}>Com todo meu coração,</span>
                            <div className="flex justify-center mt-1">
                                <Heart className="w-5 h-5 text-love-red fill-current" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white/90 backdrop-blur-md border-t border-rose-100 flex items-center gap-3 shrink-0">
                    <button
                        onClick={async () => {
                            const result = await shareContent({
                                title: content.title || "Um presente para você! ❤️",
                                text: content.message || "Veja o que preparei para hoje no Fresta.",
                                url: window.location.href,
                                imageUrl: content.mediaUrl || undefined
                            });
                            if (result === "copied") {
                                toast({ title: "Link copiado! ✨", description: "O link já está na sua área de transferência." });
                            }
                        }}
                        className="flex-1 h-12 rounded-2xl bg-love-red text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-love-red/20 active:scale-95 transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                        Compartilhar Este Momento
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config
export const namoroLockedConfig = {
    title: "Calma, meu amor! 💕",
    message: "Essa surpresa ainda está guardada para o momento certo!",
    buttonColor: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-zinc-900",
    borderColor: "border-rose-200 dark:border-rose-900",
    textColor: "text-rose-900 dark:text-rose-100",
    descColor: "text-rose-600/80 dark:text-rose-300/80",
    icon: Heart
};

// Carnaval Theme - Ticket Modal
import { motion } from "framer-motion";
import { Ticket, Sparkles, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import type { BaseModalProps } from "../shared/types";
import { PartyPopper } from "lucide-react";

export const CarnavalTicketModal = ({ isOpen, onClose, content }: BaseModalProps) => {
    const { toast } = useToast();
    if (!isOpen) return null;

    const gradientClass = 'bg-gradient-to-br from-[#6A0DAD] via-[#FF007F] to-[#FFD700]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Floating Confetti Decorations */}
            <div className="absolute top-8 left-8 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎭</div>
            <div className="absolute top-12 right-12 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎊</div>
            <div className="absolute bottom-20 left-10 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-16 right-8 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🎉</div>
            <div className="absolute top-1/3 left-6 text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>🎭</div>
            <div className="absolute top-1/4 right-6 text-xl animate-bounce" style={{ animationDelay: '0.8s' }}>💃</div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: -3 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[380px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Ticket Perforated Edge (Top) */}
                <div className="absolute top-0 left-0 right-0 h-4 flex justify-between px-2 pointer-events-none z-20">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-black/60 -mt-1.5" />
                    ))}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-4 z-30 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>

                {/* Header with Gradient */}
                <div className={`${gradientClass} pt-8 pb-6 px-6 text-center relative overflow-hidden shrink-0`}>
                    <Sparkles className="absolute top-4 left-6 w-5 h-5 text-white/40 animate-pulse" />
                    <Sparkles className="absolute top-8 right-8 w-4 h-4 text-white/50 animate-pulse" style={{ animationDelay: '0.5s' }} />

                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg"
                    >
                        <Ticket className="w-8 h-8 text-white drop-shadow-md" />
                    </motion.div>

                    <h2 className="text-3xl font-black text-white drop-shadow-lg tracking-tight">
                        {content.title || `Surpresa!`}
                    </h2>
                    <p className="text-white/80 text-sm font-bold mt-1 uppercase tracking-widest">
                        Carnaval do Fresta 🎭
                    </p>
                </div>

                {/* Content Body */}
                <div className="flex-1 p-6 bg-gradient-to-b from-white to-gray-50 overflow-y-auto overscroll-contain">
                    {content.mediaUrl && (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-xl -rotate-1 mb-6">
                            {content.type === 'video' ? (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            ) : (
                                <img src={content.mediaUrl} alt="Surpresa" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}

                    <div className="text-center space-y-4">
                        {content.message && (
                            <p className="text-lg text-gray-800 font-medium leading-relaxed">{content.message}</p>
                        )}
                        {!content.message && !content.mediaUrl && (
                            <div className="py-8 text-center">
                                <div className="text-5xl mb-4">🎭🎉💃</div>
                                <p className="text-gray-500 italic">Uma surpresa especial te espera!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 ${gradientClass} flex items-center`}>
                    <button
                        onClick={async () => {
                            const result = await shareContent({
                                title: content.title || "Surpresa de Carnaval! 🎭",
                                text: content.message || "Veja o que preparei para você no Fresta!",
                                url: window.location.href,
                                imageUrl: content.mediaUrl || undefined
                            });
                            if (result === "copied") {
                                toast({ title: "Link copiado! ✨", description: "O link já está na sua área de transferência." });
                            }
                        }}
                        className="flex-1 h-12 rounded-2xl bg-white text-gray-900 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                        Compartilhar Folia!
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Locked Modal Config
export const carnavalLockedConfig = {
    title: "Calma, folião! 🎭",
    message: "Essa surpresa ainda está guardada para o momento certo da folia!",
    buttonColor: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-zinc-900",
    borderColor: "border-purple-200 dark:border-purple-900",
    textColor: "text-purple-900 dark:text-purple-100",
    descColor: "text-purple-600/80 dark:text-purple-300/80",
    icon: PartyPopper
};

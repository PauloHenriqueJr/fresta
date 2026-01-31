/**
 * Exit Intent Modal Component
 * Shows a downsell offer when user tries to leave checkout
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    AlertTriangle,
    Gift,
    ArrowRight,
    Calendar,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExitIntentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    originalPrice: number;
    discountedPrice: number;
}

export function ExitIntentModal({
    isOpen,
    onClose,
    onAccept,
    originalPrice,
    discountedPrice,
}: ExitIntentModalProps) {
    const formatPrice = (cents: number) => {
        return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
    };

    const discountPercent = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50"
                    >
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-red-500/30 overflow-hidden">
                            {/* Warning Header */}
                            <div className="relative bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 p-6 text-center">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>

                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30"
                                >
                                    <AlertTriangle className="w-8 h-8 text-white" />
                                </motion.div>

                                <h2 className="text-2xl font-black text-white mb-1">
                                    Espere! Não vá ainda!
                                </h2>
                                <p className="text-white/70 text-sm">
                                    Temos uma oferta especial para você
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Offer card */}
                                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-md">
                                            <Calendar className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white text-lg">
                                                Premium Lite
                                            </h3>
                                            <p className="text-slate-400 text-sm">
                                                Versão essencial com desconto
                                            </p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2 mb-4">
                                        {[
                                            "Até 30 dias de calendário",
                                            "Upload de fotos",
                                            "Tema básico",
                                            "Sem anúncios",
                                        ].map((feature, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 text-sm text-slate-300"
                                            >
                                                <Check className="w-4 h-4 text-emerald-400" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-slate-500 line-through">
                                            {formatPrice(originalPrice)}
                                        </span>
                                        <span className="text-3xl font-black text-white">
                                            {formatPrice(discountedPrice)}
                                        </span>
                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                                            -{discountPercent}%
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <motion.button
                                    onClick={onAccept}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-bold text-white text-lg",
                                        "bg-gradient-to-r from-yellow-500 to-orange-500",
                                        "hover:from-yellow-400 hover:to-orange-400",
                                        "shadow-lg shadow-orange-500/30",
                                        "flex items-center justify-center gap-2"
                                    )}
                                >
                                    <Gift className="w-5 h-5" />
                                    Aceitar Oferta
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>

                                {/* Skip */}
                                <button
                                    onClick={onClose}
                                    className="w-full mt-3 py-2 text-slate-500 text-sm hover:text-slate-400 transition-colors"
                                >
                                    Não, obrigado. Quero sair mesmo.
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/**
 * Hook to detect exit intent (mouse leaving viewport)
 */
export function useExitIntent(options?: { delay?: number; once?: boolean }) {
    const [showExitIntent, setShowExitIntent] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    const { delay = 0, once = true } = options || {};

    const handleMouseLeave = useCallback(
        (e: MouseEvent) => {
            // Only trigger when mouse moves to top of viewport
            if (e.clientY <= 0) {
                if (once && hasTriggered) return;

                setTimeout(() => {
                    setShowExitIntent(true);
                    setHasTriggered(true);
                }, delay);
            }
        },
        [delay, hasTriggered, once]
    );

    useEffect(() => {
        document.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [handleMouseLeave]);

    const closeExitIntent = () => setShowExitIntent(false);

    return { showExitIntent, closeExitIntent };
}

export default ExitIntentModal;

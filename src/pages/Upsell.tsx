/**
 * Upsell Page - Shown after successful payment
 * Offers PDF Kit at special price before redirecting to success
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gift,
    FileText,
    QrCode,
    Printer,
    Sparkles,
    ArrowRight,
    X,
    Check,
    Clock,
    Crown,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/state/auth/AuthProvider";
import { createPaymentPreference, PRICING } from "@/lib/services/payment";

const Upsell = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const orderId = searchParams.get("order");
    const calendarId = searchParams.get("calendar");

    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
    const [declined, setDeclined] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0 || declined) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, declined]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAcceptUpsell = async () => {
        if (!user?.id || !calendarId) {
            navigate(`/checkout/sucesso?order=${orderId}`);
            return;
        }

        setIsProcessing(true);

        try {
            const result = await createPaymentPreference({
                userId: user.id,
                calendarId,
                items: [{ type: "pdf_kit", quantity: 1 }],
            });

            if (result.success && result.data) {
                // Redirect to payment or show QR code
                if (result.data.checkoutUrl) {
                    window.open(result.data.checkoutUrl, "_blank");
                }
            }
        } catch (error) {
            console.error("Upsell error:", error);
        } finally {
            setIsProcessing(false);
            navigate(`/checkout/sucesso?order=${orderId}`);
        }
    };

    const handleDecline = () => {
        setDeclined(true);
        setTimeout(() => {
            navigate(`/checkout/sucesso?order=${orderId}`);
        }, 500);
    };

    // If time ran out, redirect
    useEffect(() => {
        if (timeLeft === 0) {
            navigate(`/checkout/sucesso?order=${orderId}`);
        }
    }, [timeLeft, navigate, orderId]);

    const features = [
        { icon: FileText, text: "PDF com todos os dias do calendário" },
        { icon: QrCode, text: "QR Code para acessar versão digital" },
        { icon: Printer, text: "Design otimizado para impressão" },
        { icon: Gift, text: "Cartões de cada dia para recortar" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <AnimatePresence>
                {!declined && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="max-w-lg w-full"
                    >
                        {/* Countdown badge */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
                                <Clock className="w-4 h-4 text-red-400 animate-pulse" />
                                <span className="text-red-400 font-bold text-sm">
                                    Oferta expira em {formatTime(timeLeft)}
                                </span>
                            </div>
                        </motion.div>

                        {/* Main card */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 p-8 pb-16">
                                <button
                                    onClick={handleDecline}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>

                                <div className="text-center">
                                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                                        🎁 Oferta Única
                                    </span>
                                    <h1 className="text-3xl font-black text-white mb-2">
                                        Parabéns pela compra!
                                    </h1>
                                    <p className="text-white/70">
                                        Aproveite essa oferta exclusiva
                                    </p>
                                </div>
                            </div>

                            {/* Product card */}
                            <div className="-mt-10 mx-6">
                                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                            <Gift className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-black text-xl text-white">
                                                Kit Memória Física
                                            </h2>
                                            <p className="text-slate-400 text-sm">
                                                PDF para imprimir e guardar para sempre
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-4">
                                {/* Features */}
                                <div className="space-y-3 mb-6">
                                    {features.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <item.icon className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <span className="text-slate-300 text-sm">
                                                {item.text}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Price */}
                                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-center">
                                    <div className="flex items-center justify-center gap-3 mb-1">
                                        <span className="text-slate-500 line-through text-lg">
                                            R$ 19,90
                                        </span>
                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                                            -50%
                                        </span>
                                    </div>
                                    <div className="text-4xl font-black text-white">
                                        R$ 9,90
                                    </div>
                                    <div className="text-emerald-400 text-sm mt-1">
                                        Só hoje, pagamento único
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <motion.button
                                    onClick={handleAcceptUpsell}
                                    disabled={isProcessing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-bold text-white text-lg",
                                        "bg-gradient-to-r from-emerald-500 to-teal-500",
                                        "hover:from-emerald-400 hover:to-teal-400",
                                        "shadow-lg shadow-emerald-500/30",
                                        "flex items-center justify-center gap-2",
                                        "disabled:opacity-50"
                                    )}
                                >
                                    {isProcessing ? (
                                        "Processando..."
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Sim, quero o PDF!
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>

                                {/* Decline */}
                                <button
                                    onClick={handleDecline}
                                    className="w-full mt-3 py-2 text-slate-500 text-sm hover:text-slate-400 transition-colors"
                                >
                                    Não, obrigado. Continuar sem o PDF.
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Upsell;

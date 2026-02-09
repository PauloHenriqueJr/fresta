/**
 * Checkout Page - Pay-Per-Calendar Model
 * Single payment for calendar upgrade via AbacatePay PIX
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    QrCode,
    ShieldCheck,
    Lock,
    CheckCircle2,
    Calendar,
    Zap,
    Crown,
    Copy,
    ExternalLink,
    Loader2,
    Gift,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { createPaymentPreference, verifyPaymentStatus, activatePaidCalendar, PRICING, type PaymentItem } from "@/lib/services/payment";
import { supabase } from "@/lib/supabase/client";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { format } from "date-fns";

const Checkout = () => {
    const { calendarId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isLoading: authLoading } = useAuth(); // Assume signUp exists in context, or use supabase directly

    const quizEmail = searchParams.get("email") || "";
    const quizTheme = searchParams.get("theme");
    const quizDuration = searchParams.get("duration");
    const isFromQuiz = searchParams.get("from") === "quiz";

    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState<{
        checkoutUrl: string;
        orderId: string;
        pixCode?: string;
        qrCodeUrl?: string;
        expiresAt?: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [isLoadingExisting, setIsLoadingExisting] = useState(true);

    // Load existing pending order on page load
    useEffect(() => {
        const loadExistingOrder = async () => {
            // Wait for auth to finish loading
            if (authLoading) return;

            if (!calendarId || !user?.id) {
                // If auth loaded but no user, stop loading existing check
                setIsLoadingExisting(false);
                return;
            }

            // Start loading check
            setIsLoadingExisting(true);

            try {
                const { data: existingOrder } = await (supabase as any)
                    .from("orders")
                    .select("*")
                    .eq("calendar_id", calendarId)
                    .eq("status", "pending")
                    // Removed .gt("expires_at", ...) to allow loading expired pending orders
                    // This lets the UI show "Timeout/Expired" state instead of a fresh form
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (existingOrder && existingOrder.pix_code && existingOrder.gateway_checkout_url) {
                    setPaymentData({
                        checkoutUrl: existingOrder.gateway_checkout_url,
                        orderId: existingOrder.id,
                        pixCode: existingOrder.pix_code,
                        qrCodeUrl: existingOrder.pix_qr_url,
                        expiresAt: existingOrder.expires_at,
                    });
                }
            } catch (error) {
                console.error("Error loading existing order:", error);
            } finally {
                setIsLoadingExisting(false);
            }
        };

        loadExistingOrder();
    }, [calendarId, user?.id, authLoading]);

    // Selected addons
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);




    // Auto-create calendar logic if coming from Quiz and now Logged In
    const handleAutoCreateCalendar = async () => {
        if (!user || user.email !== quizEmail) return null;

        try {
            const calendar = await CalendarsRepository.create({
                ownerId: user.id,
                themeId: quizTheme || 'aniversario',
                title: "Meu Presente Especial",
                duration: parseInt(quizDuration || "12"),
                startDate: format(new Date(), "yyyy-MM-dd"),
                status: 'rascunho',
                privacy: 'private',
                isPremium: false
            });

            return calendar.id;
        } catch (err) {
            console.error("Erro ao criar calendario automático", err);
            return null;
        }
    };


    // Countdown timer for PIX expiration
    useEffect(() => {
        if (!paymentData?.expiresAt || isSuccess || isExpired) return;

        const updateTimer = () => {
            const expiresAt = new Date(paymentData.expiresAt!).getTime();
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

            if (remaining <= 0) {
                setIsExpired(true);
                setTimeRemaining(0);
                // Do not clear paymentData so we can show the specific "Expired" UI
                // instead of the generic form
            } else {
                setTimeRemaining(remaining);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [paymentData?.expiresAt, isSuccess, isExpired]);

    // Format time remaining as MM:SS
    const formatTimeRemaining = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Payment status polling
    useEffect(() => {
        if (!paymentData?.orderId || isSuccess || isExpired) return;

        const pollInterval = setInterval(async () => {
            try {
                const order = await verifyPaymentStatus(paymentData.orderId);
                if (order?.status === "paid") {
                    // Payment confirmed - activate calendar
                    const result = await activatePaidCalendar(paymentData.orderId);
                    if (result.success) {
                        setIsSuccess(true);
                        clearInterval(pollInterval);
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollInterval);
    }, [paymentData?.orderId, isSuccess, isExpired]);

    // Exit Intent disabled - can be re-enabled later
    // const { showExitIntent, closeExitIntent } = useExitIntent({ delay: 500, once: true });

    // Calculate total
    const basePrice = PRICING.PREMIUM.price_cents;
    const addonTotal = selectedAddons.reduce((sum, id) => {
        if (id === "addon_ai") return sum + PRICING.ADDON_AI.price_cents;
        if (id === "pdf_kit") return sum + PRICING.PDF_KIT.price_cents;
        if (id === "addon_password") return sum + PRICING.ADDON_PASSWORD.price_cents;
        if (id === "storage_extra") return sum + PRICING.STORAGE_EXTRA.price_cents;
        return sum;
    }, 0);
    const totalPrice = basePrice + addonTotal;

    const formatPrice = (cents: number) => {
        return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
    };

    // Customer data
    const [customerInfo, setCustomerInfo] = useState({
        cellphone: "",
        taxId: "",
    });
    const [fieldErrors, setFieldErrors] = useState<{ taxId?: string; cellphone?: string }>({});

    // Simple CPF Validator
    const isValidCPF = (cpf: string) => {
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        const base = cpf.substring(0, 9).split('').map(Number);
        const calc = (limit: number) => {
            const sum = base.reduce((acc, curr, i) => acc + (curr * (limit - i)), 0);
            const rest = sum % 11;
            return rest < 2 ? 0 : 11 - rest;
        };
        const d1 = calc(10);
        base.push(d1);
        const d2 = calc(11);
        return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
    };

    const toggleAddon = (addonId: string) => {
        setSelectedAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const handleCreatePayment = async () => {
        // Validação de Sessão (só necessária se NÃO veio do Quiz recém cadastrado? Não, user deve existir de qualquer jeito)
        if (!user?.id) {
            setError("Você precisa estar logado para finalizar.");
            return;
        }

        // Se veio do quiz, ID pode ser nulo -> Criamos agora
        let targetCalendarId = calendarId;
        if (!targetCalendarId && isFromQuiz) {
            targetCalendarId = await handleAutoCreateCalendar();
        }

        if (!targetCalendarId) {
            setError("ID do calendário não encontrado. Tente recriar.");
            return;
        }

        const newErrors: { taxId?: string; cellphone?: string } = {};

        if (!customerInfo.taxId) {
            newErrors.taxId = "O CPF é obrigatório.";
        } else if (!isValidCPF(customerInfo.taxId)) {
            newErrors.taxId = "Por favor, informe um CPF válido.";
        }

        if (!customerInfo.cellphone) {
            newErrors.cellphone = "O WhatsApp é obrigatório.";
        } else if (customerInfo.cellphone.length < 10) {
            newErrors.cellphone = "Informe um número válido com DDD.";
        }

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            setError("Por favor, preencha os dados obrigatórios corretamente.");
            return;
        }

        setFieldErrors({});
        setIsProcessing(true);
        setError(null);

        try {
            // Build items list logic updated to service standard
            const items: PaymentItem[] = [
                { type: "premium", quantity: 1 }
            ];

            if (selectedAddons.includes("addon_ai")) {
                items.push({ type: "addon_ai", quantity: 1 });
            }
            if (selectedAddons.includes("pdf_kit")) {
                items.push({ type: "pdf_kit", quantity: 1 });
            }
            if (selectedAddons.includes("addon_password")) {
                items.push({ type: "addon_password", quantity: 1 });
            }
            if (selectedAddons.includes("storage_extra")) {
                items.push({ type: "storage_extra", quantity: 1 });
            }

            const result = await createPaymentPreference({
                userId: user.id,
                calendarId: targetCalendarId,
                items,
                customer: {
                    cellphone: customerInfo.cellphone,
                    taxId: customerInfo.taxId,
                }
            });

            if (result.success && result.data) {
                setIsExpired(false);
                setPaymentData({
                    checkoutUrl: result.data.checkoutUrl,
                    orderId: result.data.orderId,
                    pixCode: result.data.pixCode,
                    qrCodeUrl: result.data.qrCodeUrl,
                    expiresAt: result.data.expiresAt,
                });

                // Se foi criado dinamicamente, atualiza URL silenciosamente para se recuperarmos o ID em refresh
                if (!calendarId) {
                    window.history.replaceState(null, "", `/checkout/${targetCalendarId}`);
                }
            } else {
                setError(result.error || "Erro ao criar pagamento. Tente novamente.");
            }
        } catch (err) {
            setError("Erro inesperado. Tente novamente.");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyPixCode = () => {
        if (paymentData?.pixCode) {
            navigator.clipboard.writeText(paymentData.pixCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleOpenCheckout = () => {
        if (paymentData?.checkoutUrl) {
            window.open(paymentData.checkoutUrl, "_blank");
        }
    };



    // Success screen
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    className="max-w-md w-full text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-24 h-24 rounded-full bg-[#2D7A5F]/10 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-12 h-12 text-[#2D7A5F]" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter">
                        Calendário Plus Ativado!
                    </h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Seu calendário agora tem acesso a todos os recursos plus.
                        Comece a criar sua magia agora mesmo.
                    </p>
                    <button
                        onClick={() => navigate(`/calendario/${calendarId}/editar`)}
                        className="w-full py-4 bg-solidroad-accent text-solidroad-text font-black text-lg rounded-2xl hover:scale-105 transition-transform"
                    >
                        Continuar Editando
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section - Brand Style */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-24 pt-12">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 1440 200">
                        <defs>
                            <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="2" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dotPattern)" />
                    </svg>
                </div>

                <div className="relative z-10 container mx-auto px-6 max-w-6xl">
                    <div className="flex items-center gap-4 mb-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm hover:bg-white/20"
                        >
                            <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
                        </motion.button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-2">
                                <Lock className="w-3 h-3 text-[#FFD166]" />
                                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                                    Checkout Seguro
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                Upgrade <span className="text-[#FFD166]">Premium</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 max-w-6xl -mt-12 relative z-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Payment Section */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Payment Card */}
                        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-border/10">
                            {isLoadingExisting ? (
                                // Loading existing order check
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#F9A03F]" />
                                    <p className="text-muted-foreground font-medium">
                                        Verificando pagamento pendente...
                                    </p>
                                </div>
                            ) : !paymentData ? (
                                // Show addons selection before creating payment
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-foreground mb-2">
                                            Escolha extras (opcional)
                                        </h2>
                                        <p className="text-muted-foreground">
                                            Adicione recursos extras ao seu calendário premium
                                        </p>
                                    </div>

                                    {/* Addons List */}
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => toggleAddon("addon_ai")}
                                            className={cn(
                                                "w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all",
                                                selectedAddons.includes("addon_ai")
                                                    ? "border-[#F9A03F] bg-[#F9A03F]/5"
                                                    : "border-border/50 hover:border-[#F9A03F]/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                selectedAddons.includes("addon_ai") ? "bg-[#F9A03F]" : "bg-muted"
                                            )}>
                                                <Zap className={cn(
                                                    "w-6 h-6",
                                                    selectedAddons.includes("addon_ai") ? "text-white" : "text-muted-foreground"
                                                )} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="font-bold text-foreground">Gerador de Textos IA</p>
                                                <p className="text-sm text-muted-foreground">Mensagens criativas automáticas</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-foreground">+{formatPrice(PRICING.ADDON_AI.price_cents)}</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => toggleAddon("pdf_kit")}
                                            className={cn(
                                                "w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all",
                                                selectedAddons.includes("pdf_kit")
                                                    ? "border-[#F9A03F] bg-[#F9A03F]/5"
                                                    : "border-border/50 hover:border-[#F9A03F]/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                selectedAddons.includes("pdf_kit") ? "bg-[#F9A03F]" : "bg-muted"
                                            )}>
                                                <Gift className={cn(
                                                    "w-6 h-6",
                                                    selectedAddons.includes("pdf_kit") ? "text-white" : "text-muted-foreground"
                                                )} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="font-bold text-foreground">Kit Memória Física</p>
                                                <p className="text-sm text-muted-foreground">PDF para imprimir e guardar</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-foreground">+{formatPrice(PRICING.PDF_KIT.price_cents)}</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => toggleAddon("storage_extra")}
                                            className={cn(
                                                "w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all",
                                                selectedAddons.includes("storage_extra")
                                                    ? "border-[#F9A03F] bg-[#F9A03F]/5"
                                                    : "border-border/50 hover:border-[#F9A03F]/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                selectedAddons.includes("storage_extra") ? "bg-[#F9A03F]" : "bg-muted"
                                            )}>
                                                <Calendar className={cn(
                                                    "w-6 h-6",
                                                    selectedAddons.includes("storage_extra") ? "text-white" : "text-muted-foreground"
                                                )} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="font-bold text-foreground">+50MB Fotos HD</p>
                                                <p className="text-sm text-muted-foreground">Fotos em alta resolução</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-foreground">+{formatPrice(PRICING.STORAGE_EXTRA.price_cents)}</p>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Customer Mandatory Info */}
                                    <div className="space-y-4 p-6 bg-muted/30 rounded-2xl border border-border/50">
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-wider text-foreground/60 mb-4">
                                                Dados Obrigatórios para PIX
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className={cn(
                                                    "text-xs font-bold ml-1 transition-colors",
                                                    fieldErrors.taxId ? "text-red-500" : "text-muted-foreground"
                                                )}>
                                                    CPF (obrigatório)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="000.000.000-00"
                                                    value={customerInfo.taxId}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').substring(0, 11);
                                                        setCustomerInfo(prev => ({ ...prev, taxId: val }));
                                                        if (fieldErrors.taxId) setFieldErrors(prev => ({ ...prev, taxId: undefined }));
                                                    }}
                                                    className={cn(
                                                        "w-full bg-card border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-mono",
                                                        fieldErrors.taxId
                                                            ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                                                            : "border-border/50 focus:border-[#F9A03F]"
                                                    )}
                                                />
                                                {fieldErrors.taxId && (
                                                    <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                                        {fieldErrors.taxId}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className={cn(
                                                    "text-xs font-bold ml-1 transition-colors",
                                                    fieldErrors.cellphone ? "text-red-500" : "text-muted-foreground"
                                                )}>
                                                    WhatsApp / Celular
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="(11) 99999-9999"
                                                    value={customerInfo.cellphone}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').substring(0, 11);
                                                        setCustomerInfo(prev => ({ ...prev, cellphone: val }));
                                                        if (fieldErrors.cellphone) setFieldErrors(prev => ({ ...prev, cellphone: undefined }));
                                                    }}
                                                    className={cn(
                                                        "w-full bg-card border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-mono",
                                                        fieldErrors.cellphone
                                                            ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                                                            : "border-border/50 focus:border-[#F9A03F]"
                                                    )}
                                                />
                                                {fieldErrors.cellphone && (
                                                    <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                                        {fieldErrors.cellphone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] text-muted-foreground italic">
                                                * O AbacatePay valida o CPF. Use um CPF válido.
                                            </p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* ORDER BUMP - Special Offer */}
                                    <div
                                        onClick={() => toggleAddon("addon_password")}
                                        className={cn(
                                            "relative p-5 rounded-2xl border-2 cursor-pointer transition-all",
                                            "bg-gradient-to-r from-amber-500/5 to-orange-500/5",
                                            selectedAddons.includes("addon_password")
                                                ? "border-amber-500 shadow-lg shadow-amber-500/10"
                                                : "border-amber-500/30 hover:border-amber-500/60"
                                        )}
                                    >
                                        {/* Special offer badge */}
                                        <div className="absolute -top-2.5 left-4 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                                ⚡ Oferta Especial
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 mt-2">
                                            {/* Checkbox */}
                                            <div className={cn(
                                                "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                                                selectedAddons.includes("addon_password")
                                                    ? "bg-amber-500 border-amber-500"
                                                    : "border-amber-500/50 bg-transparent"
                                            )}>
                                                {selectedAddons.includes("addon_password") && (
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                )}
                                            </div>

                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                                                <Lock className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <p className="font-black text-foreground">Adicionar Proteção por Senha</p>
                                                <p className="text-sm text-muted-foreground">Só quem souber a senha pode ver o calendário</p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="font-black text-lg text-amber-600">+R$ 2,90</p>
                                                <p className="text-[10px] text-muted-foreground">único</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generate Payment Button */}
                                    <motion.button
                                        onClick={handleCreatePayment}
                                        disabled={isProcessing}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-5 bg-solidroad-accent text-solidroad-text rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Gerando PIX...
                                            </>
                                        ) : (
                                            <>
                                                <QrCode className="w-6 h-6" />
                                                Gerar PIX - {formatPrice(totalPrice)}
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            ) : isExpired ? (
                                // Show expired message
                                <div className="flex flex-col items-center text-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <AlertTriangle className="w-10 h-10 text-red-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-foreground tracking-tight">
                                            PIX Expirado
                                        </h3>
                                        <p className="text-muted-foreground max-w-sm">
                                            O tempo de 10 minutos para pagamento expirou.
                                            Gere um novo PIX para continuar.
                                        </p>
                                    </div>
                                    <motion.button
                                        onClick={handleCreatePayment}
                                        disabled={isProcessing}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-5 bg-solidroad-accent text-solidroad-text rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Gerando novo PIX...
                                            </>
                                        ) : (
                                            <>
                                                <QrCode className="w-6 h-6" />
                                                Gerar Novo PIX
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            ) : (
                                // Show PIX payment info
                                <div className="flex flex-col items-center text-center gap-8">
                                    {/* Countdown Timer */}
                                    {timeRemaining !== null && (
                                        <div className={cn(
                                            "flex items-center gap-3 px-6 py-3 rounded-2xl border-2",
                                            timeRemaining <= 60
                                                ? "bg-red-500/10 border-red-500/30 text-red-600"
                                                : timeRemaining <= 180
                                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                                                    : "bg-[#2D7A5F]/10 border-[#2D7A5F]/30 text-[#2D7A5F]"
                                        )}>
                                            <Clock className="w-5 h-5" />
                                            <span className="font-black text-lg font-mono">
                                                {formatTimeRemaining(timeRemaining)}
                                            </span>
                                            <span className="text-sm font-bold opacity-70">
                                                para pagar
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6 bg-muted/50 rounded-[3rem] border-2 border-dashed border-[#F9A03F]/30 relative overflow-hidden">
                                        <div className="w-48 h-48 bg-card rounded-2xl shadow-inner flex items-center justify-center overflow-hidden">
                                            {paymentData.qrCodeUrl ? (
                                                <img src={paymentData.qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
                                            ) : isProcessing ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="w-8 h-8 animate-spin text-[#F9A03F]" />
                                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Gerando...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 opacity-40">
                                                    <QrCode className="w-20 h-20 text-[#F9A03F]" />
                                                    <span className="text-[10px] font-bold uppercase">QR Code indisponível</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-w-sm">
                                        <h3 className="text-2xl font-black text-foreground tracking-tight">
                                            {paymentData.qrCodeUrl ? "Escaneie o QR Code" : "Use o Pix Copia e Cola"}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {paymentData.qrCodeUrl
                                                ? "Abra o app do seu banco, escolha Pix e aponte a câmera. Seu calendário será ativado instantaneamente."
                                                : "O QR Code não pôde ser gerado, mas você ainda pode pagar usando o código abaixo. Copie e cole no app do seu banco."}
                                        </p>
                                    </div>

                                    {paymentData.pixCode && (
                                        <div className="w-full space-y-3 pt-4 border-t border-border/50">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Ou copie o código PIX
                                            </p>
                                            <button
                                                onClick={handleCopyPixCode}
                                                className="w-full bg-muted p-5 rounded-2xl flex items-center justify-between border-2 border-transparent hover:border-[#F9A03F]/20 transition-all"
                                            >
                                                <code className="text-xs font-mono text-foreground truncate mr-4 opacity-70">
                                                    {paymentData.pixCode.substring(0, 40)}...
                                                </code>
                                                <div className={cn(
                                                    "px-4 py-2 rounded-xl font-bold text-sm transition-colors",
                                                    copied ? "bg-green-500 text-white" : "bg-card text-foreground"
                                                )}>
                                                    {copied ? "Copiado!" : "Copiar"}
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {paymentData.checkoutUrl && (
                                        <button
                                            onClick={handleOpenCheckout}
                                            className="flex items-center gap-2 text-[#F9A03F] font-bold hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Abrir página de pagamento
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-center gap-8 text-muted-foreground/40 font-bold text-xs uppercase tracking-wider">
                                <span className="flex items-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    Seguro
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3" />
                                    AbacatePay
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-12 space-y-6">
                        <div className="bg-[#1A3E3A] rounded-[3rem] p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F9A03F] flex items-center justify-center shadow-lg">
                                        <Crown className="w-6 h-6 text-[#1A3E3A]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">Resumo do Pedido</h3>
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
                                            Pagamento Único
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Base Premium */}
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Calendário Premium</span>
                                        <span className="font-bold">{formatPrice(PRICING.PREMIUM.price_cents)}</span>
                                    </div>

                                    {/* Selected Addons */}
                                    {selectedAddons.includes("addon_ai") && (
                                        <div className="flex justify-between items-center text-white/70">
                                            <span>+ Gerador IA</span>
                                            <span>{formatPrice(PRICING.ADDON_AI.price_cents)}</span>
                                        </div>
                                    )}
                                    {selectedAddons.includes("pdf_kit") && (
                                        <div className="flex justify-between items-center text-white/70">
                                            <span>+ Kit Memória</span>
                                            <span>{formatPrice(PRICING.PDF_KIT.price_cents)}</span>
                                        </div>
                                    )}
                                    {selectedAddons.includes("storage_extra") && (
                                        <div className="flex justify-between items-center text-white/70">
                                            <span>+ 50MB Fotos HD</span>
                                            <span>{formatPrice(PRICING.STORAGE_EXTRA.price_cents)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold uppercase tracking-wider opacity-50">Total</span>
                                        <p className="text-4xl font-black text-[#FFD166] tracking-tighter">
                                            {formatPrice(totalPrice)}
                                        </p>
                                    </div>
                                    <p className="text-xs text-white/40 mt-2 text-right">
                                        + R$ 0,80 taxa PIX
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    {["Até 365 dias", "Fotos e vídeos", "Temas exclusivos", "Vitalício"].map((f) => (
                                        <div key={f} className="flex items-center gap-3 opacity-90">
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-[#FFD166] stroke-[3px]" />
                                            </div>
                                            <span className="text-sm font-bold">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Exit Intent Modal - Disabled for now
            <ExitIntentModal
                isOpen={showExitIntent && !paymentData}
                onClose={closeExitIntent}
                onAccept={() => {
                    closeExitIntent();
                    setSelectedAddons([]);
                    handleCreatePayment();
                }}
                originalPrice={PRICING.PREMIUM.price_cents}
                discountedPrice={990}
            />
            */}
        </div>
    );
};

export default Checkout;

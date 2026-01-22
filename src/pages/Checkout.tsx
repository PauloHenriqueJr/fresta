import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    CreditCard,
    QrCode,
    ShieldCheck,
    Lock,
    CheckCircle2,
    ChevronRight,
    Info,
    Calendar,
    Zap
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";

const Checkout = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [method, setMethod] = useState<"pix" | "card">("pix");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const planName = planId === "annual" ? "Plano Anual" : "Plano Mensal";
    const planPrice = planId === "annual" ? "R$ 49,90" : "R$ 9,99";
    const planPeriod = planId === "annual" ? "/ano" : "/mês";

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulating payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    className="max-w-md w-full text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-24 h-24 rounded-full bg-festive-green/10 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-12 h-12 text-festive-green" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Assinatura Ativa!</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Parabéns! Agora você tem acesso ilimitado a todos os recursos do Fresta. Comece a criar sua magia agora mesmo.
                    </p>
                    <button
                        onClick={() => navigate("/meus-calendarios")}
                        className="btn-festive w-full py-4 text-lg"
                    >
                        Começar a Criar
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Premium Header */}
            <div className="hidden lg:block border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Voltar para Planos</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Checkout Seguro</span>
                    </div>
                </div>
            </div>

            <main className="max-w-[1700px] mx-auto px-4 lg:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Payment Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Finalizar Assinatura</h1>
                            <p className="text-muted-foreground font-medium">Escolha seu método de pagamento preferido e comece agora.</p>
                        </motion.div>

                        {/* Payment Method Selector */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setMethod("pix")}
                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group ${method === "pix" ? "border-primary bg-primary/5 luxury-shadow" : "border-border bg-card hover:border-primary/30"}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${method === "pix" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                    <QrCode className="w-7 h-7" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-lg text-foreground">Pix</p>
                                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Instantâneo</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setMethod("card")}
                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group ${method === "card" ? "border-primary bg-primary/5 luxury-shadow" : "border-border bg-card hover:border-primary/30"}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${method === "card" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                    <CreditCard className="w-7 h-7" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-lg text-foreground">Cartão</p>
                                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Crédito</p>
                                </div>
                            </button>
                        </div>

                        {/* Method Details */}
                        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 lg:p-12 luxury-shadow">
                            <AnimatePresence mode="wait">
                                {method === "pix" ? (
                                    <motion.div
                                        key="pix"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col items-center text-center gap-8"
                                    >
                                        <div className="p-4 bg-white rounded-3xl shadow-xl">
                                            <div className="w-48 h-48 bg-muted animate-pulse rounded-2xl flex items-center justify-center">
                                                <QrCode className="w-20 h-20 text-muted-foreground opacity-20" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 max-w-sm">
                                            <h3 className="text-2xl font-black text-foreground tracking-tight">Escaneie o QR Code</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Abra o app do seu banco, escolha "Pagar com Pix" e aponte a câmera para o código acima.
                                            </p>
                                        </div>
                                        <div className="w-full space-y-3">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Ou copie o código</p>
                                            <div className="bg-muted/50 p-4 rounded-xl flex items-center justify-between border border-border/50">
                                                <code className="text-xs font-mono text-foreground truncate mr-4">fresta_pix_checkout_a1b2c3d4e5f6...</code>
                                                <button className="text-primary font-bold text-xs hover:underline shrink-0">Copiar</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="card"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nome no Cartão</label>
                                                <input
                                                    type="text"
                                                    placeholder="Como impresso no cartão"
                                                    className="w-full bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Número do Cartão</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-bold pl-14"
                                                    />
                                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Validade</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/AA"
                                                    className="w-full bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="***"
                                                    className="w-full bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-bold"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-12 flex flex-col gap-6">
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="btn-festive w-full py-5 text-lg flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    {isProcessing && (
                                        <motion.div
                                            className="absolute inset-0 bg-primary/20"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2.5 }}
                                        />
                                    )}
                                    <ShieldCheck className="w-6 h-6" />
                                    <span className="relative z-10">{isProcessing ? "Processando..." : "Confirmar e Pagar Agora"}</span>
                                </button>
                                <div className="flex items-center justify-center gap-6 text-muted-foreground/40 font-bold text-[10px] tracking-widest uppercase">
                                    <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> SSL Encrypt</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Compra Segura</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
                        <h2 className="text-xl font-black text-foreground tracking-tight px-4">Resumo do Pedido</h2>
                        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 luxury-shadow overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-festive flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Zap className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-foreground tracking-tight">{planName}</h3>
                                        <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Fresta Premium</p>
                                    </div>
                                </div>

                                <div className="space-y-4 border-y border-border/50 py-8">
                                    <div className="flex justify-between items-center text-muted-foreground font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-foreground font-bold">{planPrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-muted-foreground font-medium">
                                        <span>Taxas</span>
                                        <span className="text-festive-green font-bold">R$ 0,00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xl font-black text-foreground tracking-tight">Total</span>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-foreground tracking-tighter">{planPrice}</p>
                                            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Cobrado {planPeriod === "/ano" ? "anualmente" : "mensalmente"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 px-1">O que você recebe:</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {["Calendários Ilimitados", "Zero Marca d'água", "Analytics Completo"].map((f) => (
                                            <div key={f} className="flex items-center gap-3 bg-muted/30 p-3 rounded-2xl border border-border/20">
                                                <CheckCircle2 className="w-4 h-4 text-festive-green" />
                                                <span className="text-sm font-bold text-foreground/80">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-festive-yellow/5 border border-festive-yellow/20 rounded-2xl p-4 flex gap-4 items-start">
                                    <Info className="w-5 h-5 text-festive-yellow shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Você pode cancelar sua assinatura a qualquer momento através das configurações do seu perfil.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Support Box */}
                        <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-black text-foreground">Precisa de Ajuda?</p>
                                <p className="text-xs text-muted-foreground">Fale com nosso suporte 24/7</p>
                            </div>
                            <button className="text-primary font-black text-sm hover:underline">Chat Online</button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Checkout;

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
    Zap,
    MessageCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { cn } from "@/lib/utils";

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
        <div className="min-h-screen bg-[#F8F9F5]">
            {/* Premium Hero Section */}
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
                                <Lock className="w-3 h-3 text-solidroad-accent" />
                                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Checkout Seguro</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                Finalizar <span className="text-solidroad-accent">Assinatura</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 max-w-6xl -mt-12 relative z-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Payment Section */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Payment Method Selector */}
                        <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-[rgba(0,0,0,0.04)] grid grid-cols-2 gap-3">
                            {[
                                { id: 'pix', label: 'Pix', sub: 'Instantâneo', icon: QrCode },
                                { id: 'card', label: 'Cartão', sub: 'Crédito', icon: CreditCard }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id as any)}
                                    className={cn(
                                        "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group",
                                        method === m.id
                                            ? "border-solidroad-accent bg-solidroad-accent/5 shadow-inner"
                                            : "border-transparent bg-[#F8F9F5] hover:bg-[#F0F2ED]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                        method === m.id ? "bg-solidroad-accent text-solidroad-text shadow-lg" : "bg-white text-[#5A7470]"
                                    )}>
                                        <m.icon className="w-7 h-7" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-lg text-[#1A3E3A]">{m.label}</p>
                                        <p className="text-[10px] font-black text-[#5A7470]/60 uppercase tracking-widest leading-none">{m.sub}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Method Details Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[rgba(0,0,0,0.04)] min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {method === "pix" ? (
                                    <motion.div
                                        key="pix"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col items-center text-center gap-8"
                                    >
                                        <div className="p-6 bg-[#F8F9F5] rounded-[3rem] border-2 border-dashed border-solidroad-accent/30 group relative">
                                            <div className="w-48 h-48 bg-white rounded-[2rem] shadow-inner flex items-center justify-center overflow-hidden">
                                                <QrCode className="w-32 h-32 text-solidroad-accent/20" />
                                                <div className="absolute inset-0 bg-solidroad-accent/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[10px] font-black text-black/40 tracking-[0.3em]">GERANDO...</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 max-w-sm">
                                            <h3 className="text-2xl font-black text-[#1A3E3A] tracking-tight leading-tight">Escaneie o QR Code mágico</h3>
                                            <p className="text-[#5A7470] font-medium leading-relaxed">
                                                Abra o app do seu banco, escolha Pix e aponte a câmera. Sua assinatura será ativada instantaneamente.
                                            </p>
                                        </div>

                                        <div className="w-full space-y-3 pt-4 border-t border-[rgba(0,0,0,0.04)]">
                                            <p className="text-[10px] font-black uppercase text-[#5A7470]/40 tracking-widest">Código Pix Copia e Cola</p>
                                            <div className="bg-[#F8F9F5] p-5 rounded-2xl flex items-center justify-between border-2 border-transparent hover:border-solidroad-accent/20 transition-all cursor-pointer group" onClick={() => { }}>
                                                <code className="text-xs font-mono text-[#1A3E3A] truncate mr-4 opacity-70">fresta_pix_checkout_solidroad_0123...</code>
                                                <div className="h-10 px-4 rounded-xl bg-white text-[#1A3E3A] font-black text-[10px] flex items-center justify-center shadow-sm group-hover:bg-solidroad-accent transition-colors">
                                                    COPIAR
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="card"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A7470]/60 ml-1">Nome no Cartão</label>
                                                <input
                                                    type="text"
                                                    placeholder="Como impresso no cartão"
                                                    className="w-full h-14 px-6 bg-[#F8F9F5] border-2 border-transparent rounded-[1.25rem] text-[#1A3E3A] font-bold focus:outline-none focus:border-solidroad-accent focus:bg-white transition-all shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A7470]/60 ml-1">Número do Cartão</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full h-14 px-14 bg-[#F8F9F5] border-2 border-transparent rounded-[1.25rem] text-[#1A3E3A] font-bold focus:outline-none focus:border-solidroad-accent focus:bg-white transition-all shadow-inner"
                                                    />
                                                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-solidroad-accent" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A7470]/60 ml-1">Validade</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/AA"
                                                        className="w-full h-14 px-6 bg-[#F8F9F5] border-2 border-transparent rounded-[1.25rem] text-[#1A3E3A] font-bold focus:outline-none focus:border-solidroad-accent focus:bg-white transition-all shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A7470]/60 ml-1">CVV</label>
                                                    <input
                                                        type="text"
                                                        placeholder="***"
                                                        className="w-full h-14 px-6 bg-[#F8F9F5] border-2 border-transparent rounded-[1.25rem] text-[#1A3E3A] font-bold focus:outline-none focus:border-solidroad-accent focus:bg-white transition-all shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-12 flex flex-col gap-6 pt-12 border-t border-[rgba(0,0,0,0.04)]">
                                <motion.button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-18 bg-solidroad-accent text-solidroad-text rounded-[1.5rem] font-black text-lg shadow-xl shadow-solidroad-accent/20 flex items-center justify-center gap-3 relative overflow-hidden group py-6"
                                >
                                    {isProcessing && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/10"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2.5 }}
                                        />
                                    )}
                                    <ShieldCheck className="w-6 h-6 stroke-[2.5px] group-hover:scale-110 transition-transform" />
                                    <span className="relative z-10 tracking-tight">{isProcessing ? "VALIDANDO..." : "CONFIRMAR PAGAMENTO AGORA"}</span>
                                </motion.button>

                                <div className="flex items-center justify-center gap-8 text-[#5A7470]/40 font-black text-[10px] tracking-widest uppercase">
                                    <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> SSL 256-BIT</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> PCI-DSS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-12 space-y-6">
                        <div className="bg-[#1A3E3A] rounded-[3rem] p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />

                            <div className="relative z-10 space-y-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-solidroad-accent flex items-center justify-center shadow-lg">
                                            <Zap className="w-6 h-6 text-solidroad-text" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black leading-tight">Resumo do Pedido</h3>
                                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Fresta Premium</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold opacity-60">Plano Selecionado</span>
                                            <span className="text-xs font-black bg-solidroad-accent text-solidroad-text px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">VIP</span>
                                        </div>
                                        <h4 className="text-2xl font-black tracking-tight">{planName}</h4>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold opacity-50 uppercase tracking-widest text-[10px]">Total hoje</span>
                                        <div className="text-right">
                                            <p className="text-4xl font-black text-solidroad-accent tracking-tighter leading-none">{planPrice}</p>
                                            <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-2">{planPeriod === "/ano" ? "Anual" : "Mensal"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {["Calendários Ilimitados", "Personalização Total", "Estatísticas de Visita"].map((f) => (
                                        <div key={f} className="flex items-center gap-3 opacity-90">
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-solidroad-accent stroke-[3px]" />
                                            </div>
                                            <span className="text-sm font-bold">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex gap-4 items-start bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-white/5">
                                        <Info className="w-5 h-5 text-solidroad-accent shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-medium leading-relaxed opacity-60 italic">
                                            Sua assinatura será processada com segurança. Você pode cancelar a qualquer momento nas configurações.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help Link Card */}
                        <div className="bg-white rounded-[2rem] p-6 flex items-center justify-between border border-[rgba(0,0,0,0.04)] shadow-lg group cursor-pointer hover:bg-solidroad-accent transition-all duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#F8F9F5] flex items-center justify-center group-hover:bg-white transition-colors">
                                    <MessageCircle className="w-6 h-6 text-solidroad-accent" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-[#1A3E3A] group-hover:text-solidroad-text">Duvidas?</p>
                                    <p className="text-[10px] font-bold text-[#5A7470] group-hover:text-solidroad-text/60 uppercase tracking-widest">Suporte 24/7</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#5A7470] group-hover:text-solidroad-text transition-colors" />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Checkout;

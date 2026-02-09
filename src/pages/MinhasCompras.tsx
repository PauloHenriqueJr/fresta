
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ExternalLink,
    Receipt,
    Calendar,
    ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";

interface OrderHistoryItem {
    id: string;
    created_at: string;
    amount_cents: number;
    status: "pending" | "paid" | "expired" | "failed" | "refunded";
    expires_at: string | null;
    calendar: {
        id: string;
        title: string;
        theme_id: string;
    } | null;
}

export default function MinhasCompras() {
    const navigate = useNavigate();
    const { user, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data, error } = await (supabase as any)
                    .from("orders")
                    .select("id, created_at, amount_cents, status, expires_at, calendar:calendars(id, title, theme_id)")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (err) {
                console.error("Error fetching orders:", err);
                toast({
                    title: "Erro ao carregar compras",
                    description: "Não foi possível carregar seu histórico.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, authLoading]);

    const getStatusBadge = (status: string, expiresAt: string | null) => {
        const isTimeExpired = status === 'pending' && expiresAt && new Date(expiresAt) < new Date();
        const displayStatus = isTimeExpired ? 'expired' : status;

        switch (displayStatus) {
            case "paid":
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 data-[state=active]:bg-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Pago</span>
                    </div>
                );
            case "pending":
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Pendente</span>
                    </div>
                );
            case "expired":
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800 text-slate-500 border border-slate-300/50 dark:border-slate-700">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Expirado</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{status}</span>
                    </div>
                );
        }
    };

    if (loading) return <Loader text="Carregando suas compras..." />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-solidroad-text dark:text-white tracking-tight">
                        Minhas Compras
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seus pedidos e pagamentos
                    </p>
                </div>
            </div>

            {/* List */}
            {orders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 bg-card rounded-[2.5rem] border border-border/10 shadow-sm"
                >
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                        <Receipt className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Nenhuma compra encontrada</h2>
                    <p className="text-muted-foreground mb-8 text-center max-w-md">
                        Você ainda não realizou nenhuma compra no Fresta.
                        Que tal criar um calendário premium?
                    </p>
                    <button
                        onClick={() => navigate('/criar')}
                        className="px-8 py-4 bg-solidroad-accent text-solidroad-text rounded-2xl font-black shadow-glow-accent hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        Criar Novo Calendário
                    </button>
                </motion.div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order, index) => {
                        const isPending = order.status === 'pending' && (!order.expires_at || new Date(order.expires_at) > new Date());

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-card hover:bg-card/80 dark:hover:bg-slate-900/40 transition-all rounded-[2rem] p-6 border border-border/10 shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex items-start gap-5">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                                        order.status === 'paid' ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600" :
                                            isPending ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600" :
                                                "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                    )}>
                                        {order.status === 'paid' ? <CheckCircle2 className="w-7 h-7" /> :
                                            isPending ? <Clock className="w-7 h-7" /> :
                                                <Receipt className="w-7 h-7" />}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                {order.calendar?.title || "Calendário Removido"}
                                            </h3>
                                            {getStatusBadge(order.status, order.expires_at)}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(order.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                                            </span>
                                            <span className="hidden sm:inline opacity-30">•</span>
                                            <span className="font-medium text-foreground">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount_cents / 100)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-auto pl-14 md:pl-0 w-full md:w-auto">
                                    {isPending && order.calendar ? (
                                        <button
                                            onClick={() => navigate(`/checkout/${order.calendar!.id}`)}
                                            className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
                                        >
                                            Pagar Agora
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    ) : (
                                        order.calendar && (
                                            <button
                                                onClick={() => navigate(`/calendario/${order.calendar!.id}`)}
                                                className="flex-1 md:flex-none px-6 py-3 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center gap-2"
                                            >
                                                Ver Calendário
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ArrowDownRight, DollarSign } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";

export default function FinancialDashboard() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AdminRepository.getTransactions()
            .then(setTransactions)
            .finally(() => setLoading(false));
    }, []);

    const totalIncomeValue = transactions.reduce((acc, curr) => acc + curr.amount_cents, 0) / 100;

    const stats = [
        { title: "Receita Total", value: `R$ ${totalIncomeValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, change: "+12.5%", icon: DollarSign, color: "text-emerald-500" },
        { title: "LTV", value: "R$ 890", change: "+3.2%", icon: TrendingUp, color: "text-blue-500" },
        { title: "Churn Rate", value: "2.4%", change: "-0.5%", icon: ArrowDownRight, color: "text-rose-500" },
        { title: "Novos Assinantes", value: transactions.length.toString(), change: "+18%", icon: Users, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard Financeiro</h1>
                <p className="text-muted-foreground">Visão detalhada do faturamento e saúde do negócio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">{stat.value}</div>
                            <p className={`text-xs font-bold mt-1 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.change} <span className="text-muted-foreground font-medium ml-1">vrs mês anterior</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-black">Últimas Transações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center py-4 italic text-muted-foreground">Carregando...</p>
                        ) : transactions.length === 0 ? (
                            <p className="text-center py-4 italic text-muted-foreground">Nenhuma transação.</p>
                        ) : transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                                <div>
                                    <p className="text-sm font-bold">{t.profiles?.display_name || 'Usuário'}</p>
                                    <p className="text-[10px] uppercase font-black text-muted-foreground">{t.pricing_plans?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-500">+ R$ {(t.amount_cents / 100).toFixed(2)}</p>
                                    <p className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

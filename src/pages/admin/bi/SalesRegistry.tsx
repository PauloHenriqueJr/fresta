import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";
import { Search, Download } from "lucide-react";

export default function SalesRegistry() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        AdminRepository.getTransactions()
            .then(setSales)
            .catch((err) => {
                console.error("Sales fetch error:", err);
                setSales([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredSales = sales.filter(s =>
        s.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Registro de Vendas</h1>
                    <p className="text-muted-foreground">Lista detalhada de todas as transações da plataforma.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar transação ou cliente..."
                            className="bg-muted/50 border-border/40 rounded-xl pl-9 pr-4 py-2 text-xs font-bold w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-black hover:bg-muted/80 transition-all uppercase tracking-widest border border-border/20">
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                </div>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/40 bg-muted/30">
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">ID Transação</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Cliente</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Plano</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Valor</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center italic text-muted-foreground">Carregando transações...</td>
                                </tr>
                            ) : filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center italic text-muted-foreground">Nenhuma transação encontrada.</td>
                                </tr>
                            ) : filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-4 text-sm font-bold text-foreground">{sale.id.slice(0, 8)}</td>
                                    <td className="p-4 text-sm font-medium text-foreground">{sale.profiles?.display_name || "Usuário"}</td>
                                    <td className="p-4 text-sm font-medium text-muted-foreground">{sale.pricing_plans?.name}</td>
                                    <td className="p-4 text-sm font-black text-primary">R$ {(sale.amount_cents / 100).toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${sale.status === 'succeeded' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                            }`}>
                                            {sale.status === 'succeeded' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground font-medium">{new Date(sale.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

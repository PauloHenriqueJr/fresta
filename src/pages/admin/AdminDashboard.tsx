import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  Bell,
  AlertCircle
} from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubs: 0,
    totalOrgs: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      setError(false);
      const [users, transactions, orgs, logs] = await Promise.all([
        AdminRepository.getUsers().catch(() => []),
        AdminRepository.getTransactions().catch(() => []),
        AdminRepository.getB2BOrgs().catch(() => []),
        AdminRepository.getAuditLogs().catch(() => [])
      ]);

      const revenue = transactions.reduce((acc: number, curr: any) => acc + (curr.amount_cents || 0), 0) / 100;
      const subs = users.filter((u: any) => u.subscriptions?.[0]?.status === 'active').length;

      setStats({
        totalUsers: users.length,
        totalRevenue: revenue,
        activeSubs: subs,
        totalOrgs: orgs.length
      });
      setRecentLogs(logs.slice(0, 5));
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const cards = [
    { title: "Usuários Totais", value: stats.totalUsers.toString(), change: "+0%", icon: Users, color: "text-blue-500" },
    { title: "Receita (Total)", value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, change: "+0%", icon: DollarSign, color: "text-emerald-500" },
    { title: "Assinaturas Ativas", value: stats.activeSubs.toString(), change: "+0%", icon: ShieldCheck, color: "text-indigo-500" },
    { title: "Empresas B2B", value: stats.totalOrgs.toString(), change: "+0%", icon: Calendar, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Painel de Controle</h1>
          <p className="text-muted-foreground font-medium italic">Bem-vindo de volta, Administrador.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchData} className="p-3 rounded-2xl bg-muted/50 border border-border/40 text-muted-foreground hover:bg-muted transition-all">
            <ArrowUpRight className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          Ocorreu um problema ao conectar com o Supabase. Verifique se as tabelas foram criadas.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="border-border/40 bg-card/60 backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{loading ? "..." : card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground italic font-medium">Gráfico de desempenho será habilitado assim que novas vendas forem registradas.</p>
        </Card>

        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-xl font-black">Atividade Recente</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading ? <p className="text-xs italic text-muted-foreground">Carregando...</p> :
              recentLogs.length === 0 ? <p className="text-xs italic text-muted-foreground">Nenhuma atividade registrada ainda.</p> :
                recentLogs.map((log) => (
                  <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/10">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.severity === 'security' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">{log.action}</p>
                      <p className="text-xs font-bold text-foreground/90 line-clamp-1">{log.details || 'Sem detalhes'}</p>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

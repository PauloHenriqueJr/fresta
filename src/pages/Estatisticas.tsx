import { motion } from "framer-motion";
import { ArrowLeft, Eye, Heart, Users, TrendingUp, Calendar as CalIcon, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";

export default function Estatisticas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      CalendarsRepository.getWithDays(id).then(res => {
        if (res) {
          setCalendar(res.calendar);
          setDays(res.days);
        }
      }).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!calendar) return <div className="p-8 text-center italic">Calendário não encontrado</div>;

  const overviewStats = [
    { label: "Visualizações", value: calendar.views || 0, icon: Eye, change: "+12%" },
    { label: "Curtidas", value: calendar.likes || 0, icon: Heart, change: "+8%" },
    { label: "Compartilhamentos", value: calendar.shares || 0, icon: Users, change: "+23%" },
  ];

  const topDoors = days
    .filter(d => d.opened_count > 0)
    .sort((a, b) => b.opened_count - a.opened_count)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="flex items-center justify-between px-4 py-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Estatísticas</h1>
            <p className="text-sm text-muted-foreground">{calendar.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full">
          <CalIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">{calendar.duration} dias</span>
        </div>
      </div>

      <div className="px-4 space-y-8 max-w-[1600px] lg:mx-auto pb-12">
        <div className="grid grid-cols-3 gap-6">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-4 shadow-card hover:border-primary/20 border border-transparent transition-all">
              <stat.icon className="w-6 h-6 text-primary mb-2" />
              <p className="text-xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.section className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-foreground">Performance Geográfica / Temporal</h2>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="h-40 flex items-center justify-center italic text-muted-foreground/50 border-t border-border/10 pt-4">
              [Gráfico detalhado de visualizações temporais via Supabase Edge]
            </div>
          </motion.section>

          <motion.section className="bg-card rounded-3xl p-6 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-bold text-foreground mb-4">Portas Mais Abertas</h2>
            <div className="space-y-4">
              {topDoors.length === 0 ? (
                <p className="text-xs italic text-muted-foreground text-center py-8">Nenhuma porta aberta ainda.</p>
              ) : topDoors.map((door, index) => (
                <div key={door.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/10">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-black">
                    {door.day}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Porta {door.day}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">{door.opened_count || 0} aberturas</p>
                  </div>
                  <div className="text-xs font-black text-primary">#{index + 1}</div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <section className="bg-secondary/40 rounded-2xl p-6 border border-primary/10">
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span> Insights do Fresta
          </h3>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Seu calendário está tendo um bom engajamento! Considere adicionar um **Cupom de Desconto** (se for uma campanha B2B) em uma das portas finais para aumentar a taxa de conversão.
          </p>
        </section>
      </div>
    </div>
  );
}

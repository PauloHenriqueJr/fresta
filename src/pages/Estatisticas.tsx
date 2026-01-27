import { motion } from "framer-motion";
import { ArrowLeft, Eye, Heart, Users, TrendingUp, Calendar as CalIcon, Loader2, Share2, Sparkles, Trophy, Lightbulb } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { cn } from "@/lib/utils";

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

  const overviewStats = useMemo(() => {
    if (!calendar) return [];
    return [
      {
        label: "Visualizações",
        value: calendar.views || 0,
        icon: Eye,
        bg: "bg-solidroad-turquoise dark:bg-solidroad-turquoise-dark",
        iconColor: "text-[#4ECDC4]"
      },
      {
        label: "Curtidas",
        value: calendar.likes || 0,
        icon: Heart,
        bg: "bg-solidroad-beige dark:bg-solidroad-beige-dark",
        iconColor: "text-[#F9A03F]"
      },
      {
        label: "Compartilhamentos",
        value: calendar.shares || 0,
        icon: Share2,
        bg: "bg-solidroad-green dark:bg-solidroad-green-dark",
        iconColor: "text-[#2D7A5F]"
      },
    ];
  }, [calendar]);

  const topDoors = useMemo(() =>
    days
      .filter(d => (d.opened_count || 0) > 0)
      .sort((a, b) => (b.opened_count || 0) - (a.opened_count || 0))
      .slice(0, 5),
    [days]
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-solidroad-accent/20 flex items-center justify-center animate-pulse">
          <TrendingUp className="w-8 h-8 text-solidroad-accent" />
        </div>
        <p className="font-bold text-muted-foreground animate-pulse uppercase tracking-[0.2em] text-[10px]">Analisando dados...</p>
      </div>
    </div>
  );

  if (!calendar) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔎</div>
        <h2 className="text-2xl font-black text-foreground mb-2">Calendário não encontrado</h2>
        <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">Voltar ao painel</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9F5] dark:bg-background pb-24 transition-colors duration-300 font-display">
      {/* Premium Hero Section - Direct Brand Port */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-24 pt-10">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="dotPatternStats" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPatternStats)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-16 right-[10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[15%] w-32 h-32 bg-solidroad-accent/20 rounded-full blur-2xl" />

        <div className="relative z-10 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group active:scale-90"
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                  <TrendingUp className="w-3 h-3 text-solidroad-accent" />
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">Data & Performance</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                  {calendar.title}
                </h1>
                <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mt-3 flex items-center gap-2">
                  <CalIcon className="w-3 h-3" />
                  Duração: {calendar.duration} dias
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Summary Badge */}
              <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 text-center">
                <p className="text-2xl font-black text-white">{(calendar.views || 0) + (calendar.likes || 0)}</p>
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Interações Totais</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12 relative z-20">
        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {overviewStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-card rounded-[2.5rem] p-8 border border-border/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.iconColor)} />
              </div>
              <p className="text-4xl font-black text-foreground tracking-tighter mb-1">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Section placeholder */}
          <motion.div
            className="lg:col-span-7 bg-card rounded-[3rem] p-10 border border-border/10 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Fluxo de Engajamento</h2>
                <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Atividade ao longo do tempo</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary/40" />
              </div>
            </div>

            <div className="aspect-[16/9] flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-[2rem] border border-dashed border-border/20">
              <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg mb-4">
                <Sparkles className="w-8 h-8 text-solidroad-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">Gerando Inteligência...</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Os gráficos detalhados de performance temporal serão desbloqueados assim que seu calendário atingir volume de tráfego.
              </p>
            </div>
          </motion.div>

          {/* Top Performance Ranking */}
          <motion.div
            className="lg:col-span-5 bg-card rounded-[3rem] p-10 border border-border/10 shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-solidroad-accent/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-solidroad-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Top Portas</h2>
                <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Ranking de Abertura</p>
              </div>
            </div>

            <div className="space-y-4">
              {topDoors.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm italic text-muted-foreground/50 font-medium">Nenhum dado de abertura ainda.</p>
                </div>
              ) : topDoors.map((door, index) => (
                <motion.div
                  key={door.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-[#F8F9F5] dark:bg-muted/30 border border-transparent hover:border-solidroad-accent/20 transition-all group"
                  whileHover={{ x: 5 }}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm",
                    index === 0 ? "bg-solidroad-accent text-white" :
                      index === 1 ? "bg-[#4ECDC4] text-white" :
                        index === 2 ? "bg-[#5DBF94] text-white" :
                          "bg-white dark:bg-card text-muted-foreground"
                  )}>
                    {door.day}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-black text-foreground tracking-tight">Porta {door.day}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{door.opened_count || 0} aberturas</span>
                      <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden max-w-[60px]">
                        <div className="h-full bg-primary/20" style={{ width: `${Math.min((door.opened_count / (calendar.views || 1)) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-tighter">
                    TOP {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Global Insight Pro-tip */}
        <motion.section
          className="mt-12 bg-gradient-to-r from-[#1B4D3E]/5 to-[#2D7A5F]/5 rounded-[3rem] p-10 border border-[#2D7A5F]/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="w-32 h-32 text-[#2D7A5F]" />
          </div>

          <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-card shadow-xl flex items-center justify-center text-4xl shrink-0">
            <Lightbulb className="w-10 h-10 text-solidroad-accent" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-foreground tracking-tight mb-3 flex items-center justify-center md:justify-start gap-3">
              Fresta Insights
              <div className="px-2 py-0.5 rounded-full bg-solidroad-accent text-white text-[8px] font-black uppercase tracking-widest">Premium</div>
            </h3>
            <p className="text-secondary-foreground font-medium text-lg leading-relaxed max-w-3xl">
              Nossa análise sugere que a **Porta {topDoors[0]?.day || 7}** é seu ponto alto de engajamento. Considere colocar seu conteúdo mais importante ou um presente especial nesse dia para maximizar o impacto emocional! 🎁✨
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

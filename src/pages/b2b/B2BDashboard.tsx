import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Megaphone, Users, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import { cn } from "@/lib/utils";

// Pastel card colors (Solidroad style) with dark mode alternates
const STAT_CARDS = [
  { bg: 'bg-[#FFF8E8] dark:bg-[#1C1A0E]', iconBg: 'bg-[#F6D045]' },  // beige/yellow
  { bg: 'bg-[#E8F5E0] dark:bg-[#0E1A12]', iconBg: 'bg-[#2D7A5F]' },  // green
  { bg: 'bg-[#D4F4F0] dark:bg-[#0E1A1A]', iconBg: 'bg-[#4ECDC4]' },  // turquoise
];

export default function B2BDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const org = useMemo(() => (profile ? db.getB2BOrgByOwner(profile.id) : null), [profile]);
  const campaigns = useMemo(() => (org ? db.listB2BCampaigns(org.id) : []), [org]);
  const members = useMemo(() => (org ? db.listB2BMembers(org.id) : []), [org]);

  const totals = useMemo(() => {
    return campaigns.reduce(
      (acc, c) => {
        acc.views += c.stats.views;
        acc.opens += c.stats.opens;
        acc.leads += c.stats.leads;
        return acc;
      },
      { views: 0, opens: 0, leads: 0 }
    );
  }, [campaigns]);

  // Premium Bento Cards Configuration
  const BENTO_CARDS = [
    {
      label: "Campanhas Ativas",
      value: campaigns.length,
      icon: Megaphone,
      bg: "bg-solidroad-beige dark:bg-solidroad-beige-dark",
      iconBg: "bg-solidroad-accent",
      iconColor: "text-solidroad-text",
      cols: "col-span-1 md:col-span-1"
    },
    {
      label: "Colaboradores",
      value: members.length,
      icon: Users,
      bg: "bg-solidroad-green dark:bg-solidroad-green-dark",
      iconBg: "bg-[#2D7A5F]",
      iconColor: "text-white",
      cols: "col-span-1 md:col-span-1"
    },
    {
      label: "Visualizações Totais",
      value: totals.views,
      icon: Eye,
      bg: "bg-solidroad-turquoise dark:bg-solidroad-turquoise-dark",
      iconBg: "bg-[#4ECDC4]",
      iconColor: "text-white",
      cols: "col-span-1 md:col-span-1"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Premium Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-solidroad-text dark:text-[#F6D045] mb-2">
            Olá, {profile?.display_name?.split(' ')[0] || 'Gestor'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground/80 dark:text-white/60 font-medium">
            Aqui está o resumo da {org ? org.name : "sua organização"} hoje.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/b2b/campanhas/nova")}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-solidroad-accent/20 hover:shadow-xl bg-solidroad-accent text-solidroad-text"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          Nova Campanha
        </motion.button>
      </motion.div>

      {/* Bento Grid Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {BENTO_CARDS.map((card, idx) => (
          <motion.div
            key={card.label}
            variants={item}
            className={cn(
              "rounded-[2rem] p-6 lg:p-8 border border-border/5 relative overflow-hidden group transition-all duration-300 hover:shadow-xl",
              card.bg,
              card.cols
            )}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <card.icon className="w-32 h-32" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", card.iconBg)}>
                <card.icon className={cn("w-7 h-7", card.iconColor)} strokeWidth={2.5} />
              </div>

              <div>
                <p className="text-4xl md:text-5xl font-black tracking-tighter text-solidroad-text dark:text-white">
                  {card.value}
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 dark:text-white/40 mt-1">
                  {card.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Campaigns Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-solidroad-text dark:text-white">
            Campanhas Recentes
          </h2>
          <button
            onClick={() => navigate("/b2b/campanhas")}
            className="flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-70 text-solidroad-text dark:text-white/60"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {campaigns.length > 0 ? (
            campaigns.slice(0, 5).map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ scale: 1.005, backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => navigate(`/b2b/campanhas/${c.id}`)}
                className="group w-full rounded-2xl p-4 md:p-6 border border-border/10 bg-white dark:bg-white/5 cursor-pointer hover:shadow-lg transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl bg-solidroad-accent text-solidroad-text shadow-sm group-hover:scale-105 transition-transform">
                    {c.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-solidroad-text dark:text-white truncate">
                      {c.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        c.status === 'active'
                          ? "bg-solidroad-green text-[#2D7A5F] dark:bg-solidroad-green-dark dark:text-[#5DBF94]"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {c.status === 'active' ? 'Ativo' : c.status}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground/40 dark:text-white/30">
                        • {c.duration} dias de duração
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:gap-12 mr-2">
                  <div className="hidden md:block text-right">
                    <p className="text-2xl font-black text-solidroad-text dark:text-white">{c.stats.views}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/40">Views</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-transparent group-hover:bg-solidroad-accent/10 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-5 h-5 text-solidroad-text/20 group-hover:text-solidroad-text transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center rounded-[2rem] border-2 border-dashed border-border/10">
              <Megaphone className="w-16 h-16 mx-auto mb-6 text-muted-foreground/10" strokeWidth={1} />
              <h3 className="text-xl font-bold text-solidroad-text dark:text-white mb-2">Nenhuma campanha ainda</h3>
              <p className="text-muted-foreground/60 dark:text-white/40 mb-8 max-w-sm mx-auto">
                Crie sua primeira campanha para engajar seus colaboradores e ver as métricas aparecerem aqui.
              </p>
              <button
                onClick={() => navigate("/b2b/campanhas/nova")}
                className="px-8 py-3 rounded-xl font-bold bg-solidroad-accent text-solidroad-text hover:shadow-lg transition-all"
              >
                Começar Agora
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

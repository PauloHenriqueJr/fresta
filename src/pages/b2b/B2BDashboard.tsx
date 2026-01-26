import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Megaphone, Users, Eye, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import { cn } from "@/lib/utils";

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
      bg: "bg-white",
      iconBg: "bg-solidroad-accent",
      iconColor: "text-solidroad-text",
      cols: "col-span-1 md:col-span-1"
    },
    {
      label: "Colaboradores",
      value: members.length,
      icon: Users,
      bg: "bg-white",
      iconBg: "bg-[#2D7A5F]",
      iconColor: "text-white",
      cols: "col-span-1 md:col-span-1"
    },
    {
      label: "Visualizações Totais",
      value: totals.views,
      icon: Eye,
      bg: "bg-white",
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
    <div className="min-h-screen bg-[#F8F9F5] -m-6 md:-m-10">
      {/* Premium B2B Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-24 pt-12 md:pt-20">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 300">
            <defs>
              <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <Settings className="w-3 h-3 text-solidroad-accent" />
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Painel Corporativo</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
                Olá, {profile?.display_name?.split(' ')[0] || 'Gestor'}! 👋
              </h1>
              <p className="text-lg text-white/60 font-medium">
                Aqui está o resumo da {org ? org.name : "sua organização"} hoje.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/b2b/campanhas/nova")}
              className="flex items-center gap-2 px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl bg-solidroad-accent text-solidroad-text"
            >
              <Plus className="w-5 h-5 stroke-[3px]" />
              NOVA CAMPANHA
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-[1600px] -mt-12 relative z-20 pb-20">
        {/* Bento Grid Stats - Premium Integration */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {BENTO_CARDS.map((card, idx) => (
            <motion.div
              key={card.label}
              variants={item}
              className={cn(
                "rounded-[2.5rem] p-8 lg:p-10 border border-[rgba(0,0,0,0.04)] relative overflow-hidden group transition-all duration-300 hover:shadow-2xl bg-white",
                card.cols
              )}
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <card.icon className="w-32 h-32" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className={cn("w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-lg", card.iconBg)}>
                  <card.icon className={cn("w-8 h-8", card.iconColor)} strokeWidth={2.5} />
                </div>

                <div>
                  <p className="text-4xl md:text-6xl font-black tracking-tighter text-[#1A3E3A]">
                    {card.value}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A7470]/60 mt-1">
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
          className="space-y-6 mt-16"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-[#1A3E3A]">
              Campanhas Recentes
            </h2>
            <button
              onClick={() => navigate("/b2b/campanhas")}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:text-solidroad-accent text-[#5A7470]/60"
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
                  whileHover={{ scale: 1.005 }}
                  onClick={() => navigate(`/b2b/campanhas/${c.id}`)}
                  className="group w-full rounded-[2rem] p-5 md:p-6 border border-[rgba(0,0,0,0.04)] bg-white cursor-pointer hover:shadow-xl transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl bg-solidroad-accent text-solidroad-text shadow-sm group-hover:scale-105 transition-transform">
                      {c.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-lg text-[#1A3E3A] truncate">
                        {c.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          c.status === 'active'
                            ? "bg-[#E8F5E0] text-[#2D7A5F]"
                            : "bg-slate-100 text-slate-400"
                        )}>
                          {c.status === 'active' ? 'Ativo' : c.status}
                        </span>
                        <span className="text-[10px] font-bold text-[#5A7470]/40 uppercase tracking-widest">
                          • {c.duration} dias
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-12 mr-2">
                    <div className="hidden md:block text-right">
                      <p className="text-2xl font-black text-[#1A3E3A] tracking-tighter">{c.stats.views}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#5A7470]/40">Views</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#F8F9F5] group-hover:bg-solidroad-accent transition-colors flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-[#5A7470] group-hover:text-solidroad-text transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center rounded-[3rem] border-2 border-dashed border-[rgba(0,0,0,0.04)] bg-white/50">
                <Megaphone className="w-16 h-16 mx-auto mb-6 text-[#5A7470]/10" strokeWidth={1} />
                <h3 className="text-xl font-black text-[#1A3E3A] mb-2">Nenhuma campanha ainda</h3>
                <p className="text-[#5A7470] font-medium mb-8 max-w-sm mx-auto">
                  Crie sua primeira campanha para engajar seus colaboradores e ver as métricas aparecerem aqui.
                </p>
                <button
                  onClick={() => navigate("/b2b/campanhas/nova")}
                  className="px-8 py-4 rounded-2xl font-black text-sm bg-solidroad-accent text-solidroad-text hover:shadow-xl transition-all"
                >
                  COMEÇAR AGORA
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

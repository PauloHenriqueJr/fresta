import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/state/auth/AuthProvider";
import { B2BRepository } from "@/lib/data/B2BRepository";
import { Loader2, TrendingUp, Users, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Pastel cards with dark mode alternates
const STAT_CARDS = [
  { bg: 'bg-[#FFF8E8] dark:bg-[#1C1A0E]', iconBg: 'bg-[#F6D045]', icon: <TrendingUp className="w-5 h-5 text-[#0E220E]" />, label: "Views" },
  { bg: 'bg-[#E8F5E0] dark:bg-[#0E1A12]', iconBg: 'bg-[#2D7A5F]', icon: <MousePointer2 className="w-5 h-5 text-[#0E220E]" />, label: "Aberturas" },
  { bg: 'bg-[#D4F4F0] dark:bg-[#0E1A1A]', iconBg: 'bg-[#4ECDC4]', icon: <Users className="w-5 h-5 text-[#0E220E]" />, label: "Engajamento" }
];

export default function B2BAnalytics() {
  const { user } = useAuth();
  const [org, setOrg] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const orgData = await B2BRepository.getOrgByOwner(user.id) as any;
        if (orgData) {
          setOrg(orgData);
          const campaignData = await B2BRepository.listCampaigns(orgData.id);
          setCampaigns(campaignData);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const totals = useMemo(() => {
    return (campaigns as any[]).reduce(
      (acc, c) => {
        acc.views += (c as any).views || 0;
        acc.opens += (c as any).opens || 0;
        acc.leads += (c as any).leads || 0;
        return acc;
      },
      { views: 0, opens: 0, leads: 0 }
    );
  }, [campaigns]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F6D045]" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="p-12 text-center bg-white dark:bg-white/5 rounded-3xl border border-border/10">
        <h2 className="text-xl font-bold text-[#0E220E] dark:text-white">Organização não encontrada</h2>
        <p className="text-muted-foreground/60 dark:text-white/40 mt-2">Você precisa configurar seu perfil B2B primeiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
          Analytics
        </h1>
        <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
          Painel de desempenho: {org.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map((s, idx) => {
          const value = idx === 0 ? totals.views : idx === 1 ? totals.opens : totals.leads;
          return (
            <motion.div
              key={s.label}
              className={cn("rounded-2xl p-6 border border-border/10", s.bg)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div
                className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", s.iconBg)}
              >
                {s.icon}
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#0E220E] dark:text-white">
                {value}
              </p>
              <p className="text-sm font-medium mt-1 text-muted-foreground/60 dark:text-white/40">
                {s.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Table/List */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-border/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
            Desempenho por Campanha
          </h2>
        </div>

        <div className="space-y-3">
          {campaigns.map((c, idx) => (
            <div
              key={c.id}
              className="p-4 rounded-xl transition-all border border-border/5 dark:border-white/5 bg-[#F9F9F9] dark:bg-white/5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-[#0E220E] dark:text-white truncate">
                  {c.title || 'Sem título'}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    c.status === 'active' ? "bg-[#E8F5E0] dark:bg-[#0E1A12] text-[#2D7A5F]" : "bg-muted dark:bg-white/5 text-muted-foreground/60"
                  )}>
                    {c.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest leading-loose">
                    {c.theme_id || 'padrão'}
                  </span>
                </div>
              </div>
              <div className="flex gap-8 items-center shrink-0">
                <div className="text-right">
                  <p className="text-lg font-bold text-[#0E220E] dark:text-white">{c.views || 0}</p>
                  <p className="text-[11px] text-muted-foreground/40 uppercase font-bold">Views</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#0E220E] dark:text-white">{c.opens || 0}</p>
                  <p className="text-[11px] text-muted-foreground/40 uppercase font-bold">Opens</p>
                </div>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="py-16 text-center rounded-xl border-2 border-dashed border-border/10">
              <p className="font-medium text-[#0E220E] dark:text-white">Nenhuma campanha encontrada</p>
              <p className="text-sm text-muted-foreground/40 mt-1">Crie sua primeira campanha para ver os números.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

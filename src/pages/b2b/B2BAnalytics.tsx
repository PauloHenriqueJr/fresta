import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/state/auth/AuthProvider";
import { B2BRepository } from "@/lib/data/B2BRepository";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";
import { Loader2, TrendingUp, Users, MousePointer2 } from "lucide-react";

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="p-8 text-center bg-card rounded-3xl shadow-card m-6">
        <h2 className="font-bold text-foreground">Organização não encontrada</h2>
        <p className="text-sm text-muted-foreground mt-1">Você precisa configurar seu perfil B2B primeiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <B2BPageHeader
        title="Analytics"
        subtitle={`Painel de desempenho: ${org.name}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {[
          { label: "Views", value: totals.views, icon: <TrendingUp className="w-4 h-4" /> },
          { label: "Aberturas", value: totals.opens, icon: <MousePointer2 className="w-4 h-4" /> },
          { label: "Engajamento", value: totals.leads, icon: <Users className="w-4 h-4" /> }
        ].map((s, idx) => (
          <motion.div
            key={s.label}
            className="bg-card rounded-2xl p-4 shadow-card lg:p-5 relative overflow-hidden group hover:border-primary/50 border-2 border-transparent transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/40 transition-colors">
              {s.icon}
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl font-black text-foreground mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-foreground text-lg">Desempenho por Campanha</h2>
        </div>

        <div className="space-y-4">
          {campaigns.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4 border border-transparent hover:border-border">
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{c.title || 'Sem título'}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${c.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                    }`}>
                    {c.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-loose">
                    {c.theme_id || 'padrão'}
                  </span>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">{c.views || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">{c.opens || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Opens</p>
                </div>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="py-12 text-center bg-muted/10 rounded-2xl border-2 border-dashed border-border leading-relaxed">
              <p className="font-bold text-foreground">Nenhuma campanha encontrada</p>
              <p className="text-sm text-muted-foreground mt-1">Crie sua primeira campanha para ver os números.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

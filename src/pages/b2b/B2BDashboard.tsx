import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Megaphone, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";

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

  return (
    <div className="space-y-6">
      <B2BPageHeader
        title="Dashboard"
        subtitle={org ? `${org.avatar} ${org.name}` : "Carregando organização..."}
        actions={
          <button onClick={() => navigate("/b2b/campanhas/nova")} className="btn-festive py-3 px-5">
            Nova campanha
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {[{
          label: "Campanhas",
          value: campaigns.length,
          icon: Megaphone,
          gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
        }, {
          label: "Membros da Equipe",
          value: members.length,
          icon: Users,
          gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
        }, {
          label: "Visualizações Totais",
          value: totals.views,
          icon: BarChart3,
          gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
        }].map((s, idx) => (
          <motion.div
            key={s.label}
            className="bg-card rounded-[2rem] p-6 shadow-card border border-border/50 relative overflow-hidden group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${s.gradient} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`} />

            <div className={`w-12 h-12 rounded-2xl ${s.gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-4xl font-black text-foreground tracking-tight">{s.value}</p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-card border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Campanhas Recentes</h2>
            <p className="text-muted-foreground font-medium">Acompanhe o desempenho das suas ações</p>
          </div>
          <button
            onClick={() => navigate("/b2b/campanhas")}
            className="text-sm font-black text-primary hover:text-primary/80 flex items-center gap-2 uppercase tracking-widest"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {campaigns.slice(0, 5).map((c) => (
            <motion.button
              key={c.id}
              onClick={() => navigate(`/b2b/campanhas/${c.id}`)}
              className="w-full bg-background rounded-2xl p-4 border border-border/50 hover:border-primary/30 flex items-center justify-between group shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4 min-w-0 text-left">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors`}>
                  {c.title.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-foreground truncate text-lg leading-none mb-1 group-hover:text-primary transition-colors">{c.title}</p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                    <span className={`px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-foreground'}`}>
                      {c.status === 'active' ? 'Ativo' : c.status}
                    </span>
                    <span>•</span>
                    <span>{c.duration} dias</span>
                  </div>
                </div>
              </div>

              <div className="text-right pl-4">
                <p className="text-2xl font-black text-foreground">{c.stats.views}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Views</p>
              </div>
            </motion.button>
          ))}
          {campaigns.length === 0 && (
            <div className="py-12 text-center bg-secondary/30 rounded-3xl border-2 border-dashed border-border">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="font-bold text-foreground text-lg">Nenhuma campanha ainda</p>
              <p className="text-muted-foreground mt-1 mb-4">Que tal criar sua primeira experiência mágica?</p>
              <button onClick={() => navigate("/b2b/campanhas/nova")} className="btn-festive px-6 py-2 text-sm">Criar Campanha</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Crown,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Eye,
  Heart,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { useEffect, useState } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";

export default function Perfil() {
  const navigate = useNavigate();
  const { user, profile, logout, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({ totalCalendars: 0, views: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      CalendarsRepository.getUserStats(user.id)
        .then(setStats)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/entrar", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const statCards = [
    { label: "Calendários", value: stats.totalCalendars, icon: Calendar },
    { label: "Visualizações", value: stats.views.toLocaleString(), icon: Eye },
    { label: "Curtidas", value: stats.likes, icon: Heart },
  ];

  const menuItems = [
    { icon: Crown, label: "Seja Premium", description: "Desbloqueie recursos exclusivos", route: "/premium", highlight: true },
    { icon: Settings, label: "Configurações da Conta", description: "Edite seu perfil e preferências", route: "/conta/configuracoes" },
    { icon: HelpCircle, label: "Ajuda e Suporte", description: "Dúvidas frequentes e contato", route: "/ajuda" },
  ];

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="hidden lg:block px-4 pt-12 max-w-[1600px] lg:mx-auto">
        <motion.div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-card via-background to-card border border-border/50 p-12 shadow-2xl group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 flex items-center gap-12">
            <div className="w-48 h-48 rounded-[2.5rem] bg-gradient-festive flex items-center justify-center shadow-2xl">
              <span className="text-8xl">{profile?.avatar ?? "👤"}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-xs font-black text-primary uppercase tracking-[0.2em]">Membro desde 2024</span>
                <span className="px-4 py-1.5 rounded-full bg-accent/20 text-xs font-black text-accent-foreground uppercase tracking-[0.2em] border border-accent/20">🌟 Plano Free</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-foreground mb-4">{profile?.display_name || user?.email?.split('@')[0]}</h1>
              <p className="text-xl text-muted-foreground/80 font-medium max-w-xl">Gerencie sua experiência festiva e acompanhe seus sucessos na comunidade Fresta.</p>
            </div>
            <button onClick={() => navigate("/conta/configuracoes")} className="px-8 py-4 rounded-[1.25rem] bg-card border border-border text-foreground font-black hover:bg-muted transition-all shadow-xl flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" /> Editar Perfil
            </button>
          </div>
        </motion.div>
      </div>

      <div className="px-4 max-w-[1600px] lg:mx-auto pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 lg:mt-12">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-card rounded-[2rem] p-8 luxury-shadow flex flex-col gap-4 border border-transparent hover:border-primary/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center"><stat.icon className="w-7 h-7 text-primary" /></div>
              <div>
                <p className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8 mt-12 lg:mt-16">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-4">Recursos & Preferências</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <button key={item.label} onClick={() => navigate(item.route)} className={`group p-8 rounded-[2.5rem] flex flex-col gap-6 transition-all border border-border/30 hover:border-primary/40 luxury-shadow ${item.highlight ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${item.highlight ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-primary"}`}><item.icon className="w-7 h-7" /></div>
                <div className="flex-1 text-left">
                  <p className="font-black text-xl text-foreground tracking-tight mb-1">{item.label}</p>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.description}</p>
                </div>
              </button>
            ))}
            <button onClick={handleLogout} className="group p-8 rounded-[2.5rem] bg-festive-red/5 border border-festive-red/20 flex flex-col gap-6 transition-all hover:bg-festive-red/10 luxury-shadow">
              <div className="w-14 h-14 rounded-2xl bg-festive-red flex items-center justify-center shadow-lg shadow-festive-red/30 transition-all group-hover:scale-110"><LogOut className="w-7 h-7 text-white" /></div>
              <div className="flex-1 text-left">
                <p className="font-black text-xl text-festive-red tracking-tight mb-1">Encerrar Sessão</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">Proteja sua privacidade ao sair</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

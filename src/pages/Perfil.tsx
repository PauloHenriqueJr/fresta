import { motion } from "framer-motion";
import {
  Crown,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Eye,
  Flame,
  Loader2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { useEffect, useState } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import AvatarPicker from "@/components/AvatarPicker";

// Solidroad-style pastel colors
const STAT_COLORS = [
  { bg: 'bg-[#E8F5E0]', icon: 'bg-[#2D7A5F]' },  // green
  { bg: 'bg-[#FFF8E8]', icon: 'bg-[#F9A03F]' },  // beige/orange
  { bg: 'bg-[#D4F4F0]', icon: 'bg-[#4ECDC4]' },  // turquoise
];

const MENU_COLORS = [
  'bg-[#FFF8E8]', // beige
  'bg-[#E8F5E0]', // green
  'bg-[#D4F4F0]', // turquoise
  'bg-[#FFE5EC]', // pink
];

export default function Perfil() {
  const navigate = useNavigate();
  const { user, profile, logout, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({ totalCalendars: 0, activeCalendars: 0, views: 0, likes: 0 });
  const [loading, setLoading] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

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
    { label: "Ativos", value: stats.activeCalendars, icon: Flame },
    { label: "Visualizações", value: stats.views.toLocaleString(), icon: Eye },
  ];

  const menuItems = [
    { icon: Crown, label: "Seja Premium", description: "Desbloqueie recursos exclusivos", route: "/premium", highlight: true },
    { icon: Settings, label: "Configurações", description: "Edite perfil e preferências", route: "/conta/configuracoes" },
    { icon: HelpCircle, label: "Ajuda", description: "Dúvidas e suporte", route: "/ajuda" },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 300">
            <defs>
              <pattern id="circles" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="4" fill="white" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 right-[10%] w-32 h-32 bg-[#F9A03F]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[15%] w-24 h-24 bg-[#4ECDC4]/20 rounded-full blur-2xl" />

        <div className="relative z-10 container mx-auto px-6 py-12 lg:py-16">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Avatar */}
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-white/10 backdrop-blur-sm overflow-hidden border-4 border-white/20 shadow-2xl hover:border-white/40 transition-all group"
            >
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <img
                  src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.email || 'default'}&backgroundColor=b6e3f4`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white text-sm font-bold">Alterar</span>
              </div>
            </button>

            {/* Info */}
            <div className="text-center lg:text-left flex-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
                  Membro desde 2024
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F9A03F] text-white text-xs font-bold">
                  Free
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight">
                {profile?.display_name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-white/60 max-w-md">
                Gerencie sua experiência e acompanhe seus calendários
              </p>
            </div>

            {/* Edit button - desktop */}
            <button
              onClick={() => navigate("/conta/configuracoes")}
              className="hidden lg:flex items-center gap-2 px-6 py-3 bg-white text-[#1A3E3A] rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Settings className="w-5 h-5" />
              Editar Perfil
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-3 gap-4 -mt-8 relative z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 lg:p-8 bg-card border border-border/10 shadow-sm"
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${STAT_COLORS[index].icon} flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <p className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          className="mt-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-muted-foreground/60 uppercase tracking-wider mb-4">Recursos</h2>

          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className="w-full flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-card border border-border/10 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.highlight ? 'bg-solidroad-accent shadow-glow' : 'bg-muted'}`}>
                <item.icon className={`w-5 h-5 ${item.highlight ? 'text-solidroad-text' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-bold text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground/60">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-card border border-border/10 hover:bg-red-500/5 hover:border-red-500/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-bold text-foreground group-hover:text-red-500 transition-colors">Sair da conta</p>
              <p className="text-sm text-muted-foreground/60">Encerrar sua sessão</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        currentAvatar={profile?.avatar}
      />
    </div>
  );
}

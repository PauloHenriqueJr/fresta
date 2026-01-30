import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import {
  Plus,
  Search,
  MoreVertical,
  Loader2,
  Eye,
  Edit2,
  Settings,
  BarChart3,
  Trash2,
  Calendar,
  ArrowRight,
  Sparkles,
  Gift,
  PartyPopper,
  ChevronRight,
  DoorOpen,
  Lock
} from "lucide-react";
import { PlusIcon } from "@/components/PremiumIcon";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { useAuth } from "@/state/auth/AuthProvider";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

// Theme Images
import mascotNatal from "@/assets/mascot-natal.jpg";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotPascoa from "@/assets/mascot-pascoa.jpg";
import mascotIndependencia from "@/assets/mascot-independencia.jpg";
import mascotDiaDasMaes from "@/assets/mascot-diadasmaes.jpg";
import mascotDiaDosPais from "@/assets/mascot-diadospais.jpg";
import mascotDiaDasCriancas from "@/assets/mascot-diadascriancas.jpg";
import mascotAniversario from "@/assets/mascot-aniversario.jpg";
import mascotViagem from "@/assets/mascot-viagem.jpg";
import mascotEstudos from "@/assets/mascot-estudo.jpg";
import mascotMetas from "@/assets/mascot-metas.jpg";
import mascotNamoro from "@/assets/mascot-namoro.jpg";
import mascotNoivado from "@/assets/mascot-noivado.jpg";
import mascotCasamento from "@/assets/mascot-casamento.jpg";
import mascotBodas from "@/assets/mascot-bodas.jpg";
import mascotReveillon from "@/assets/mascot-reveillon.jpg";

const themeImages: Record<string, string> = {
  natal: mascotNatal,
  carnaval: mascotCarnaval,
  saojoao: mascotSaoJoao,
  pascoa: mascotPascoa,
  independencia: mascotIndependencia,
  diadasmaes: mascotDiaDasMaes,
  diadospais: mascotDiaDosPais,
  diadascriancas: mascotDiaDasCriancas,
  aniversario: mascotAniversario,
  viagem: mascotViagem,
  estudos: mascotEstudos,
  metas: mascotMetas,
  namoro: mascotNamoro,
  noivado: mascotNoivado,
  casamento: mascotCasamento,
  bodas: mascotBodas,
  reveillon: mascotReveillon,
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

type CalendarType = Tables<'calendars'>;

// Plus Bento Stats for B2C
const STATS = [
  { label: "Calendários Ativos", key: "active", icon: Calendar, bg: "bg-solidroad-beige dark:bg-solidroad-beige-dark", iconColor: "text-[#F9A03F]" },
  { label: "Total de Visualizações", key: "views", icon: Eye, bg: "bg-solidroad-turquoise dark:bg-solidroad-turquoise-dark", iconColor: "text-[#4ECDC4]" },
  { label: "Momentos Criados", key: "total", icon: Gift, bg: "bg-solidroad-green dark:bg-solidroad-green-dark", iconColor: "text-[#2D7A5F]" },
];

const MeusCalendarios = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();

  const [query, setQuery] = useState("");
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarToDelete, setCalendarToDelete] = useState<{ id: string, title: string } | null>(null);

  const fetchCalendars = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await CalendarsRepository.listByOwner(userId);
      setCalendars(data || []);
    } catch (err: any) {
      console.error('MeusCalendarios: Fetch failed', err);
      setError('Não foi possível carregar seus calendários. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchCalendars(user.id);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  const handleDelete = async () => {
    if (!calendarToDelete) return;
    try {
      await CalendarsRepository.delete(calendarToDelete.id);
      setCalendars(prev => prev.filter(c => c.id !== calendarToDelete.id));
      setCalendarToDelete(null);
    } catch (err) {
      console.error('Error deleting calendar:', err);
    }
  };

  const filteredCalendars = calendars.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.title.toLowerCase().includes(q);
  });

  const statsData = useMemo(() => {
    return {
      active: calendars.filter(c => c.status === 'ativo').length,
      views: calendars.reduce((acc, c) => acc + (c.views || 0), 0),
      total: calendars.length
    };
  }, [calendars]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading || authLoading) {
    return <Loader text="Abrindo suas portas..." />;
  }

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-300">
      {/* Plus Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-20 pt-10">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-16 right-[10%] w-40 h-40 bg-[#F9A03F]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-[15%] w-32 h-32 bg-[#4ECDC4]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 container mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <Sparkles className="w-3 h-3 text-solidroad-accent" />
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Painel de Controle</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                Meus <span className="text-solidroad-accent">Calendários</span>
              </h1>
              <p className="text-lg text-white/60 font-medium">
                Gerencie suas experiências e acompanhe os momentos
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/criar")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-card text-[#1B4D3E] dark:text-white rounded-2xl font-black shadow-2xl hover:shadow-white/10 transition-all group"
            >
              <Plus className="w-5 h-5 stroke-[3px] group-hover:rotate-90 transition-transform duration-300" />
              CRIAR NOVO
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Stats Grid - Overlapping Hero */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 -mt-12 relative z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-2xl p-5 md:p-8 bg-card border border-border/10 shadow-sm group hover:shadow-xl transition-all duration-300",
                idx === 2 ? "col-span-2 md:col-span-1" : ""
              )}
            >
              <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-5 h-5 md:w-6 md:h-6", stat.iconColor)} />
              </div>
              <p className="text-2xl md:text-4xl font-black text-foreground tracking-tighter">
                {stat.key === 'views' ? statsData.views.toLocaleString() : statsData[stat.key as keyof typeof statsData]}
              </p>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search Bar - Floating White Card style from Explorar */}
        <motion.div
          className="mt-8 bg-card rounded-2xl shadow-sm p-4 flex items-center gap-4 border border-border/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Buscar por título ou tema..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-medium"
            />
          </div>
        </motion.div>

        {/* List Content */}
        <div className="mt-12">
          {filteredCalendars.length === 0 ? (
            <motion.div
              className="py-20 text-center bg-card rounded-[2.5rem] border border-border/10 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 bg-solidroad-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-solidroad-accent" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">Nada por aqui ainda</h2>
              <p className="text-muted-foreground/60 max-w-xs mx-auto mb-8">
                {query ? `Nenhum calendário com "${query}" foi encontrado.` : "Seus calendários aparecerão aqui. Que tal criar o primeiro agora?"}
              </p>
              {!query && (
                <button
                  onClick={() => navigate("/criar")}
                  className="px-8 py-3.5 bg-solidroad-accent text-solidroad-text rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-glow"
                >
                  Criar meu Primeiro Calendário
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredCalendars.map((calendar, index) => {
                const def = getThemeDefinition(BASE_THEMES, calendar.theme_id as any);
                const colors = [
                  'bg-[#FFF8E8]', 'bg-[#D4F4F0]', 'bg-[#E8F5E0]', 'bg-[#FFE5EC]'
                ];
                const cardBg = colors[index % colors.length];

                return (
                  <motion.div
                    key={calendar.id}
                    variants={item}
                    onClick={() => {
                      if (calendar.status === 'aguardando_pagamento') {
                        navigate(`/checkout/${calendar.id}`);
                      } else {
                        navigate(`/calendario/${calendar.id}`);
                      }
                    }}
                  >
                    {/* Hover status background color change or pattern? */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-solidroad-accent to-solidroad-green opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm border border-black/5 overflow-hidden relative">
                        {def?.id && themeImages[def.id] ? (
                          <img
                            src={themeImages[def.id]}
                            alt={calendar.title}
                            className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <PlusIcon name={def?.iconName || "Sparkles"} className="w-8 h-8 text-solidroad-accent" />
                        )}
                        {/* Overlay with icon on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {calendar.status === 'ativo' ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#2D7A5F]/10 text-[#2D7A5F] border border-[#2D7A5F]/10 animate-pulse-soft">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2D7A5F]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Ativo</span>
                          </div>
                        ) : (calendar.status as string) === 'aguardando_pagamento' ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#F9A03F]/10 text-[#F9A03F] border border-[#F9A03F]/10">
                            <Lock className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pendente</span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Inativo</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 mb-8">
                      <h3 className="text-xl font-black text-foreground line-clamp-1 group-hover:text-solidroad-accent transition-colors tracking-tight">
                        {calendar.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {calendar.duration} dias</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {calendar.views || 0}</span>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-black/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-solidroad-accent uppercase tracking-[0.2em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        Gerenciar <ChevronRight className="w-3 h-3" />
                      </span>

                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-9 h-9 rounded-xl hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground/60"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-card shadow-2xl border border-border/10">
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); navigate(`/calendario/${calendar.id}`); }}
                              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-solidroad-accent/10 hover:text-solidroad-accent transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-2" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                if (calendar.status === 'aguardando_pagamento') {
                                  navigate(`/checkout/${calendar.id}`);
                                } else {
                                  navigate(`/editar-dia/${calendar.id}/1`);
                                }
                              }}
                              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-solidroad-accent/10 hover:text-solidroad-accent transition-colors"
                            >
                              <Edit2 className="w-4 h-4 mr-2" /> {calendar.status === 'aguardando_pagamento' ? "Pagar para Editar" : "Editar Conteúdo"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="border-border/10" />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalendarToDelete({ id: calendar.id, title: calendar.title || '' });
                              }}
                              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-red-500/10 text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Dialog - Premium Style using Portal */}
      <DeleteConfirmModal
        isOpen={!!calendarToDelete}
        onClose={() => setCalendarToDelete(null)}
        onConfirm={handleDelete}
        title="Excluir Calendário?"
        description={
          <>
            Você está prestes a excluir permanentemente <strong>"{calendarToDelete?.title}"</strong>. Todos os momentos e surpresas serão perdidos.
          </>
        }
      />
    </div >
  );
};

export default MeusCalendarios;

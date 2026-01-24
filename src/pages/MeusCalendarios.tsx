import { motion } from "framer-motion";
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
  PartyPopper
} from "lucide-react";
import { PremiumIcon } from "@/components/PremiumIcon";
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


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type CalendarType = Tables<'calendars'>;

// Premium Bento Stats for B2C
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-solidroad-accent/20 flex items-center justify-center animate-pulse">
            <Calendar className="w-8 h-8 text-solidroad-accent" />
          </div>
          <p className="font-bold text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Header */}
      {/* Mobile Header (Reference Style) */}
      <div className="flex md:hidden items-center justify-between py-4 px-1">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-solidroad-text dark:text-white">
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-lg font-bold text-solidroad-text dark:text-white">
          Meus Calendários
        </h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/criar")}
          className="w-10 h-10 rounded-xl bg-solidroad-green dark:bg-solidroad-green-dark flex items-center justify-center text-[#2D7A5F] dark:text-[#5DBF94] shadow-sm"
        >
          <Plus className="w-6 h-6 stroke-[3px]" />
        </motion.button>
      </div>

      {/* Desktop Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-solidroad-text dark:text-white mb-2">
            Meus Calendários
          </h1>
          <p className="text-lg text-muted-foreground/80 dark:text-white/60 font-medium">
            Gerencie suas experiências
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/criar")}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-solidroad-accent/20 hover:shadow-xl bg-solidroad-accent text-solidroad-text hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          Criar Novo
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex overflow-x-auto pb-6 gap-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-4 md:pb-0 snap-x hide-scrollbar"
      >
        {STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            variants={item}
            className={cn(
              "min-w-[140px] md:min-w-0 snap-center rounded-2xl md:rounded-[2rem] p-4 md:p-8 border border-border/5 relative overflow-hidden group transition-all duration-300 hover:shadow-xl flex-1",
              stat.bg
            )}
          >
            {/* Desktop-only Decoration */}
            <div className="hidden md:block absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <stat.icon className="w-32 h-32" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full gap-3 md:gap-4">
              <div className={cn("w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-sm", stat.iconColor)}>
                <stat.icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-black tracking-tighter text-solidroad-text dark:text-white">
                  {stat.key === 'views' ? statsData.views.toLocaleString() : statsData[stat.key as keyof typeof statsData]}
                </p>
                <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-muted-foreground/60 dark:text-white/40 mt-0.5 md:mt-1 truncate">
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search Bar - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-5 rounded-xl md:rounded-3xl border border-border/10 bg-white dark:bg-white/5 focus-within:ring-2 focus-within:ring-solidroad-accent/50 focus-within:bg-white/80 dark:focus-within:bg-white/10 transition-all shadow-sm"
      >
        <Search className="w-5 h-5 text-muted-foreground/40" strokeWidth={2.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar calendários..."
          className="flex-1 bg-transparent focus:outline-none font-medium text-solidroad-text dark:text-white placeholder:text-muted-foreground/40 text-sm md:text-base"
        />
      </motion.div>

      {/* Calendars List (Mobile) & Grid (Desktop) */}
      <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredCalendars.length === 0 ? (
          <div className="col-span-full rounded-[2.5rem] p-16 border-2 border-dashed border-border/10 text-center bg-white/50 dark:bg-white/5">
            <div className="w-20 h-20 bg-solidroad-beige dark:bg-solidroad-beige-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Sparkles className="w-10 h-10 text-solidroad-accent opacity-60" />
            </div>
            <h2 className="font-bold text-xl mb-2 text-solidroad-text dark:text-white">
              Nenhum calendário encontrado
            </h2>
            <p className="text-base mb-8 text-muted-foreground/60 dark:text-white/40 max-w-sm mx-auto">
              {query ? `Não encontramos nada para "${query}".` : "Você ainda não criou nenhum calendário. Que tal começar agora?"}
            </p>
            <button
              onClick={() => navigate("/criar")}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-solidroad-accent text-solidroad-text shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Criar Calendário
            </button>
          </div>
        ) : (
          filteredCalendars.map((calendar, index) => {
            const def = getThemeDefinition(BASE_THEMES, calendar.theme_id as any);
            return (
              <>
                {/* Mobile List Item */}
                <motion.div
                  key={`mobile-${calendar.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/calendario/${calendar.id}`)}
                  className="md:hidden flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-border/10 shadow-sm active:scale-[0.98] transition-all"
                >
                  {/* Thumbnail Row */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border/10 relative">
                    {def?.id && themeImages[def.id] ? (
                      <img
                        src={themeImages[def.id]}
                        alt={calendar.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-solidroad-green to-solidroad-turquoise dark:from-white/5 dark:to-white/10 flex items-center justify-center">
                        <PremiumIcon name={def?.iconName || "Sparkles"} className="w-8 h-8 text-[#2D7A5F] dark:text-white/80" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base text-solidroad-text dark:text-white truncate">
                        {calendar.title}
                      </h3>
                      {calendar.status === 'ativo' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-solidroad-green text-[#2D7A5F] text-[9px] font-bold uppercase tracking-wide">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/80 dark:text-white/50 truncate">
                      {calendar.duration} dias • {(calendar.views || 0)} views
                    </p>
                  </div>

                  <button className="p-2 text-muted-foreground/40">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </motion.div>

                {/* Desktop Card (Unchanged Grid Item) */}
                <motion.div
                  key={calendar.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/calendario/${calendar.id}`)}
                  className="hidden md:flex group relative rounded-[2rem] p-6 lg:p-8 bg-white dark:bg-white/5 border border-border/10 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Decorative Background Blur */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-solidroad-accent/10 rounded-full blur-3xl group-hover:bg-solidroad-accent/20 transition-all duration-500" />

                  <div className="relative z-10 flex flex-col h-full w-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#F9F9F9] dark:bg-white/10 flex items-center justify-center shadow-sm border border-border/5 overflow-hidden relative">
                        {def?.id && themeImages[def.id] ? (
                          <img
                            src={themeImages[def.id]}
                            alt={calendar.title}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <PremiumIcon name={def?.iconName || "Sparkles"} className="w-8 h-8 text-solidroad-accent" />
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                          calendar.status === 'ativo'
                            ? "bg-solidroad-green text-[#2D7A5F] border-[#2D7A5F]/10 dark:bg-solidroad-green-dark dark:text-[#5DBF94]"
                            : "bg-muted text-muted-foreground border-transparent"
                        )}>
                          {calendar.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-solidroad-text dark:text-white mb-2 line-clamp-1 group-hover:text-solidroad-accent transition-colors">
                      {calendar.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/60 dark:text-white/40 mb-8">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {calendar.duration} dias
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> {(calendar.views || 0).toLocaleString()} reviews
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/10">
                      <span className="text-xs font-bold text-solidroad-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0">
                        Ver detalhes
                      </span>

                      <div className="flex items-center justify-end">
                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-muted-foreground transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white dark:bg-[#1C1A0E] border-border/10 shadow-xl">
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); navigate(`/calendario/${calendar.id}`); }}
                              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-muted"
                            >
                              <Eye className="w-4 h-4 mr-2" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); navigate(`/editar-dia/${calendar.id}/1`); }}
                              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-muted"
                            >
                              <Edit2 className="w-4 h-4 mr-2" /> Editar Conteúdo
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/10" />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalendarToDelete({ id: calendar.id, title: calendar.title || '' });
                              }}
                              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-red-50 text-red-500 focus:bg-red-50 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            );
          })
        )}
      </div>

      {/* Delete Dialog - Premium Style */}
      <AlertDialog open={!!calendarToDelete} onOpenChange={() => setCalendarToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#1C1A0E] rounded-[2rem] border-border/10 p-8 shadow-2xl">
          <AlertDialogHeader>
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-solidroad-text dark:text-white">Excluir experiência?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground/80 font-medium mt-2">
              Você está prestes a excluir <strong>"{calendarToDelete?.title}"</strong>.
              Esta ação é irreversível e todos os dados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-xl h-12 px-6 font-bold border-2 border-border/10 bg-transparent hover:bg-muted/50">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-red-500/20"
            >
              Sim, excluir permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeusCalendarios;

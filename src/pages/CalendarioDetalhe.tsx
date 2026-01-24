import { motion } from "framer-motion";
import { ArrowLeft, Settings, BarChart3, Share2, Loader2, Eye, Edit, Info, Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { useAuth } from "@/state/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/supabase/types";
import DaySurpriseModal from "@/components/calendar/DaySurpriseModal";
import { format, addDays, parseISO, startOfDay, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type CalendarType = Tables<"calendars">;
type CalendarDay = Tables<"calendar_days">;

const ALL_THEMES = ["default", "carnaval", "saojoao", "natal", "reveillon", "pascoa", "independencia", "namoro", "casamento"] as const;

const toUiTheme = (theme: string) =>
  (ALL_THEMES.includes(theme as any) ? theme : "default") as typeof ALL_THEMES[number];

const CalendarioDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [calendar, setCalendar] = useState<CalendarType | null>(null);
  const [daysData, setDaysData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedDayPreview, setSelectedDayPreview] = useState<number | null>(null);
  const [previewOpenedDays, setPreviewOpenedDays] = useState<number[]>([]);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const result = await CalendarsRepository.getWithDays(id);
        if (!result) {
          setCalendar(null);
          setDaysData([]);
          setError("Calendário não encontrado.");
          return;
        }
        setCalendar(result.calendar);
        setDaysData(result.days || []);
        setError(null);
      } catch (err) {
        console.error("CalendarioDetalhe: Error fetching calendar", err);
        setError("Erro ao carregar calendário.");
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [id]);

  const isOwner = useMemo(() => {
    if (!calendar) return false;
    const currentUserId = profile?.id || user?.id;
    return !!currentUserId && calendar.owner_id === currentUserId;
  }, [calendar, profile, user]);

  const days = useMemo(() => {
    if (!calendar) return [];
    try {
      const dayMap = new Map((daysData || []).map((day) => [day.day, day]));
      return Array.from({ length: calendar.duration || 0 }, (_, i) => {
        const dayNum = i + 1;
        const dayData = dayMap.get(dayNum);
        const hasSpecialContent = !!(dayData?.content_type || dayData?.message || dayData?.url || dayData?.label);

        const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar.created_at || new Date().toISOString());
        const doorDate = startOfDay(addDays(baseDate, dayNum - 1));
        const dateLabel = format(doorDate, "dd MMM", { locale: ptBR });
        const isLocked = isAfter(doorDate, startOfDay(new Date()));

        // Logic sync: Creator sees what user sees (Locked/Available), unless in Preview Mode interactively opening
        // But click always goes to Edit if not preview mode
        let status: "locked" | "available" | "opened" = isLocked ? "locked" : "available";

        if (previewMode) {
          status = previewOpenedDays.includes(dayNum) ? "opened" : status;
        }

        return {
          day: dayNum,
          dateLabel,
          status,
          hasSpecialContent,
        };
      });
    } catch (e) {
      console.error("CalendarioDetalhe: Error processing days", e);
      return [];
    }
  }, [calendar, daysData, previewMode, previewOpenedDays]);

  const selectedDayData = useMemo(() =>
    daysData.find(d => d.day === selectedDayPreview),
    [daysData, selectedDayPreview]
  );

  const handleShare = async () => {
    if (!calendar) return;
    const url = `${window.location.origin}/#/c/${calendar.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: calendar.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copiado!", description: "O link foi copiado para a área de transferência." });
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-solidroad-accent" />
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="min-h-screen px-4 py-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-xl font-bold text-solidroad-text">Calendário não encontrado</h1>
        <button onClick={() => navigate(-1)} className="mt-4 text-solidroad-accent font-bold hover:underline">Voltar</button>
      </div>
    );
  }

  const completionPercentage = Math.round((days.filter(d => d.hasSpecialContent).length / (calendar.duration || 1)) * 100);

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden theme-${calendar.theme_id}`}>
      {/* Sao Joao Background Pattern - Synced with VisualizarCalendario */}
      {calendar.theme_id === 'saojoao' && (
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#F9A03F 2px, transparent 2px), radial-gradient(#F9A03F 2px, transparent 2px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px"
        }} />
      )}
      {calendar.theme_id === 'casamento' && (
        <div className="absolute inset-0 z-0 opacity-5 dark:opacity-2 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#C5A059 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }} />
      )}

      <FloatingDecorations theme={toUiTheme(calendar.theme_id)} />

      {/* Premium Header - Solidroad Style */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/10 px-6 py-4 transition-colors"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/meus-calendarios')}
              className="w-10 h-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-solidroad-text dark:text-white" strokeWidth={2.5} />
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                  isOwner ? "bg-solidroad-accent/20 text-solidroad-text dark:text-solidroad-accent" : "bg-blue-100 text-blue-700"
                )}>
                  {isOwner ? "Proprietário" : "Visitante"}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  {calendar.privacy === 'public' ? "Público" : "Privado"}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-solidroad-text dark:text-white leading-none mt-1 truncate max-w-md">
                {calendar.title}
              </h1>
            </div>
          </div>

          {/* Actions - Responsive (Mobile Icons, Desktop Text) */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={cn(
                "flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-bold text-sm transition-all border",
                !previewMode
                  ? "bg-solidroad-accent/10 text-solidroad-text dark:text-white border-solidroad-accent/20"
                  : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
              )}
              title={previewMode ? "Modo Visualização" : "Modo Edição"}
            >
              {previewMode ? <Eye className="w-4 h-4 md:w-5 md:h-5 dark:text-white" /> : <Edit className="w-4 h-4 md:w-5 md:h-5 dark:text-solidroad-accent" />}
              <span className="hidden sm:inline">{previewMode ? "Visualização" : "Edição"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-background/50 dark:bg-card border border-border/10 font-bold text-sm text-solidroad-text dark:text-white hover:bg-muted transition-all"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5 dark:text-white" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>

            <div className="hidden md:block h-8 w-px bg-border/10 mx-1" />

            <button
              onClick={() => navigate(`/calendario/${calendar.id}/configuracoes`)}
              className="w-10 h-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors border border-transparent dark:border-border/10"
              title="Configurações"
            >
              <Settings className="w-5 h-5 text-muted-foreground dark:text-white" />
            </button>
          </div>
        </div>
      </motion.header>

      <main className="px-6 py-8 max-w-[1600px] mx-auto space-y-8 relative z-10">
        {/* Stats Row - Bento Grid Lite */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-3xl p-6 border border-border/10 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-solidroad-text dark:text-white">{(calendar.views || 0).toLocaleString()}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 dark:text-white/40">Visualizações</p>
            </div>
          </div>
          <div className="bg-card rounded-3xl p-6 border border-border/10 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-solidroad-text dark:text-white">{completionPercentage}%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 dark:text-white/40">Concluído</p>
            </div>
          </div>
          <div className="bg-card rounded-3xl p-6 border border-border/10 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-solidroad-text dark:text-white">{days.filter(d => d.hasSpecialContent).length} / {calendar.duration}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 dark:text-white/40">Dias Configurados</p>
            </div>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border/10 shadow-sm min-h-[500px] transition-colors">
          <CalendarGrid
            title={calendar.title || "Calendário"}
            month={(() => {
              const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar.created_at || new Date().toISOString());
              return format(baseDate, "MMMM", { locale: ptBR }).toUpperCase();
            })()}
            days={days as any}
            onDayClick={(day) => {
              if (!isOwner) return;
              if (previewMode) {
                setPreviewOpenedDays(prev => prev.includes(day) ? prev : [...prev, day]);
                setTimeout(() => setSelectedDayPreview(day), 600);
              } else {
                navigate(`/editar-dia/${calendar.id}/${day}`);
              }
            }}
            theme={toUiTheme(calendar.theme_id)}
          />
        </div>
      </main>

      <DaySurpriseModal
        isOpen={selectedDayPreview !== null}
        onClose={() => setSelectedDayPreview(null)}
        day={selectedDayPreview || 1}
        content={selectedDayData?.content_type ? {
          type: selectedDayData.content_type as any,
          message: selectedDayData?.message || "",
          url: selectedDayData?.url || "",
          label: selectedDayData?.label || "Abrir",
        } : undefined}
        theme={toUiTheme(calendar.theme_id) as any}
      />

    </div>
  );
};

export default CalendarioDetalhe;

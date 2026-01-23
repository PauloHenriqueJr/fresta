import { motion } from "framer-motion";
import { ArrowLeft, Settings, BarChart3, Share2, Loader2, Eye, Edit, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { useAuth } from "@/state/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/supabase/types";
import DaySurpriseModal from "@/components/calendar/DaySurpriseModal";
import { format, addDays, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Calendar = Tables<"calendars">;
type CalendarDay = Tables<"calendar_days">;

// A UI do calend??rio hoje suporta apenas: default | carnaval | saojoao.
// Outros temas entram como "default" at?? criarmos varia????es visuais espec??ficas.
const ALL_THEMES = ["default", "carnaval", "saojoao", "natal", "reveillon", "pascoa", "independencia", "namoro", "casamento"] as const;

const toUiTheme = (theme: string) =>
  (ALL_THEMES.includes(theme as any) ? theme : "default") as typeof ALL_THEMES[number];

const CalendarioDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [daysData, setDaysData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedDayPreview, setSelectedDayPreview] = useState<number | null>(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!id) {
        console.warn("CalendarioDetalhe: No ID provided");
        setLoading(false);
        return;
      }

      console.log("CalendarioDetalhe: Starting fetch for ID", id);
      setLoading(true);

      try {
        const result = await CalendarsRepository.getWithDays(id);
        console.log("CalendarioDetalhe: Fetch result", result);

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
        setError("Erro ao carregar calendário. Verifique sua conexão.");
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

        return {
          day: dayNum,
          dateLabel,
          status: hasSpecialContent ? ("opened" as const) : ("available" as const),
          hasSpecialContent,
        };
      });
    } catch (e) {
      console.error("CalendarioDetalhe: Error processing days", e);
      return [];
    }
  }, [calendar, daysData]);

  const selectedDayData = useMemo(() =>
    daysData.find(d => d.day === selectedDayPreview),
    [daysData, selectedDayPreview]
  );

  const handleShare = async () => {
    if (!calendar) return;
    try {
      await CalendarsRepository.incrementShares(calendar.id);
    } catch (err) {
      console.error("CalendarioDetalhe: erro ao incrementar compartilhamentos", err);
    }
    const url = `${window.location.origin}${import.meta.env.BASE_URL}#/c/${calendar.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: calendar.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copiado!", description: "O link do seu calend??rio foi copiado." });
      }
    } catch {
      // ignore
    }
  };

  console.log("CalendarioDetalhe: Rendering. Loading:", loading, "Calendar:", !!calendar, "Days:", daysData.length);
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="mt-6 text-xl font-bold text-foreground">Calend??rio n??o encontrado</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {error ?? "Este calend??rio n??o existe neste dispositivo."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-24">
      <FloatingDecorations theme={toUiTheme(calendar.theme_id)} />

      <motion.header
        className="px-4 py-3 relative z-10 lg:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate("/meus-calendarios")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <span className="badge-festive bg-secondary text-secondary-foreground text-xs">
            {isOwner ? "CRIADOR" : "VISITANTE"}
          </span>

          <button
            onClick={() => navigate(`/calendario/${calendar.id}/configuracoes`)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{calendar.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {calendar.privacy === "public" ? "Público" : "Privado (apenas link)"} • {calendar.duration} portas
          </p>
        </div>
      </motion.header>

      {/* Desktop Header & Command Bar */}
      <div className="hidden lg:block relative z-10 px-8 py-8 max-w-[1700px] mx-auto">
        <div className="glass-premium rounded-[2.5rem] p-8 luxury-shadow flex items-center justify-between gap-12">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/meus-calendarios")}
              className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center shadow-sm hover:bg-muted transition-all group"
            >
              <ArrowLeft className="w-6 h-6 text-foreground group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-12 w-[1px] bg-border/50" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-widest">
                  {isOwner ? "Proprietário" : "Visualização"}
                </span>
                <span className="text-muted-foreground/40 text-xs font-bold">•</span>
                <span className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest leading-none">
                  {calendar.privacy === "public" ? "🌎 Público" : "🔒 Privado"}
                </span>
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none">{calendar.title}</h1>
            </div>
          </div>

          <div className="flex-1 flex justify-center gap-12 border-x border-border/30 px-12">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-foreground tracking-tighter">{(calendar.views || 0).toLocaleString()}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Visualizações</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-foreground tracking-tighter">{days.filter(d => d.hasSpecialContent).length}/{calendar.duration}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Dias Configur.</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-primary tracking-tighter">
                {Math.round((days.filter(d => d.hasSpecialContent).length / calendar.duration) * 100)}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Concluido</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={cn(
                "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all group",
                previewMode
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-background border-border/50 hover:bg-muted text-foreground"
              )}
              title={previewMode ? "Sair do Modo Visualização" : "Modo Visualização"}
            >
              {previewMode ? <Edit className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
            <motion.button
              className="px-8 py-4 rounded-[1.25rem] bg-gradient-festive text-white font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </motion.button>
            <button
              onClick={() => navigate(`/calendario/${calendar.id}/estatisticas`)}
              className="w-14 h-14 rounded-2xl bg-background border border-border/50 flex items-center justify-center hover:bg-muted transition-all group"
              title="Estatísticas Detalhadas"
            >
              <BarChart3 className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </button>
            <button
              onClick={() => navigate(`/calendario/${calendar.id}/configuracoes`)}
              className="w-14 h-14 rounded-2xl bg-background border border-border/50 flex items-center justify-center hover:bg-muted transition-all group"
              title="Configurações do Calendário"
            >
              <Settings className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <main className="relative z-10 px-8 max-w-[1700px] lg:mx-auto lg:pb-12">
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
              setSelectedDayPreview(day);
            } else {
              navigate(`/editar-dia/${calendar.id}/${day}`);
            }
          }}
          theme={toUiTheme(calendar.theme_id)}
        />
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

      {/* Bottom bar - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border lg:hidden">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <motion.button
            className="flex-1 btn-festive flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </motion.button>
          <motion.button
            className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/calendario/${calendar.id}/estatisticas`)}
          >
            <BarChart3 className="w-6 h-6 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CalendarioDetalhe;

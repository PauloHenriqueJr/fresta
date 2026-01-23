import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Heart, Eye, Loader2, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import DaySurpriseModal from "@/components/calendar/DaySurpriseModal";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import type { Tables } from "@/lib/supabase/types";
import { useAuth } from "@/state/auth/AuthProvider";
import { format, addDays, isAfter, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type Calendar = Tables<'calendars'>;
type CalendarDay = Tables<'calendar_days'>;

const VisualizarCalendario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [openedDays, setOpenedDays] = useState<number[]>([]);

  // Carregar status local ao iniciar
  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`fresta_opened_${id}`);
      if (saved) {
        try {
          setOpenedDays(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing opened days", e);
        }
      }
    }
  }, [id]);

  // Fetch calendar data
  useEffect(() => {
    const fetchCalendar = async () => {
      if (!id) {
        setError("Calendário não encontrado");
        setLoading(false);
        return;
      }

      try {
        const result = await CalendarsRepository.getPublic(id);

        if (!result) {
          setError("Este calendário não existe ou é privado.");
          setLoading(false);
          return;
        }

        setCalendar(result.calendar);
        setDays(result.days);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar:', err);
        setError("Erro ao carregar calendário");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [id]);

  // Increment views only if not owner
  useEffect(() => {
    if (calendar && user !== undefined) {
      const isOwner = calendar.owner_id === user?.id;
      if (!isOwner) {
        CalendarsRepository.incrementViews(calendar.id);
      }
    }
  }, [calendar, user]);

  const handleDayClick = async (dayNum: number) => {
    // Check if locked
    const baseDate = calendar?.start_date ? parseISO(calendar.start_date) : parseISO(calendar?.created_at || new Date().toISOString());
    const doorDate = startOfDay(addDays(baseDate, dayNum - 1));
    const isLocked = isAfter(doorDate, startOfDay(new Date()));

    if (isLocked) {
      return; // Prevenir abertura antecipada
    }

    const dayData = days.find((d) => d.day === dayNum);
    if (dayData) {
      setSelectedDay(dayNum);

      // Salvar localmente se ainda não estiver aberto
      if (!openedDays.includes(dayNum)) {
        const newOpened = [...openedDays, dayNum];
        setOpenedDays(newOpened);
        if (id) {
          localStorage.setItem(`fresta_opened_${id}`, JSON.stringify(newOpened));
        }
      }

      // Increment opened count global
      if (dayData.id) {
        // Não contar se o próprio dono estiver vendo
        const currentUserId = user?.id;
        const isOwner = calendar?.owner_id === currentUserId;

        if (!isOwner) {
          await CalendarsRepository.incrementDayOpened(dayData.id);
        }
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: calendar?.title ?? "Calendário Fresta",
        text: `Confira o calendário "${calendar?.title}"!`,
        url: window.location.href,
      });

      if (id) {
        await CalendarsRepository.incrementShares(id);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  const selectedDayData = days.find(d => d.day === selectedDay);
  const themeData = calendar ? getThemeDefinition(BASE_THEMES, calendar.theme_id as any) : null;

  // Transform days for CalendarGrid
  const gridDays = days.map(d => {
    const baseDate = calendar?.start_date ? parseISO(calendar.start_date) : parseISO(calendar?.created_at || new Date().toISOString());
    const doorDate = startOfDay(addDays(baseDate, d.day - 1));
    const isLocked = isAfter(doorDate, startOfDay(new Date()));
    const dateLabel = format(doorDate, "dd MMM", { locale: ptBR });

    return {
      day: d.day,
      dateLabel,
      status: isLocked
        ? ("locked" as const)
        : (openedDays.includes(d.day) ? ("opened" as const) : ("available" as const)),
      hasSpecialContent: !!d.content_type,
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  if (error || !calendar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            {error || "Calendário não encontrado"}
          </h1>
          <p className="text-muted-foreground mb-6">
            Este calendário pode ser privado ou não existir mais.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-festive"
          >
            Voltar ao início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden theme-${calendar.theme_id}`}>
      <FloatingDecorations theme={(themeData?.id || "natal") as any} />

      {/* Header */}
      <motion.header
        className="relative z-10 px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {calendar.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {themeData?.emoji} {themeData?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setLiked(!liked)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${liked ? "bg-festive-red" : "bg-card"
                } shadow-card`}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "text-white fill-white" : "text-muted-foreground"
                  }`}
              />
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>
        {/* Romantic Progress Bar - Inspired by user reference */}
        {(themeData?.id === "namoro" || themeData?.id === "casamento" || themeData?.id === "noivado" || themeData?.id === "bodas") && (
          <motion.div
            className="mt-6 p-6 bg-card/60 backdrop-blur-md rounded-3xl border border-primary/20 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                Amor: {Math.round((openedDays.length / (days.length || 1)) * 100)}% completo
              </span>
              <span className="text-xs font-bold text-foreground">
                Faltam {days.length - openedDays.length} surpresas! ❤️
              </span>
            </div>
            <div className="h-3 rounded-full bg-secondary/50 shadow-inner overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((openedDays.length / (days.length || 1)) * 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Calendar Grid */}
      <main className="relative z-10 px-4 pb-24">
        <CalendarGrid
          title={calendar.title}
          month={(() => {
            const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar?.created_at || new Date().toISOString());
            return format(baseDate, "MMMM", { locale: ptBR }).toUpperCase();
          })()}
          days={gridDays}
          onDayClick={handleDayClick}
          theme={(themeData?.id || "natal") as any}
        />
      </main>

      {/* Surprise Modal */}
      <DaySurpriseModal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        day={selectedDay || 1}
        content={selectedDayData?.content_type === "text" ? {
          type: "text",
          message: selectedDayData?.message || "Surpresa! 🎉",
        } : selectedDayData?.content_type === "photo" || selectedDayData?.content_type === "gif" ? {
          type: selectedDayData.content_type,
          url: selectedDayData?.url || "",
          message: selectedDayData?.message || "",
        } : selectedDayData?.content_type === "link" ? {
          type: "link",
          url: selectedDayData?.url || "",
          label: selectedDayData?.label || "Clique aqui",
          message: selectedDayData?.message || "",
        } : {
          type: "text",
          message: "Esta porta ainda está vazia... 📭",
        }}
        theme={calendar.theme_id}
      />

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-20">
        <motion.button
          className="w-full max-w-lg mx-auto btn-festive flex items-center justify-center gap-2"
          onClick={() => navigate("/criar")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Criar meu próprio calendário
        </motion.button>
      </div>
    </div>
  );
};

export default VisualizarCalendario;

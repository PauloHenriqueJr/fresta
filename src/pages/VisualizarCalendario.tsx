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

type Calendar = Tables<'calendars'>;
type CalendarDay = Tables<'calendar_days'>;

const VisualizarCalendario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleDayClick = async (dayNum: number) => {
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
        await CalendarsRepository.incrementDayOpened(dayData.id);
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
  const gridDays = days.map(d => ({
    day: d.day,
    status: openedDays.includes(d.day) ? "opened" as const : "available" as const,
    hasSpecialContent: !!d.content_type,
  }));

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
    <div className="min-h-screen bg-background relative overflow-hidden">
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

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {(calendar.views ?? 0).toLocaleString()} visualizações
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {(calendar.likes ?? 0) + (liked ? 1 : 0)} curtidas
          </span>
        </div>
      </motion.header>

      {/* Calendar Grid */}
      <main className="relative z-10 px-4 pb-24">
        <CalendarGrid
          title=""
          month=""
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
        } : selectedDayData?.content_type === "link" ? {
          type: "link",
          url: selectedDayData?.url || "",
          label: selectedDayData?.label || "Clique aqui",
        } : {
          type: "text",
          message: "Esta porta ainda está vazia... 📭",
        }}
      />

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
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

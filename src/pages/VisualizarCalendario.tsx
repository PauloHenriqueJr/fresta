import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Heart, Eye, Loader2, AlertCircle, Sparkles, Lock, Unlock, ArrowRight, Clock, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import DaySurpriseModal from "@/components/calendar/DaySurpriseModal";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import { getThemeConfig } from "@/lib/themes/registry";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/types";
import { useAuth } from "@/state/auth/AuthProvider";
import { format, addDays, isAfter, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import {
  LoveBackground,
  HangingHearts,
  LoveHeader,
  LoveProgressBar,
  EnvelopeCard,
  UnlockedDayCard as LoveUnlockedCard,
  LockedDayCard as LoveLockedCard,
  LoveQuote,
  LoveFooter,
  LoveLetterModal,
  LoveLockedModal,
  WeddingBackground,
  WeddingHeader,
  WeddingProgress,
  WeddingDayCard,
  WeddingSpecialCard,
  WeddingDiarySection,
  WeddingFooter,
  WeddingShower,
  WeddingTopDecorations
} from "@/lib/themes/themeComponents";
import { scheduleDoorReminder, subscribeToPush, promptInstall } from "@/lib/push/notifications";

type Calendar = Tables<'calendars'> & {
  primary_color?: string;
  secondary_color?: string;
  background_url?: string;
};
type CalendarDay = Tables<'calendar_days'>;

const THEME_BG_COLORS: Record<string, string> = {
  natal: 'bg-[#FFF8E8]',
  namoro: 'bg-[#FFE5EC]',
  casamento: 'bg-[#FFF8E8]',
  carnaval: 'bg-[#E8E4F5]',
  saojoao: 'bg-[#FFF8E8]',
  pascoa: 'bg-[#D4F4F0]',
  independencia: 'bg-[#E8F5E0]',
  reveillon: 'bg-[#E8E4F5]',
  aniversario: 'bg-[#FFF0E5]',
};

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
  const [lockedDay, setLockedDay] = useState<number | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [openedDays, setOpenedDays] = useState<number[]>([]);
  const [lockedModalData, setLockedModalData] = useState<{ isOpen: boolean, day: number, date: Date } | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (newLiked) {
      toast.success("Amor enviado! ❤️", {
        description: "Que lindo gesto! O criador do calendário vai adorar.",
        duration: 3000,
      });
      // Optionally sync with Supabase here
      if (calendar?.id) {
        // We'll use a standard update for now as RPC might not be defined for likes
        (supabase.from('calendars') as any)
          .update({ likes: (calendar.likes || 0) + 1 })
          .eq('id', calendar.id)
          .then();
      }
    }
  };

  // Countdown timer for locked modal
  useEffect(() => {
    if (lockedDay === null) return;

    const interval = setInterval(() => {
      const baseDate = calendar?.start_date ? parseISO(calendar.start_date) : parseISO(calendar?.created_at || new Date().toISOString());
      const doorDate = startOfDay(addDays(baseDate, lockedDay - 1));
      const now = new Date();
      const diff = doorDate.getTime() - now.getTime();

      if (diff <= 0) {
        setLockedDay(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedDay, calendar]);

  const handleNotifyMe = async () => {
    // Determine target day and date from either legacy lockedDay or new lockedModalData
    let targetDay: number | null = lockedDay;
    let targetDate: Date | null = null;

    if (lockedModalData) {
      targetDay = lockedModalData.day;
      targetDate = lockedModalData.date;
    } else if (lockedDay !== null && calendar) {
      const baseDate = calendar?.start_date ? parseISO(calendar.start_date) : parseISO(calendar?.created_at || new Date().toISOString());
      targetDate = startOfDay(addDays(baseDate, lockedDay - 1));
    }

    if (!calendar || targetDay === null || !targetDate) return;

    // Import push utilities dynamically to avoid SSR issues
    const {
      isPWAInstalled,
      promptInstall,
      canInstallPWA,
      requestNotificationPermission,
      subscribeToPush,
      scheduleDoorReminder
    } = await import('@/lib/push/notifications');

    // Step 1: Check if PWA is installed
    const isInstalled = isPWAInstalled();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (!isInstalled) {
      if (canInstallPWA()) {
        // Android/Desktop: Prompt user to install PWA
        toast("📲 Instale o app para receber notificações!", {
          description: "A experiência fica muito melhor com o aplicativo instalado.",
          action: {
            label: "Instalar Agora",
            onClick: async () => {
              const installed = await promptInstall();
              if (installed) {
                // O ouvinte 'appinstalled' no useEffect cuidará de pedir a permissão
              }
            }
          },
          duration: 10000
        });
        return; // Não pede permissão no navegador comum para não ser invasivo
      } else if (isIOS) {
        // iOS: Show instructions
        toast("📲 Ative as notificações!", {
          description: "Para ser avisado das portas, instale o app: toque em Compartilhar e 'Adicionar à Tela de Início'.",
          duration: 10000
        });
        return;
      }
    }

    // Step 2: Request notification permission (Executado apenas se já instalado ou em Desktop)
    const permission = await requestNotificationPermission();

    if (permission !== 'granted') {
      toast.error("Permissão de notificação negada", {
        description: "Ative as notificações nas configurações do navegador."
      });
      setLockedDay(null);
      setLockedModalData(null);
      return;
    }

    // Step 3: Subscribe to push notifications
    const subscription = await subscribeToPush();

    if (!subscription) {
      toast.error("Erro ao configurar notificações", {
        description: "Tente novamente mais tarde."
      });
      setLockedDay(null);
      setLockedModalData(null);
      return;
    }

    // Step 4: Schedule the door reminder
    const doorDate = new Date(targetDate);
    doorDate.setHours(9, 0, 0, 0); // Notificar às 09:00 para melhor engajamento

    const success = await scheduleDoorReminder(calendar.id, targetDay, doorDate);

    if (success) {
      toast.success("🎉 Lembrete configurado!", {
        description: `Você será notificado quando a Porta ${targetDay} abrir.`
      });
    } else {
      toast("Lembrete salvo localmente!", {
        description: "Você receberá a notificação quando abrir o app."
      });
    }

    setLockedDay(null);
    setLockedModalData(null);
  };


  // Listen for successful installation
  useEffect(() => {
    const handleAppInstalled = () => {
      toast.success("App instalado com sucesso! 🎉", {
        description: "Agora ative as notificações para não perder nada.",
        action: {
          label: "Ativar Notificações",
          onClick: () => handleNotifyMe()
        },
        duration: 10000
      });
      // Clear the prompt
      (window as any).deferredPrompt = null;
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, [id, lockedDay]); // Re-bind if these change, though empty deps would be fine too

  // Save as last visited calendar for PWA entry
  useEffect(() => {
    if (id) {
      localStorage.setItem('fresta_last_visited_calendar', `/c/${id}`);
    }
  }, [id]);

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

  const isFutureCalendar = calendar?.start_date && isAfter(parseISO(calendar.start_date), startOfDay(new Date()));
  const daysUntilStart = calendar?.start_date ? Math.ceil((parseISO(calendar.start_date).getTime() - startOfDay(new Date()).getTime()) / (1000 * 60 * 60 * 24)) : 0;

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

        // If no password or current user is owner, authorize immediately
        if (!result.calendar.password || (user && result.calendar.owner_id === user.id)) {
          setIsAuthorized(true);
        }

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
      setLockedDay(dayNum);
      return;
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

        console.log('DEBUG handleDayClick:', {
          dayId: dayData.id,
          currentUserId,
          ownerId: calendar?.owner_id,
          isOwner,
          willIncrement: !isOwner
        });

        if (!isOwner) {
          try {
            await CalendarsRepository.incrementDayOpened(dayData.id);
            console.log('DEBUG: incrementDayOpened called successfully');
          } catch (err) {
            console.error('DEBUG: incrementDayOpened failed:', err);
          }
        }
      }
    }
  };

  const handleLockedClick = (dayNum: number, openDate: Date) => {
    setLockedModalData({
      isOpen: true,
      day: dayNum,
      date: openDate
    });
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
  const premiumTheme = getThemeConfig(calendar?.theme_id);

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
        : (openedDays.includes(d.day) || (d.opened_count || 0) > 0 ? ("opened" as const) : ("available" as const)),
      hasSpecialContent: !!(d.content_type || d.message || d.url || d.label),
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

  // Password Gate
  if (!isAuthorized && calendar.password) {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden theme-${calendar.theme_id}`}>
        <FloatingDecorations theme={(themeData?.id || "natal") as any} />

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-card/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-border/10 shadow-elevated text-center">
            <motion.div
              className={cn(
                "w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg transition-colors",
                passwordError ? "bg-red-500 text-white" : "bg-solidroad-accent text-solidroad-text"
              )}
              animate={passwordError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Lock className="w-10 h-10" />
            </motion.div>

            <h2 className="text-3xl font-black text-foreground mb-3">{calendar.title}</h2>
            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              Esta experiência está protegida. Digite a senha para abrir as portas.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordInput === calendar.password) {
                  setIsAuthorized(true);
                  setPasswordError(false);
                } else {
                  setPasswordError(true);
                  setTimeout(() => setPasswordError(false), 2000);
                }
              }}
              className="space-y-4"
            >
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha..."
                className={cn(
                  "w-full px-6 py-5 rounded-2xl bg-background/50 border-2 font-bold text-lg text-center focus:outline-none transition-all",
                  passwordError ? "border-red-500 ring-4 ring-red-500/10" : "border-border/10 focus:border-solidroad-accent focus:ring-4 focus:ring-solidroad-accent/10"
                )}
                autoFocus
              />
              <button
                type="submit"
                className="w-full btn-festive py-5 rounded-2xl flex items-center justify-center gap-2"
              >
                ACESSAR AGORA
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-[10px] text-muted-foreground/40 mt-8 font-black uppercase tracking-widest leading-relaxed">
              A senha foi enviada para você por quem criou este calendário.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const bgColor = THEME_BG_COLORS[calendar.theme_id] || 'bg-background';

  // --- RENDERIZADORES ESPECIALIZADOS ---

  const renderNamoroView = () => (
    <>
      <LoveBackground />
      <HangingHearts />
      <div className="relative w-full bg-white/80 dark:bg-surface-dark/90 pb-6 rounded-b-[2.5rem] shadow-festive z-10 pt-10 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-200 transition-transform active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/40 shadow-sm pointer-events-none">
            <span className="text-[10px] xs:text-xs font-bold text-rose-600 dark:text-rose-300 tracking-wide uppercase">Amor e Romance</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95",
                liked
                  ? "bg-love-red text-white"
                  : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-200"
              )}
            >
              <Heart className={cn("w-5 h-5", liked && "fill-white")} />
            </button>
            <button onClick={handleShare} className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-200">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <LoveHeader title={calendar.title} subtitle="Uma jornada de amor para nós dois" isEditor={false} />
        <LoveProgressBar progress={Math.round((openedDays.length / (days.length || 1)) * 100)} isEditor={false} />
      </div>

      <main className="flex-1 px-4 py-8 pb-36 relative z-0">
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {days.map((d) => {
            const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar.created_at || new Date().toISOString());
            const doorDate = startOfDay(addDays(baseDate, d.day - 1));
            const isLocked = isAfter(doorDate, startOfDay(new Date()));

            if (isLocked) {
              const diff = doorDate.getTime() - new Date().getTime();
              const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
              return (
                <LoveLockedCard
                  key={d.day}
                  dayNumber={d.day}
                  timeText={`${daysLeft}d`}
                  onClick={() => handleLockedClick(d.day, doorDate)}
                />
              );
            }

            if (openedDays.includes(d.day) || (d.opened_count || 0) > 0) {
              return (
                <LoveUnlockedCard
                  key={d.day}
                  dayNumber={d.day}
                  imageUrl={d.url || ""}
                  onClick={() => handleDayClick(d.day)}
                />
              );
            }

            return (
              <EnvelopeCard
                key={d.day}
                dayNumber={d.day}
                onClick={() => handleDayClick(d.day)}
              />
            );
          })}
        </div>
        <LoveQuote isEditor={false} />
      </main>
      <LoveFooter isEditor={false} onNavigate={() => navigate('/criar')} />
    </>
  );

  const renderWeddingView = () => (
    <>
      <WeddingBackground />
      <WeddingShower />
      <WeddingTopDecorations />
      <div className="relative z-10">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 text-wedding-gold hover:bg-white transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-[10px] font-bold text-wedding-gold tracking-[0.2em] uppercase">Nossa União</h2>
          <button onClick={handleShare} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 text-wedding-gold hover:bg-white transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <WeddingHeader title={calendar.title} subtitle="A contagem regressiva para o altar" isEditor={false} />
        <WeddingProgress progress={Math.round((openedDays.length / (days.length || 1)) * 100)} />
      </div>

      <main className="flex-1 px-4 py-4 pb-36 relative z-0">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-sm font-bold text-wedding-gold uppercase tracking-[0.2em] flex items-center gap-2">
            Calendário
          </h2>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {days.map((d) => {
            const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar.created_at || new Date().toISOString());
            const doorDate = startOfDay(addDays(baseDate, d.day - 1));
            const isLocked = isAfter(doorDate, startOfDay(new Date()));

            return (
              <WeddingDayCard
                key={d.day}
                dayNumber={d.day}
                imageUrl={d.url || undefined}
                status={openedDays.includes(d.day) ? 'unlocked' : (isLocked ? 'locked' : 'unlocked')}
                onClick={() => isLocked ? handleLockedClick(d.day, doorDate) : handleDayClick(d.day)}
              />
            );
          })}
        </div>
        <WeddingDiarySection isEditor={false} />
      </main>
      <WeddingFooter isEditor={false} />
    </>
  );

  const renderDefaultView = () => (
    <>
      <FloatingDecorations theme={(themeData?.id || "natal") as any} />

      {/* Header */}
      <motion.header
        className="relative z-10 px-4 py-4 mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          {calendar.theme_id === 'saojoao' && (
            <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              Vila de São João
            </span>
          )}
          {calendar.theme_id === 'casamento' && (
            <span className="px-3 py-1 bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              Rumo ao Altar
            </span>
          )}
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex items-center gap-2">
            {!(themeData?.id === "namoro" || themeData?.id === "casamento" || themeData?.id === "noivado" || themeData?.id === "bodas") && (
              <motion.button
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${liked ? "bg-red-500" : "bg-white/80 backdrop-blur-sm"
                  } shadow-sm border border-black/5`}
                whileTap={{ scale: 0.9 }}
                style={liked && calendar.primary_color ? { backgroundColor: calendar.primary_color } : undefined}
              >
                <Heart
                  className={`w-5 h-5 ${liked ? "text-white fill-white" : "text-muted-foreground"
                    }`}
                />
              </motion.button>
            )}
            <motion.button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-black/5"
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>

        <div>
          <h1
            className={cn(
              "text-3xl font-black mb-1 leading-tight",
              calendar.theme_id === 'saojoao' ? "text-[#5D2E0B]" : "text-foreground"
            )}
            style={calendar.primary_color ? { color: calendar.primary_color } : undefined}
          >
            {calendar.title}
          </h1>
          <p className={cn(
            "text-sm font-medium",
            calendar.theme_id === 'saojoao' ? "text-[#8B4513]/70" : "text-muted-foreground"
          )}>
            {themeData?.emoji} {themeData?.name}
          </p>
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
                style={calendar.primary_color ? { backgroundColor: calendar.primary_color } : undefined}
              />
            </div>
          </motion.div>
        )}

        {/* Future Calendar Banner */}
        {isFutureCalendar && (
          <motion.div
            className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-3xl border border-orange-200/50 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <Clock className="w-6 h-6 animate-pulse-soft" />
              </div>
              <div>
                <h3 className="text-lg font-black text-orange-900 dark:text-orange-200 leading-tight">
                  Estreia em {daysUntilStart} {daysUntilStart === 1 ? 'dia' : 'dias'}
                </h3>
                <p className="text-sm text-orange-800/60 dark:text-orange-200/50 font-medium">
                  Este calendário começa oficialmente em {format(parseISO(calendar.start_date!), "d 'de' MMMM", { locale: ptBR })}.
                </p>
              </div>
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
          days={gridDays.map(d => ({
            ...d,
            onClick: () => {
              if (d.status === 'locked') {
                const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar?.created_at || new Date().toISOString());
                handleLockedClick(d.day, startOfDay(addDays(baseDate, d.day - 1)));
              } else {
                handleDayClick(d.day);
              }
            }
          }))}
          onDayClick={handleDayClick}
          theme={(themeData?.id || "natal") as any}
        />
      </main>

      {/* Time Capsule - User Reference */}
      <motion.section
        className="relative z-10 px-4 mt-8 mb-24 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-card/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-elevated">
          {/* Decorative icons in bg */}
          <div className="absolute top-4 right-4 text-primary/10 -rotate-12 transition-transform group-hover:rotate-0">
            {["namoro", "casamento", "noivado", "bodas"].includes(calendar.theme_id) ? <Heart className="w-16 h-16 fill-current" /> : <Sparkles className="w-16 h-16" />}
          </div>
          <div className="absolute bottom-4 left-4 text-accent/10 rotate-12 transition-transform group-hover:rotate-0">
            <Sparkles className="w-12 h-12" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>

            {(() => {
              const capsuleContent: Record<string, { title: string, message: string }> = {
                saojoao: {
                  title: "MEMÓRIAS DO ARRAIÁ",
                  message: "Que a alegria dessa festa aqueça seu coração o ano todo! Guarde cada momento. 🔥🌽"
                },
                carnaval: {
                  title: "FOLIA ETERNA",
                  message: "A vida é um carnaval! Celebre cada dia com a mesma energia dessa festa. 🎉🎭"
                },
                natal: {
                  title: "ESPÍRITO NATALINO",
                  message: "O melhor presente é estar presente. Que estas memórias iluminem seu caminho. 🎄✨"
                },
                namoro: {
                  title: "NOSSA CÁPSULA",
                  message: "\"O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção.\""
                },
                casamento: {
                  title: "NOSSA JORNADA",
                  message: "Cada dia ao seu lado é um presente que quero abrir para sempre. 💍💖"
                },
                bodas: {
                  title: "CELEBRAÇÃO DO AMOR",
                  message: "Uma história construída dia após dia, com muito amor e cumplicidade."
                },
                default: {
                  title: "CÁPSULA DO TEMPO",
                  message: "Colecione momentos, não coisas. Este calendário é um pedacinho da sua história."
                }
              };

              const content = capsuleContent[calendar.theme_id] || capsuleContent['default'];

              return (
                <>
                  <h3 className="text-2xl font-black text-foreground mb-2 uppercase">{content.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{content.message}"
                  </p>
                </>
              );
            })()}

          </div>
        </div>
      </motion.section>

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
    </>
  );

  return (
    <div className={cn("min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500", bgColor, `theme-${calendar.theme_id}`)}
      style={calendar.background_url ? {
        backgroundImage: `url(${calendar.background_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      {calendar.theme_id === 'namoro' ? renderNamoroView() :
        calendar.theme_id === 'casamento' ? renderWeddingView() :
          renderDefaultView()
      }

      {/* Love Letter Modal (Universal for romantic themes) */}
      {(calendar.theme_id === 'namoro' || calendar.theme_id === 'casamento' || calendar.theme_id === 'noivado' || calendar.theme_id === 'bodas') && (
        <LoveLetterModal
          isOpen={selectedDay !== null}
          onClose={() => setSelectedDay(null)}
          content={selectedDayData ? (() => {
            const url = selectedDayData.url || "";
            const isVideo = url.includes('tiktok.com') || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com');
            const type = isVideo ? 'video' : (selectedDayData.content_type === 'photo' || selectedDayData.content_type === 'gif') ? 'image' : 'text';

            return {
              type,
              title: selectedDayData.label || `Porta ${selectedDay}`,
              message: selectedDayData?.message || "",
              mediaUrl: selectedDayData?.url || undefined,
            };
          })() : { type: 'text', message: "Surpresa! 🎉", title: `Porta ${selectedDay}` }}
        />
      )}

      {/* Surprise Modal (Global fallback for non-romantic themes) */}
      {!(calendar.theme_id === 'namoro' || calendar.theme_id === 'casamento' || calendar.theme_id === 'noivado' || calendar.theme_id === 'bodas') && (
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
      )}

      {/* Love Locked Modal (Global - Fixed Interaction) */}
      <LoveLockedModal
        isOpen={!!lockedModalData?.isOpen}
        onClose={() => setLockedModalData(null)}
        dayNumber={lockedModalData?.day || 0}
        unlockDate={lockedModalData?.date || new Date()}
        onNotify={handleNotifyMe}
        theme={calendar.theme_id}
      />
    </div>
  );
};

export default VisualizarCalendario;

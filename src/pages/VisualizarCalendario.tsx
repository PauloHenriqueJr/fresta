import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/common/Loader";
import { Share2, Heart, Eye, Loader2, AlertCircle, Sparkles, Lock, Unlock, ArrowRight, Clock, ArrowLeft, Palette, DoorOpen } from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import DaySurpriseModal from "@/components/calendar/DaySurpriseModal";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import { getThemeConfig } from "@/lib/themes/registry";
import { BrandWatermark } from "@/components/calendar/BrandWatermark";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import type { Tables } from "@/lib/supabase/types";
import { useAuth } from "@/state/auth/AuthProvider";
import { format, addDays, isAfter, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import {
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
import { UniversalTemplate } from "@/components/themes/UniversalTemplate";
import { scheduleDoorReminder, subscribeToPush, promptInstall } from "@/lib/push/notifications";
import { shareContent } from "@/lib/utils/share-utils";

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
  const { toast } = useToast();
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

  const isOwner = calendar?.owner_id === user?.id;
  const [searchParams] = useSearchParams();
  // Template Preview ONLY when coming from Explore page (via ?template=true) AND not the owner
  const isFromExplore = searchParams.get('template') === 'true';
  const isTemplatePreview = isFromExplore && !isOwner;

  const { isPremium } = useSubscription();

  // Check if the CALENDAR OWNER is premium (data comes from getPublic)
  const ownerSubscriptions = (calendar as any)?.profiles?.subscriptions || [];
  const isOwnerPlus = calendar?.is_premium || ownerSubscriptions.some(
    (s: any) => s.status === 'active' || s.status === 'trialing'
  );

  const getRedactedContent = (day: CalendarDay) => {
    if (!calendar) return { type: 'text', message: "", title: "" };

    // SECURITY: Show real content if user is the Owner OR if they are authorized and NOT in template preview mode.
    // This ensures intended recipients (like partners) see the messages while strangers in Explore mode see generic data.
    const shouldShowRealContent = isOwner || (isAuthorized && !isTemplatePreview);

    if (shouldShowRealContent) {
      const url = day.url || "";
      const isVideo = url.includes('tiktok.com') || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com');
      const isMusic = url.includes('spotify.com') || (day.content_type as string) === 'music';

      let type: "text" | "photo" | "gif" | "link" | "image" | "video" | "music" = 'text';
      if (isMusic) type = 'music';
      else if (isVideo) type = 'video';
      else if (day.content_type === 'photo' || day.content_type === 'gif') type = 'image';
      else if (day.content_type === 'link') type = 'link';

      return {
        type,
        title: day.label || `Porta ${day.day}`,
        message: day.message || "",
        url: day.url || undefined,
        mediaUrl: day.url || undefined,
      };
    }

    // Template Mode (Explore page visitors) - Generic content, NO personal messages
    return {
      type: 'text',
      title: `Porta ${day.day}`,
      message: "", // SECURITY: No personal content for strangers browsing templates
      mediaUrl: undefined,
    };
  };

  const handleCloneTheme = () => {
    if (!calendar) return;
    const params = new URLSearchParams({
      theme: calendar.theme_id,
      title: `Copiado de ${calendar.title}`,
      from_template: calendar.id
    });
    navigate(`/criar?${params.toString()}`);
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (newLiked) {
      toast({
        title: "Amor enviado! ❤️",
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

    // Step 1: Check device type
    const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInstalled = isPWAInstalled();

    // MOBILE: Always prioritize PWA installation for background notifications
    if (!isDesktop && !isInstalled) {
      if (canInstallPWA()) {
        // Android: Prompt user to install PWA
        toast({
          title: "📲 Instale o app para receber notificações!",
          description: "A experiência fica muito melhor com o aplicativo instalado.",
          action: (
            <button
              onClick={async () => {
                const installed = await promptInstall();
                if (installed) {
                  // Handled by useEffect
                }
              }}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Instalar Agora
            </button>
          ),
        });
        return;
      } else if (isIOS) {
        // iOS: Show instructions
        toast({
          title: "📲 Ative as notificações!",
          description: "Para ser avisado das portas, instale o app: toque em Compartilhar e 'Adicionar à Tela de Início'.",
        });
        return;
      }
    }

    // Step 2: Request notification permission
    let permission = 'default' as NotificationPermission;
    if ('Notification' in window) {
      permission = Notification.permission;
    }

    // Se estiver no Desktop e for padrão, tenta pedir logo sem mensagens intermediárias
    if (permission === 'default') {
      permission = await requestNotificationPermission();
    }

    if (permission !== 'granted') {
      const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

      // Só mostra o toast de erro SE o usuário negou explicitamente ou se o sistema bloqueou
      if (permission === 'denied') {
        if (isDesktop) {
          toast({
            variant: "destructive",
            title: "Notificações desativadas",
            description: "Clique no ícone de 🔒 (cadeado) na barra de endereço e altere 'Notificações' para 'Permitir'.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Permissão de notificação negada",
            description: "Ative as notificações nas configurações do seu navegador."
          });
        }
      }

      setLockedDay(null);
      setLockedModalData(null);
      return;
    }

    // Step 3: Subscribe to push notifications
    const subscription = await subscribeToPush();

    if (!subscription) {
      toast({
        variant: "destructive",
        title: "Erro ao configurar notificações",
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
      toast({
        title: "🎉 Lembrete configurado!",
        description: `Você será notificado quando a Porta ${targetDay} abrir.`
      });
    } else {
      toast({
        title: "Lembrete salvo localmente!",
        description: "Você receberá a notificação quando abrir o app."
      });
    }

    setLockedDay(null);
    setLockedModalData(null);
  };


  // Listen for successful installation
  useEffect(() => {
    const handleAppInstalled = () => {
      toast({
        title: "App instalado com sucesso! 🎉",
        description: "Agora ative as notificações para não perder nada.",
        action: (
          <button
            onClick={() => handleNotifyMe()}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Ativar Notificações
          </button>
        ),
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
          setError("Este calendário não foi encontrado ou não está disponível.");
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
    const result = await shareContent({
      title: calendar?.title ?? "Calendário Fresta",
      text: `Confira o calendário "${calendar?.title}"!`,
      url: window.location.href,
      imageUrl: calendar?.background_url || undefined
    });

    if (result === true && id) {
      await CalendarsRepository.incrementShares(id);
    } else if (result === "copied") {
      toast({
        title: "Link copiado! ✨",
        description: "Agora você pode colar e enviar para quem quiser.",
      });
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
    return <Loader text="Abrindo seu calendário..." />;
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
            onClick={() => navigate(user ? "/meus-calendarios" : "/explorar")}
            className="btn-festive"
          >
            Voltar ao Início
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


  // --- RENDERIZADORES ESPECIALIZADOS ---

  const renderWeddingView = () => (
    <>
      <WeddingBackground />
      <WeddingShower />
      <WeddingTopDecorations />
      <div className="relative z-10">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
          <button
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate(isOwner ? '/meus-calendarios' : '/explorar');
              }
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 text-wedding-gold hover:bg-white transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-[10px] font-bold text-wedding-gold tracking-[0.2em] uppercase">Nossa União</h2>
          <button onClick={handleShare} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 text-wedding-gold hover:bg-white transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <WeddingHeader
          title={calendar.title}
          subtitle="A contagem regressiva para o altar"
          isEditor={false}
          showWatermark={!isOwnerPlus}
        />
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
            const isOpened = openedDays.includes(d.day) || (d.opened_count || 0) > 0;

            return (
              <WeddingDayCard
                key={d.day}
                dayNumber={d.day}
                imageUrl={d.url || undefined}
                status={isOpened ? 'unlocked' : (isLocked ? 'locked' : 'unlocked')}
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.history.state && window.history.state.idx > 0) {
                  navigate(-1);
                } else {
                  navigate(isOwner ? '/meus-calendarios' : '/explorar');
                }
              }}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-black/5 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
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
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setLiked(!liked)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-black/5 transition-all",
                liked ? "bg-red-500 text-white fill-white" : "bg-white/80 backdrop-blur-sm text-muted-foreground"
              )}
              whileTap={{ scale: 0.9 }}
              style={liked && calendar.primary_color ? { backgroundColor: calendar.primary_color } : undefined}
            >
              <Heart className={cn("w-5 h-5", liked && "fill-current")} />
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-black/5"
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 w-full mb-1">
          {!isOwnerPlus && <BrandWatermark variant="compact" className="hidden sm:flex" />}
          <h1
            className={cn(
              "text-3xl font-black leading-tight text-center",
              calendar.theme_id === 'saojoao' ? "text-[#5D2E0B]" : "text-foreground"
            )}
            style={calendar.primary_color ? { color: calendar.primary_color } : undefined}
          >
            {calendar.title}
          </h1>
          {!isOwnerPlus && <BrandWatermark variant="compact" className="hidden sm:flex" />}
        </div>

        {/* Mobile Watermarks */}
        {!isOwnerPlus && (
          <div className="flex sm:hidden items-center justify-center gap-2 mb-4">
            <BrandWatermark variant="compact" />
            <BrandWatermark variant="compact" />
          </div>
        )}
        <p className={cn(
          "text-sm font-medium",
          calendar.theme_id === 'saojoao' ? "text-[#8B4513]/70" : "text-muted-foreground"
        )}>
          {themeData?.emoji} {themeData?.name}
        </p>
      </motion.header>

      {/* Romantic Progress Bar */}
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
                saojoao: { title: "MEMÓRIAS DO ARRAIÁ", message: "Que a alegria dessa festa aqueça seu coração o ano todo! Guarde cada momento. 🔥🌽" },
                carnaval: { title: "FOLIA ETERNA", message: "A vida é um carnaval! Celebre cada dia com a mesma energia dessa festa. 🎉🎭" },
                natal: { title: "ESPÍRITO NATALINO", message: "O melhor presente é estar presente. Que estas memórias iluminem seu caminho. 🎄✨" },
                namoro: { title: "NOSSA CÁPSULA", message: "\"O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção.\"" },
                casamento: { title: "NOSSA JORNADA", message: "Cada dia ao seu lado é um presente que quero abrir para sempre. 💍💖" },
                bodas: { title: "CELEBRAÇÃO DO AMOR", message: "Uma história construída dia após dia, com muito amor e cumplicidade." },
                default: { title: "CÁPSULA DO TEMPO", message: "Colecione momentos, não coisas. Este calendário é um pedacinho da sua história." }
              };
              const content = capsuleContent[calendar.theme_id] || capsuleContent['default'];
              return (
                <>
                  <h3 className="text-2xl font-black text-foreground mb-2 uppercase">{content.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{content.message}"</p>
                </>
              );
            })()}
          </div>
        </div>
      </motion.section>

      {/* Bottom CTA - Only for visitors */}
      {!isOwner && (
        <div className="relative w-full px-4 py-24 flex flex-col items-center justify-center mt-12 gap-4">
          {isTemplatePreview && (
            <motion.button
              className="w-full max-w-lg mx-auto bg-solidroad-accent text-solidroad-text font-black py-5 rounded-2xl shadow-glow overflow-hidden relative group"
              onClick={handleCloneTheme}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                USAR ESTE TEMA AGORA
              </span>
            </motion.button>
          )}

          <motion.button
            className={cn(
              "w-full max-w-lg mx-auto flex items-center justify-center gap-2 px-8 py-5 rounded-2xl font-bold transition-all",
              isTemplatePreview ? "bg-white/10 border border-border/10 text-foreground" : "btn-festive"
            )}
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            {isTemplatePreview ? "Compartilhar este Modelo" : "Compartilhar"}
          </motion.button>
        </div>
      )}
    </>
  );

  const premiumConfig = getThemeConfig(calendar.theme_id);

  if (premiumConfig.ui && (calendar.theme_id === 'namoro' || calendar.theme_id === 'casamento' || calendar.theme_id === 'noivado' || calendar.theme_id === 'bodas' || calendar.theme_id === 'carnaval' || calendar.theme_id === 'saojoao')) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <UniversalTemplate
          config={premiumConfig}
          calendar={calendar}
          days={days as any}
          openedDays={openedDays}
          isEditor={false}
          isEditorContext={isOwner}
          onNavigateBack={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate(isOwner ? '/meus-calendarios' : '/explorar');
            }
          }}
          onShare={handleShare}
          onLike={() => setLiked(!liked)}
          liked={liked}
          onDayClick={handleDayClick}
          onLockedClick={handleLockedClick}
          onSettings={() => navigate(`/calendario/${calendar.id}/configuracoes`)}
          onUpdateCalendar={async (data) => {
            if (!calendar?.id) return;
            try {
              const updated = await CalendarsRepository.update(calendar.id, data);
              setCalendar(updated);
              toast({ title: "Salvo com sucesso! ✨", description: "As alterações já estão ao vivo." });
            } catch (err) {
              toast({ variant: "destructive", title: "Erro ao salvar", description: "Tente novamente." });
              throw err;
            }
          }}
          onStats={() => navigate(`/calendario/${calendar.id}/estatisticas`)}
          showWatermark={!isOwnerPlus}
        />

        {/* Surprise Modals (Romantic themes - NOT Carnaval/SaoJoao) */}
        {!['carnaval', 'saojoao'].includes(calendar.theme_id) && (
          <LoveLetterModal
            isOpen={selectedDay !== null}
            onClose={() => setSelectedDay(null)}
            config={premiumConfig}
            content={selectedDayData ? (getRedactedContent(selectedDayData) as any) : { type: 'text', message: "", title: `Porta ${selectedDay}` }}
          />
        )}

        {/* Festive Modals for Carnaval/SaoJoao */}
        {['carnaval', 'saojoao'].includes(calendar.theme_id) && (
          <DaySurpriseModal
            isOpen={selectedDay !== null}
            onClose={() => setSelectedDay(null)}
            day={selectedDay || 1}
            content={selectedDayData ? (getRedactedContent(selectedDayData) as any) : { type: 'text', message: "Surpresa! 🎉", title: `Porta ${selectedDay}` }}
            theme={calendar.theme_id}
            isTemplate={isTemplatePreview}
          />
        )}

        <LoveLockedModal
          isOpen={!!lockedModalData?.isOpen}
          onClose={() => setLockedModalData(null)}
          dayNumber={lockedModalData?.day || 0}
          unlockDate={lockedModalData?.date || new Date()}
          onNotify={handleNotifyMe}
          theme={calendar.theme_id}
        />

        {!isOwnerPlus && (
          <div className="py-12 flex justify-center relative z-10">
            <BrandWatermark />
          </div>
        )}

        {/* Template Preview Banner */}
        {isTemplatePreview && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 p-4"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
          >
            <div className="max-w-xl mx-auto bg-card/80 backdrop-blur-xl border border-solidroad-accent/20 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-solidroad-accent/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-solidroad-accent" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground uppercase tracking-wider leading-none">Modo Visualização</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Dados pessoais protegidos. Use este modelo para você!</p>
                </div>
              </div>
              <button
                onClick={handleCloneTheme}
                className="px-4 py-2 bg-solidroad-accent text-solidroad-text rounded-xl font-bold text-[10px] hover:scale-105 transition-all shadow-sm whitespace-nowrap"
              >
                USAR MODELO
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500", bgColor, `theme-${calendar.theme_id}`)}
      style={calendar.background_url ? {
        backgroundImage: `url(${calendar.background_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      {calendar.theme_id === 'casamento' ? renderWeddingView() : renderDefaultView()}

      {/* Love Letter Modal (Romantic - Not Carnaval/SaoJoao) */}
      {['namoro', 'casamento', 'noivado', 'bodas'].includes(calendar.theme_id) &&
        !['carnaval', 'saojoao'].includes(calendar.theme_id) &&
        !isTemplatePreview && (
          <LoveLetterModal
            isOpen={selectedDay !== null}
            onClose={() => setSelectedDay(null)}
            content={selectedDayData ? (getRedactedContent(selectedDayData) as any) : { type: 'text', message: "Surpresa! 🎉", title: `Porta ${selectedDay}` }}
          />
        )}

      {/* Surprise Modal (Global fallback) */}
      {(isTemplatePreview || !(calendar.theme_id === 'namoro' || calendar.theme_id === 'casamento' || calendar.theme_id === 'noivado' || calendar.theme_id === 'bodas')) && (
        <DaySurpriseModal
          isOpen={selectedDay !== null}
          onClose={() => setSelectedDay(null)}
          day={selectedDay || 1}
          content={selectedDayData ? (getRedactedContent(selectedDayData) as any) : { type: 'text', message: "Surpresa! 🎉", title: `Porta ${selectedDay}` }}
          theme={calendar.theme_id}
          isTemplate={isTemplatePreview}
        />
      )}

      <LoveLockedModal
        isOpen={!!lockedModalData?.isOpen}
        onClose={() => setLockedModalData(null)}
        dayNumber={lockedModalData?.day || 0}
        unlockDate={lockedModalData?.date || new Date()}
        onNotify={handleNotifyMe}
        theme={calendar.theme_id}
      />

      {!isOwnerPlus && (
        <div className="py-12 flex justify-center relative z-10">
          <BrandWatermark />
        </div>
      )}
    </div>
  );
};

export default VisualizarCalendario;

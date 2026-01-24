import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Heart, Eye, Loader2, AlertCircle, Sparkles } from "lucide-react";
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
import { AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
  const [lockedDay, setLockedDay] = useState<number | null>(null);

  const [openedDays, setOpenedDays] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

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
    if (!calendar || lockedDay === null) return;

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
      return;
    }

    // Step 3: Subscribe to push notifications
    const subscription = await subscribeToPush();

    if (!subscription) {
      toast.error("Erro ao configurar notificações", {
        description: "Tente novamente mais tarde."
      });
      setLockedDay(null);
      return;
    }

    // Step 4: Schedule the door reminder
    const baseDate = calendar.start_date
      ? parseISO(calendar.start_date)
      : parseISO(calendar.created_at || new Date().toISOString());
    const doorDate = startOfDay(addDays(baseDate, lockedDay - 1));
    doorDate.setHours(9, 0, 0, 0); // Notificar às 09:00 para melhor engajamento

    const success = await scheduleDoorReminder(calendar.id, lockedDay, doorDate);

    if (success) {
      toast.success("🎉 Lembrete configurado!", {
        description: `Você será notificado quando a Porta ${lockedDay} abrir.`
      });
    } else {
      toast("Lembrete salvo localmente!", {
        description: "Você receberá a notificação quando abrir o app."
      });
    }

    setLockedDay(null);
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
      {/* Sao Joao Background Pattern */}
      {calendar.theme_id === 'saojoao' && (
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#F9A03F 2px, transparent 2px), radial-gradient(#F9A03F 2px, transparent 2px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
          backgroundColor: "#FFF8E8"
        }} />
      )}
      {/* Wedding Background Pattern */}
      {calendar.theme_id === 'casamento' && (
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#C5A059 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundColor: "#FFFCF5"
        }} />
      )}

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
            <motion.button
              onClick={() => setLiked(!liked)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${liked ? "bg-red-500" : "bg-white/80 backdrop-blur-sm"
                } shadow-sm border border-black/5`}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "text-white fill-white" : "text-muted-foreground"
                  }`}
              />
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

        <div>
          <h1 className={cn(
            "text-3xl font-black mb-1 leading-tight",
            calendar.theme_id === 'saojoao' ? "text-[#5D2E0B]" : "text-foreground"
          )}>
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

      {/* Locked Day Modal "Calma Coração" */}
      <AnimatePresence>
        {lockedDay !== null && (
          <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 theme-${calendar.theme_id}`}>
            <motion.div
              className="absolute inset-0 bg-foreground/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLockedDay(null)}
            />
            <motion.div
              className="relative bg-card rounded-[3rem] p-8 max-w-sm w-full shadow-elevated overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20" />
                  <Loader2 className="w-12 h-12 text-primary animate-spin-slow" />
                </div>

                {(() => {
                  const lockedContent: Record<string, { title: string, message: string }> = {
                    saojoao: {
                      title: "Opa, pera lá! 🌽",
                      message: "A fogueira ainda tá esquentando! Segura a ansiedade que essa porta abre logo pro arraiá."
                    },
                    carnaval: {
                      title: "O bloco ainda não saiu! 🎉",
                      message: "Tudo tem sua hora na avenida. Aguarde a concentração para abrir esta porta!"
                    },
                    natal: {
                      title: "O Papai Noel ainda não chegou! 🎅",
                      message: "Essa surpresa está sendo embrulhada pelos elfos. Aguente firme!"
                    },
                    casamento: {
                      title: "Ainda não é o momento... 💍",
                      message: "Estamos preparando este detalhe com todo carinho do mundo. Em breve você verá!"
                    },
                    namoro: {
                      title: "Calma, amor! ❤️",
                      message: "Eu sei que você tá curiosa(o), mas essa surpresa é para o momento certo."
                    },
                    default: {
                      title: "Calma, coração! ✨",
                      message: "Essa surpresa ainda está sendo preparada e só abre em breve. Segura a ansiedade!"
                    }
                  };

                  const content = lockedContent[calendar.theme_id] || lockedContent['default'];

                  return (
                    <>
                      <h2 className="text-3xl font-black text-foreground mb-3 leading-tight">{content.title}</h2>
                      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                        {content.message}
                      </p>
                    </>
                  );
                })()}

                <div className="flex gap-3 mb-10">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-muted-foreground">Horas</span>
                  </div>
                  <div className="text-2xl font-black pt-3 text-primary">:</div>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-muted-foreground">Minutos</span>
                  </div>
                  <div className="text-2xl font-black pt-3 text-primary">:</div>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-primary/10 text-primary border-2 border-primary/20 rounded-2xl flex items-center justify-center font-black text-xl">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-muted-foreground">Segundos</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleNotifyMe}
                  className="w-full btn-festive py-5 rounded-3xl flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <Heart className="w-5 h-5 fill-current" />
                  </motion.div>
                  Me avise quando abrir
                </motion.button>

                <button
                  onClick={() => setLockedDay(null)}
                  className="mt-6 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  Voltar ao calendário
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

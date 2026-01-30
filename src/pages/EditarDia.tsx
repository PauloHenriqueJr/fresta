import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Camera, Link as LinkIcon, Loader2, X, Play, Check, Music, Lock, Crown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { getThemeConfig } from "@/lib/themes/registry";
import DayCard from "@/components/calendar/DayCard";
import { useAuth } from "@/state/auth/AuthProvider";

type Calendar = Tables<'calendars'>;
type CalendarDay = Tables<'calendar_days'>;
type ContentType = "text" | "photo" | "gif" | "link" | "music";

interface ContentOption {
  type: ContentType;
  icon: React.ReactNode;
  label: string;
}

const contentOptions: ContentOption[] = [
  { type: "text", icon: <MessageSquare className="w-6 h-6" />, label: "Mensagem de Texto" },
  { type: "photo", icon: <Camera className="w-6 h-6" />, label: "Foto ou Vídeo" },
  { type: "gif", icon: <span className="text-lg font-bold">GIF</span>, label: "GIF Animado" },
  { type: "link", icon: <LinkIcon className="w-6 h-6" />, label: "Cupom/Link" },
  { type: "music", icon: <Music className="w-6 h-6" />, label: "Música (Spotify)" },
];

const EditarDia = () => {
  const navigate = useNavigate();
  const { dia, calendarId } = useParams();
  const { toast } = useToast();

  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [dayData, setDayData] = useState<CalendarDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedType, setSelectedType] = useState<ContentType>("text");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const dayNumber = parseInt(dia || "1", 10);
  const themeConfig = calendar ? getThemeConfig(calendar.theme_id) : null;

  // Fetch calendar and day data
  useEffect(() => {
    const fetchData = async () => {
      if (!calendarId) {
        setLoading(false);
        return;
      }

      try {
        const calData = await CalendarsRepository.getById(calendarId);
        setCalendar(calData);

        const day = await CalendarsRepository.getDay(calendarId, dayNumber);
        if (day) {
          setDayData(day);
          setSelectedType(day.content_type || "text");
          setMessage(day.message || "");
          setUrl(day.url || "");
          setLabel(day.label || "");
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [calendarId, dayNumber]);

  // Track changes for autosave
  useEffect(() => {
    if (loading) return;
    setHasChanges(true);
  }, [message, url, label, selectedType, loading]);

  // Debounced Auto-save
  useEffect(() => {
    if (!hasChanges || saving || !calendarId) return;

    const timer = setTimeout(async () => {
      try {
        setSaving(true);
        await CalendarsRepository.updateDay(calendarId, dayNumber, {
          contentType: selectedType,
          message: message.trim() || null,
          url: (selectedType === "photo" || selectedType === "gif" || selectedType === "link" || selectedType === "music") ? url : null,
          label: selectedType === "link" ? label : null,
        });
        setLastSaved(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        setHasChanges(false);
      } catch (err) {
        console.error('Autosave error:', err);
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, url, label, selectedType, hasChanges, saving, calendarId, dayNumber]);

  const handleSave = async () => {
    if (!calendarId) return;

    setSaving(true);

    try {
      await CalendarsRepository.updateDay(calendarId, dayNumber, {
        contentType: selectedType,
        message: message.trim() || null,
        url: (selectedType === "photo" || selectedType === "gif" || selectedType === "link" || selectedType === "music") ? url : null,
        label: selectedType === "link" ? label : null,
      });

      toast({
        title: "Surpresa salva!",
        description: `O conteúdo do dia ${dayNumber} foi salvo com sucesso.`,
      });
      navigate(-1);
    } catch (err) {
      console.error('Error saving:', err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o conteúdo. Tente novamente.",
        variant: "destructive",
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const bgStyle = themeConfig ? {
    ...themeConfig.styles.background,
    backgroundImage: themeConfig.ui?.layout.bgSvg
      ? `${themeConfig.ui.layout.bgSvg}, ${themeConfig.styles.background?.backgroundImage || 'none'}`
      : themeConfig.styles.background?.backgroundImage
  } : undefined;

  const primaryBtnClass = themeConfig?.ui?.footer.button.split(' ').find(c => c.startsWith('bg-')) || "bg-primary";

  // Extract a visible accent color (avoiding transparent for gradient themes)
  const accentTextClass = themeConfig?.ui?.header.title.split(' ').find(c => c.startsWith('text-') && !c.includes('transparent'))
    || themeConfig?.ui?.header.title.split(' ').find(c => c.startsWith('from-'))?.replace('from-', 'text-')
    || "text-primary";

  return (
    <div className={cn("min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 font-sans", themeConfig?.ui?.layout.bgClass)} style={bgStyle}>
      {themeConfig?.FloatingComponent && <themeConfig.FloatingComponent />}
      {/* Header - mobile only */}
      <motion.header
        className="px-4 py-4 flex items-center gap-4 lg:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className={cn("text-lg font-black tracking-tight font-display", accentTextClass)}>
          O que tem na Porta {dayNumber}?
        </h1>
      </motion.header>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-4 py-8 max-w-[1200px] mx-auto w-full relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-border/40 hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className={cn("text-2xl font-black tracking-tight font-display dark:text-foreground", accentTextClass)}>O que tem na Porta {dayNumber}?</h1>
            <p className="text-sm font-medium text-muted-foreground/80">{calendar ? calendar.title : "Personalize sua surpresa"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {saving ? (
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Salvando...
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
              <Check className="w-3 h-3" />
              Salvo às {lastSaved}
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-4 max-w-[1200px] lg:mx-auto pb-32 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Preview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Day Card Preview */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-48 h-48">
                {calendar && (
                  <DayCard
                    day={dayNumber}
                    status={dayData?.content_type ? "available" : "locked"}
                    theme={calendar.theme_id || "default"}
                    hasSpecialContent={!!dayData?.content_type}
                    dateLabel={`DIA ${dayNumber}`}
                    onClick={() => { }} // No-op in preview
                  />
                )}
              </div>
            </motion.div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-foreground mt-4">
                {calendar ? calendar.title : "Porta"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Visualização da porta no calendário
              </p>
            </div>

          </div>

          {/* Right Column: Inputs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content Type Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className={cn("font-bold mb-4 flex items-center gap-2 font-display dark:text-foreground", accentTextClass)}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Tipo de conteúdo
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {contentOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                      selectedType === option.type
                        ? cn("bg-card dark:bg-card text-foreground border-transparent shadow-lg ring-2", accentTextClass.replace('text-', 'ring-'))
                        : "border-border/30 bg-card/60 dark:bg-card/40 backdrop-blur-sm hover:border-primary/50 text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "transition-colors",
                        selectedType === option.type ? accentTextClass : "opacity-60"
                      )}
                    >
                      {option.icon}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Message Input */}
            {(selectedType === "text" || selectedType === "photo" || selectedType === "gif") && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn("font-bold flex items-center gap-2 font-display dark:text-foreground", accentTextClass)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Sua Mensagem
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{message.length} caracteres</span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem festiva aqui..."
                  className={cn(
                    "w-full h-48 lg:h-64 p-6 bg-card dark:bg-card/80 backdrop-blur-sm border-2 border-border rounded-3xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none transition-all shadow-sm",
                    accentTextClass.replace('text-', 'focus:border-')
                  )}
                />
              </motion.section>
            )}

            {/* Photo/Video Upload */}
            {selectedType === "photo" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className={cn("font-bold mb-4 flex items-center gap-2 font-display dark:text-foreground", accentTextClass)}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  Mídia da Surpresa
                </h3>

                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const originalFile = e.target.files?.[0];
                        if (!originalFile || !calendarId) return;

                        if (!calendar?.is_premium) {
                          toast({
                            title: "Upload Bloqueado",
                            description: "O upload de fotos está disponível apenas no Plano Plus.",
                            variant: "destructive"
                          });
                          return;
                        }

                        setSaving(true);
                        try {
                          const { compressImage } = await import("@/lib/image-utils");
                          let file = originalFile;
                          if (originalFile.type.startsWith('image/')) {
                            toast({ title: "Otimizando foto...", description: "Isso economiza espaço e carrega mais rápido. 🚀" });
                            file = await compressImage(originalFile);
                          }

                          const { data: { user } } = await (await import("@/lib/supabase/client")).supabase.auth.getUser();
                          if (!user) throw new Error("Usuário não autenticado");

                          const fileExt = file.name.split('.').pop() || 'jpg';
                          const fileName = `${user.id}/${calendarId}/day-${dayNumber}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                          const publicUrl = await CalendarsRepository.uploadMedia(file, fileName);
                          setUrl(publicUrl);
                          toast({ title: "Foto enviada!", description: "A imagem foi otimizada e salva no servidor." });
                        } catch (err: any) {
                          console.error('Upload error:', err);
                          toast({ title: "Erro no envio", description: err.message || "Não foi possível enviar a foto.", variant: "destructive" });
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={saving}
                    />
                    <div className={cn(
                      "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden",
                      url ? "border-primary/40 bg-card/40" : "border-border/50 bg-card/20 backdrop-blur-sm group-hover:border-primary/50"
                    )}>
                      {!calendar?.is_premium && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center">
                          <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-xs font-bold text-foreground">Upload disponível apenas no Plano Plus</p>
                          <button
                            onClick={() => navigate('/premium')}
                            className="mt-2 text-[10px] font-black uppercase text-primary hover:underline"
                          >
                            Seja Plus para subir fotos
                          </button>
                        </div>
                      )}
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-background shadow-sm")}>
                        <Camera className={cn("w-6 h-6", accentTextClass)} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground">
                          {url ? 'Trocar Foto' : 'Escolher Foto do Dispositivo'}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">PNG, JPG ou GIF (Max 5MB)</p>
                      </div>
                    </div>
                  </div>

                  {url && (
                    <div className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-muted border border-border group">
                      {(() => {
                        // YouTube Robust Parsing
                        const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
                        const ytId = ytMatch ? ytMatch[1] : null;

                        if (ytId) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}`}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          );
                        }

                        // TikTok
                        if (url.includes('tiktok.com')) {
                          return (
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#010101] text-white">
                              <Play className="w-12 h-12 mb-3 text-white fill-current opacity-80" />
                              <p className="text-[10px] font-black uppercase tracking-widest text-center px-4">Preview: Vídeo do TikTok selecionado</p>
                            </div>
                          );
                        }

                        // Instagram
                        if (url.includes('instagram.com/reels') || url.includes('instagram.com/reel/') || url.includes('instagram.com/p/')) {
                          const igUrl = url.split('?')[0];
                          const embedUrl = `${igUrl}${igUrl.endsWith('/') ? '' : '/'}embed/`;

                          return (
                            <div className="w-full h-full relative bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] overflow-hidden">
                              <iframe
                                src={embedUrl}
                                className="w-full h-full bg-white opacity-0 transition-opacity duration-700"
                                onLoad={(e) => (e.target as any).classList.remove('opacity-0')}
                                frameBorder="0"
                                scrolling="no"
                                allowTransparency
                              />
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white pointer-events-none group-hover:pointer-events-auto">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-xl group-hover:scale-105 transition-transform">
                                  <Play className="w-7 h-7 text-white fill-current" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-center px-4 mb-4 drop-shadow-md">Se for um perfil privado, o preview não aparecerá</p>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-5 py-2.5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg active:scale-95 pointer-events-auto"
                                >
                                  Abrir no Instagram ↗
                                </a>
                              </div>
                            </div>
                          );
                        }

                        // Default Image Preview
                        return (
                          <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
                            (e.target as any).src = 'https://placehold.co/600x400?text=Link+de+Mídia+Inválido';
                          }} />
                        );
                      })()}
                      <button
                        onClick={() => setUrl('')}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all backdrop-blur-sm z-20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-background/20 px-4 text-muted-foreground backdrop-blur-sm">OU USE UM LINK EXTERNO</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Link de Vídeo ou Imagem Externa</h4>
                    <input
                      type="url"
                      value={url.includes('.supabase.co') ? '' : url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="TikTok, Instagram Reels, YouTube ou link de imagem..."
                      className={cn(
                        "w-full p-6 bg-white/80 backdrop-blur-sm border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-sm",
                        accentTextClass.replace('text-', 'focus:border-')
                      )}
                    />
                  </div>
                </div>

                <div className="tip-card mt-6">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    💡 <strong>Privacidade:</strong> Fotos do seu dispositivo são salvas com segurança no Supabase. Se o seu Instagram for <strong>privado</strong>, a foto do link não aparecerá para outras pessoas; nesse caso, prefira subir o arquivo aqui!
                  </p>
                </div>
              </motion.section>
            )}

            {/* GIF Selection */}
            {selectedType === "gif" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className={cn("font-bold mb-4 flex items-center gap-2 font-display", accentTextClass)}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  Link do GIF
                </h3>
                <input
                  type="url"
                  value={url.includes('.supabase.co') ? '' : url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://media.giphy.com/..."
                  className={cn(
                    "w-full p-6 bg-white/80 backdrop-blur-sm border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-sm",
                    accentTextClass.replace('text-', 'focus:border-')
                  )}
                />

                {url && (
                  <div className="mt-6 relative rounded-2xl overflow-hidden shadow-md aspect-video bg-muted border border-border group">
                    <img src={url} alt="GIF Preview" className="w-full h-full object-contain" onError={(e) => {
                      (e.target as any).src = 'https://placehold.co/600x400?text=GIF+Inválido';
                    }} />
                    <button
                      onClick={() => setUrl('')}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all backdrop-blur-sm z-20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.section>
            )}

            {/* Link Input */}
            {selectedType === "link" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className={cn("font-bold mb-4 flex items-center gap-2 font-display", accentTextClass)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    URL do Link
                  </h3>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://exemplo.com/cupom"
                    className={cn(
                      "w-full p-6 bg-white/80 backdrop-blur-sm border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-sm",
                      accentTextClass.replace('text-', 'focus:border-')
                    )}
                  />
                </div>
                <div>
                  <h3 className={cn("font-bold mb-4 flex items-center gap-2 font-display", accentTextClass)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Texto do botão
                  </h3>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Clique para ver"
                    className={cn(
                      "w-full p-6 bg-white/80 backdrop-blur-sm border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-sm",
                      accentTextClass.replace('text-', 'focus:border-')
                    )}
                  />
                </div>
              </motion.section>
            )}

            {/* Music/Spotify Input */}
            {selectedType === "music" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className={cn("font-bold mb-4 flex items-center gap-2 font-display dark:text-foreground", accentTextClass)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Link do Spotify
                  </h3>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://open.spotify.com/track/..."
                    className={cn(
                      "w-full p-6 bg-card dark:bg-card/80 backdrop-blur-sm border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-sm",
                      accentTextClass.replace('text-', 'focus:border-')
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Cole o link de uma música, álbum ou playlist do Spotify
                  </p>
                </div>

                {url && (url.includes('spotify.com')) && (() => {
                  const match = url.match(/open\.spotify\.com\/(?:[a-zA-Z-]+\/)?(track|playlist|album)\/([a-zA-Z0-9]+)/);
                  if (match) {
                    return (
                      <div className="rounded-2xl overflow-hidden shadow-md border border-border bg-black/90">
                        <iframe
                          src={`https://open.spotify.com/embed/${match[1]}/${match[2]}?theme=0`}
                          width="100%"
                          height="152"
                          frameBorder="0"
                          allow="encrypted-media"
                          className="w-full"
                        />
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="tip-card">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    🎵 <strong>Dica:</strong> No Spotify, clique em "Compartilhar" → "Copiar link" para obter o link da música
                  </p>
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>

      {/* Save Button - Floating Style, no Bar */}
      <div className="fixed bottom-8 right-4 left-4 lg:left-auto lg:right-10 z-[120]">
        <motion.button
          className={cn(
            "w-full lg:w-auto lg:px-12 flex items-center justify-center gap-3 h-14 rounded-full font-black text-sm uppercase tracking-widest text-white shadow-2xl hover:scale-[1.05] active:scale-[0.95] transition-all",
            primaryBtnClass,
            "backdrop-blur-sm border border-white/20"
          )}
          onClick={handleSave}
          disabled={saving}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95, y: 0 }}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <span>Salvar Surpresa</span>
              <Check className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div >
  );
};

export default EditarDia;

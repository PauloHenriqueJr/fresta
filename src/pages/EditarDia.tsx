import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Camera, Link as LinkIcon, Loader2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import type { Tables } from "@/lib/supabase/types";

type Calendar = Tables<'calendars'>;
type CalendarDay = Tables<'calendar_days'>;
type ContentType = "text" | "photo" | "gif" | "link";

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

  const dayNumber = parseInt(dia || "1", 10);

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

  const handleSave = async () => {
    if (!calendarId) return;

    setSaving(true);

    try {
      await CalendarsRepository.updateDay(calendarId, dayNumber, {
        contentType: selectedType,
        message: message.trim() || null,
        url: (selectedType === "photo" || selectedType === "gif" || selectedType === "link") ? url : null,
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

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
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
        <h1 className="text-lg font-bold text-foreground">
          O que tem na Porta {dayNumber}?
        </h1>
      </motion.header>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-4 py-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">O que tem na Porta {dayNumber}?</h1>
            <p className="text-sm text-muted-foreground">{calendar ? calendar.title : "Personalize sua surpresa"}</p>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-[1600px] lg:mx-auto pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Preview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Day Card Preview */}
            <motion.div
              className="bg-card rounded-3xl p-6 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-full h-2 bg-primary rounded-full mb-6" />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <span className="text-3xl font-extrabold text-primary">
                    {dayNumber}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  {calendar ? calendar.title : "Porta"}
                </h2>
                <p className="text-sm text-primary">
                  Personalize a surpresa deste dia
                </p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Inputs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content Type Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold text-foreground mb-4">
                Escolha o tipo de conteúdo
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {contentOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedType === option.type
                      ? "border-primary bg-secondary/50 shadow-sm"
                      : "border-border bg-card hover:border-primary/50"
                      }`}
                  >
                    <span
                      className={
                        selectedType === option.type
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {option.icon}
                    </span>
                    <span
                      className={`text-sm font-bold ${selectedType === option.type
                        ? "text-primary"
                        : "text-muted-foreground"
                        }`}
                    >
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
                  <h3 className="font-bold text-foreground">Sua Mensagem</h3>
                  <span className="text-xs text-muted-foreground transition-all">{message.length} caracteres</span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem festiva aqui..."
                  className="w-full h-48 lg:h-64 p-6 bg-card border-2 border-border rounded-3xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary transition-all shadow-sm"
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
                <h3 className="font-bold text-foreground mb-4">Mídia da Surpresa</h3>

                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const originalFile = e.target.files?.[0];
                        if (!originalFile || !calendarId) return;

                        setSaving(true);
                        try {
                          // Import compression utility
                          const { compressImage } = await import("@/lib/image-utils");

                          // Compress only if it's an image
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
                          toast({
                            title: "Foto enviada!",
                            description: "A imagem foi otimizada e salva no servidor.",
                          });
                        } catch (err: any) {
                          console.error('Upload error:', err);
                          toast({
                            title: "Erro no envio",
                            description: err.message || "Não foi possível enviar a foto.",
                            variant: "destructive",
                          });
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={saving}
                    />
                    <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${url ? 'border-primary/40 bg-primary/5' : 'border-border bg-card group-hover:border-primary/50'}`}>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-primary" />
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
                    <div className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-muted border border-border">
                      {url.includes('tiktok.com') || url.includes('instagram.com') || url.includes('youtube.com') ? (
                        <div className="w-full h-full flex items-center justify-center p-4 bg-muted text-center">
                          <p className="text-xs text-muted-foreground">Preview não disponível para links sociais nesta tela, mas aparecerá no calendário.</p>
                        </div>
                      ) : (
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => setUrl('')}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all backdrop-blur-sm"
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
                      <span className="bg-background px-4 text-muted-foreground">OU USE UM LINK EXTERNO</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Link de Vídeo ou Imagem Externa</h4>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="TikTok, Instagram Reels, YouTube ou link de imagem..."
                      className="w-full p-6 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-sm"
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
                <h3 className="font-bold text-foreground mb-4">URL do GIF</h3>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://media.giphy.com/..."
                  className="w-full p-6 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-sm"
                />
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
                  <h3 className="font-bold text-foreground mb-4">URL do Link</h3>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://exemplo.com/cupom"
                    className="w-full p-6 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-sm"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-4">Texto do botão</h3>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Clique para ver"
                    className="w-full p-6 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </motion.section>
            )}
          </div>
          {/* Desktop inline button */}
          <motion.button
            className="hidden lg:flex w-full btn-festive mt-8 items-center justify-center gap-2"
            onClick={handleSave}
            disabled={saving}
            whileHover={!saving ? { scale: 1.02 } : {}}
            whileTap={!saving ? { scale: 0.98 } : {}}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Surpresa"
            )}
          </motion.button>
        </div>
      </div>

      {/* Save Button - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border lg:hidden">
        <motion.button
          className="w-full max-w-lg mx-auto btn-festive flex items-center justify-center gap-2"
          onClick={handleSave}
          disabled={saving}
          whileHover={!saving ? { scale: 1.02 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Surpresa"
          )}
        </motion.button>
      </div>
    </div >
  );
};

export default EditarDia;

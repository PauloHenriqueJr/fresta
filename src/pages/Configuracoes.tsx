import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Download,
  MessageCircle,
  Instagram,
  MoreHorizontal,
  Globe,
  Link,
  Check,
  Settings,
  Sparkles,
  Calendar,
  ChevronRight,
  Trash2,
  Loader2,
  Lock,
  Unlock,
  EyeOff,
  Eye
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { BASE_THEMES } from "@/lib/offline/themes";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

const Configuracoes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calendar, setCalendar] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [themeId, setThemeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [headerMessage, setHeaderMessage] = useState("");
  const [footerMessage, setFooterMessage] = useState("");
  const [capsuleMessage, setCapsuleMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!id) return;
      try {
        const data = await CalendarsRepository.getById(id);
        if (data) {
          setCalendar(data);
          setTitle(data.title);
          setThemeId(data.theme_id);
          setPrivacy(data.privacy);
          setPassword(data.password || "");
          setHeaderMessage(data.header_message || "");
          setFooterMessage(data.footer_message || "");
          setCapsuleMessage(data.capsule_message || "");
          setStartDate(data.start_date ? data.start_date.split('T')[0] : "");
        }
      } catch (err) {
        console.error("Error fetching calendar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [id]);

  const fullUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/c/${id}`;
  const calendarLink = fullUrl.replace(/^https?:\/\//, '');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link do seu calendário foi copiado.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!id) return;
    if (!title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O título não pode ficar vazio.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await CalendarsRepository.update(id, {
        title: title.trim(),
        theme_id: themeId,
        privacy,
        password: password || null,
        start_date: startDate || null,
        header_message: headerMessage || null,
        footer_message: footerMessage || null,
        capsule_message: capsuleMessage || null
      });

      toast({
        title: "Configurações salvas!",
        description: "As alterações foram aplicadas com sucesso.",
      });

      // Refresh local state
      const updated = await CalendarsRepository.getById(id);
      if (updated) setCalendar(updated);

    } catch (err) {
      console.error("Error saving settings:", err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSocialShare = (platform: 'whatsapp' | 'instagram' | 'tiktok') => {
    const text = encodeURIComponent(`Confira meu calendário no Fresta: ${fullUrl}`);
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      instagram: `https://www.instagram.com/`,
      tiktok: `https://www.tiktok.com/`,
    };

    if (platform === 'whatsapp') {
      window.open(urls.whatsapp, '_blank');
    } else {
      handleCopyLink();
      toast({
        title: "Link copiado!",
        description: `Abra o ${platform === 'instagram' ? 'Instagram' : 'TikTok'} e cole o link na sua bio!`,
      });
    }
  };

  const handleDelete = async () => {
    if (!id || !calendar) return;

    setDeleting(true);
    try {
      await CalendarsRepository.delete(id);
      toast({
        title: "Calendário excluído",
        description: "O calendário foi removido do sistema.",
      });
      navigate("/meus-calendarios");
    } catch (err) {
      console.error("Error deleting calendar:", err);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o calendário.",
        variant: "destructive",
      });
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-solidroad-text dark:bg-black/40 pb-24 pt-12 border-b border-border/10">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-sm hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
            </motion.button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-2">
                <Settings className="w-3 h-3 text-solidroad-accent" />
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Ajustes Mágicos</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Configurações
              </h1>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-white/10 dark:bg-card/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10 dark:border-border/10"
          >
            <div className="w-12 h-12 rounded-xl bg-solidroad-accent/20 flex items-center justify-center shrink-0 shadow-glow">
              <Sparkles className="w-6 h-6 text-solidroad-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-black truncate">{calendar?.title || "Carregando..."}</p>
              <p className="text-white/60 dark:text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest">Editando agora</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl -mt-12 relative z-20 pb-48 md:pb-32">
        {loading ? (
          <div className="bg-card rounded-[2.5rem] p-20 shadow-xl border border-border/10 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 animate-spin text-solidroad-accent mb-4" />
            <p className="font-bold text-muted-foreground">Preparando ajustes...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Sections Wrapper */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="space-y-6"
            >
              {/* Basic Info Section */}
              <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <div className="bg-card rounded-[2.5rem] p-8 shadow-xl border border-border/10 transition-colors">
                  <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-solidroad-accent/10 flex items-center justify-center"><Calendar className="w-4 h-4 text-solidroad-accent" /></div>
                    Informações Básicas
                  </h2>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Nome da Experiência</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Contagem para o Natal"
                        className="w-full h-14 px-6 bg-background dark:bg-black/20 border-2 border-transparent rounded-2xl text-foreground font-bold text-lg focus:outline-none focus:border-solidroad-accent/20 focus:bg-card transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Data de Estreia</label>
                      <DatePicker
                        date={startDate ? parseISO(startDate) : undefined}
                        setDate={(date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : "")}
                        placeholder="Escolher data de estreia..."
                      />
                      <p className="text-[10px] text-muted-foreground/50 font-medium italic ml-1 leading-relaxed">
                        A contagem regressiva e os dias disponíveis serão calculados a partir desta data.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Privacy & Sharing Section - Moved up */}
              <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <div className="bg-card rounded-[2.5rem] p-8 shadow-xl border border-border/10 transition-colors">
                  <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-solidroad-accent/10 flex items-center justify-center"><Lock className="w-4 h-4 text-solidroad-accent" /></div>
                    Privacidade e Senha
                  </h2>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                          Visibilidade
                        </h3>
                        <p className="text-[10px] text-muted-foreground/40 italic">
                          * Público: Aparecerá no "Explorar" para todos.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'public', label: 'Público', desc: 'No Explorar', icon: Globe },
                          { id: 'private', label: 'Privado', desc: 'Apenas Link', icon: Link }
                        ].map(p => (
                          <button
                            key={p.id}
                            onClick={() => setPrivacy(p.id as any)}
                            className={cn(
                              "w-full p-4 rounded-2xl border-2 flex flex-col gap-1 transition-all text-left",
                              privacy === p.id ? "border-solidroad-accent bg-solidroad-accent/5 ring-4 ring-solidroad-accent/5" : "border-transparent bg-background/50 dark:bg-white/5 opacity-60 hover:opacity-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Check className={cn("w-3 h-3 text-solidroad-accent transition-opacity", privacy === p.id ? "opacity-100" : "opacity-0")} />
                              <p className="font-black text-foreground text-sm">{p.label}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 font-medium leading-tight ml-5">{p.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Senha de Acesso (Opcional)</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Digite uma senha..."
                          className="w-full h-14 px-6 bg-background dark:bg-black/20 border-2 border-transparent rounded-2xl text-foreground font-bold focus:outline-none focus:border-solidroad-accent/20 transition-all shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-solidroad-accent transition-colors"
                        >
                          {showPassword ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Theme Selection - Modernized */}
              <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <div className="bg-card rounded-[2.5rem] p-8 shadow-xl border border-border/10 transition-colors">
                  <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-solidroad-turquoise/10 flex items-center justify-center"><Globe className="w-4 h-4 text-[#4ECDC4]" /></div>
                    Trocar Estilo Visual
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {BASE_THEMES.filter(t => t.scope !== 'b2b').map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setThemeId(theme.id)}
                        className={cn(
                          "relative p-4 rounded-3xl border-2 text-left transition-all duration-300 group overflow-hidden",
                          themeId === theme.id
                            ? "border-solidroad-accent bg-solidroad-accent/5 shadow-lg"
                            : "border-border/10 hover:border-solidroad-accent/30 bg-background/50 dark:bg-white/5"
                        )}
                      >
                        {themeId === theme.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-solidroad-accent rounded-full flex items-center justify-center shadow-glow">
                            <Check className="w-3 h-3 text-solidroad-text stroke-[3px]" />
                          </div>
                        )}
                        <div className="w-10 h-10 rounded-xl bg-card border border-border/5 shadow-sm flex items-center justify-center text-xl mb-3 mb-3 group-hover:scale-110 transition-transform">
                          {theme.emoji || '✨'}
                        </div>
                        <p className="font-black text-sm text-foreground leading-tight">{theme.name}</p>
                        <p className="text-[10px] text-muted-foreground/70 font-medium line-clamp-2 mt-1 leading-tight">{theme.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Privacy & Sharing */}
              <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Privacy */}
                  <div className="bg-card rounded-[2.5rem] p-8 shadow-xl border border-border/10 transition-colors space-y-8">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                          Visibilidade
                        </h3>
                        <p className="text-[10px] text-muted-foreground/40 italic">
                          * Público: Aparecerá no "Explorar" para todos.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'public', label: 'Público', desc: 'No Explorar', icon: Globe },
                          { id: 'private', label: 'Privado', desc: 'Apenas Link', icon: Link }
                        ].map(p => (
                          <button
                            key={p.id}
                            onClick={() => setPrivacy(p.id as any)}
                            className={cn(
                              "w-full p-4 rounded-2xl border-2 flex flex-col gap-1 transition-all",
                              privacy === p.id ? "border-solidroad-accent bg-solidroad-accent/5 ring-4 ring-solidroad-accent/5" : "border-transparent bg-background/50 dark:bg-white/5 opacity-60 hover:opacity-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Check className={cn("w-3 h-3 text-solidroad-accent transition-opacity", privacy === p.id ? "opacity-100" : "opacity-0")} />
                              <p className="font-black text-foreground text-sm">{p.label}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 font-medium leading-tight ml-5">{p.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-border/5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Senha de Acesso</label>
                        <span className="text-[10px] bg-solidroad-accent/20 text-solidroad-text dark:text-solidroad-accent px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Opcional</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                          {password ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Ex: segredo123"
                          className="w-full pl-14 pr-14 h-14 rounded-xl bg-background dark:bg-black/20 border-2 border-transparent text-foreground font-bold focus:outline-none focus:border-solidroad-accent/20 transition-all shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-solidroad-accent transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground/40 italic leading-tight">
                        Se definida, o visitante precisará digitar esta senha para ver o conteúdo.
                      </p>
                    </div>
                  </div>

                  {/* Quick Link */}
                  <div className="bg-solidroad-text dark:bg-card rounded-[2.5rem] p-8 shadow-xl text-white border border-border/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-solidroad-accent/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">Link da Experiência</h3>
                    <div className="bg-white/10 dark:bg-black/20 rounded-2xl p-4 border border-white/10 mb-6 shrink-0 min-w-0 relative z-10">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Link Único</p>
                      <p className="text-sm font-bold truncate opacity-90">{`${window.location.origin}${import.meta.env.BASE_URL}#/c/${id}`}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCopyLink}
                      className="w-full h-14 rounded-2xl bg-solidroad-accent text-solidroad-text font-black text-sm flex items-center justify-center gap-2 relative z-10 shadow-glow"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? "COPIADO!" : "COPIAR LINK"}
                    </motion.button>
                  </div>
                </div>
              </motion.section>

              {/* QR Code & Social */}
              <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <div className="bg-card rounded-[2.5rem] p-8 shadow-xl border border-border/10 transition-colors">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Dynamic QR Code */}
                    <div className="w-48 h-48 bg-white dark:bg-white rounded-[2rem] flex items-center justify-center p-4 border-2 border-border/10 group relative shrink-0 shadow-lg overflow-hidden transition-all hover:scale-105">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-solidroad-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <span className="text-[10px] font-black text-solidroad-text tracking-widest bg-solidroad-accent/80 px-3 py-1 rounded-full">ESCANEIE</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-black text-foreground mb-3 leading-tight">Compartilhar com o mundo</h3>
                      <p className="text-muted-foreground font-medium mb-6">Mande o link no WhatsApp ou use o QR Code em convites impressos (surpresa!).</p>

                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <button onClick={() => handleSocialShare('whatsapp')} className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all"><MessageCircle className="w-7 h-7" /></button>
                        <button onClick={() => handleSocialShare('instagram')} className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFB344] via-[#EA384D] to-[#8D2791] text-white flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all"><Instagram className="w-7 h-7" /></button>
                        <button onClick={() => handleSocialShare('tiktok')} className="w-14 h-14 rounded-2xl bg-solidroad-text dark:bg-black/40 text-white flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all shadow-glow"><span className="text-2xl font-bold">🎵</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Danger Zone */}
              <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <div className="bg-red-500/5 rounded-[2.5rem] p-8 border-2 border-red-500/10">
                  <h3 className="text-lg font-black text-red-500 mb-2">Zona de Perigo</h3>
                  <p className="text-muted-foreground text-sm font-medium mb-6">Ações irreversíveis. Tenha cuidado!</p>

                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={deleting}
                    className="w-full h-14 rounded-2xl bg-card border-2 border-red-500/10 text-red-500 font-black text-sm flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                  >
                    {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    EXCLUIR CALENDÁRIO PERMANENTEMENTE
                  </button>
                </div>
              </motion.section>
            </motion.div>
          </div>
        )}
      </div>

      {/* Save Button - Floating Footer */}
      {!loading && (
        <div className="fixed bottom-[72px] md:bottom-0 left-0 right-0 p-6 bg-background/80 dark:bg-card/80 backdrop-blur-xl border-t border-border/10 z-[60] transition-colors">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4">
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Modo de Edição</p>
              <p className="text-sm font-bold text-foreground truncate opacity-80">Suas mudanças serão refletidas imediatamente no link público.</p>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto md:min-w-[240px] h-16 bg-solidroad-accent text-solidroad-text rounded-[1.25rem] font-black text-lg shadow-xl shadow-solidroad-accent/20 flex items-center justify-center gap-2 group shadow-glow"
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6 stroke-[3.5px] group-hover:scale-110 transition-transform" />}
              {saving ? "SALVANDO..." : "SALVAR TUDO"}
            </motion.button>
          </div>
        </div>
      )}

      {/* Delete Dialog - Premium Style using Portal */}
      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Excluir Calendário?"
        description={
          <>
            Você está prestes a excluir permanentemente <strong>"{calendar?.title}"</strong>. Todos os momentos e surpresas serão perdidos.
          </>
        }
        isLoading={deleting}
      />
    </div>
  );
};

export default Configuracoes;

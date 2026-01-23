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
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";

const Configuracoes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calendar, setCalendar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!id) return;
      try {
        const data = await CalendarsRepository.getById(id);
        if (data) {
          setCalendar(data);
          setPrivacy(data.privacy);
        }
      } catch (err) {
        console.error("Error fetching calendar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [id]);

  const calendarLink = `${window.location.host}${import.meta.env.BASE_URL}#/c/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.protocol}//${calendarLink}`);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link do seu calendário foi copiado.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await CalendarsRepository.update(id, { privacy });
      toast({
        title: "Configurações salvas!",
        description: "As alterações foram aplicadas com sucesso.",
      });
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

  const handleDelete = async () => {
    if (!id || !calendar) return;
    if (!confirm(`Tem certeza que deseja excluir o calendário "${calendar.title}"? Esta ação é permanente.`)) {
      return;
    }

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
        <h1 className="text-lg font-bold text-foreground">Configurações</h1>
      </motion.header>

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 py-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">{calendar?.title || "Carregando..."}</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      ) : (
        <div className="px-4 space-y-8 max-w-2xl lg:mx-auto pb-32">
          {/* Share Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-2">
              Compartilhar seu Calendário
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Personalize como os outros verão seu cronômetro festivo.
            </p>

            {/* Link Card */}
            <div className="bg-card rounded-2xl p-4 shadow-card flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {calendarLink}
                </p>
                <p className="text-xs text-primary">
                  Link do seu calendário personalizado
                </p>
              </div>
              <motion.button
                className="btn-festive py-2 px-4 text-sm flex items-center gap-2"
                onClick={handleCopyLink}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Link
                  </>
                )}
              </motion.button>
            </div>
          </motion.section>

          {/* QR Code Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-6 shadow-card flex flex-col items-center">
              {/* QR Code placeholder */}
              <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
                <div className="w-40 h-40 bg-card rounded-xl border-4 border-primary/30 flex items-center justify-center">
                  <span className="text-6xl">📱</span>
                </div>
              </div>
              <button className="flex items-center gap-2 text-primary font-semibold">
                <Download className="w-5 h-5" />
                Baixar QR Code
              </button>
            </div>
          </motion.section>

          {/* Social Share Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-foreground mb-4">
              Compartilhar nas Redes
            </h3>
            <div className="flex items-center gap-4">
              <button className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-card">
                <MessageCircle className="w-7 h-7 text-white" />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shadow-card">
                <Instagram className="w-7 h-7 text-white" />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center shadow-card">
                <span className="text-2xl">🎵</span>
              </button>
              <button className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shadow-card">
                <MoreHorizontal className="w-7 h-7 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              WhatsApp • Stories • TikTok • Mais
            </p>
          </motion.section>

          {/* Privacy Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-bold text-foreground mb-4">Privacidade</h3>
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <button
                className={`w-full p-4 flex items-center gap-4 ${privacy === "public" ? "bg-secondary" : ""
                  }`}
                onClick={() => setPrivacy("public")}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${privacy === "public" ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <Globe
                    className={`w-5 h-5 ${privacy === "public"
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                      }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">Público</p>
                  <p className="text-xs text-muted-foreground">
                    Qualquer pessoa pode encontrar
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${privacy === "public"
                    ? "border-primary bg-primary"
                    : "border-muted"
                    }`}
                >
                  {privacy === "public" && (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
              </button>

              <button
                className={`w-full p-4 flex items-center gap-4 border-t border-border ${privacy === "private" ? "bg-secondary" : ""
                  }`}
                onClick={() => setPrivacy("private")}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${privacy === "private" ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <Link
                    className={`w-5 h-5 ${privacy === "private"
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                      }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">
                    Privado (apenas link)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Apenas pessoas com o link acessam
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${privacy === "private"
                    ? "border-primary bg-primary"
                    : "border-muted"
                    }`}
                >
                  {privacy === "private" && (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
              </button>
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            className="pt-8 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-bold text-festive-red mb-2">Zona de Perigo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ações irreversíveis para o seu calendário.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-bold flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              Excluir permanentemente
            </button>
          </motion.section>

          {/* Desktop inline button */}
          <motion.button
            className="hidden lg:block w-full btn-festive mt-8"
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </motion.button>
        </div>
      )}

      {/* Save Button - mobile only */}
      {!loading && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border lg:hidden">
          <motion.button
            className="w-full max-w-lg mx-auto btn-festive"
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;

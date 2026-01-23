import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Bell,
  Moon,
  Trash2,
  ChevronRight,
  Loader2,
  Save,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/state/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";

const ContaConfiguracoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
    }
    // Load local preferences
    const storedNotifications = localStorage.getItem("fresta_notifications");
    const storedDarkMode = localStorage.getItem("fresta_darkmode");

    if (storedNotifications !== null) {
      setNotifications(storedNotifications === "true");
    }
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
  }, [profile]);

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("fresta_darkmode", String(darkMode));
  }, [darkMode]);

  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("fresta_notifications", String(newValue));
    toast({
      title: newValue ? "Notificações ativadas" : "Notificações desativadas",
      description: newValue ? "Você receberá lembretes e atualizações." : "Você não receberá mais notificações.",
    });
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome não pode ficar vazio.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ display_name: displayName.trim() });
      setIsEditingName(false);
      toast({
        title: "Nome atualizado!",
        description: "Seu nome foi salvo com sucesso.",
      });
    } catch (err) {
      console.error("Error saving name:", err);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar seu nome.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Deseja sair da sua conta?")) return;
    await signOut();
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão removidos permanentemente.")) {
      return;
    }

    setDeletingAccount(true);
    try {
      // In a real implementation, you would call an RPC or Edge Function to delete the user and their data
      toast({
        title: "Solicitação recebida",
        description: "Por questões de segurança, enviaremos um email de confirmação para excluir sua conta.",
      });
    } catch (err) {
      console.error("Error deleting account:", err);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header */}
      <motion.header
        className="px-4 py-4 lg:py-10 flex items-center gap-4 max-w-[1600px] lg:mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-foreground">Configurações da Conta</h1>
          <p className="hidden lg:block text-sm text-muted-foreground">Edite seu perfil e preferências</p>
        </div>
      </motion.header>

      <div className="px-4 space-y-8 max-w-[1600px] lg:mx-auto pt-2 lg:pt-0 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-bold text-foreground mb-4">Perfil</h2>
            <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
              {/* Name Row */}
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Nome</p>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      className="w-full p-2 mt-1 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                      placeholder="Seu nome"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground truncate">
                      {profile?.display_name || user?.user_metadata?.name || "Usuário Fresta"}
                    </p>
                  )}
                </div>
                {isEditingName ? (
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="p-2 rounded-full bg-primary text-white shrink-0 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="shrink-0"
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Email Row (Read-only) */}
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">E-mail</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user?.email || "Não configurado"}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 shrink-0">
                  Fixo
                </span>
              </div>
            </div>
          </motion.section>

          {/* Preferences Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-bold text-foreground mb-4">Preferências</h2>
            <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Receber lembretes e atualizações
                  </p>
                </div>
                <button
                  onClick={handleNotificationsToggle}
                  className={`w-12 h-7 rounded-full transition-colors shrink-0 ${notifications ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ x: notifications ? 26 : 4 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Moon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">
                    Tema escuro para o app
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-7 rounded-full transition-colors shrink-0 ${darkMode ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ x: darkMode ? 26 : 4 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-bold text-foreground mb-4">Zona de Perigo</h2>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 text-foreground hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <LogOut className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Sair da Conta</p>
                  <p className="text-xs text-muted-foreground">
                    Encerrar sessão neste dispositivo
                  </p>
                </div>
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 text-festive-red hover:bg-destructive/5 transition-colors disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-festive-red/10 flex items-center justify-center shrink-0">
                  {deletingAccount ? <Loader2 className="w-6 h-6 text-festive-red animate-spin" /> : <Trash2 className="w-6 h-6 text-festive-red" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Excluir Conta</p>
                  <p className="text-xs text-muted-foreground">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default ContaConfiguracoes;

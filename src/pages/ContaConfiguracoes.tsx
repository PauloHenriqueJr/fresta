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
  Camera,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/state/auth/AuthProvider";
import AvatarPicker from "@/components/AvatarPicker";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

const ContaConfiguracoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut, updateProfile, themePreference, updateThemePreference } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
    }
    // Load local preferences
    const storedNotifications = localStorage.getItem("fresta_notifications");

    if (storedNotifications !== null) {
      setNotifications(storedNotifications === "true");
    }
  }, [profile]);

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
    await signOut();
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
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
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Premium Hero Section - Minimal version for settings */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-12 pt-8">
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

        <div className="relative z-10 container mx-auto px-6">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5px]" />
            </motion.button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-2">
                <Settings className="w-3 h-3 text-solidroad-accent" />
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Ajustes Fresta</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                Configurações <span className="text-solidroad-accent">da Conta</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-6 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] mb-4 ml-1">Perfil do Usuário</h2>
            <div className="bg-card rounded-[2.5rem] border border-border/10 shadow-xl overflow-hidden divide-y divide-border/5">
              {/* Avatar Row */}
              <div className="p-4 flex items-center gap-4">
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="w-16 h-16 rounded-full bg-muted overflow-hidden shrink-0 hover:ring-2 hover:ring-primary/50 transition-all group relative"
                >
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.email || 'default'}&backgroundColor=b6e3f4`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Avatar</p>
                  <p className="text-sm text-muted-foreground">
                    Toque para alterar sua foto
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </div>

              {/* Name Row */}
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-solidroad-accent/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-solidroad-accent" />
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
                <div className="w-12 h-12 rounded-2xl bg-solidroad-turquoise/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-solidroad-turquoise" />
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
            <h2 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] mb-4 ml-1">Preferências</h2>
            <div className="bg-card rounded-[2.5rem] border border-border/10 shadow-xl overflow-hidden divide-y divide-border/5">
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-solidroad-green/10 flex items-center justify-center shrink-0">
                  <Bell className="w-6 h-6 text-solidroad-green" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Receber lembretes e atualizações
                  </p>
                </div>
                <button
                  onClick={handleNotificationsToggle}
                  className={`w-12 h-7 rounded-full transition-colors shrink-0 ${notifications ? "bg-solidroad-accent" : "bg-muted"
                    }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-solidroad-text shadow-md"
                    animate={{ x: notifications ? 26 : 4 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-solidroad-accent/10 flex items-center justify-center shrink-0">
                  <Moon className="w-6 h-6 text-solidroad-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">
                    Tema escuro para o app
                  </p>
                </div>
                <button
                  onClick={() => updateThemePreference(themePreference === 'dark' ? 'light' : 'dark')}
                  className={`w-12 h-7 rounded-full transition-colors shrink-0 ${themePreference === 'dark' ? "bg-solidroad-accent" : "bg-muted"
                    }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-solidroad-text shadow-md"
                    animate={{ x: themePreference === 'dark' ? 26 : 4 }}
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
            className="lg:col-span-2 mt-8"
          >
            <h2 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] mb-4 ml-1 text-center">Gestão de Acesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full bg-card rounded-[2.5rem] p-6 shadow-lg border border-border/10 flex items-center gap-4 text-foreground hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <LogOut className="w-7 h-7 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-black text-lg">Sair da Conta</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Encerrar sessão neste dispositivo
                  </p>
                </div>
              </button>

              <button
                onClick={() => setShowDeleteAccountDialog(true)}
                disabled={deletingAccount}
                className="w-full bg-card rounded-[2.5rem] p-6 shadow-lg border border-border/10 flex items-center gap-4 text-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all group disabled:opacity-50"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {deletingAccount ? <Loader2 className="w-7 h-7 text-red-500 animate-spin" /> : <Trash2 className="w-7 h-7 text-red-500" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-black text-lg">Excluir Conta</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500/60">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
              </button>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        currentAvatar={profile?.avatar}
      />

      {/* Logout Dialog - Premium Style using Portal */}
      <ConfirmModal
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Sair da Conta? 👋"
        description="Tem certeza que deseja encerrar sua sessão no Fresta?"
        confirmText="SIM, SAIR"
        cancelText="VOLTAR"
        icon={LogOut}
        iconClassName="text-[#1A3E3A]"
        iconBgClassName="bg-[#F6D045]/20"
        accentColor="bg-[#F6D045]"
        confirmButtonClassName="bg-[#F6D045] hover:bg-[#e5c03f] text-[#1A3E3A] shadow-[#F6D045]/25"
      />

      {/* Delete Account Dialog - Premium Style using Portal */}
      <DeleteConfirmModal
        isOpen={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta Permanentemente? ⚠️"
        description="Esta ação não pode ser desfeita. Todos os seus calendários, dados e preferências serão removidos para sempre."
        confirmText="SIM, EXCLUIR TUDO"
        cancelText="CANCELAR"
        isLoading={deletingAccount}
      />
    </div>
  );
};

export default ContaConfiguracoes;

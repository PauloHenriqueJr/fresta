import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Bell,
  Moon,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ContaConfiguracoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas.",
    });
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
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Nome</p>
                  <p className="text-sm text-muted-foreground">Usuário Demo</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    usuario@email.com
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Receber lembretes e atualizações
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-7 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-muted"
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
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
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
                  className={`w-12 h-7 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-muted"
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
            <button className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 text-festive-red">
              <div className="w-12 h-12 rounded-full bg-festive-red/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-festive-red" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold">Excluir Conta</p>
                <p className="text-xs text-muted-foreground">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </button>
          </motion.section>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border lg:relative lg:bg-transparent lg:border-t-0 lg:p-0 lg:mt-6 lg:max-w-[1600px] lg:mx-auto">
        <motion.button
          className="w-full max-w-lg mx-auto btn-festive lg:ml-0"
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Salvar Alterações
        </motion.button>
      </div>
    </div>
  );
};

export default ContaConfiguracoes;

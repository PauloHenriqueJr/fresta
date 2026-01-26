import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/state/auth/AuthProvider";
import B2BSidebar from "@/components/b2b/B2BSidebar";
import { Plus, Settings, Menu, CircleUser, LayoutDashboard, Megaphone, BarChart3, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function B2BLayout() {
  const { profile, logout, themePreference, updateThemePreference } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isTabActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    const nextTheme = themePreference === "dark" ? "light" : "dark";
    updateThemePreference(nextTheme);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[#F9F9F9] dark:bg-[#0E220E] transition-colors duration-300">
        {/* Desktop app shell (lg+) */}
        <div className="hidden lg:flex min-h-screen w-full">
          <B2BSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            {/* Header - Premium Glassmorphic Solidroad style */}
            <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-50 border-b border-border/10 bg-white/80 dark:bg-[#0E220E]/80 backdrop-blur-xl transition-colors duration-300">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-muted transition-colors rounded-lg p-2 text-solidroad-text dark:text-white/80" />
                <div className="h-5 w-px bg-border/10" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40 dark:text-white/30">
                    Painel Empresarial
                  </span>
                  <span className="text-base font-bold tracking-tight -mt-0.5 text-solidroad-text dark:text-solidroad-accent">
                    Fresta B2B
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F9F9F9] dark:bg-white/5 text-[#0E220E] dark:text-[#F6D045] transition-all hover:scale-105"
                  title={themePreference === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
                >
                  {themePreference === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Create button */}
                <button
                  onClick={() => navigate("/b2b/campanhas/nova")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:shadow-md bg-[#F6D045] text-[#0E220E]"
                >
                  <Plus className="w-4 h-4" />
                  Nova Campanha
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    navigate("/entrar");
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted text-muted-foreground/60 dark:text-white/40"
                >
                  Sair
                </button>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 p-6 lg:p-8 xl:p-10 max-w-[1400px] mx-auto w-full">
              <Outlet />
            </main>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex-1 flex flex-col relative pb-20">
          {/* Mobile Header */}
          <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-50 border-b bg-white dark:bg-[#0E220E] border-border/10 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F6D045]">
                <Menu className="w-4 h-4 text-[#0E220E]" />
              </div>
              <span className="text-base font-bold text-[#0E220E] dark:text-white">
                Fresta B2B
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F9F9F9] dark:bg-white/5 text-[#0E220E] dark:text-[#F6D045]"
              >
                {themePreference === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => navigate("/b2b/privacidade")}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F9F9F9] dark:bg-white/5 text-muted-foreground/60 dark:text-white/40"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Mobile Content */}
          <main className="flex-1 p-4 overflow-x-hidden">
            <Outlet />
          </main>

          {/* Bottom Navigation - Solidroad style */}
          <div className="fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom border-t bg-white dark:bg-[#0E220E] border-border/10 px-2 py-2">
            <nav className="flex items-center justify-around max-w-lg mx-auto h-14 relative">
              {/* Dashboard */}
              <button
                onClick={() => navigate("/b2b")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  isTabActive("/b2b") ? "text-[#0E220E] dark:text-[#F6D045]" : "text-muted-foreground/40"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  isTabActive("/b2b") ? "bg-[#F6D045]" : "transparent"
                )}>
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold">Painel</span>
              </button>

              {/* Campanhas */}
              <button
                onClick={() => navigate("/b2b/campanhas")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  isTabActive("/b2b/campanhas") ? "text-[#0E220E] dark:text-[#F6D045]" : "text-muted-foreground/40"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  isTabActive("/b2b/campanhas") ? "bg-[#F6D045]" : "transparent"
                )}>
                  <Megaphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold">Campanhas</span>
              </button>

              {/* Create Button (FAB) */}
              <div className="flex-1 flex justify-center -mt-6">
                <motion.button
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-[#F6D045]"
                  onClick={() => navigate("/b2b/campanhas/nova")}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-6 h-6 text-[#0E220E]" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Analytics */}
              <button
                onClick={() => navigate("/b2b/analytics")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  isTabActive("/b2b/analytics") ? "text-[#0E220E] dark:text-[#F6D045]" : "text-muted-foreground/40"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  isTabActive("/b2b/analytics") ? "bg-[#F6D045]" : "transparent"
                )}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold">Relatórios</span>
              </button>

              {/* Profile */}
              <button
                onClick={() => navigate("/b2b/perfil")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  isTabActive("/b2b/perfil") ? "text-[#0E220E] dark:text-[#F6D045]" : "text-muted-foreground/40"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  isTabActive("/b2b/perfil") ? "bg-[#F6D045]" : "transparent"
                )}>
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <CircleUser className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[10px] font-semibold">Perfil</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

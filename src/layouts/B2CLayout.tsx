import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import B2CSidebar from "@/components/b2c/B2CSidebar";
import { useAuth } from "@/state/auth/AuthProvider";
import { Plus, Search, Calendar, CircleUser, Home, Moon, Sun, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function B2CLayout() {
  const { user, profile, logout, themePreference, updateThemePreference } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isTabActive = (path: string) => location.pathname === path;
  const isCreationFlow = location.pathname.startsWith("/criar") || location.pathname.startsWith("/editar-dia");

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Desktop app shell (lg+) */}
        <div className="hidden lg:flex min-h-screen w-full">
          <B2CSidebar />

          <div className="flex-1 min-w-0">
            {/* Header - Premium Glassmorphic Solidroad style (Matching B2B) */}
            <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-40 border-b border-border/10 bg-white/80 dark:bg-[#0E220E]/80 backdrop-blur-xl transition-colors duration-300">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-muted transition-colors rounded-lg p-2 text-solidroad-text dark:text-white/80" />
                <div className="h-5 w-px bg-border/10" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 dark:text-white/40">
                    Olá, {profile?.display_name?.split(' ')[0] || 'usuário'}
                  </span>
                  <span className="text-lg font-medium tracking-tight text-solidroad-text dark:text-[#F6D045] -mt-0.5">Painel Central</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden xl:flex items-center bg-muted/50 dark:bg-card rounded-2xl px-4 py-2.5 border border-border/10 group focus-within:border-solidroad-accent/50 focus-within:ring-2 focus-within:ring-solidroad-accent/10 transition-all">
                  <Search className="w-4 h-4 text-muted-foreground/60 mr-2" />
                  <input
                    type="text"
                    placeholder="Busca global..."
                    className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-muted-foreground/40 font-medium text-foreground"
                  />
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    const nextTheme = themePreference === "dark" ? "light" : "dark";
                    updateThemePreference(nextTheme);
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/50 dark:bg-card text-foreground dark:text-solidroad-accent transition-all hover:scale-105 border border-border/10"
                  title="Alternar modo claro/escuro"
                >
                  {themePreference === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => navigate("/premium")}
                  className="px-6 py-2.5 rounded-xl bg-solidroad-accent text-solidroad-text text-sm font-black shadow-glow-accent hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Seja Premium
                </button>
              </div>
            </header>

            <main className="p-8 lg:p-12 xl:p-16 max-w-[1600px] mx-auto w-full">
              <Outlet />
            </main>
          </div>
        </div>

        {/* Mobile/Tablet: mantém exatamente como está (sem shell) */}
        <div className={`lg:hidden flex-1 flex flex-col relative ${isCreationFlow ? "" : "pb-24"}`}>
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>

          {/* SHARED BOTTOM NAV - MOBILE ONLY */}
          {!isCreationFlow && (
            <div className="fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom bg-background/80 backdrop-blur-xl border-t border-border/40 px-2 py-1">
              <nav className="flex items-center justify-around max-w-lg mx-auto h-16 relative">

                {/* INÍCIO (Home discovery) */}
                <button
                  onClick={() => navigate("/explorar")}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/explorar") && !location.search.includes('q=') ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                >
                  <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/explorar") && !location.search.includes('q=') ? "bg-primary/10" : ""}`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Início</span>
                </button>

                {/* CALENDÁRIOS */}
                <button
                  onClick={() => navigate("/meus-calendarios")}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/meus-calendarios") ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                >
                  <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/meus-calendarios") ? "bg-primary/10" : ""}`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-center">Calendários</span>
                </button>

                {/* NOVO (+) */}
                <div className="flex-1 flex justify-center -mt-8">
                  <motion.button
                    className="bg-primary text-primary-foreground w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    onClick={() => navigate("/criar")}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-8 h-8" strokeWidth={3} />
                  </motion.button>
                </div>

                {/* EXPLORAR */}
                <button
                  onClick={() => navigate("/explorar")}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/explorar") ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                >
                  <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/explorar") ? "bg-primary/10" : ""}`}>
                    <Search className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Explorar</span>
                </button>

                {/* PERFIL */}
                <button
                  onClick={() => navigate("/perfil")}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/perfil") ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                    }`}
                >
                  <div className={`relative w-8 h-8 flex items-center justify-center rounded-xl p-0.5 transition-colors ${isTabActive("/perfil") ? "bg-primary/10" : ""}`}>
                    {profile && profile.avatar ? (
                      <div className={`w-full h-full rounded-full overflow-hidden border transition-colors ${isTabActive("/perfil") ? "border-primary" : "border-border/50"
                        }`}>
                        <img
                          src={profile.avatar}
                          alt="Perfil"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <CircleUser className="w-full h-full text-muted-foreground hidden" />
                      </div>
                    ) : (
                      <CircleUser className={`w-6 h-6 ${isTabActive("/perfil") ? "text-primary" : "text-muted-foreground"}`} />
                    )}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Perfil</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}

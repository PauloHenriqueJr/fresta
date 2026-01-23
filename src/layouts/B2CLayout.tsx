import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import B2CSidebar from "@/components/b2c/B2CSidebar";
import { useAuth } from "@/state/auth/AuthProvider";
import { Plus, Search, Calendar, CircleUser, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function B2CLayout() {
  const { user, profile, logout } = useAuth();
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
            <header className="h-24 flex items-center justify-between border-b border-border/40 px-12 bg-card/60 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300 hover:bg-card/70">
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
                <div className="h-6 w-[1px] bg-border/50 mx-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Controle</span>
                  <span className="text-xl font-black tracking-tight text-foreground -mt-1 leading-none">Painel Central</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden xl:flex items-center bg-muted/50 rounded-2xl px-4 py-2 border border-border/50 group focus-within:border-primary/50 transition-all">
                  <span className="text-muted-foreground mr-2">🔍</span>
                  <input
                    type="text"
                    placeholder="Busca global..."
                    className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    const isDark = document.documentElement.classList.toggle("dark");
                    localStorage.setItem("fresta_darkmode", String(isDark));
                  }}
                  className="p-3 rounded-2xl bg-muted/50 border border-border/50 text-foreground hover:bg-muted transition-all"
                  title="Alternar modo claro/escuro"
                >
                  <span className="dark:hidden">🌙</span>
                  <span className="hidden dark:inline">☀️</span>
                </button>

                <button
                  onClick={() => navigate("/premium")}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-festive text-white text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
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

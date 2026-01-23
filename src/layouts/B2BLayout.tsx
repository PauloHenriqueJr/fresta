import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/state/auth/AuthProvider";
import B2BSidebar from "@/components/b2b/B2BSidebar";
import { LayoutDashboard, Megaphone, Plus, BarChart3, CircleUser, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function B2BLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isTabActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Desktop app shell (lg+) */}
        <div className="hidden lg:flex min-h-screen w-full">
          <B2BSidebar />

          <div className="flex-1 min-w-0">
            <header className="h-24 flex items-center justify-between border-b border-border/40 px-12 bg-card/60 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300 hover:bg-card/70">
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
                <div className="h-6 w-[1px] bg-border/50 mx-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Controle B2B</span>
                  <span className="text-xl font-black tracking-tight text-foreground -mt-1 leading-none">Painel Empresarial</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    logout();
                    navigate("/entrar");
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-muted text-foreground text-xs font-black hover:bg-muted/80 transition-all uppercase tracking-widest"
                >
                  Sair
                </button>
              </div>
            </header>

            <main className="p-8 lg:p-12 xl:p-16 max-w-[1600px] mx-auto w-full">
              <Outlet />
            </main>
          </div>
        </div>

        {/* Mobile View with Bottom Nav */}
        <div className="lg:hidden flex-1 flex flex-col relative pb-20">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border/40 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">Corporativo</span>
              <span className="text-lg font-black tracking-tight text-foreground -mt-1 leading-none">Fresta B2B</span>
            </div>
            <button
              onClick={() => navigate("/b2b/privacidade")}
              className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </header>

          <main className="flex-1 p-4 overflow-x-hidden">
            <Outlet />
          </main>

          {/* SHARED BOTTOM NAV - B2B MOBILE */}
          <div className="fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom bg-background/80 backdrop-blur-xl border-t border-border/40 px-2 py-1">
            <nav className="flex items-center justify-around max-w-lg mx-auto h-16 relative">

              {/* DASHBOARD */}
              <button
                onClick={() => navigate("/b2b")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/b2b") ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/b2b") ? "bg-primary/10" : ""}`}>
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Painel</span>
              </button>

              {/* CAMPANHAS */}
              <button
                onClick={() => navigate("/b2b/campanhas")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/b2b/campanhas") ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/b2b/campanhas") ? "bg-primary/10" : ""}`}>
                  <Megaphone className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-center">Campanhas</span>
              </button>

              {/* NOVO (+) */}
              <div className="flex-1 flex justify-center -mt-8">
                <motion.button
                  className="bg-primary text-primary-foreground w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  onClick={() => navigate("/b2b/campanhas/nova")}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-8 h-8" strokeWidth={3} />
                </motion.button>
              </div>

              {/* ANALYTICS */}
              <button
                onClick={() => navigate("/b2b/analytics")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/b2b/analytics") ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/b2b/analytics") ? "bg-primary/10" : ""}`}>
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Relatórios</span>
              </button>

              {/* PERFIL */}
              <button
                onClick={() => navigate("/b2b/perfil")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/b2b/perfil") ? "text-primary" : "text-muted-foreground/60"
                  }`}
              >
                <div className={`relative w-8 h-8 flex items-center justify-center rounded-xl p-0.5 transition-colors ${isTabActive("/b2b/perfil") ? "bg-primary/10" : ""}`}>
                  {profile && profile.avatar ? (
                    <div className={`w-full h-full rounded-full overflow-hidden border transition-colors ${isTabActive("/b2b/perfil") ? "border-primary" : "border-border/50"
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
                    <CircleUser className={`w-6 h-6 ${isTabActive("/b2b/perfil") ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Perfil</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

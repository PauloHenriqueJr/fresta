import { Outlet, useNavigate } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import B2CSidebar from "@/components/b2c/B2CSidebar";
import { useAuth } from "@/state/auth/AuthProvider";

export default function B2CLayout() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="lg:hidden">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}

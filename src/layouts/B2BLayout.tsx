import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/state/auth/AuthProvider";
import B2BSidebar from "@/components/b2b/B2BSidebar";
import { NavLink } from "@/components/NavLink";

export default function B2BLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

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

        {/* Mobile/Tablet Fallback */}
        <div className="lg:hidden">
          <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
            <div className="h-14 flex items-center justify-between px-4">
              <span className="font-black text-foreground tracking-tighter text-xl">Fresta B2B</span>
            </div>
            <nav className="px-3 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[{
                  label: "Dashboard",
                  to: "/b2b",
                }, {
                  label: "Campanhas",
                  to: "/b2b/campanhas",
                }, {
                  label: "Analytics",
                  to: "/b2b/analytics",
                }, {
                  label: "Equipe",
                  to: "/b2b/equipe",
                }].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className="shrink-0 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-bold text-muted-foreground transition-all"
                    activeClassName="bg-primary text-white border-transparent shadow-sm"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </header>
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

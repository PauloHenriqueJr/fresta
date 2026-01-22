import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Desktop app shell (lg+) */}
        <div className="hidden lg:flex min-h-screen w-full">
          <AdminSidebar />

          <div className="flex-1 min-w-0">
            <header className="h-24 flex items-center justify-between border-b border-border/40 px-12 bg-card/60 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300 hover:bg-card/70">
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hover:bg-amber-500/10 transition-colors" />
                <div className="h-6 w-[1px] bg-border/50 mx-2" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600/60">Root Access</span>
                  <span className="text-xl font-black tracking-tight text-foreground -mt-1 leading-none">Painel Administrativo</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-widest">
                  Ambiente de Controle
                </span>
              </div>
            </header>

            <main className="p-8 lg:p-12 xl:p-16 max-w-[1600px] mx-auto w-full">
              <Outlet />
            </main>
          </div>
        </div>

        {/* Mobile Fallback */}
        <div className="lg:hidden p-4">
          <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20 text-center">
            <h2 className="text-xl font-black text-amber-600 mb-2">Acesso Restrito</h2>
            <p className="text-sm text-foreground/70 font-medium">O painel administrativo deve ser acessado preferencialmente via Desktop para melhor visualização dos dados.</p>
          </div>
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

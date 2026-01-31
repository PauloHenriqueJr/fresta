import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { LayoutDashboard, Users, DollarSign, BarChart3, CircleUser, MoreHorizontal, Calendar, Briefcase } from "lucide-react";
import { useAuth } from "@/state/auth/AuthProvider";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const isTabActive = (path: string) => location.pathname === path;

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
                {/* Dashboard Switcher */}
                <div className="flex items-center gap-1 bg-amber-500/10 rounded-xl p-1 border border-amber-500/20">
                  <button
                    onClick={() => navigate("/meus-calendarios")}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-600/60 hover:text-amber-600 hover:bg-amber-500/10 transition-all"
                    title="Ir para B2C"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate("/b2b")}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-600/60 hover:text-amber-600 hover:bg-amber-500/10 transition-all"
                    title="Ir para B2B"
                  >
                    <Briefcase className="w-4 h-4" />
                  </button>
                </div>

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

        {/* Mobile View with Bottom Nav */}
        <div className="lg:hidden flex-1 flex flex-col relative pb-20">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border/40 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-600/60">Admin</span>
              <span className="text-lg font-black tracking-tight text-foreground -mt-1">Fresta Master</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <span className="text-[10px] font-black text-amber-600">🛡️</span>
            </div>
          </header>

          <main className="flex-1 p-4 overflow-x-hidden">
            <Outlet />
          </main>

          {/* SHARED BOTTOM NAV - ADMIN MOBILE */}
          <div className="fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom bg-background/80 backdrop-blur-xl border-t border-border/40 px-2 py-1">
            <nav className="flex items-center justify-around max-w-lg mx-auto h-16 relative">

              {/* DASHBOARD */}
              <button
                onClick={() => navigate("/admin")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/admin") ? "text-amber-600" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/admin") ? "bg-amber-500/10" : ""}`}>
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Geral</span>
              </button>

              {/* VENDAS */}
              <button
                onClick={() => navigate("/admin/vendas")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/admin/vendas") ? "text-amber-600" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/admin/vendas") ? "bg-amber-500/10" : ""}`}>
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Vendas</span>
              </button>

              {/* BI / FINANCEIRO */}
              <button
                onClick={() => navigate("/admin/financeiro")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/admin/financeiro") ? "text-amber-600" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/admin/financeiro") ? "bg-amber-500/10" : ""}`}>
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-center">BI</span>
              </button>

              {/* USUÁRIOS */}
              <button
                onClick={() => navigate("/admin/usuarios")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/admin/usuarios") ? "text-amber-600" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isTabActive("/admin/usuarios") ? "bg-amber-500/10" : ""}`}>
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Users</span>
              </button>

              {/* PERFIL */}
              <button
                onClick={() => navigate("/admin/perfil")}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isTabActive("/admin/perfil") ? "text-amber-600" : "text-muted-foreground/60"
                  }`}
              >
                <div className={`relative w-8 h-8 flex items-center justify-center rounded-xl p-0.5 transition-colors ${isTabActive("/admin/perfil") ? "bg-amber-500/10" : ""}`}>
                  {profile && profile.avatar ? (
                    <div className={`w-full h-full rounded-full overflow-hidden border transition-colors ${isTabActive("/admin/perfil") ? "border-amber-600" : "border-border/50"
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
                    <CircleUser className={`w-6 h-6 ${isTabActive("/admin/perfil") ? "text-amber-600" : "text-muted-foreground"}`} />
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

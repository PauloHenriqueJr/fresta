import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Palette, CreditCard, Users2, Shield, LogOut, Briefcase, MessageSquare, TicketPercent, Globe, Activity, Database, Mail } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/state/auth/AuthProvider";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationGroups = [
  {
    label: "Business Intelligence",
    items: [
      { title: "Dashboard Financeiro", url: "/admin/financeiro", icon: LayoutDashboard },
      { title: "Registro de Vendas", url: "/admin/vendas", icon: CreditCard },
      { title: "Log de Atividades", url: "/admin/logs", icon: Shield },
    ]
  },
  {
    label: "Gestão de Clientes",
    items: [
      { title: "Usuários B2C", url: "/admin/usuarios", icon: Users2 },
      { title: "Clientes B2B", url: "/admin/b2b-clientes", icon: Briefcase },
      { title: "Feedbacks", url: "/admin/feedbacks", icon: MessageSquare },
    ]
  },
  {
    label: "Configurações",
    items: [
      { title: "Templates Globais", url: "/admin/temas", icon: Palette },
      { title: "Configuração de Planos", url: "/admin/planos", icon: LayoutDashboard },
      { title: "Gestão de Cupons", url: "/admin/cupons", icon: TicketPercent },
    ]
  },
  {
    label: "Técnico & Marketing",
    items: [
      { title: "SEO & Metadados", url: "/admin/seo", icon: Globe },
      { title: "Status & Health", url: "/admin/health", icon: Activity },
      { title: "Backups", url: "/admin/backups", icon: Database },
      { title: "E-mails Transacionais", url: "/admin/emails", icon: Mail },
    ]
  }
];

export default function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className={`${collapsed ? "w-14" : "w-64"} border-r border-border/50 bg-card/30 backdrop-blur-xl`}>
      <div className="flex flex-col h-full bg-gradient-to-b from-card/50 to-background/50">
        <SidebarHeader className="py-8 px-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex justify-center">
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent p-0 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:h-11">
                <NavLink to="/admin" className="flex items-center gap-3 w-full justify-start group-data-[collapsible=icon]:justify-center">
                  <div className="w-11 h-11 rounded-2xl bg-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all duration-500 shadow-xl shadow-amber-600/30 border border-white/10">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  {!collapsed && (
                    <div className="flex flex-col ml-1">
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-black tracking-tighter text-foreground leading-none"
                      >
                        Painel Master
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600/60 mt-1"
                      >
                        Root Ecosystem
                      </motion.span>
                    </div>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-3 overflow-y-auto no-scrollbar">
          {navigationGroups.map((group) => (
            <SidebarGroup key={group.label} className="mt-4 first:mt-0">
              {!collapsed && (
                <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink
                          to={item.url}
                          end
                          className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-amber-600/5 hover:translate-x-1"
                          activeClassName="bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:translate-x-0"
                        >
                          <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${pathname === item.url ? 'text-white' : 'text-amber-600'}`} />
                          {!collapsed && <span className="text-sm font-bold tracking-tight">{item.title}</span>}
                          {pathname === item.url && !collapsed && (
                            <div className="absolute -left-3 w-1 h-6 bg-white rounded-full blur-[1px]" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Bottom Profile Section */}
        <div className="mt-auto px-3 border-t border-border/30 bg-card/20 py-8">
          {!collapsed ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shadow-lg">
                  <span className="text-xl">{profile?.avatar ?? "🔐"}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-foreground truncate">
                    {profile?.display_name || user?.email?.split('@')[0] || "Administrador"}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">
                    MODO ROOT
                  </span>
                </div>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/entrar", { replace: true });
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-festive-red/10 hover:text-festive-red transition-all duration-300 group"
              >
                <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-bold">Encerrar Sessão</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => navigate("/admin")}>
                <span className="text-sm">{profile?.avatar ?? "🔐"}</span>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/entrar", { replace: true });
                }}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-festive-red/10 hover:text-festive-red transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

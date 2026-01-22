import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { CalendarDays, PlusCircle, User, Settings, Crown, HelpCircle, LogOut } from "lucide-react";
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

const items = [
  { title: "Meus Calendários", url: "/meus-calendarios", icon: CalendarDays },
  { title: "Criar Calendário", url: "/criar", icon: PlusCircle },
];

const accountItems = [
  { title: "Perfil", url: "/perfil", icon: User },
  { title: "Configurações", url: "/conta/configuracoes", icon: Settings },
  { title: "Premium", url: "/premium", icon: Crown },
  { title: "Ajuda", url: "/ajuda", icon: HelpCircle },
];

export default function B2CSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className={`${collapsed ? "w-14" : "w-64"} border-r border-border/50 bg-card/30 backdrop-blur-xl`}>
      <div className="flex flex-col h-full bg-gradient-to-b from-card/50 to-background/50">
        <SidebarHeader className="py-8 px-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex justify-center">
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent p-0 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:h-11">
                <NavLink to="/" className="flex items-center gap-3 w-full justify-start group-data-[collapsible=icon]:justify-center">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-festive flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all duration-500 shadow-xl shadow-primary/30 border border-white/20">
                    <span className="text-2xl leading-none">🚪</span>
                  </div>
                  {!collapsed && (
                    <div className="flex flex-col ml-1">
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-black tracking-tighter text-foreground leading-none"
                      >
                        Fresta
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mt-0.5"
                      >
                        Consumer App
                      </motion.span>
                    </div>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarGroup className="px-3">
          {!collapsed && (
            <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/5 hover:translate-x-1"
                      activeClassName="bg-gradient-festive text-white shadow-lg shadow-primary/20 hover:translate-x-0"
                    >
                      <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${pathname.startsWith(item.url) ? 'text-white' : 'text-primary'}`} />
                      {!collapsed && <span className="text-sm font-bold tracking-tight">{item.title}</span>}
                      {pathname.startsWith(item.url) && !collapsed && (
                        <div className="absolute -left-3 w-1 h-6 bg-white rounded-full blur-[1px]" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-3 mt-4 flex-1">
          {!collapsed && (
            <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 mb-2">
              Minha Conta
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/5 hover:translate-x-1"
                      activeClassName="bg-gradient-festive text-white shadow-lg shadow-primary/20 hover:translate-x-0"
                    >
                      <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${pathname.startsWith(item.url) ? 'text-white' : 'text-primary'}`} />
                      {!collapsed && <span className="text-sm font-bold tracking-tight">{item.title}</span>}
                      {pathname.startsWith(item.url) && !collapsed && (
                        <div className="absolute -left-3 w-1 h-6 bg-white rounded-full blur-[1px]" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Profile Section */}
        <div className="mt-auto px-3 border-t border-border/30 bg-card/20 py-8">
          {!collapsed ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-festive flex items-center justify-center shadow-lg">
                  <span className="text-xl">{profile?.avatar ?? "👤"}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-foreground truncate">
                    {profile?.display_name || user?.email?.split('@')[0] || "Usuário"}
                  </span>
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                    Plano Free
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
              <div className="w-8 h-8 rounded-xl bg-gradient-festive flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => navigate("/perfil")}>
                <span className="text-sm">{profile?.avatar ?? "👤"}</span>
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

import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { CalendarDays, PlusCircle, User, Settings, Crown, HelpCircle, LogOut, LayoutDashboard, DoorOpen, Search } from "lucide-react";
import { useAuth } from "@/state/auth/AuthProvider";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

const items = [
  { title: "Meus Calendários", url: "/meus-calendarios", icon: CalendarDays },
  { title: "Explorar", url: "/explorar", icon: Search },
  { title: "Criar Novo", url: "/criar", icon: PlusCircle },
];

const accountItems = [
  { title: "Perfil", url: "/perfil", icon: User },
  { title: "Configurações", url: "/conta/configuracoes", icon: Settings },
  { title: "Seja Premium", url: "/premium", icon: Crown },
  { title: "Ajuda", url: "/ajuda", icon: HelpCircle },
];

export default function B2CSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className={cn(
      "border-r border-border/10 transition-all duration-300 z-50",
      collapsed ? "w-[4.5rem]" : "w-72",
      "bg-sidebar dark:bg-sidebar backdrop-blur-xl" // Respect theme variables for separation
    )}>
      <div className="flex flex-col h-full">
        {/* Header / Brand - Fixed Height h-20 to match Navbar */}
        <SidebarHeader className="h-20 flex items-center justify-center border-b border-white/5 px-4">
          <button
            onClick={() => navigate('/')}
            className={cn("flex items-center gap-3 transition-all w-full", collapsed ? "justify-center" : "")}
          >
            <div className="w-10 h-10 rounded-xl bg-solidroad-accent flex items-center justify-center shadow-lg shadow-solidroad-accent/20 flex-shrink-0 text-solidroad-text">
              <DoorOpen className="w-6 h-6" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start">
                <span className="font-black text-xl tracking-tight text-solidroad-text dark:text-[#F6D045] leading-none">Fresta</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Consumer</span>
              </div>
            )}
          </button>
        </SidebarHeader>

        <SidebarContent className={cn("gap-8", collapsed ? "px-0" : "px-4")}>
          {/* Main Menu */}
          <SidebarGroup>
            {!collapsed && <div className="px-4 mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">Menu</div>}
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {items.map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} size="lg" className={cn(collapsed && "!w-full !h-14 !p-0 justify-center")}>
                        <NavLink
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 py-3 rounded-xl transition-all",
                            collapsed ? "justify-center px-0" : "px-3",
                            isActive
                              ? "bg-solidroad-accent text-solidroad-text shadow-glow-accent ring-2 ring-solidroad-accent/20"
                              : "text-muted-foreground/70 hover:bg-muted dark:hover:bg-card hover:text-foreground transition-all duration-300"
                          )}
                        >
                          <item.icon className={cn("w-8 h-8", isActive ? "text-solidroad-text" : "text-muted-foreground/40 dark:text-white/20 group-hover:text-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                          {!collapsed && <span className={cn("font-bold tracking-tight", isActive ? "text-solidroad-text" : "text-foreground")}>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Account Menu */}
          <SidebarGroup className="mt-auto">
            {!collapsed && <div className="px-4 mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">Conta</div>}
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {accountItems.map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} size="lg" className={cn(collapsed && "!w-full !h-14 !p-0 justify-center")}>
                        <NavLink
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 py-3 rounded-xl transition-all",
                            collapsed ? "justify-center px-0" : "px-3",
                            isActive
                              ? "bg-solidroad-accent text-solidroad-text shadow-glow-accent ring-2 ring-solidroad-accent/20"
                              : "text-muted-foreground/70 hover:bg-muted dark:hover:bg-card hover:text-foreground transition-all duration-300"
                          )}
                        >
                          <item.icon className={cn("w-8 h-8", isActive ? "text-solidroad-text" : "text-muted-foreground/40 dark:text-white/20 group-hover:text-foreground")} strokeWidth={isActive ? 2.5 : 2} />
                          {!collapsed && <span className={cn("font-bold tracking-tight", isActive ? "text-solidroad-text" : "text-foreground")}>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Sair" size="lg" className={cn(collapsed && "!w-full !h-14 !p-0 justify-center")}>
                    <button
                      onClick={() => { logout(); navigate('/entrar'); }}
                      className={cn(
                        "w-full flex items-center gap-3 py-3 rounded-xl transition-all font-bold text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10",
                        collapsed ? "justify-center px-0" : "px-3"
                      )}
                    >
                      <LogOut className="w-8 h-8" strokeWidth={1.5} />
                      {!collapsed && <span>Sair</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Footer */}
        <div className={cn("mt-auto p-4 border-t border-border/10", collapsed ? "flex justify-center" : "")}>
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
            <UserAvatar size="md" />
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate">{profile?.display_name || "Usuário"}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 truncate">{user?.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

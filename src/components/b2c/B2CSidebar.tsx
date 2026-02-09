import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { CalendarDays, PlusCircle, User, Settings, Crown, HelpCircle, LogOut, LayoutDashboard, DoorOpen, Search, Receipt, Sidebar as SidebarIcon } from "lucide-react";
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
import { useAuth } from "@/state/auth/AuthProvider";
import { cn } from "@/lib/utils";

const items = [
  { title: "Meus Calendários", url: "/meus-calendarios", icon: CalendarDays },
  { title: "Explorar", url: "/explorar", icon: Search },
  { title: "Criar Novo", url: "/criar", icon: PlusCircle },
];

const accountItems = [
  { title: "Perfil", url: "/perfil", icon: User },
  { title: "Minhas Compras", url: "/minhas-compras", icon: Receipt },
  { title: "Configurações", url: "/conta/configuracoes", icon: Settings },
  { title: "Fazer Upgrade", url: "/plus", icon: Crown },
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
            {/* Logo Customizada */}
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="Fresta"
                className="w-full h-full object-contain drop-shadow-sm"
              />
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
                              ? "bg-muted/80 text-foreground font-medium"
                              : "text-muted-foreground/70 hover:bg-muted dark:hover:bg-card hover:text-foreground transition-all duration-300"
                          )}
                        >
                          <item.icon className={cn("w-5 h-5", isActive ? "text-foreground" : "text-muted-foreground/40 dark:text-white/20 group-hover:text-foreground")} />
                          {!collapsed && <span className={cn("text-sm", isActive ? "font-bold" : "font-medium")}>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}

                {/* Logout Button */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Sair" size="lg" className={cn(collapsed && "!w-full !h-14 !p-0 justify-center")}>
                    <button
                      onClick={logout}
                      className={cn(
                        "flex items-center gap-3 py-3 rounded-xl transition-all w-full text-left",
                        collapsed ? "justify-center px-0" : "px-3",
                        "text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
                      )}
                    >
                      <LogOut className="w-5 h-5" />
                      {!collapsed && <span className="font-medium text-sm">Sair da Conta</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}

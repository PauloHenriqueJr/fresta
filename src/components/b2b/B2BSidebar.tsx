import { motion } from "framer-motion";
import {
  DoorOpen,
  LayoutDashboard,
  Megaphone,
  Palette,
  Users,
  BarChart3,
  LogOut,
  PlusCircle,
  UserPlus,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { cn } from "@/lib/utils";

const navigationGroups = [
  {
    label: "Engajamento",
    items: [
      { title: "Dashboard", url: "/b2b", icon: LayoutDashboard },
      { title: "Relatório Executivo", url: "/b2b/relatorio", icon: BarChart3 },
    ]
  },
  {
    label: "Campanha",
    items: [
      { title: "Campanhas", url: "/b2b/campanhas", icon: Megaphone },
      { title: "Criar Jornada", url: "/b2b/campanhas/nova", icon: PlusCircle },
      { title: "Editor", url: "/b2b/editor", icon: Palette },
    ]
  },
  {
    label: "Segurança",
    items: [
      { title: "Privacidade & SSO", url: "/b2b/privacidade", icon: ShieldCheck },
      { title: "Convites", url: "/b2b/convites", icon: UserPlus },
      { title: "Equipe", url: "/b2b/equipe", icon: Users },
      { title: "Branding", url: "/b2b/branding", icon: Palette },
    ]
  }
];

export default function B2BSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]",
        "bg-white dark:bg-[#0E220E] border-border/10"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <SidebarHeader className={cn("border-b border-border/10 px-0 flex items-center justify-center", collapsed ? "h-20" : "h-20 px-4")}>
          <SidebarMenu>
            <SidebarMenuItem className="flex justify-center w-full">
              <SidebarMenuButton
                size="lg"
                asChild
                className={cn(
                  "hover:bg-transparent p-0 transition-all",
                  collapsed ? "!w-full !h-14 justify-center" : "w-full"
                )}
              >
                <NavLink
                  to="/b2b"
                  className={cn(
                    "flex items-center gap-3 w-full",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  {/* Logo - Yellow rounded square */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#F6D045]/20 bg-[#F6D045]">
                    <DoorOpen className="w-6 h-6 text-[#0E220E]" strokeWidth={2.5} />
                  </div>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col"
                    >
                      <span className="text-xl font-black tracking-tight leading-none text-solidroad-text dark:text-[#F6D045]">
                        Fresta
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Business
                      </span>
                    </motion.div>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent className={cn("gap-0 overflow-y-auto flex-1", collapsed ? "px-0" : "px-3")}>
          {navigationGroups.map((group) => (
            <SidebarGroup key={group.label} className="mt-6 first:mt-0">
              {!collapsed && (
                <SidebarGroupLabel className="px-3 text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground/40">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title} size="lg" className={cn("transition-all", collapsed && "!w-full !h-14 !p-0 justify-center")}>
                          <NavLink
                            to={item.url}
                            end
                            className={cn(
                              "group flex items-center gap-3 transition-all duration-200",
                              collapsed ? "justify-center px-0 w-full h-full" : "px-3 py-2.5 rounded-xl w-full h-full",
                              isActive
                                ? "bg-[#F6D045] text-[#0E220E]"
                                : "text-muted-foreground/70 hover:bg-[#F6D045]/10 hover:text-[#0E220E] dark:text-white/60 dark:hover:text-[#F6D045]"
                            )}
                          >
                            <item.icon
                              className={cn(
                                isActive ? "text-[#0E220E]" : "text-muted-foreground/60 dark:text-white/40 group-hover:text-inherit",
                                collapsed ? "w-8 h-8" : "w-5 h-5"
                              )}
                              strokeWidth={collapsed ? (isActive ? 2 : 1.5) : 2}
                            />
                            {!collapsed && (
                              <span className="text-sm font-medium flex-1 truncate">{item.title}</span>
                            )}
                            {!collapsed && isActive && (
                              <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Bottom Profile Section */}
        <div className={cn("mt-auto border-t border-border/10", collapsed ? "h-24 flex items-center justify-center p-0" : "py-4 px-3")}>
          {!collapsed ? (
            <div className="flex flex-col gap-3">
              {/* Profile card */}
              <button
                onClick={() => navigate("/b2b/perfil")}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-white/5 hover:bg-muted/50 transition-colors w-full text-left outline-none"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden bg-[#F6D045] shrink-0">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-[#0E220E]">
                      {(profile?.display_name || user?.email || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold truncate text-[#0E220E] dark:text-white">
                    {profile?.display_name || user?.email?.split('@')[0] || "Usuário"}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground/50 dark:text-white/30 truncate">
                    Admin
                  </span>
                </div>
              </button>

              {/* Logout button */}
              <button
                onClick={async () => {
                  await logout();
                  navigate("/entrar", { replace: true });
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 group text-muted-foreground/60 dark:text-white/40 w-full"
              >
                <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors shrink-0" />
                <span className="text-sm font-medium group-hover:text-red-500 transition-colors">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full">
              <SidebarMenuButton asChild tooltip="Conta" size="lg" className="!w-full !h-14 !p-0 justify-center">
                <button
                  onClick={() => navigate("/b2b/perfil")}
                  className="flex items-center justify-center w-full h-full"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-[#F6D045] border border-border/10 shrink-0">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-[#0E220E]">
                        {(profile?.display_name || user?.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>
              </SidebarMenuButton>
              <SidebarMenuButton asChild tooltip="Sair" size="lg" className="!w-full !h-14 !p-0 justify-center">
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/entrar", { replace: true });
                  }}
                  className="flex items-center justify-center w-full h-full text-muted-foreground/50 hover:text-red-500"
                >
                  <LogOut className="w-8 h-8" strokeWidth={1.5} />
                </button>
              </SidebarMenuButton>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

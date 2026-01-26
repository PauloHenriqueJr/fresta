import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  ArrowRight,
  Grid3X3,
  List,
  Megaphone,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import B2BCampaignsTable from "@/components/b2b/B2BCampaignsTable";
import B2BCampaignsKanban from "@/components/b2b/B2BCampaignsKanban";
import { cn } from "@/lib/utils";

// Premium Pastel cards
const CARD_COLORS = [
  'bg-solidroad-beige dark:bg-solidroad-beige-dark border-solidroad-accent/20',
  'bg-solidroad-green dark:bg-solidroad-green-dark border-[#2D7A5F]/20',
  'bg-solidroad-turquoise dark:bg-solidroad-turquoise-dark border-[#4ECDC4]/20',
  'bg-solidroad-pink dark:bg-solidroad-pink-dark border-[#FF6B6B]/20',
  'bg-solidroad-purple dark:bg-solidroad-purple-dark border-[#a855f7]/20'
];

export default function B2BCampanhas() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [desktopView, setDesktopView] = useState<"table" | "kanban">("table");

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const org = useMemo(() => (profile ? db.getB2BOrgByOwner(profile.id) : null), [profile]);
  const campaigns = useMemo(() => {
    if (!org) return [];
    const all = db.listB2BCampaigns(org.id);
    const query = q.trim().toLowerCase();
    if (!query) return all;
    return all.filter((c) => c.title.toLowerCase().includes(query));
  }, [org, q]);

  return (
    <div className="min-h-screen bg-[#F8F9F5] -m-6 md:-m-10 pb-20">
      {/* Premium B2B Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-24 pt-12 md:pt-20">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 200">
            <defs>
              <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <Settings className="w-3 h-3 text-solidroad-accent" />
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Gestão de Experiências</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
                Suas <span className="text-solidroad-accent">Campanhas</span>
              </h1>
              <p className="text-lg text-white/60 font-medium max-w-lg">
                Gerencie todas as suas jornadas de endomarketing e acompanhe o engajamento do time.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/b2b/campanhas/nova")}
              className="flex items-center gap-2 px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl bg-solidroad-accent text-solidroad-text"
            >
              <Plus className="w-5 h-5 stroke-[3px]" />
              NOVA CAMPANHA
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-[1600px] -mt-10 relative z-20">
        {/* Floating Search and View Toggle Wrapper */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search Bar - Floating Style */}
          <motion.div
            className="flex-1 bg-white rounded-[2rem] shadow-[0_16px_48px_rgba(0,0,0,0.1)] p-5 md:p-6 flex items-center gap-4 border border-[rgba(0,0,0,0.04)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-solidroad-beige/40 flex items-center justify-center">
              <Search className="w-6 h-6 text-[#F9A03F]" strokeWidth={2.5} />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Qual campanha você procura?"
              className="flex-1 bg-transparent text-[#1A3E3A] placeholder:text-[#9CA3AF] focus:outline-none font-bold text-lg"
            />
          </motion.div>

          {/* View Toggle - Floating Style */}
          <motion.div
            className="hidden md:flex p-3 rounded-[2rem] bg-[#1A3E3A] shadow-xl items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => setDesktopView("table")}
              className={cn(
                "flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                desktopView === "table"
                  ? "bg-solidroad-accent text-solidroad-text"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <List className="w-4 h-4" strokeWidth={3} />
              Tabela
            </button>
            <button
              onClick={() => setDesktopView("kanban")}
              className={cn(
                "flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                desktopView === "kanban"
                  ? "bg-solidroad-accent text-solidroad-text"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <Grid3X3 className="w-4 h-4" strokeWidth={3} />
              Kanban
            </button>
          </motion.div>
        </div>

        <div className="mt-12">
          {/* Mobile Cards */}
          <div className="grid grid-cols-1 md:hidden gap-4">
            {campaigns.map((c, idx) => (
              <motion.div
                key={c.id}
                className={cn("rounded-3xl p-6 border cursor-pointer group relative shadow-sm hover:shadow-md transition-all", CARD_COLORS[idx % CARD_COLORS.length])}
                onClick={() => navigate(`/b2b/campanhas/${c.id}`)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-lg truncate mb-1 text-solidroad-text dark:text-white">
                      {c.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-solidroad-text/60 dark:text-white/40 font-medium">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg uppercase tracking-wider text-[10px] font-bold border border-black/5 dark:border-white/10",
                          c.status === 'active'
                            ? "bg-white/50 dark:bg-black/20 text-solidroad-text dark:text-white"
                            : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                        )}
                      >
                        {c.status === 'active' ? 'Ativo' : c.status}
                      </span>
                      <span>•</span>
                      <span>{c.duration} dias</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 -mr-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-solidroad-text/40"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl p-2 shadow-xl bg-white dark:bg-[#163316] border-border/10 dark:border-white/10"
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/b2b/campanhas/${c.id}`);
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-white/5"
                      >
                        <Eye className="w-4 h-4 text-solidroad-text dark:text-white/80" />
                        <span className="text-sm font-medium text-solidroad-text dark:text-white/80">Ver Detalhes</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-white/5">
                        <Edit2 className="w-4 h-4 text-solidroad-text dark:text-white/80" />
                        <span className="text-sm font-medium text-solidroad-text dark:text-white/80">Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/10 dark:bg-white/10" />
                      <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats row */}
                <div className="mt-6 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
                  <div className="flex gap-4 text-xs font-semibold text-solidroad-text/60 dark:text-white/40">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-solidroad-text dark:text-white leading-none">{c.stats.views}</span>
                      <span className="text-[10px] uppercase tracking-widest mt-0.5 opacity-60">Views</span>
                    </div>
                    <div className="w-px h-8 bg-black/5 dark:bg-white/5 mx-2" />
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-solidroad-text dark:text-white leading-none">{c.stats.opens}</span>
                      <span className="text-[10px] uppercase tracking-widest mt-0.5 opacity-60">Opens</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/40 dark:bg-white/10 flex items-center justify-center transition-transform active:scale-95">
                    <ArrowRight className="w-5 h-5 text-solidroad-text dark:text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Table/Kanban */}
          <div className="hidden md:block min-h-[400px]">
            {desktopView === "table" ? (
              <B2BCampaignsTable campaigns={campaigns} onOpen={(id) => navigate(`/b2b/campanhas/${id}`)} />
            ) : (
              <B2BCampaignsKanban campaigns={campaigns} onOpen={(id) => navigate(`/b2b/campanhas/${id}`)} />
            )}
          </div>

          {/* Empty State */}
          {campaigns.length === 0 && (
            <div className="rounded-[2.5rem] p-16 border-2 border-dashed border-border/10 text-center bg-white/50 dark:bg-white/5">
              <div className="w-20 h-20 bg-solidroad-beige dark:bg-solidroad-beige-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Megaphone className="w-10 h-10 text-solidroad-text dark:text-solidroad-accent opacity-40" />
              </div>
              <h2 className="font-bold text-xl mb-2 text-solidroad-text dark:text-white">
                Nenhuma campanha encontrada
              </h2>
              <p className="text-base mb-8 text-muted-foreground/60 dark:text-white/40 max-w-sm mx-auto">
                {q ? `Não encontramos nada para "${q}". Tente outro termo.` : "Sua organização ainda não tem campanhas ativas. Que tal começar agora?"}
              </p>
              <button
                onClick={() => navigate("/b2b/campanhas/nova")}
                className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-solidroad-accent text-solidroad-text shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Criar Primeira Campanha
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Archive,
  Trash2,
  BarChart2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";
import B2BCampaignsTable from "@/components/b2b/B2BCampaignsTable";
import B2BCampaignsKanban from "@/components/b2b/B2BCampaignsKanban";

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
    <div className="space-y-4">
      <B2BPageHeader
        title="Campanhas"
        subtitle="Gerencie todas as suas campanhas"
        actions={
          <button
            onClick={() => navigate("/b2b/campanhas/nova")}
            className="btn-festive py-3 px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-center">
        <div className="bg-card rounded-2xl p-3 shadow-card flex items-center gap-3 lg:col-span-8">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar campanhas..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Desktop: toggle de visualização */}
        <div className="hidden lg:flex lg:col-span-4 lg:justify-end gap-2">
          <button
            onClick={() => setDesktopView("table")}
            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${desktopView === "table"
              ? "bg-secondary text-secondary-foreground border-transparent"
              : "bg-background text-foreground/80 border-border hover:bg-muted"
              }`}
          >
            Tabela
          </button>
          <button
            onClick={() => setDesktopView("kanban")}
            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${desktopView === "kanban"
              ? "bg-secondary text-secondary-foreground border-transparent"
              : "bg-background text-foreground/80 border-border hover:bg-muted"
              }`}
          >
            Kanban
          </button>
        </div>
      </div>

      {/* Mobile/Tablet: cards como já era */}
      <div className="grid grid-cols-1 lg:hidden gap-3">
        {campaigns.map((c, idx) => (
          <motion.button
            key={c.id}
            onClick={() => navigate(`/b2b/campanhas/${c.id}`)}
            className="bg-card rounded-2xl p-4 shadow-card text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.status.toUpperCase()} • {c.duration} dias</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 -mr-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border/50 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">
                      Ações da Campanha
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/b2b/campanhas/${c.id}`);
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">Ver Detalhes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">Relatório Full</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group">
                      <Edit2 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">Editar Setup</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-orange-500/10 text-orange-500 transition-colors group">
                      <Archive className="w-4 h-4" />
                      <span className="text-sm font-bold">Arquivar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-rose-500/10 text-rose-500 transition-colors group"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-bold">Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {c.theme.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span><span className="font-semibold text-foreground">{c.stats.views}</span> views</span>
              <span><span className="font-semibold text-foreground">{c.stats.opens}</span> aberturas</span>
              <span><span className="font-semibold text-foreground">{c.stats.leads}</span> leads</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Desktop: tabela/kanban */}
      <div className="hidden lg:block">
        {desktopView === "table" ? (
          <B2BCampaignsTable campaigns={campaigns} onOpen={(id) => navigate(`/b2b/campanhas/${id}`)} />
        ) : (
          <B2BCampaignsKanban campaigns={campaigns} onOpen={(id) => navigate(`/b2b/campanhas/${id}`)} />
        )}
      </div>

      {campaigns.length === 0 && (
        <div className="bg-card rounded-3xl p-8 shadow-card text-center">
          <p className="font-bold text-foreground text-lg">Nenhuma campanha encontrada</p>
          <p className="text-sm text-muted-foreground mt-1">Crie uma nova campanha para começar.</p>
        </div>
      )}
    </div>
  );
}


import type { B2BCampaign } from "@/lib/offline/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
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
import { useNavigate } from "react-router-dom";

type Props = {
  campaigns: B2BCampaign[];
  onOpen: (id: string) => void;
};

const statusLabel: Record<B2BCampaign["status"], string> = {
  draft: "Rascunho",
  active: "Ativa",
  archived: "Arquivada",
};

export default function B2BCampaignsTable({ campaigns, onOpen }: Props) {
  const navigate = useNavigate();
  return (
    <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campanha</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tema</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Aberturas</TableHead>
            <TableHead className="text-right">Leads</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((c) => (
            <TableRow key={c.id} className="cursor-pointer" onClick={() => onOpen(c.id)}>
              <TableCell>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.duration} dias</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {statusLabel[c.status]}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-muted text-foreground">
                  {c.theme.toUpperCase()}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold text-foreground">{c.stats.views}</TableCell>
              <TableCell className="text-right font-semibold text-foreground">{c.stats.opens}</TableCell>
              <TableCell className="text-right font-semibold text-foreground">{c.stats.leads}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border/50 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">
                      Ações da Campanha
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onOpen(c.id)} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group">
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
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-rose-500/10 text-rose-500 transition-colors group" onClick={(e) => { e.stopPropagation(); /* Logic for delete */ }}>
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-bold">Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {campaigns.length === 0 && (
        <div className="p-8 text-center border-t border-border bg-background/30">
          <p className="font-bold text-foreground">Nenhuma campanha ainda</p>
          <p className="text-sm text-muted-foreground mt-1">Crie sua primeira campanha para começar a medir resultados.</p>
        </div>
      )}
    </div>
  );
}

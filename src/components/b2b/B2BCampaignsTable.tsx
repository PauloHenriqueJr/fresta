import type { B2BCampaign } from "@/lib/offline/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  BarChart2,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    <div className="rounded-2xl border border-border/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-[#F9F9F9] dark:bg-white/5">
          <TableRow className="hover:bg-transparent border-border/5">
            <TableHead className="py-4 text-[#0E220E] dark:text-white/60 font-bold uppercase text-[10px] tracking-widest pl-6">Campanha</TableHead>
            <TableHead className="py-4 text-[#0E220E] dark:text-white/60 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
            <TableHead className="py-4 text-[#0E220E] dark:text-white/60 font-bold uppercase text-[10px] tracking-widest">Tema</TableHead>
            <TableHead className="py-4 text-[#0E220E] dark:text-white/60 font-bold uppercase text-[10px] tracking-widest text-right">Views</TableHead>
            <TableHead className="py-4 text-[#0E220E] dark:text-white/60 font-bold uppercase text-[10px] tracking-widest text-right">Aberturas</TableHead>
            <TableHead className="py-4 text-[#0E220E] dark:text-white/60 font-bold uppercase text-[10px] tracking-widest text-right">Engajamento</TableHead>
            <TableHead className="py-4 text-right pr-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((c) => (
            <TableRow
              key={c.id}
              className="group cursor-pointer border-border/5 hover:bg-[#F9F9F9] dark:hover:bg-white/5 transition-colors"
              onClick={() => onOpen(c.id)}
            >
              <TableCell className="py-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F6D045] flex items-center justify-center font-bold text-[#0E220E] shrink-0">
                    {c.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0E220E] dark:text-white truncate lg:max-w-[200px]">{c.title}</p>
                    <p className="text-[10px] font-medium text-muted-foreground/60 dark:text-white/30 uppercase">{c.duration} dias de jornada</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={cn(
                  "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                  c.status === 'active' ? "bg-[#E8F5E0] text-[#2D7A5F]" : "bg-muted dark:bg-white/10 text-muted-foreground/60"
                )}>
                  {statusLabel[c.status]}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F6D045]" />
                  <span className="text-xs font-bold text-[#0E220E] dark:text-white/80 uppercase tracking-tight">
                    {c.theme}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-black text-[#0E220E] dark:text-white/90">{c.stats.views}</TableCell>
              <TableCell className="text-right font-black text-[#0E220E] dark:text-white/90">{c.stats.opens}</TableCell>
              <TableCell className="text-right font-black text-[#0E220E] dark:text-white/90">{c.stats.leads}</TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 text-muted-foreground/40 transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#163316] border border-border/10 rounded-xl p-2 shadow-xl">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(c.id);
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-white/5"
                      >
                        <Eye className="w-4 h-4 text-[#0E220E] dark:text-white" />
                        <span className="text-sm font-bold text-[#0E220E] dark:text-white">Ver Detalhes</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-white/5">
                        <Edit2 className="w-4 h-4 text-[#0E220E] dark:text-white" />
                        <span className="text-sm font-bold text-[#0E220E] dark:text-white">Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/10" />
                      <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-bold">Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

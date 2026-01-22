import type { B2BCampaign } from "@/lib/offline/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

import { useMemo } from "react";
import type { B2BCampaign } from "@/lib/offline/types";

type Props = {
  campaigns: B2BCampaign[];
  onOpen: (id: string) => void;
};

const columns: { key: B2BCampaign["status"]; label: string }[] = [
  { key: "draft", label: "Rascunho" },
  { key: "active", label: "Ativa" },
  { key: "archived", label: "Arquivada" },
];

export default function B2BCampaignsKanban({ campaigns, onOpen }: Props) {
  const byStatus = useMemo(() => {
    const map = new Map<B2BCampaign["status"], B2BCampaign[]>();
    columns.forEach((c) => map.set(c.key, []));
    for (const c of campaigns) {
      map.get(c.status)?.push(c);
    }
    return map;
  }, [campaigns]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((col) => {
        const list = byStatus.get(col.key) ?? [];
        return (
          <section key={col.key} className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
            <header className="px-4 py-3 border-b border-border bg-background/40">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">{col.label}</p>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {list.length}
                </span>
              </div>
            </header>

            <div className="p-3 space-y-3">
              {list.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onOpen(c.id)}
                  className="w-full text-left rounded-2xl border border-border bg-background p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.theme.toUpperCase()} • {c.duration} dias</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-secondary text-secondary-foreground shrink-0">
                      {c.stats.views} views
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span><span className="font-semibold text-foreground">{c.stats.opens}</span> aberturas</span>
                    <span><span className="font-semibold text-foreground">{c.stats.leads}</span> leads</span>
                  </div>
                </button>
              ))}

              {list.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">Nada aqui ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">Quando você criar campanhas, elas vão aparecer nesta coluna.</p>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

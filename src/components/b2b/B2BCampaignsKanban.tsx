import { useMemo } from "react";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, Archive, Eye, MousePointer2, Layout } from "lucide-react";

type Props = {
  campaigns: Tables<'b2b_campaigns'>[];
  onOpen: (id: string) => void;
};

const columns: { key: Tables<'b2b_campaigns'>["status"]; label: string; icon: any; color: string }[] = [
  { key: "draft", label: "Rascunho", icon: Clock, color: "text-muted-foreground" },
  { key: "active", label: "Ativa", icon: CheckCircle2, color: "text-[#2D7A5F]" },
  { key: "archived", label: "Arquivada", icon: Archive, color: "text-muted-foreground/60" },
];

export default function B2BCampaignsKanban({ campaigns, onOpen }: Props) {
  const byStatus = useMemo(() => {
    const map = new Map<Tables<'b2b_campaigns'>["status"], Tables<'b2b_campaigns'>[]>();
    columns.forEach((c) => map.set(c.key, []));
    for (const c of campaigns) {
      map.get(c.status)?.push(c);
    }
    return map;
  }, [campaigns]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const list = byStatus.get(col.key) ?? [];
        return (
          <section key={col.key} className="flex flex-col h-full min-h-[500px]">
            <header className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <col.icon className={cn("w-4 h-4", col.color)} />
                <h3 className="text-sm font-bold text-[#0E220E] dark:text-white uppercase tracking-widest">{col.label}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-white/5 border border-border/10 text-[10px] font-black text-[#0E220E] dark:text-white/60">
                {list.length}
              </span>
            </header>

            <div className="flex-1 space-y-3 p-2 bg-[#F1F1F1] dark:bg-black/20 rounded-2xl border border-border/5">
              {list.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onOpen(c.id)}
                  className="w-full text-left rounded-xl bg-white dark:bg-[#1C331C] p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all border border-border/5 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <p className="font-bold text-[#0E220E] dark:text-white truncate group-hover:text-[#F6D045] transition-colors">{c.title}</p>
                      <p className="text-[10px] font-medium text-muted-foreground/60 dark:text-white/30 uppercase mt-0.5">{(c as any).theme_id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-border/5">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">Views</p>
                      <p className="text-sm font-black text-[#0E220E] dark:text-white">{(c as any).views || 0}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">Opens</p>
                      <p className="text-sm font-black text-[#0E220E] dark:text-white">{(c as any).opens || 0}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">Leads</p>
                      <p className="text-sm font-black text-[#0E220E] dark:text-white">{(c as any).leads || 0}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/30">{c.duration} dias</span>
                    <div className="w-6 h-6 rounded-lg bg-[#F6D045]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Layout className="w-3 h-3 text-[#F6D045]" />
                    </div>
                  </div>
                </button>
              ))}

              {list.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-border/10 rounded-xl">
                  <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-relaxed">
                    Vazio
                  </p>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

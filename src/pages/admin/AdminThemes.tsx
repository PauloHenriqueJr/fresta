import { useMemo, useState } from "react";
import { db } from "@/lib/offline/db";
import type { ThemeDefinition, ThemeScope } from "@/lib/offline/types";
import { groupLabel } from "@/lib/offline/themes";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";

const scopeOptions: { value: ThemeScope; label: string }[] = [
  { value: "common", label: "Comum" },
  { value: "b2c", label: "B2C" },
  { value: "b2b", label: "B2B" },
];

export default function AdminThemes() {
  const { settings, updateSetting, isLoading } = useGlobalSettings();
  const [refresh, setRefresh] = useState(0);
  const themes = useMemo(() => {
    void refresh;
    return db.listThemes();
  }, [refresh]);

  const grouped = useMemo(() => {
    const map = new Map<ThemeScope, ThemeDefinition[]>();
    for (const t of themes) {
      map.set(t.scope, [...(map.get(t.scope) ?? []), t]);
    }
    return Array.from(map.entries());
  }, [themes]);

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Gerenciar temas</h1>
        <p className="text-muted-foreground font-medium mt-2">
          Controle total sobre a aparência do Fresta.
        </p>
      </div>

      <div className="space-y-8">
        {grouped.map(([scope, list]) => (
          <section key={scope} className="space-y-4">
            <h2 className="text-xl font-black text-foreground uppercase tracking-widest pl-2 border-l-4 border-primary/50">
              {groupLabel[scope]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {list.map((t) => (
                <div
                  key={t.id}
                  className={`bg-card rounded-[2rem] p-6 shadow-card border border-border/50 relative overflow-hidden group hover:shadow-festive transition-all hover:-translate-y-1 ${settings.activeTheme === t.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
                >
                  {/* Active Indicator */}
                  {settings.activeTheme === t.id && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm z-10">
                      Ativo Globalment
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl shadow-inner">
                      {t.emoji}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ID</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded-full font-mono text-foreground">{t.id}</code>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Nome de Exibição</label>
                      <input
                        className="w-full p-2 bg-background/50 border border-border rounded-xl text-foreground font-bold focus:outline-none focus:border-primary focus:bg-background transition-colors"
                        value={t.name}
                        onChange={(e) => {
                          db.updateTheme(t.id, { name: e.target.value });
                          setRefresh((x) => x + 1);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Emoji</label>
                        <input
                          className="w-full p-2 bg-background/50 border border-border rounded-xl text-foreground font-bold text-center focus:outline-none focus:border-primary focus:bg-background transition-colors"
                          value={t.emoji}
                          onChange={(e) => {
                            db.updateTheme(t.id, { emoji: e.target.value });
                            setRefresh((x) => x + 1);
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Default</label>
                        <button
                          className={`w-full p-2 rounded-xl border text-xs font-bold transition-colors ${t.enabledByDefault ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-background border-border text-muted-foreground"
                            }`}
                          onClick={() => {
                            db.updateTheme(t.id, { enabledByDefault: !t.enabledByDefault });
                            setRefresh((x) => x + 1);
                          }}
                        >
                          {t.enabledByDefault ? "ATIVO" : "INATIVO"}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <button
                        className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${settings.activeTheme === t.id
                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                            : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        onClick={() => updateSetting("active_theme", t.id)}
                        disabled={isLoading}
                      >
                        {settings.activeTheme === t.id ? "Em Uso Agora" : "Usar este Tema"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

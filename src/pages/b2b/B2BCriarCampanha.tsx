import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import type { ThemeId } from "@/lib/offline/types";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";

const durationOptions = [7, 12, 24, 30];
const themes: { id: ThemeId; label: string; emoji: string }[] = [
  { id: "carnaval", label: "Carnaval", emoji: "🎭" },
  { id: "saojoao", label: "São João", emoji: "🔥" },
  { id: "natal", label: "Natal", emoji: "🎄" },
];

export default function B2BCriarCampanha() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<ThemeId>("carnaval");
  const [duration, setDuration] = useState(24);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const org = useMemo(() => (profile ? db.getB2BOrgByOwner(profile.id) : null), [profile]);

  const canCreate = title.trim().length > 0 && !!org;

  const handleCreate = () => {
    if (!org) return;
    const created = db.createB2BCampaign({
      orgId: org.id,
      title: title.trim(),
      theme,
      duration,
      startDate: startDate || undefined,
    });
    navigate(`/b2b/campanhas/${created.id}`);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <B2BPageHeader title="Nova campanha" subtitle="Wizard B2B (offline)" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-3xl p-6 shadow-card">
          <label className="font-bold text-foreground">Nome da campanha</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Carnaval para Clientes 2026"
            className="mt-2 w-full p-4 bg-background border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-card">
          <label className="font-bold text-foreground">Tema</label>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  theme === t.id ? "border-primary bg-secondary" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{t.emoji}</span>
                  {theme === t.id && (
                    <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </span>
                  )}
                </div>
                <p className="font-bold text-foreground mt-2">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-card">
          <label className="font-bold text-foreground">Duração</label>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {durationOptions.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  duration === d ? "border-primary bg-secondary" : "border-border bg-background"
                }`}
              >
                <span className="font-bold text-foreground">{d} dias</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-card">
          <label className="font-bold text-foreground">Data de início (opcional)</label>
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            className="mt-2 w-full p-4 bg-background border-2 border-border rounded-2xl text-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <motion.button
          disabled={!canCreate}
          onClick={handleCreate}
          className={`btn-festive w-full ${!canCreate ? "opacity-50 cursor-not-allowed" : ""}`}
          whileHover={canCreate ? { scale: 1.01 } : {}}
          whileTap={canCreate ? { scale: 0.98 } : {}}
        >
          Criar campanha
        </motion.button>
      </div>
    </div>
  );
}

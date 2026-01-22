import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import { useToast } from "@/hooks/use-toast";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";

const logoOptions = ["🏢", "🎉", "🎭", "🔥", "🎄", "⭐", "🎁", "🚀"]; 

export default function B2BBranding() {
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const org = useMemo(() => (profile ? db.getB2BOrgByOwner(profile.id) : null), [profile]);
  const branding = useMemo(() => (org ? db.getB2BBranding(org.id) : null), [org]);

  const [logoEmoji, setLogoEmoji] = useState("🏢");
  const [primaryHue, setPrimaryHue] = useState(145);

  useEffect(() => {
    if (!branding) return;
    setLogoEmoji(branding.logoEmoji);
    setPrimaryHue(branding.primaryHue);
  }, [branding]);

  const handleSave = () => {
    if (!org) return;
    db.updateB2BBranding(org.id, { logoEmoji, primaryHue });
    toast({ title: "Branding salvo!", description: "Configurações salvas localmente (offline)." });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <B2BPageHeader title="Branding" subtitle="Configurações de marca (offline)" />

      <div className="bg-card rounded-3xl p-6 shadow-card">
        <h2 className="font-bold text-foreground">Logo (emoji)</h2>
        <p className="text-sm text-muted-foreground mt-1">Mantém a pegada de avatar/emoji do produto.</p>
        <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2">
          {logoOptions.map((e) => (
            <button
              key={e}
              onClick={() => setLogoEmoji(e)}
              className={`h-12 rounded-2xl border-2 flex items-center justify-center ${
                logoEmoji === e ? "border-primary bg-secondary" : "border-border bg-background"
              }`}
            >
              <span className="text-xl">{e}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-card">
        <h2 className="font-bold text-foreground">Cor primária (hue)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Salvo como número (0–360) para facilitar migração futura para backend.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={360}
            value={primaryHue}
            onChange={(e) => setPrimaryHue(parseInt(e.target.value, 10))}
            className="flex-1"
          />
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center border border-border">
            <span className="text-sm font-bold text-foreground">{primaryHue}</span>
          </div>
        </div>
      </div>

      <motion.button
        className="btn-festive"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
      >
        Salvar branding
      </motion.button>
    </div>
  );
}

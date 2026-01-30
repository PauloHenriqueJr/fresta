import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Palette, Sparkles, Save, Building2, PartyPopper, Flame, TreePine, Star, Gift, Rocket } from "lucide-react";
import { PlusIcon } from "@/components/PremiumIcon";

const logoOptions = ["Building2", "PartyPopper", "Music", "Flame", "TreePine", "Star", "Gift", "Rocket"];

export default function B2BBranding() {
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const org = useMemo(() => (profile ? db.getB2BOrgByOwner(profile.id) : null), [profile]);
  const branding = useMemo(() => (org ? db.getB2BBranding(org.id) : null), [org]);

  const [logoIconName, setLogoIconName] = useState("Building2");
  const [primaryHue, setPrimaryHue] = useState(145);

  useEffect(() => {
    if (!branding) return;
    setLogoIconName(branding.logoIconName);
    setPrimaryHue(branding.primaryHue);
  }, [branding]);

  const handleSave = () => {
    if (!org) return;
    db.updateB2BBranding(org.id, { logoIconName, primaryHue });
    toast({ title: "Branding salvo!", description: "Configurações de marca atualizadas com sucesso." });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
          Branding
        </h1>
        <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
          Personalize a identidade da sua organização no Fresta
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Logo Section */}
        <div className="rounded-[2.5rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-solidroad-accent/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-solidroad-accent" />
            </div>
            <h2 className="text-xl font-black text-solidroad-text dark:text-white">Identidade Visual</h2>
          </div>
          <p className="text-sm text-muted-foreground/60 dark:text-white/40 max-w-md">
            Escolha o ícone que melhor representa sua empresa. Ele será exibido em todos os convites e dashboards.
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {logoOptions.map((iconName) => (
              <button
                key={iconName}
                onClick={() => setLogoIconName(iconName)}
                className={cn(
                  "w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95",
                  logoIconName === iconName
                    ? "border-solidroad-accent bg-solidroad-accent/10 shadow-md"
                    : "border-border/5 dark:border-white/5 bg-[#F9F9F9] dark:bg-black/20 hover:border-solidroad-accent/30"
                )}
              >
                <PlusIcon name={iconName} className={cn("w-8 h-8", logoIconName === iconName ? "text-solidroad-accent" : "text-muted-foreground/60")} />
              </button>
            ))}
          </div>
        </div>

        {/* Color Section */}
        <div className="rounded-[2.5rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-solidroad-accent/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-solidroad-accent" />
            </div>
            <h2 className="text-xl font-black text-solidroad-text dark:text-white">Cores da Marca</h2>
          </div>
          <p className="text-sm text-muted-foreground/60 dark:text-white/40 max-w-md">
            Ajuste o matiz (hue) para que os elementos da interface combinem com sua marca institucional.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-8">
              <input
                type="range"
                min={0}
                max={360}
                value={primaryHue}
                onChange={(e) => setPrimaryHue(parseInt(e.target.value, 10))}
                className="flex-1 h-3 rounded-full appearance-none bg-gradient-to-r from-red-500 via-green-500 to-blue-500 cursor-pointer accent-white"
              />
              <div
                className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-4 border-white dark:border-white/10 shadow-xl relative overflow-hidden"
                style={{ backgroundColor: `hsl(${primaryHue}, 70%, 50%)` }}
              >
                <div className="absolute inset-0 bg-white/20 blur-lg" />
                <span className="relative text-sm font-black text-white drop-shadow-md z-10">{primaryHue}°</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 h-4 rounded-xl overflow-hidden opacity-80 border border-white/20">
              <div style={{ backgroundColor: `hsl(${primaryHue}, 80%, 40%)` }} />
              <div style={{ backgroundColor: `hsl(${primaryHue}, 70%, 50%)` }} />
              <div style={{ backgroundColor: `hsl(${primaryHue}, 60%, 70%)` }} />
            </div>
          </div>
        </div>
      </div>

      <motion.button
        className="fixed bottom-8 right-8 md:static md:w-auto px-10 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl bg-solidroad-accent text-solidroad-text z-50 flex items-center gap-3"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
      >
        <Save className="w-5 h-5" />
        Salvar Branding
      </motion.button>
    </div>
  );
}

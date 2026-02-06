import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Calendar as CalendarIcon, Sparkles, Flame, Snowflake, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { B2BRepository } from "@/lib/data/B2BRepository";

type ThemeId = "carnaval" | "saojoao" | "natal";

const durationOptions = [7, 12, 18, 24, 30];
const themes: { id: ThemeId; label: string; Icon: React.ElementType; color: string }[] = [
  { id: "carnaval", label: "Carnaval", Icon: Sparkles, color: "bg-purple-500" },
  { id: "saojoao", label: "São João", Icon: Flame, color: "bg-orange-500" },
  { id: "natal", label: "Natal", Icon: Snowflake, color: "bg-red-500" },
];

export default function B2BCriarCampanha() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<ThemeId>("carnaval");
  const [duration, setDuration] = useState(24);
  const [startDate, setStartDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      if (!profile) return;
      setLoading(true);
      try {
        const ensured = await B2BRepository.ensureOrgForOwner({
          ownerId: profile.id,
          ownerEmail: (profile as any).email,
          ownerName: (profile as any).display_name,
        });
        setOrg(ensured);
      } catch (e) {
        console.error("B2BCriarCampanha load error:", e);
        setOrg(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [profile]);

  const canCreate = title.trim().length > 0 && !!org;

  const handleCreate = async () => {
    if (!org) return;
    try {
      const created = await B2BRepository.createCampaign({
        orgId: (org as any).id,
        title: title.trim(),
        themeId: theme,
        duration,
        startDate: startDate || null,
      });
      navigate(`/b2b/campanhas/${(created as any).id}`);
    } catch (e) {
      console.error("B2BCriarCampanha create error:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F6D045]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-border/10 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-solidroad-text dark:text-white hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-solidroad-text dark:text-solidroad-accent">
            Nova Campanha
          </h1>
          <p className="mt-1 text-lg text-muted-foreground/80 dark:text-white/40">
            Crie uma nova jornada gamificada para seus colaboradores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Step 1: Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 shadow-sm space-y-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-12 rounded-2xl bg-solidroad-accent flex items-center justify-center text-lg font-black text-solidroad-text shadow-lg shadow-solidroad-accent/20">1</span>
            <div>
              <h2 className="text-xl font-black text-solidroad-text dark:text-white">Informações Básicas</h2>
              <p className="text-sm text-muted-foreground/60">Defina o nome da sua campanha</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Nome da Campanha</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Integração Novos Talentos 2026"
              className="w-full px-6 py-5 rounded-2xl border border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white focus:outline-none focus:ring-4 focus:ring-solidroad-accent/10 border-transparent focus:border-solidroad-accent/50 font-bold transition-all text-xl placeholder:text-muted-foreground/30"
            />
          </div>
        </motion.div>

        {/* Step 2: Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 shadow-sm space-y-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-12 rounded-2xl bg-solidroad-accent flex items-center justify-center text-lg font-black text-solidroad-text shadow-lg shadow-solidroad-accent/20">2</span>
            <div>
              <h2 className="text-xl font-black text-solidroad-text dark:text-white">Identidade Visual</h2>
              <p className="text-sm text-muted-foreground/60">Escolha o tema da experiência</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "p-8 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group h-full flex flex-col justify-between min-h-[180px]",
                  theme === t.id
                    ? "border-solidroad-accent bg-solidroad-accent/5 shadow-xl shadow-solidroad-accent/10"
                    : "border-border/5 dark:border-white/5 bg-[#F9F9F9] dark:bg-black/20 hover:border-solidroad-accent/30 hover:bg-solidroad-accent/5"
                )}
              >
                <div className="flex items-start justify-between relative z-10 w-full mb-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm",
                    theme === t.id ? "bg-solidroad-accent text-solidroad-text" : "bg-white dark:bg-white/10 text-muted-foreground"
                  )}>
                    <t.Icon className="w-8 h-8" strokeWidth={2} />
                  </div>

                  {theme === t.id && (
                    <motion.div
                      layoutId="theme-check"
                      className="w-8 h-8 rounded-full bg-solidroad-accent flex items-center justify-center shadow-md"
                    >
                      <Check className="w-4 h-4 text-solidroad-text" strokeWidth={4} />
                    </motion.div>
                  )}
                </div>
                <div className="relative z-10 mt-auto">
                  <p className={cn("font-black text-2xl", theme === t.id ? "text-solidroad-text dark:text-white" : "text-solidroad-text/60 dark:text-white/40")}>
                    {t.label}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground/50 mt-1">Tema Premium</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 3: Config */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[2rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 shadow-sm space-y-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-12 rounded-2xl bg-solidroad-accent flex items-center justify-center text-lg font-black text-solidroad-text shadow-lg shadow-solidroad-accent/20">3</span>
            <div>
              <h2 className="text-xl font-black text-solidroad-text dark:text-white">Configurações</h2>
              <p className="text-sm text-muted-foreground/60">Duração e agendamento</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Duração da Jornada (Dias)</label>
              <div className="flex flex-wrap gap-3">
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "w-16 h-16 rounded-2xl border-2 font-black text-lg transition-all flex items-center justify-center",
                      duration === d
                        ? "bg-solidroad-accent text-solidroad-text border-solidroad-accent shadow-lg shadow-solidroad-accent/20 scale-110"
                        : "bg-[#F9F9F9] dark:bg-black/20 border-transparent text-muted-foreground hover:bg-solidroad-accent/10 hover:text-solidroad-text"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-dashed border-border/10">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Data de Lançamento (Opcional)</label>
              <div className="relative max-w-sm">
                <DatePicker
                  date={startDate ? new Date(startDate) : undefined}
                  setDate={(date) => setStartDate(date ? date.toISOString().split('T')[0] : "")}
                  placeholder="Agendar lançamento..."
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          disabled={!canCreate}
          onClick={handleCreate}
          className={cn(
            "w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 mt-4 mb-20",
            canCreate
              ? "bg-solidroad-accent text-solidroad-text hover:shadow-solidroad-accent/30 hover:-translate-y-1 hover:scale-[1.01]"
              : "bg-muted dark:bg-white/5 text-muted-foreground/40 opacity-50 cursor-not-allowed border border-border/10"
          )}
          whileTap={canCreate ? { scale: 0.98 } : {}}
        >
          <Sparkles className="w-6 h-6 fill-current" />
          Concluir e Criar Campanha
        </motion.button>
      </div>
    </div>
  );
}

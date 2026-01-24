import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar as CalendarIcon,
  Palette,
  Check,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import mascotNoivado from "@/assets/mascot-noivado.jpg";
import mascotPeeking from "@/assets/mascot-peeking.png";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotBodas from "@/assets/mascot-bodas.jpg";
import mascotNatal from "@/assets/mascot-natal.jpg";
import mascotReveillon from "@/assets/mascot-reveillon.jpg";
import mascotPascoa from "@/assets/mascot-pascoa.jpg";
import mascotIndependencia from "@/assets/mascot-independencia.jpg";
import mascotNamoro from "@/assets/mascot-namoro.jpg";
import mascotCasamento from "@/assets/mascot-casamento.jpg";
import mascotDiaDasCriancas from "@/assets/mascot-diadascriancas.jpg";
import mascotDiaDasMaes from "@/assets/mascot-diadasmaes.jpg";
import mascotDiaDosPais from "@/assets/mascot-diadospais.jpg";
import mascotViagem from "@/assets/mascot-viagem.jpg";
import mascotMetas from "@/assets/mascot-metas.jpg";
import mascotEstudos from "@/assets/mascot-estudo.jpg";
import mascotAniversario from "@/assets/mascot-aniversario.jpg";
import { useAuth } from "@/state/auth/AuthProvider";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import type { ThemeDefinition, ThemeId } from "@/lib/offline/types";
import { BASE_THEMES } from "@/lib/offline/themes";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { getThemeConfig } from "@/lib/themes/registry";

const themeImageByKey: Record<ThemeDefinition["imageKey"], string> = {
  noivado: mascotNoivado,
  peeking: mascotPeeking,
  bodas: mascotBodas,
  carnaval: mascotCarnaval,
  saojoao: mascotSaoJoao,
  natal: mascotNatal,
  reveillon: mascotReveillon,
  pascoa: mascotPascoa,
  independencia: mascotIndependencia,
  namoro: mascotNamoro,
  casamento: mascotCasamento,
  diadascriancas: mascotDiaDasCriancas,
  diadasmaes: mascotDiaDasMaes,
  diadospais: mascotDiaDosPais,
  viagem: mascotViagem,
  metas: mascotMetas,
  estudos: mascotEstudos,
  aniversario: mascotAniversario,
};

// Na criação B2C, exibimos temas comuns + B2C.
const themes = BASE_THEMES.filter((t) => t.scope !== "b2b");

const durationOptions = [
  { value: 7, label: "7 dias", description: "Uma semana de surpresas" },
  { value: 12, label: "12 dias", description: "Quase duas semanas" },
  { value: 24, label: "24 dias", description: "Calendário clássico" },
  { value: 30, label: "30 dias", description: "Um mês inteiro" },
];

const CriarCalendario = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | "">("");
  const [calendarName, setCalendarName] = useState("");
  const [duration, setDuration] = useState(24);
  const [startDate, setStartDate] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    if (step === 1) return selectedTheme !== "";
    if (step === 2) return calendarName.trim() !== "";
    return true;
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      if (!user) {
        setError('Você precisa estar logado para criar um calendário.');
        return;
      }

      setCreating(true);
      setError(null);

      try {
        const created = await CalendarsRepository.create({
          ownerId: user.id,
          title: calendarName.trim() || "Meu Calendário",
          themeId: selectedTheme as ThemeId,
          duration,
          privacy,
          startDate: startDate || undefined,
        });

        navigate(`/calendario/${created.id}`);
      } catch (err: any) {
        console.error('CriarCalendario: Error creating calendar:', err);
        const message = err?.message || err?.toString() || 'Erro desconhecido';
        setError(`Erro ao criar calendário: ${message}`);
        setCreating(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const selectedThemeData = themes.find((t) => t.id === selectedTheme) ?? null;

  return (
    <div className="min-h-screen pb-32 lg:pb-8 flex flex-col items-center">
      {/* Premium Header */}
      <motion.header
        className="w-full max-w-5xl px-6 py-8 flex items-center justify-between z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-border/10 flex items-center justify-center hover:bg-muted transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-solidroad-text dark:text-white" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-solidroad-text dark:text-white leading-none">Criar Experiência</h1>
            <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Passo {step} de {totalSteps}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn(
              "h-2 rounded-full transition-all duration-500",
              s <= step ? "w-8 bg-solidroad-accent" : "w-2 bg-border/20"
            )} />
          ))}
        </div>
      </motion.header>

      <div className="w-full max-w-5xl px-6 pb-12 flex-1">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Theme */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-solidroad-text dark:text-white">
                  Escolha um Tema
                </h2>
                <p className="text-lg text-muted-foreground/80">
                  Qual é a ocasião especial que vamos celebrar?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={cn(
                      "group relative bg-white dark:bg-white/5 rounded-[2rem] p-4 border-2 text-left transition-all duration-300 overflow-hidden",
                      selectedTheme === theme.id ? "border-solidroad-accent shadow-xl shadow-solidroad-accent/10" : "border-transparent hover:border-solidroad-accent/30 shadow-sm"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn("w-full aspect-[4/3] rounded-2xl mb-4 overflow-hidden relative", theme.gradientClass)}>
                      <img
                        src={themeImageByKey[theme.imageKey]}
                        alt={theme.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl shadow-sm">
                        {theme.emoji}
                      </div>

                      {selectedTheme === theme.id && (
                        <div className="absolute inset-0 bg-solidroad-accent/20 backdrop-blur-[2px] flex items-center justify-center z-10">
                          <div className="w-12 h-12 bg-solidroad-accent rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-6 h-6 text-solidroad-text" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-2 pb-2">
                      <h4 className="text-lg font-bold text-solidroad-text dark:text-white mb-1 group-hover:text-solidroad-accent transition-colors">{theme.name}</h4>
                      <p className="text-sm font-medium text-muted-foreground/60 leading-snug">{theme.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Calendar Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-solidroad-text dark:text-white">
                  Personalizar Experiência
                </h2>
                <p className="text-lg text-muted-foreground/80">
                  Vamos dar um nome e definir a duração.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-8">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Nome do Calendário</label>
                    <input
                      type="text"
                      value={calendarName}
                      onChange={(e) => setCalendarName(e.target.value)}
                      placeholder="Ex: Viagem para Disney 🏖️"
                      className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/5 border-2 border-border/10 text-lg font-bold text-solidroad-text dark:text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-solidroad-accent focus:ring-4 focus:ring-solidroad-accent/10 transition-all"
                      autoFocus
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Data de Início (Opcional)</label>
                    <DatePicker
                      date={startDate ? new Date(startDate) : undefined}
                      setDate={(date) => setStartDate(date ? date.toISOString().split('T')[0] : "")}
                      placeholder="Escolher data de início..."
                    />
                  </div>

                  {/* Privacy */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Visibilidade</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setPrivacy('public')} className={cn("p-4 rounded-2xl border-2 text-left transition-all", privacy === 'public' ? "border-solidroad-accent bg-solidroad-accent/5" : "border-border/10 bg-white dark:bg-white/5")}>
                        <span className="text-sm font-bold text-solidroad-text dark:text-white block mb-0.5">Público</span>
                        <span className="text-xs text-muted-foreground/60">Aparece no Explorar</span>
                      </button>
                      <button onClick={() => setPrivacy('private')} className={cn("p-4 rounded-2xl border-2 text-left transition-all", privacy === 'private' ? "border-solidroad-accent bg-solidroad-accent/5" : "border-border/10 bg-white dark:bg-white/5")}>
                        <span className="text-sm font-bold text-solidroad-text dark:text-white block mb-0.5">Privado</span>
                        <span className="text-xs text-muted-foreground/60">Apenas quem tem o link</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Duração (Portas)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {durationOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDuration(opt.value)}
                        className={cn(
                          "p-6 rounded-[1.5rem] border-2 text-left transition-all group hover:-translate-y-1 hover:shadow-lg",
                          duration === opt.value
                            ? "border-solidroad-accent bg-solidroad-accent text-solidroad-text shadow-solidroad-accent/20"
                            : "border-border/10 bg-white dark:bg-white/5 hover:border-solidroad-accent/30"
                        )}
                      >
                        <span className={cn("text-3xl font-black block mb-1", duration === opt.value ? "text-solidroad-text" : "text-solidroad-text dark:text-white")}>{opt.value}</span>
                        <span className={cn("text-xs font-bold uppercase tracking-wide opacity-80", duration === opt.value ? "text-solidroad-text" : "text-muted-foreground")}>{opt.label}</span>
                        <p className={cn("text-xs mt-2 opacity-60 leading-tight", duration === opt.value ? "text-solidroad-text" : "text-muted-foreground")}>{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-24 h-24 bg-gradient-festive rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-4xl font-black text-solidroad-text dark:text-white mb-4">Tudo Pronto!</h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto mb-12">
                Seu calendário <strong>{calendarName}</strong> está pronto para ser criado.
              </p>

              <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-border/10 w-full max-w-md shadow-xl mb-12">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed border-border/10">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm", selectedThemeData?.gradientClass)}>
                    {selectedThemeData?.emoji}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tema Escolhido</p>
                    <p className="text-xl font-black text-solidroad-text dark:text-white">{selectedThemeData?.name}</p>
                  </div>
                </div>

                {/* Theme Tip for Creator */}
                {(() => {
                  // Dynamic import or assumed implicit import if added to top
                  const themeConfig = getThemeConfig(selectedTheme as string);
                  if (themeConfig.content.usageTip) {
                    return (
                      <div className="mb-6 p-4 bg-solidroad-accent/10 rounded-2xl border border-solidroad-accent/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-solidroad-text/60 mb-1">
                          {themeConfig.content.tipTitle || "Dica do Tema"}
                        </p>
                        <p className="text-xs text-solidroad-text italic font-medium leading-relaxed">
                          "{themeConfig.content.usageTip}"
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Duração</span>
                    <span className="text-base font-black text-solidroad-text dark:text-white">{duration} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Estreia</span>
                    <span className="text-base font-black text-solidroad-text dark:text-white">{startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'Imediata'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Visibilidade</span>
                    <Badge className="bg-solidroad-green text-[#2D7A5F]">{privacy === 'public' ? 'PÚBLICO' : 'PRIVADO'}</Badge>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 font-medium">
                  {error}
                </div>
              )}

              <motion.button
                className={`w-full max-w-md bg-solidroad-accent text-solidroad-text text-lg font-black py-5 rounded-2xl shadow-xl shadow-solidroad-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 ${creating ? "opacity-70 cursor-wait" : ""
                  }`}
                onClick={handleNext}
                disabled={creating}
              >
                {creating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 fill-current" />}
                {creating ? "Criando Mágica..." : "Criar Calendário Agora"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Next/Back Buttons for Step 1 & 2 */}
      {step < 3 && (
        <div className="hidden lg:flex fixed bottom-8 right-8 gap-4">
          <button onClick={handleNext} disabled={!canProceed()} className="px-8 py-4 bg-solidroad-text text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
            Próximo Passo <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0E220E]/90 backdrop-blur-lg border-t border-border/10 lg:hidden z-50">
        <button
          onClick={handleNext}
          disabled={!canProceed() || creating}
          className="w-full bg-solidroad-text text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
        >
          {step === 3 ? "Finalizar Criação" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

// Simple Badge Component for internal use
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", className)}>
    {children}
  </span>
);

export default CriarCalendario;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
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
        console.log('CriarCalendario: Starting creation with:', {
          ownerId: user.id,
          title: calendarName.trim() || "Meu Calendário",
          themeId: selectedTheme,
          duration,
          privacy,
          startDate: startDate || undefined,
        });

        const created = await CalendarsRepository.create({
          ownerId: user.id,
          title: calendarName.trim() || "Meu Calendário",
          themeId: selectedTheme as ThemeId,
          duration,
          privacy,
          startDate: startDate || undefined,
        });

        console.log('CriarCalendario: Success! Created:', created);
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
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header */}
      <motion.header
        className="px-4 py-4 lg:py-10 flex items-center gap-4 max-w-[1600px] lg:mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-foreground">Criar Calendário</h1>
          <p className="text-sm text-muted-foreground">Passo {step} de {totalSteps}</p>
        </div>
      </motion.header>

      {/* Progress Bar */}
      <div className="px-4 mb-8 max-w-[1600px] lg:mx-auto">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-festive rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="px-4 max-w-[1600px] lg:mx-auto pb-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Theme */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground">
                  Escolha o Tema
                </h2>
                <p className="text-muted-foreground mt-2">
                  Qual festa você quer celebrar?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`w-full bg-card rounded-[2rem] p-4 lg:p-6 shadow-card hover:shadow-festive transition-all group relative overflow-hidden flex lg:flex-col items-center gap-4 text-left ${selectedTheme === theme.id ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`w-20 h-20 lg:w-full lg:h-48 rounded-2xl ${theme.gradientClass} flex items-center justify-center overflow-hidden flex-shrink-0 relative transition-transform duration-500 group-hover:scale-105`}
                    >
                      <img
                        src={themeImageByKey[theme.imageKey]}
                        alt={theme.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Desktop Overlay Highlight */}
                      <div className="absolute inset-0 bg-black/0 lg:group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-3 right-3 text-4xl hidden lg:block drop-shadow-md transform transition-transform group-hover:scale-110 duration-300">
                        {theme.emoji}
                      </div>

                      {selectedTheme === theme.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl animate-in zoom-in spin-in-12">
                            <Check className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 lg:w-full">
                      <div className="flex items-center gap-2 mb-1 lg:hidden">
                        <span className="text-2xl">{theme.emoji}</span>
                        <h4 className="text-xl font-bold text-foreground">{theme.name}</h4>
                      </div>
                      <h4 className="text-xl font-bold text-foreground hidden lg:block mb-2">{theme.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {theme.description ?? "Toque para ver o calendário"}
                      </p>
                    </div>

                    {/* Mobile Check */}
                    {selectedTheme === theme.id && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center lg:hidden flex-shrink-0">
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Calendar Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground">
                  Detalhes do Calendário
                </h2>
                <p className="text-muted-foreground mt-2">
                  Personalize sua contagem regressiva
                </p>
              </div>

              {/* Calendar Name */}
              <div className="space-y-2">
                <label className="font-bold text-foreground">
                  Nome do Calendário
                </label>
                <input
                  type="text"
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                  placeholder="Ex: Carnaval da Alegria 2025"
                  className="w-full p-4 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="font-bold text-foreground">
                  Quantos dias?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${duration === option.value
                        ? "border-primary bg-secondary"
                        : "border-border bg-card"
                        }`}
                    >
                      <span className="font-bold text-foreground block">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="font-bold text-foreground">
                  Data de início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-4 bg-card border-2 border-border rounded-2xl text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Privacy */}
              <div className="space-y-2">
                <label className="font-bold text-foreground">Privacidade</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPrivacy("public")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${privacy === "public"
                      ? "border-primary bg-secondary"
                      : "border-border bg-card"
                      }`}
                  >
                    <span className="font-bold text-foreground block">Público</span>
                    <span className="text-xs text-muted-foreground">
                      Pode aparecer no Explorar
                    </span>
                  </button>
                  <button
                    onClick={() => setPrivacy("private")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${privacy === "private"
                      ? "border-primary bg-secondary"
                      : "border-border bg-card"
                      }`}
                  >
                    <span className="font-bold text-foreground block">
                      Privado
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Apenas via link
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview & Create */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground">
                  Tudo Pronto!
                </h2>
                <p className="text-muted-foreground mt-2">
                  Confira o resumo do seu calendário
                </p>
              </div>

              {/* Preview Card */}
              <div className="bg-card rounded-3xl p-6 shadow-card">
                {selectedThemeData && (
                  <div
                    className={`w-full h-32 rounded-2xl ${selectedThemeData.gradientClass} flex items-center justify-center mb-4 overflow-hidden`}
                  >
                    <img
                      src={themeImageByKey[selectedThemeData.imageKey]}
                      alt={selectedThemeData.name}
                      className="h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">
                  {calendarName || "Meu Calendário"}
                </h3>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {selectedThemeData?.emoji} {selectedThemeData?.name}
                  </span>
                  <span>•</span>
                  <span>{duration} dias</span>
                </div>
                {startDate && (
                  <p className="text-sm text-primary mt-2">
                    Início: {new Date(startDate).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-secondary rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Portas</span>
                  <span className="font-bold text-foreground">{duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tema</span>
                  <span className="font-bold text-foreground">
                    {selectedThemeData?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-bold">
                    RASCUNHO
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Privacidade</span>
                  <span className="font-bold text-foreground">
                    {privacy === "public" ? "Público" : "Privado"}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Desktop inline button */}
              <motion.button
                className={`hidden lg:flex w-full btn-festive items-center justify-center gap-2 ${!canProceed() || creating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={handleNext}
                disabled={!canProceed() || creating}
                whileHover={canProceed() && !creating ? { scale: 1.02 } : {}}
                whileTap={canProceed() && !creating ? { scale: 0.98 } : {}}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando...
                  </>
                ) : step === totalSteps ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Criar Calendário
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Button - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <motion.button
          className={`w-full max-w-lg mx-auto btn-festive flex items-center justify-center gap-2 ${!canProceed() || creating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={handleNext}
          disabled={!canProceed() || creating}
          whileHover={canProceed() && !creating ? { scale: 1.02 } : {}}
          whileTap={canProceed() && !creating ? { scale: 0.98 } : {}}
        >
          {creating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Criando...
            </>
          ) : step === totalSteps ? (
            <>
              <Sparkles className="w-5 h-5" />
              Criar Calendário
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default CriarCalendario;

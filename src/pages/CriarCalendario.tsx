import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar as CalendarIcon,
  Loader2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Check,
  Crown,
  AlertCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useUserPlanStatus, PLUS_THEMES } from "@/hooks/usePlanLimits";
import { PlusIcon } from "@/components/PremiumIcon";

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

const themes = BASE_THEMES.filter((t) => t.scope !== "b2b");

// Free plan: 7 days max
const FREE_MAX_DAYS = 7;

const durationOptions = [
  { value: 7, label: "7 dias", description: "Uma semana de surpresas", free: true },
  { value: 12, label: "12 dias", description: "Quase duas semanas", free: false },
  { value: 24, label: "24 dias", description: "Calendário clássico", free: false },
  { value: 30, label: "30 dias", description: "Um mês inteiro", free: false },
];

const CriarCalendario = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { user, signUp } = useAuth();
  const planStatus = useUserPlanStatus();

  const queryParams = new URLSearchParams(search);
  const initialTheme = queryParams.get("theme") as ThemeId || "";
  const initialTitle = queryParams.get("title") || "";

  const [step, setStep] = useState(initialTheme ? 2 : 1);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | "">(initialTheme);
  const [calendarName, setCalendarName] = useState(initialTitle);
  const [duration, setDuration] = useState(7);
  // Auto-fill with today's date for better UX
  const [startDate, setStartDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  // Privacy removed from UI, defaulting to private internally
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 3;

  const isThemePlus = (themeId: string) => PLUS_THEMES.includes(themeId);
  const selectedThemePlus = selectedTheme ? isThemePlus(selectedTheme) : false;
  const isDurationFree = (days: number) => days <= FREE_MAX_DAYS;
  const selectedDurationFree = isDurationFree(duration);

  const needsPlus = selectedThemePlus || !selectedDurationFree || planStatus.hasUsedFreeCalendar;

  const canProceed = () => {
    if (step === 1) return selectedTheme !== "";
    if (step === 2) return calendarName.trim() !== "";
    return true;
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      let currentUserId = user?.id;

      if (!user) {
        if (!email.includes('@')) {
          setError('Por favor, insira um e-mail válido.');
          return;
        }
        setCreating(true);
        try {
          const { error: signUpError } = await signUp(email, 'tempPassword!123', name);
          if (signUpError) throw signUpError;
        } catch (err: any) {
          console.error('CriarCalendario: Error signing up:', err);
          setError(`Erro ao criar conta: ${err.message || 'Erro desconhecido'}`);
          setCreating(false);
          return;
        }
      }

      setCreating(true);
      setError(null);

      try {
        const created = await CalendarsRepository.create({
          ownerId: currentUserId || user?.id || '',
          title: calendarName.trim() || "Meu Calendário",
          themeId: selectedTheme as ThemeId,
          duration,
          privacy: 'private',
          password: password || undefined,
          startDate: startDate || undefined,
          status: (needsPlus && !planStatus.isAdmin) ? 'aguardando_pagamento' : 'ativo',
          isPremium: needsPlus,
        });

        if (needsPlus && !planStatus.isAdmin) {
          navigate(`/checkout/${created.id}`);
        } else {
          navigate(`/calendario/${created.id}`);
        }
      } catch (err: any) {
        console.error('CriarCalendario: Error creating calendar:', err);
        setError(`Erro ao criar calendário: ${err.message || 'Erro desconhecido'}`);
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

      {planStatus.hasUsedFreeCalendar && !planStatus.isAdmin && (
        <div className="w-full max-w-5xl px-6 mb-6">
          <div className="bg-[#F9A03F]/10 border border-[#F9A03F]/30 rounded-2xl p-4 flex items-start gap-2">
            <Crown className="w-4 h-4 text-[#F9A03F] flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-[#F9A03F]">Você já possui um calendário. Novos calendários ou temas especiais requerem o Plano Plus.</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl px-6 pb-12 flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-solidroad-text dark:text-white">
                  Escolha um Tema
                </h2>
                <p className="text-lg text-muted-foreground/80 font-serif italic">
                  Qual é a ocasião especial que vamos celebrar?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => {
                  const isPlus = isThemePlus(theme.id);
                  const isLocked = isPlus && planStatus.hasUsedFreeCalendar && !planStatus.isAdmin;

                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => !isLocked && setSelectedTheme(theme.id)}
                      className={cn(
                        "group relative bg-white dark:bg-white/5 rounded-[2rem] p-4 border-2 text-left transition-all duration-300 overflow-hidden",
                        selectedTheme === theme.id ? "border-solidroad-accent shadow-xl shadow-solidroad-accent/10" : "border-transparent hover:border-solidroad-accent/30 shadow-sm",
                        isLocked && "opacity-60 grayscale-[0.5]"
                      )}
                      whileHover={!isLocked ? { scale: 1.02 } : {}}
                      whileTap={!isLocked ? { scale: 0.98 } : {}}
                    >
                      <div className={cn("w-full aspect-[4/3] rounded-2xl mb-4 overflow-hidden relative")}>
                        <img
                          src={themeImageByKey[theme.imageKey]}
                          alt={theme.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl shadow-sm">
                          {theme.emoji}
                        </div>

                        {isPlus && (
                          <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#F9A03F] text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg">
                            <Crown className="w-2 h-2" />
                            PLUS
                          </div>
                        )}

                        {isLocked && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-20">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                        )}

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
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-solidroad-text dark:text-white">
                  Personalizar Experiência
                </h2>
                <p className="text-lg text-muted-foreground/80 font-serif italic">
                  Vamos dar um nome e definir a duração.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-8">
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

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Data de Início (Opcional)</label>
                    <DatePicker
                      date={startDate ? parseISO(startDate) : undefined}
                      setDate={(date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : "")}
                      placeholder="Escolher data de início..."
                    />
                  </div>



                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Proteger com Senha</label>
                      <span className="text-[10px] bg-solidroad-accent/20 text-solidroad-text dark:text-solidroad-accent px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Opcional</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                        {password ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ex: segredo123"
                        className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white dark:bg-white/5 border-2 border-border/10 text-lg font-bold text-solidroad-text dark:text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-solidroad-accent focus:ring-4 focus:ring-solidroad-accent/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-solidroad-accent transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Duração (Portas)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {durationOptions.map(opt => {
                      const isOptionPlus = !opt.free;
                      const isLocked = isOptionPlus && planStatus.hasUsedFreeCalendar && !planStatus.isAdmin;

                      return (
                        <button
                          key={opt.value}
                          onClick={() => !isLocked && setDuration(opt.value)}
                          className={cn(
                            "p-6 rounded-[1.5rem] border-2 text-left transition-all group hover:-translate-y-1 hover:shadow-lg relative",
                            duration === opt.value
                              ? "border-solidroad-accent bg-solidroad-accent text-solidroad-text shadow-solidroad-accent/20"
                              : "border-border/10 bg-white dark:bg-white/5 hover:border-solidroad-accent/30",
                            isLocked && "opacity-60 grayscale-[0.5]"
                          )}
                        >
                          <span className={cn("text-3xl font-black block mb-1", duration === opt.value ? "text-solidroad-text" : "text-solidroad-text dark:text-white")}>{opt.value}</span>
                          <span className={cn("text-xs font-bold uppercase tracking-wide opacity-80", duration === opt.value ? "text-solidroad-text" : "text-muted-foreground")}>{opt.label}</span>

                          {isOptionPlus && (
                            <div className="absolute top-4 right-4 px-2 py-0.5 bg-[#F9A03F] text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-md">
                              <Crown className="w-2 h-2" />
                              PLUS
                            </div>
                          )}

                          {isLocked && (
                            <Lock className="absolute top-4 right-4 w-4 h-4 text-white p-0.5 bg-black/40 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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

              <h2 className="text-4xl font-serif font-bold text-solidroad-text dark:text-white mb-4">Revisar e Criar</h2>

              <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-border/10 w-full max-w-md shadow-xl mb-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed border-border/10 text-left">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-muted")}>
                    {selectedThemeData?.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tema Escolhido</p>
                    <p className="text-xl font-serif font-bold text-solidroad-text dark:text-white">{selectedThemeData?.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-left">
                    <span className="text-sm font-bold text-muted-foreground">Nome</span>
                    <span className="text-base font-black text-solidroad-text dark:text-white">{calendarName}</span>
                  </div>
                  <div className="flex justify-between items-center text-left">
                    <span className="text-sm font-bold text-muted-foreground">Duração</span>
                    <span className="text-base font-black text-solidroad-text dark:text-white">{duration} dias</span>
                  </div>
                  <div className="flex justify-between items-center text-left">
                    <span className="text-sm font-bold text-muted-foreground">Plano</span>
                    <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-full", needsPlus ? "bg-[#F9A03F]/10 text-[#F9A03F]" : "bg-green-100 text-green-700")}>
                      {needsPlus ? 'PLUS' : 'GRATUITO'}
                    </span>
                  </div>
                </div>

                {!user && (
                  <div className="mt-8 pt-8 border-t border-border/10 space-y-4 text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 text-center">Criar conta para salvar</p>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-background border-2 border-border/10 font-bold"
                    />
                    <input
                      type="email"
                      placeholder="Seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-background border-2 border-border/10 font-bold"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm font-bold rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <motion.button
                className={`w-full max-w-md bg-solidroad-accent text-solidroad-text text-lg font-black py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 ${creating ? "opacity-70 cursor-wait" : ""}`}
                onClick={handleNext}
                disabled={creating}
              >
                {creating ? <Loader2 className="w-6 h-6 animate-spin" /> : needsPlus && !planStatus.isAdmin ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6 fill-current" />}
                {creating ? "Criando..." : needsPlus && !planStatus.isAdmin ? "Ir para Pagamento" : "Criar Agora"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 3 && (
        <div className="hidden lg:flex fixed bottom-8 right-8 gap-4">
          <button onClick={handleNext} disabled={!canProceed()} className="px-8 py-4 bg-solidroad-accent text-solidroad-text rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-glow">
            Continuar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-background/80 backdrop-blur-lg border-t border-border/10 lg:hidden z-50">
        <button
          onClick={handleNext}
          disabled={!canProceed() || creating}
          className="w-full bg-solidroad-accent text-solidroad-text py-4 rounded-xl font-black shadow-xl disabled:opacity-50 transition-all active:scale-[0.98] shadow-glow"
        >
          {creating ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : step === 3 ? "Finalizar" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

export default CriarCalendario;

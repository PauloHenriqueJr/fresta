/**
 * Explorar Page - Theme Library
 * Brand Identity: Verde Floresta + Dourado
 * Shows available calendar themes for users to create
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  ArrowRight,
  Crown,
  Sparkles,
  Calendar,
  Lock,
  Eye,
  X,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { BASE_THEMES } from "@/lib/offline/themes";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@/components/PremiumIcon";
import { useUserPlanStatus } from "@/hooks/usePlanLimits";

// Import mascots
import mascotNatal from "@/assets/mascot-natal.jpg";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotNamoro from "@/assets/mascot-namoro.jpg";
import mascotAniversario from "@/assets/mascot-aniversario.jpg";
import mascotCasamento from "@/assets/mascot-casamento.jpg";
import mascotReveillon from "@/assets/mascot-reveillon.jpg";
import mascotPascoa from "@/assets/mascot-pascoa.jpg";
import mascotNoivado from "@/assets/mascot-noivado.jpg";
import mascotBodas from "@/assets/mascot-bodas.jpg";
import mascotDiaDasCriancas from "@/assets/mascot-diadascriancas.jpg";
import mascotDiaDasMaes from "@/assets/mascot-diadasmaes.jpg";
import mascotDiaDosPais from "@/assets/mascot-diadospais.jpg";
import mascotViagem from "@/assets/mascot-viagem.jpg";
import mascotMetas from "@/assets/mascot-metas.jpg";
import mascotEstudos from "@/assets/mascot-estudo.jpg";
import mascotIndependencia from "@/assets/mascot-independencia.jpg";

// Theme categories
const THEME_CATEGORIES = [
  {
    name: "Românticos",
    emoji: "💕",
    themes: ["namoro", "casamento", "bodas", "noivado"],
  },
  {
    name: "Festivos",
    emoji: "🎉",
    themes: ["carnaval", "saojoao", "reveillon"],
  },
  {
    name: "Religiosos",
    emoji: "✨",
    themes: ["natal", "pascoa"],
  },
  {
    name: "Comemorações",
    emoji: "🎂",
    themes: ["aniversario", "diadascriancas"],
  },
  {
    name: "Família",
    emoji: "👨‍👩‍👧",
    themes: ["diadasmaes", "diadospais"],
  },
  {
    name: "Outros",
    emoji: "🌟",
    themes: ["viagem", "estudos", "independencia", "metas"],
  },
];

// Mascot images map
const mascotByKey: Record<string, string> = {
  natal: mascotNatal,
  carnaval: mascotCarnaval,
  saojoao: mascotSaoJoao,
  namoro: mascotNamoro,
  aniversario: mascotAniversario,
  casamento: mascotCasamento,
  reveillon: mascotReveillon,
  pascoa: mascotPascoa,
  noivado: mascotNoivado,
  bodas: mascotBodas,
  diadascriancas: mascotDiaDasCriancas,
  diadasmaes: mascotDiaDasMaes,
  diadospais: mascotDiaDosPais,
  viagem: mascotViagem,
  metas: mascotMetas,
  estudos: mascotEstudos,
  independencia: mascotIndependencia,
};

// Demo/Sample IDs
const demoById: Record<string, string> = {
  carnaval: "/calendario/carnaval",
  saojoao: "/calendario/saojoao",
  natal: "/calendario/natal",
  reveillon: "/calendario/reveillon",
  pascoa: "/calendario/pascoa",
  independencia: "/calendario/independencia",
  namoro: "/calendario/namoro",
  casamento: "/calendario/casamento",
  aniversario: "/calendario/aniversario",
};

// Theme premium status - premium themes require payment
const PREMIUM_THEMES = ["casamento", "bodas", "noivado", "reveillon", "viagem"];

const Explorar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const planStatus = useUserPlanStatus();
  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);

  // Get theme definition
  const getTheme = (id: string) => {
    return BASE_THEMES.find(t => t.id === id);
  };

  const handleThemeSelect = (themeId: string) => {
    const isPlus = PREMIUM_THEMES.includes(themeId);

    // If it's a Plus theme and user doesn't have a Plus plan or isn't admin
    if (isPlus && !planStatus.isAdmin) {
      setShowUpgradeModal(themeId);
      return;
    }

    const url = isAuthenticated
      ? `/criar?theme=${themeId}`
      : `/entrar?redirect=/criar?theme=${themeId}`;
    navigate(url);
  };

  const handleViewSample = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation();
    const demoUrl = demoById[themeId];
    if (demoUrl) {
      navigate(`${demoUrl}?template=true`);
    } else {
      handleThemeSelect(themeId);
    }
  };

  const selectedThemeForModal = showUpgradeModal ? getTheme(showUpgradeModal) : null;

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-300">
      {/* Hero Section - Brand Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="circles" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="4" fill="white" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-16 right-[10%] w-40 h-40 bg-[#F9A03F]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-[15%] w-32 h-32 bg-[#4ECDC4]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 lg:py-20">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Palette className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Biblioteca de Temas</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Escolha o tema
              <br />
              <span className="text-[#FFD166]">perfeito</span>
            </h1>

            <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto">
              Temas exclusivos para cada ocasião especial.
              Comece grátis e faça upgrade quando quiser.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12">
        {/* Featured Themes - Large Cards with Photos */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#F9A03F]" />
            <h2 className="text-xl font-black text-foreground tracking-tight">
              Mais Populares
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["namoro", "carnaval", "natal", "reveillon"].map((themeId, index) => {
              const theme = getTheme(themeId);
              if (!theme) return null;
              const isPlus = PREMIUM_THEMES.includes(themeId);
              const hasMascot = !!mascotByKey[themeId];

              return (
                <motion.div
                  key={themeId}
                  whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
                  onClick={() => handleThemeSelect(themeId)}
                  className={cn(
                    "group relative h-64 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg border border-border/10"
                  )}
                >
                  {/* Background Image */}
                  {hasMascot ? (
                    <img
                      src={mascotByKey[themeId]}
                      alt={theme.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className={cn("absolute inset-0", theme.gradientClass)} />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Premium Indicators */}
                  {isPlus && (
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                      <div className="px-3 py-1 bg-[#F9A03F] text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg">
                        <Crown className="w-3 h-3" />
                        PLUS
                      </div>
                      <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
                    <h3 className="text-xl font-black mb-1">{theme.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#FFD166] opacity-0 group-hover:opacity-100 transition-opacity">
                        Começar agora
                        <ArrowRight className="w-4 h-4" />
                      </div>

                      {demoById[themeId] && (
                        <button
                          onClick={(e) => handleViewSample(e, themeId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          Exemplo
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* All Themes by Category */}
        <div className="space-y-20">
          {THEME_CATEGORIES.map((category) => {
            const categoryThemes = category.themes.map(id => getTheme(id)).filter(Boolean);
            if (categoryThemes.length === 0) return null;

            return (
              <section key={category.name}>
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-2xl">{category.emoji}</span>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">{category.name}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryThemes.map((theme, index) => {
                    if (!theme) return null;
                    const isPlus = PREMIUM_THEMES.includes(theme.id);
                    const hasMascot = !!mascotByKey[theme.id];

                    return (
                      <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8 }}
                        onClick={() => handleThemeSelect(theme.id)}
                        className={cn(
                          "group relative overflow-hidden rounded-[2.5rem] border-2 transition-all cursor-pointer aspect-square shadow-sm hover:shadow-xl",
                          hasMascot ? "border-transparent" : "border-border/10 bg-card hover:border-border/30"
                        )}
                      >
                        {hasMascot ? (
                          <img
                            src={mascotByKey[theme.id]}
                            alt={theme.name}
                            className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-solidroad-accent/5">
                            <PlusIcon name={theme.iconName || "Sparkles"} className="w-10 h-10 text-solidroad-accent" />
                          </div>
                        )}

                        {/* Lock Overlay */}
                        {isPlus && (
                          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                            <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg">
                              <Lock className="w-4 h-4" />
                            </div>
                          </div>
                        )}

                        {/* Overlay with info */}
                        <div className={cn(
                          "absolute inset-0 flex flex-col justify-end p-8 text-left",
                          hasMascot ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent" : "bg-gradient-to-t from-card via-transparent to-transparent"
                        )}>
                          <div className="flex justify-between items-end">
                            <div>
                              <h4 className={cn(
                                "text-xl font-bold leading-tight",
                                hasMascot ? "text-white" : "text-foreground"
                              )}>{theme.name}</h4>
                              <p className={cn(
                                "text-xs mt-1 font-medium",
                                hasMascot ? "text-white/60" : "text-muted-foreground"
                              )}>
                                {isPlus ? "Tema Plus" : "Começar grátis"}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {demoById[theme.id] && (
                                <button
                                  onClick={(e) => handleViewSample(e, theme.id)}
                                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg"
                                  title="Ver Exemplo"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              )}

                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300",
                                hasMascot ? "bg-white text-black" : "bg-solidroad-accent text-white"
                              )}>
                                <ArrowRight className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA Section - Brand Style */}
        <section className="mt-24 mb-12">
          <div className="bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] rounded-[3rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9A03F]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4ECDC4]/20 rounded-full blur-[80px]" />

            <Calendar className="w-14 h-14 mx-auto mb-6 relative z-10 text-[#FFD166]" />
            <h2 className="text-3xl md:text-4xl font-black mb-4 relative z-10 leading-tight">
              Não encontrou o tema perfeito?
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-lg mx-auto relative z-10 font-medium">
              Crie um calendário personalizado com o tema que você quiser e encante quem você ama!
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")}
              className="px-10 py-5 bg-white text-[#1B4D3E] font-black text-lg rounded-2xl hover:scale-105 hover:shadow-2xl transition-all relative z-10 shadow-xl"
            >
              Criar Calendário Personalizado
            </button>
          </div>
        </section>
      </div>

      {/* Upgrade Choice Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(null)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
            >
              <div className="bg-card rounded-[3rem] shadow-2xl overflow-hidden border border-border/10">
                <div className="p-8 md:p-12 text-center">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#F9A03F]/10 flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-8 h-8 text-[#F9A03F]" />
                  </div>

                  <h3 className="text-3xl font-black text-foreground mb-4 leading-tight">
                    Tema Plus Selecionado
                  </h3>

                  <p className="text-muted-foreground font-medium mb-8">
                    O tema <span className="text-foreground font-bold italic">"{selectedThemeForModal?.name}"</span> é exclusivo do Plano Plus. Deseja ver um exemplo ou começar a criação agora?
                  </p>

                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        const themeId = showUpgradeModal;
                        setShowUpgradeModal(null);
                        navigate(isAuthenticated ? `/criar?theme=${themeId}` : `/entrar?redirect=/criar?theme=${themeId}`);
                      }}
                      className="w-full py-5 bg-[#F9A03F] text-white font-black rounded-2xl text-lg shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                      <CreditCard className="w-6 h-6" />
                      CRIAR COM ESTE TEMA
                    </button>

                    <button
                      onClick={(e) => {
                        const themeId = showUpgradeModal;
                        setShowUpgradeModal(null);
                        handleViewSample(e, themeId);
                      }}
                      className="w-full py-5 bg-card text-foreground border-2 border-border/50 font-black rounded-2xl text-lg hover:bg-muted/50 transition-all flex items-center justify-center gap-3"
                    >
                      <Eye className="w-6 h-6" />
                      VER EXEMPLO GRÁTIS
                    </button>
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Até 365 dias de duração
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Upload de fotos e vídeos
                    </div>
                  </div>

                  <button
                    onClick={() => setShowUpgradeModal(null)}
                    className="mt-8 text-muted-foreground text-sm font-bold uppercase tracking-widest hover:text-foreground transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explorar;

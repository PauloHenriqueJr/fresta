import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mascotNoivado from "@/assets/mascot-noivado.jpg";
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
import { BASE_THEMES, groupLabel } from "@/lib/offline/themes";
import type { ThemeDefinition, ThemeScope } from "@/lib/offline/types";
import mascotPeeking from "@/assets/mascot-peeking.png";

const imageByKey: Record<ThemeDefinition["imageKey"], string> = {
  peeking: mascotPeeking,
  noivado: mascotNoivado,
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

const routeForTheme = (t: ThemeDefinition) => {
  // Demos temáticas específicas (B2C)
  const demoById: Partial<Record<ThemeDefinition["id"], string>> = {
    carnaval: "/calendario/carnaval",
    saojoao: "/calendario/saojoao",
    natal: "/calendario/natal",
    reveillon: "/calendario/reveillon",
    pascoa: "/calendario/pascoa",
    independencia: "/calendario/independencia",
    namoro: "/calendario/namoro",
    casamento: "/calendario/casamento",
  };

  return demoById[t.id] ?? "/calendario";
};

const themeOptions = BASE_THEMES.filter((t) => t.scope !== "b2b" && t.enabledByDefault);

const groupOrder: ThemeScope[] = ["common", "b2c", "b2b"];

const EscolherTema = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header
        className="px-4 py-4 flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Escolher Tema</h1>
      </motion.header>

      <div className="px-4">
        {/* Title Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-festive flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">
            Qual festa você quer celebrar?
          </h2>
          <p className="text-muted-foreground mt-2">
            Escolha o tema do seu calendário festivo
          </p>
        </motion.div>

        {/* Theme Cards */}
        <div className="space-y-6">
          {groupOrder
            .filter((scope) => scope !== "b2b")
            .map((scope) => {
              const list = themeOptions.filter((t) => t.scope === scope);
              if (list.length === 0) return null;
              return (
                <section key={scope}>
                  <h3 className="text-sm font-extrabold text-foreground mb-3 px-1">
                    {groupLabel[scope]}
                  </h3>
                  <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
                    {list.map((theme, index) => (
                      <motion.button
                        key={theme.id}
                        onClick={() => navigate(routeForTheme(theme))}
                        className="w-full bg-card rounded-3xl p-4 lg:p-6 shadow-card flex lg:flex-col items-center gap-4 hover:shadow-festive transition-shadow group relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`w-20 h-20 lg:w-full lg:h-48 rounded-2xl ${theme.gradientClass} flex items-center justify-center overflow-hidden flex-shrink-0 relative transition-transform duration-500 group-hover:scale-105`}
                        >
                          <img
                            src={imageByKey[theme.imageKey]}
                            alt={theme.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Desktop Overlay Highlight */}
                          <div className="absolute inset-0 bg-black/0 lg:group-hover:bg-black/10 transition-colors duration-300" />
                          <div className="absolute bottom-3 right-3 text-4xl hidden lg:block drop-shadow-md transform transition-transform group-hover:scale-110 duration-300">
                            {theme.emoji}
                          </div>
                        </div>

                        <div className="flex-1 text-left lg:w-full lg:flex lg:flex-col lg:justify-between">
                          <div className="lg:mb-auto">
                            <div className="flex items-center gap-2 mb-1 lg:hidden">
                              <span className="text-2xl">{theme.emoji}</span>
                              <h4 className="text-xl font-bold text-foreground">{theme.name}</h4>
                            </div>
                            <h4 className="text-xl font-bold text-foreground hidden lg:block mb-2">{theme.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {theme.description ?? "Toque para ver o calendário"}
                            </p>
                          </div>

                          <div className="hidden lg:flex items-center gap-2 mt-4 font-black uppercase text-xs tracking-widest text-primary">
                            Ver detalhes <span className="text-lg">→</span>
                          </div>
                        </div>

                        {/* Mobile Arrow */}
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center lg:hidden">
                          <span className="text-lg">→</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>

        {/* Create Custom Calendar */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate("/criar")}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-primary bg-secondary/50 text-center"
          >
            <span className="text-primary font-bold">+ Criar Personalizado</span>
            <p className="text-xs text-muted-foreground mt-1">
              Customize cores, duração e muito mais
            </p>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default EscolherTema;

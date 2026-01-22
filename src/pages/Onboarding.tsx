import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Flame, Sparkles, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroMascot from "@/assets/hero-mascot.png";

interface OnboardingSlide {
  id: string;
  theme: "carnaval" | "saojoao" | "natal";
  title: string;
  highlight: string;
  description: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  bgClass: string;
  accentClass: string;
}

const slides: OnboardingSlide[] = [
  {
    id: "carnaval",
    theme: "carnaval",
    title: "Sinta a energia do",
    highlight: "Carnaval!",
    description: "Crie contagens regressivas vibrantes para blocos, desfiles e as festas mais animadas do ano.",
    buttonText: "Entrar no Ritmo",
    buttonIcon: <PartyPopper className="w-5 h-5" />,
    bgClass: "bg-gradient-to-b from-carnaval-purple-light to-background",
    accentClass: "bg-gradient-carnaval",
  },
  {
    id: "saojoao",
    theme: "saojoao",
    title: "O melhor do",
    highlight: "São João está aqui!",
    description: "Crie contagens regressivas incríveis para o São João, Festas Juninas e muito mais.",
    buttonText: "Começar a Festa",
    buttonIcon: <Flame className="w-5 h-5" />,
    bgClass: "bg-gradient-to-b from-saojoao-orange-light to-background",
    accentClass: "bg-gradient-saojoao",
  },
  {
    id: "share",
    theme: "natal",
    title: "Compartilhe a",
    highlight: "Magia",
    description: "Envie para amigos e família e acompanhe a diversão conforme eles abrem as portas.",
    buttonText: "Começar agora",
    buttonIcon: <Sparkles className="w-5 h-5" />,
    bgClass: "bg-gradient-to-b from-festive-green-light to-background",
    accentClass: "bg-gradient-festive",
  },
];

const FloatingIcons = ({ theme }: { theme: string }) => {
  const icons = {
    carnaval: ["🎭", "🎪", "✨", "🎵"],
    saojoao: ["🌽", "🔥", "🎆", "🪗"],
    natal: ["🎄", "⭐", "🎁", "❄️"],
  };

  const themeIcons = icons[theme as keyof typeof icons] || icons.natal;

  return (
    <div className="absolute top-0 left-0 right-0 flex justify-around py-4">
      {themeIcons.map((icon, i) => (
        <motion.span
          key={i}
          className="text-2xl opacity-40"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
        >
          {icon}
        </motion.span>
      ))}
    </div>
  );
};

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigate("/meus-calendarios");
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className={`min-h-screen ${slide.bgClass} relative overflow-hidden lg:flex lg:items-center lg:justify-center`}>
      <FloatingIcons theme={slide.theme} />

      <div className="w-full lg:max-w-[1000px] lg:mx-auto lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center lg:bg-card/30 lg:backdrop-blur-xl lg:p-12 lg:rounded-[3rem] lg:border lg:border-white/20 lg:shadow-2xl relative z-10">
        {/* Left Column (Desktop) / Top (Mobile) - Hero Image */}
        <div className="flex flex-col items-center">
          {/* Header - Mobile Only */}
          <div className="flex items-center justify-between w-full px-4 pt-4 lg:hidden">
            {currentSlide > 0 ? (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full bg-card/50 flex items-center justify-center shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            ) : (
              <div className="w-10" />
            )}
            <span className="text-sm font-bold text-muted-foreground/60">
              {currentSlide + 1} / {slides.length}
            </span>
            <div className="w-10" />
          </div>

          <div className="px-6 pt-8 lg:p-0 w-full flex flex-col items-center lg:items-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center lg:items-start w-full"
              >
                {/* Image */}
                <div className="relative w-full max-w-[340px] aspect-square mb-8 lg:max-w-none lg:mb-0">
                  <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl lg:rounded-[3rem] border-4 border-white/30">
                    <img
                      src={heroMascot}
                      alt="Mascote"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Theme badge */}
                  {slide.theme === "carnaval" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-xl border-4 border-white"
                    >
                      <span className="text-3xl">🎭</span>
                    </motion.div>
                  )}
                  {slide.theme === "saojoao" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-saojoao-orange flex items-center justify-center shadow-xl border-4 border-white"
                    >
                      <Flame className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column (Desktop) / Bottom (Mobile) - Content */}
        <div className="flex flex-col px-6 lg:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "_text"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <h1 className="text-4xl font-black text-foreground leading-[1.1] lg:text-5xl lg:tracking-tighter">
                {slide.title}{" "}
                <span
                  className={
                    slide.theme === "carnaval"
                      ? "text-carnaval-purple"
                      : slide.theme === "saojoao"
                        ? "text-saojoao-orange"
                        : "text-primary"
                  }
                >
                  {slide.highlight}
                </span>
              </h1>
              <p className="text-muted-foreground mt-6 text-lg font-medium leading-relaxed lg:text-xl lg:max-w-md">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots & Nav */}
          <div className="flex flex-col gap-10 mt-12 lg:mt-16">
            <div className="flex justify-center lg:justify-start gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${i === currentSlide
                      ? `w-12 ${slide.accentClass} shadow-lg shadow-primary/20`
                      : "w-2.5 bg-muted/40 hover:bg-muted"
                    }`}
                />
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <motion.button
                onClick={handleNext}
                className={`w-full max-w-lg lg:max-w-xs btn-festive py-5 text-lg flex items-center justify-center gap-2 ${slide.accentClass} shadow-2xl shadow-primary/20`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-black tracking-tight">{slide.buttonText}</span>
                {slide.buttonIcon}
              </motion.button>

              {currentSlide > 0 && (
                <button
                  onClick={handleBack}
                  className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-xs transition-colors px-6"
                >
                  Voltar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

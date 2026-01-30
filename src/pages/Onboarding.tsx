import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles, X, ChevronRight, Flame, PartyPopper, Gift, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import heroMascot from "@/assets/hero-mascot.png";
import mascotNatal from "@/assets/mascot-natal.jpg";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotPascoa from "@/assets/mascot-pascoa.jpg";

// --- Visual Components ---

const PhoneMockup = () => (
  <div className="relative w-48 h-80 bg-gray-900 rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
    {/* Screen */}
    <div className="absolute inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="h-12 bg-green-500/10 flex items-center px-4 gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">F</div>
        <div className="h-2 w-20 bg-gray-200 rounded-full" />
      </div>
      {/* Chat Bubble */}
      <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-3 rounded-2xl rounded-tl-none shadow-lg border border-gray-100 max-w-[160px]"
        >
          <div className="h-2 w-12 bg-green-100 rounded-full mb-2" />
          <p className="text-[10px] text-gray-500 leading-tight">
            Olha só o que criei! Abre o link para contarmos juntos até o Natal:
            <br /><span className="text-blue-500">fresta.app/natal</span>
          </p>
        </motion.div>
      </div>
    </div>
    {/* Dynamic Island */}
    <div className="absolute top-2 w-20 h-5 bg-black rounded-full z-20" />
  </div>
);

const ThemeCard = ({ image, title, color }: { image: string; title: string, color: string }) => (
  <div className="bg-white rounded-2xl p-2 pb-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
    <div className={`aspect-square rounded-xl overflow-hidden ${color}`}>
      <img src={image} alt={title} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
    </div>
    <span className="text-[10px] font-bold text-gray-700 text-center uppercase tracking-wide">{title}</span>
  </div>
);

const ThemeCollage = () => (
  <div className="relative w-72 h-72">
    <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[2.5rem] border border-gray-100 rotate-6 transition-transform hover:rotate-3 shadow-inner">
      <ThemeCard image={mascotCarnaval} title="Carnaval" color="bg-purple-100" />
      <ThemeCard image={mascotSaoJoao} title="São João" color="bg-orange-100" />
      <ThemeCard image={mascotNatal} title="Natal" color="bg-red-100" />
      <ThemeCard image={mascotPascoa} title="Páscoa" color="bg-pink-100" />
    </div>

    {/* Decor */}
    <motion.div
      className="absolute -top-4 -right-4 bg-[#F6D045] p-3 rounded-2xl shadow-xl rotate-12 z-20"
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      <Sparkles className="w-6 h-6 text-[#0E220E]" fill="#0E220E" />
    </motion.div>
  </div>
);

// --- Slides Data ---

const slides = [
  {
    id: "welcome",
    title: "Bem-vindo ao\nFresta!",
    description: "Crie contagens regressivas incríveis para o Carnaval, São João e muito mais.",
    visual: (
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#F6D045]/20 rounded-full blur-3xl" />
        <img src={heroMascot} alt="Mascote" className="relative w-full h-full object-contain drop-shadow-2xl z-10" />
      </div>
    ),
    btnText: "Próximo",
  },
  {
    id: "personalize",
    title: "Personalize com\nsua Cara",
    description: "Escolha temas, adicione surpresas diárias e deixe tudo com o seu estilo.",
    visual: <ThemeCollage />,
    btnText: "Próximo",
  },
  {
    id: "share",
    title: "Compartilhe a\nMagia",
    description: "Envie para amigos e família e acompanhe a diversão conforme eles abrem as portas.",
    visual: <PhoneMockup />,
    btnText: "Começar agora",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleNext = async () => {
    if (current === slides.length - 1) {
      await completeOnboarding();
      navigate("/meus-calendarios");
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigate("/meus-calendarios");
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white md:rounded-[3rem] md:shadow-2xl md:p-8 h-[90vh] md:h-auto flex flex-col relative overflow-hidden">
        {/* Skip Button */}
        <div className="absolute top-6 right-6 z-20">
          {current < slides.length - 1 && (
            <button
              onClick={handleSkip}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Pular
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center text-center pt-10 pb-6 px-6"
            >
              {/* Visual Slot */}
              <div className="mb-10 flex items-center justify-center min-h-[280px]">
                {slides[current].visual}
              </div>

              {/* Text */}
              <h1 className="text-3xl font-black text-[#0E220E] mb-4 whitespace-pre-line tracking-tight">
                {slides[current].title}
              </h1>
              <p className="text-gray-500 font-medium text-base leading-relaxed max-w-[280px]">
                {slides[current].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="mt-auto px-6 pb-6 pt-4">
          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-[#2D7A5F]" : "w-1.5 bg-gray-200"
                  }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full h-14 bg-[#2D7A5F] hover:bg-[#23634c] active:scale-[0.98] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#2D7A5F]/20 flex items-center justify-center gap-2 transition-all"
          >
            {slides[current].btnText}
            <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

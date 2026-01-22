import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Star, Wand2, Trophy, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import TipCard from "@/components/calendar/TipCard";
import ExclusiveDayGrid from "@/components/calendar/ExclusiveDayGrid";

const calendarDays = Array.from({ length: 12 }, (_, i) => {
  const day = i + 1;
  if (day <= 3) return { day, status: "opened" as const };
  if (day === 4) return { day, status: "available" as const };
  const daysUntil = day - 4;
  return {
    day,
    status: "locked" as const,
    timeLeft: daysUntil === 1 ? "14H" : `${daysUntil}D`,
  };
});

export default function CalendarioIndependencia() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden theme-independencia">
      <FloatingDecorations theme="independencia" />

      {/* Hero/topo exclusivo */}
      <div className="absolute inset-x-0 top-0 h-[340px] bg-secondary opacity-60" />
      <div className="absolute inset-x-0 top-0 h-[380px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)] bg-gradient-independencia opacity-25" />

      <motion.header
        className="px-4 pt-6 pb-2 relative z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/meus-calendarios")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <span className="badge-festive bg-secondary text-secondary-foreground text-xs flex items-center gap-2">
            <Star className="w-4 h-4" /> 7 DE SETEMBRO <Star className="w-4 h-4" />
          </span>

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-card"
            onClick={() => console.log("independencia magic")}
            aria-label="Ação temática"
          >
            <Wand2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-5xl font-black leading-tight">
            <span className="block text-brasil-green">VIVA O</span>
            <span className="block text-brasil-blue -mt-1">BRASIL</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-base">Semana da Pátria</p>
        </div>
      </motion.header>

      <motion.section
        className="px-4 py-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-card rounded-3xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-brasil-green bg-brasil-green-light px-4 py-2 rounded-full">
              BRASILIDADE: 50%
            </span>
            <span className="text-sm font-semibold text-foreground">Rumo ao Bicentenário 🇧🇷</span>
          </div>

          <div className="mt-3 h-3 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-1/2 bg-brasil-green" />
            <div className="-mt-3 h-3 w-[12%] ml-1/2 bg-brasil-yellow" />
          </div>
        </div>
      </motion.section>

      <section className="px-4 relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Sparkles className="w-5 h-5 text-brasil-blue" />
          <h2 className="text-sm font-black text-brasil-blue uppercase tracking-widest">Contagem regressiva</h2>
        </motion.div>

        <ExclusiveDayGrid
          days={calendarDays}
          ctaDayPrefix="DIA"
          ctaLabel="CONHECER HISTÓRIA"
          ctaHint="⭐"
          gradientClassName="bg-brasil-blue"
          onCtaClick={(d) => console.log("conhecer historia", d)}
        />
      </section>

      <section className="px-4 mt-6 relative z-10">
        <TipCard
          title="Curiosidade do dia"
          message="D. Pedro I não estava em um cavalo branco no momento do grito — a cena foi romantizada depois."
          theme="independencia"
        />
      </section>

      {/* Bottom bar (metodologia exclusiva) */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <motion.button
            className="flex-1 btn-festive flex items-center justify-center gap-2 bg-brasil-green"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log("celebrar brasil")}
          >
            <Trophy className="w-5 h-5" />
            CELEBRAR BRASIL
          </motion.button>

          <motion.button
            className="w-14 h-14 rounded-2xl bg-brasil-blue shadow-card flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log("share independencia")}
            aria-label="Compartilhar"
          >
            <Share2 className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        </div>
      </motion.div>

      <div className="h-28" />
    </div>
  );
}

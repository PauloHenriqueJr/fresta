import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import ProgressBar from "@/components/calendar/ProgressBar";
import ShareButton from "@/components/calendar/ShareButton";
import TipCard from "@/components/calendar/TipCard";

import mascotReveillon from "@/assets/mascot-reveillon.jpg";

const calendarDays = Array.from({ length: 12 }, (_, i) => {
  const day = i + 1;
  if (day <= 3) return { day, status: "opened" as const, hasSpecialContent: day === 2 };
  if (day === 4) return { day, status: "available" as const, hasSpecialContent: true };
  const daysUntil = day - 4;
  return {
    day,
    status: "locked" as const,
    timeLeft: daysUntil === 1 ? "14h" : `${daysUntil}D`,
  };
});

export default function CalendarioReveillon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingDecorations theme="reveillon" />

      {/* Hero/topo exclusivo */}
      <div className="absolute inset-x-0 top-0 h-[340px] bg-gradient-festive opacity-25" />
      <div className="absolute inset-x-0 top-0 h-[380px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)] bg-gradient-festive opacity-25" />

      <motion.header
        className="px-4 pt-6 pb-4 relative z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/meus-calendarios")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="badge-festive bg-secondary text-secondary-foreground text-xs">RÉVEILLON</span>
          <div className="w-10" />
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-primary" />
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Contagem regressiva</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mt-2 leading-tight">
              Virada
              <span className="block text-gradient-festive">de Ano</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Pequenas metas, memórias e um brinde no final.
            </p>
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-card shadow-card overflow-hidden">
            <img
              src={mascotReveillon}
              alt="Mascote do tema Réveillon"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </motion.header>

      <motion.section
        className="px-4 py-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ProgressBar progress={45} label="45% do caminho" daysLeft={6} theme="reveillon" />
      </motion.section>

      <section className="px-4 relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">12 desejos (demo)</h2>
        </motion.div>

        <CalendarGrid
          title="Virada de Ano"
          month="DEZ"
          days={calendarDays}
          onDayClick={(d) => console.log("open", d)}
          theme="default"
        />
      </section>

      <section className="px-4 mt-6 relative z-10">
        <TipCard
          title="Dica da Virada"
          message="Use os primeiros dias para memórias e o último para o convite/contagem regressiva."
          theme="default"
        />
      </section>

      <ShareButton label="Compartilhar" onClick={() => console.log("share reveillon")} theme="reveillon" />
      <div className="h-28" />
    </div>
  );
}

import { motion } from "framer-motion";
import { ArrowLeft, Heart, Calendar, BookOpenText, Send, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import TipCard from "@/components/calendar/TipCard";
import RomanceDayGrid from "@/components/calendar/RomanceDayGrid";

const calendarDays = Array.from({ length: 9 }, (_, i) => {
  const day = i + 1;
  if (day <= 4) return { day, status: "opened" as const, hasSpecialContent: day === 2 };
  if (day === 5) return { day, status: "available" as const, hasSpecialContent: true };
  const daysUntil = day - 5;
  return {
    day,
    status: "locked" as const,
    timeLeft: daysUntil === 1 ? "14h" : `${daysUntil}D`,
  };
});

export default function CalendarioNamoro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden theme-romance">
      <FloatingDecorations theme="namoro" />

      {/* Hero/topo exclusivo */}
      <div className="absolute inset-x-0 top-0 h-[340px] bg-secondary opacity-60" />
      <div className="absolute inset-x-0 top-0 h-[380px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)] bg-gradient-romance opacity-30" />

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
          <Heart className="w-5 h-5 text-primary" />
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-card"
            onClick={() => console.log("namoro story")}
            aria-label="Nossa história"
          >
            <BookOpenText className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-5xl font-black leading-tight">
            <span className="block text-primary">NOSSA</span>
            <span className="block text-primary -mt-1 italic">História</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-base">Contagem para o nosso dia especial</p>
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
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-secondary px-4 py-2 rounded-full">
              AMOR: 70% COMPLETO
            </span>
            <span className="text-sm font-semibold text-foreground">Faltam 3 dias! ❤️</span>
          </div>

          <div className="mt-3 progress-festive">
            <motion.div
              className="progress-festive-bar bg-gradient-romance"
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.section>

      <section className="px-4 relative z-10">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-sm font-black text-primary uppercase tracking-widest">Nossos momentos</h2>
        </motion.div>

        <RomanceDayGrid days={calendarDays} onCtaClick={(d) => console.log("revelar memoria", d)} />
      </section>

      <section className="px-4 mt-6 relative z-10">
        <TipCard
          title="Cápsula do tempo"
          message="“O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção.”"
          theme="namoro"
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
            className="flex-1 btn-festive flex items-center justify-center gap-2 bg-gradient-romance"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log("enviar amor")}
          >
            <Send className="w-5 h-5" />
            ENVIAR AMOR
          </motion.button>

          <motion.button
            className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log("namoro like")}
            aria-label="Curtir"
          >
            <HeartHandshake className="w-6 h-6 text-primary" />
          </motion.button>
        </div>
      </motion.div>

      <div className="h-28" />
    </div>
  );
}

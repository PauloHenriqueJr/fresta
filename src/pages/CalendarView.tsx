import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Menu, Share2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import ProgressBar from "@/components/calendar/ProgressBar";
import TipCard from "@/components/calendar/TipCard";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import DaySurpriseModal from "@/components/calendar/DaySurpriseModal";

// Sample calendar data
const calendarDays = Array.from({ length: 11 }, (_, i) => {
  const day = i + 1;
  if (day <= 4) {
    return { day, status: "opened" as const, hasSpecialContent: day === 2 };
  } else if (day === 5) {
    return { day, status: "available" as const, hasSpecialContent: true };
  } else {
    const daysUntil = day - 5;
    return {
      day,
      status: "locked" as const,
      timeLeft: daysUntil === 1 ? "14h" : `${daysUntil}D`,
    };
  }
});

const CalendarView = () => {
  const navigate = useNavigate();

  const handleDayClick = (day: number) => {
    console.log(`Opening surprise for day ${day}!`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating decorations */}
      <FloatingDecorations theme="default" />

      {/* Header */}
      <motion.header
        className="px-4 py-3 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <span className="badge-festive bg-secondary text-secondary-foreground text-xs">
            VISITANTE
          </span>

          <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            Bloco da Amizade <span>🎉</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Contagem regressiva oficial
          </p>
        </div>
      </motion.header>

      {/* Progress section */}
      <motion.section
        className="px-4 py-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ProgressBar
          progress={40}
          label="40% completado"
          daysLeft={5}
          theme="default"
        />
      </motion.section>

      {/* Calendar section */}
      <section className="px-4 relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="text-lg">📅</span>
          <h2 className="text-lg font-bold text-foreground">
            Calendário de Fevereiro
          </h2>
        </motion.div>

        <CalendarGrid
          title="Bloco da Amizade"
          month="FEVEREIRO"
          days={calendarDays}
          onDayClick={handleDayClick}
          theme="default"
        />
      </section>

      {/* Tip section */}
      <section className="px-4 mt-6 relative z-10">
        <TipCard
          title="Dica do dia"
          message="Prepare sua fantasia! Faltam poucos dias para o grande bloco. Já combinou com a galera?"
          theme="default"
        />
      </section>

      {/* Bottom actions */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <motion.button
            className="flex-1 btn-festive flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            Convidar Amigos
          </motion.button>
          <motion.button
            className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center hover:shadow-festive transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-6 h-6 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      {/* Spacer for fixed bottom */}
      <div className="h-24" />
    </div>
  );
};

export default CalendarView;

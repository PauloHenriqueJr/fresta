import { motion } from "framer-motion";
import { ArrowLeft, Menu, Share2, Settings, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/calendar/ProgressBar";
import TipCard from "@/components/calendar/TipCard";
import DayCard from "@/components/calendar/DayCard";

// Sample São João calendar data
const calendarDays = Array.from({ length: 9 }, (_, i) => {
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

const SaoJoaoFloatingIcons = () => {
  const icons = ["🔴", "💛", "🔵", "🔴", "💛", "🔵", "🔴", "💛"];
  
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center overflow-hidden h-16">
      <div className="flex">
        {icons.map((icon, i) => (
          <motion.div
            key={i}
            className="w-8 h-12"
            style={{
              clipPath: "polygon(50% 100%, 0 0, 100% 0)",
            }}
          >
            <div 
              className={`w-full h-full ${
                icon === "🔴" ? "bg-red-500" : icon === "💛" ? "bg-yellow-400" : "bg-blue-500"
              }`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CalendarioSaoJoao = () => {
  const navigate = useNavigate();

  const handleDayClick = (day: number) => {
    console.log(`Opening São João day ${day}!`);
  };

  return (
    <div className="min-h-screen bg-saojoao-orange-light relative overflow-hidden theme-saojoao">
      {/* Bandeirinhas */}
      <SaoJoaoFloatingIcons />

      {/* Header */}
      <motion.header
        className="px-4 py-3 pt-20 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/meus-calendarios")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <span className="badge-festive bg-saojoao-orange text-white text-xs">
            VILA DE SÃO JOÃO
          </span>

          <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-saojoao-brown flex items-center gap-2">
            Arraiá do Calendário <Flame className="w-7 h-7 text-saojoao-orange" />
          </h1>
          <p className="text-sm text-saojoao-brown/70 mt-1">
            Sua contagem para a fogueira
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
          label="40% do caminho"
          daysLeft={5}
          theme="saojoao"
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
          <Flame className="w-5 h-5 text-saojoao-orange" />
          <h2 className="text-lg font-bold text-saojoao-brown italic">
            Janelas do São João
          </h2>
        </motion.div>

        <motion.div
          className="bg-card rounded-3xl p-4 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {calendarDays.map((dayData) => (
              <div
                key={dayData.day}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  dayData.status === "available"
                    ? "bg-saojoao-brown text-white shadow-lg"
                    : dayData.status === "opened"
                    ? "bg-saojoao-orange-light border-2 border-saojoao-orange/30"
                    : "bg-saojoao-brown/20"
                }`}
                style={{
                  backgroundImage: dayData.status === "locked" 
                    ? "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 10px)"
                    : undefined
                }}
                onClick={() => dayData.status === "available" && handleDayClick(dayData.day)}
              >
                <span className="text-xl font-extrabold">
                  {dayData.day.toString().padStart(2, "0")}
                </span>
                {dayData.status === "available" && (
                  <span className="text-xs mt-1">ABRA A JANELA!</span>
                )}
                {dayData.status === "locked" && dayData.timeLeft && (
                  <span className="text-xs opacity-50 mt-1">{dayData.timeLeft}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tip section */}
      <section className="px-4 mt-6 relative z-10">
        <TipCard
          title="Dica do Sertão"
          message="Já separou o traje xadrez? Amanhã tem surpresa especial pra quem tá com o chapéu de palha pronto!"
          theme="saojoao"
        />
      </section>

      {/* Bottom actions */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-saojoao-orange-light/80 backdrop-blur-lg border-t border-saojoao-orange/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <motion.button
            className="flex-1 btn-festive flex items-center justify-center gap-2 bg-saojoao-orange"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            Convidar pra Festa
          </motion.button>
          <motion.button
            className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center"
            onClick={() => navigate("/configuracoes")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-6 h-6 text-saojoao-brown" />
          </motion.button>
        </div>
      </motion.div>

      {/* Spacer for fixed bottom */}
      <div className="h-28" />
    </div>
  );
};

export default CalendarioSaoJoao;

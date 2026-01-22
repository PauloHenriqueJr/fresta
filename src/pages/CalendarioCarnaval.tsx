import { motion } from "framer-motion";
import { ArrowLeft, Menu, Share2, Settings, Sparkles, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/calendar/ProgressBar";
import TipCard from "@/components/calendar/TipCard";

// Sample Carnaval calendar data
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
      timeLeft: daysUntil === 1 ? "14H" : `${daysUntil}D`,
    };
  }
});

const CarnavalFloatingIcons = () => {
  const icons = ["🎭", "✨", "🎪", "🎵", "+"];
  
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-around py-3 opacity-30">
      {icons.map((icon, i) => (
        <motion.span
          key={i}
          className="text-carnaval-purple text-xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
        >
          {icon}
        </motion.span>
      ))}
    </div>
  );
};

const CalendarioCarnaval = () => {
  const navigate = useNavigate();

  const handleDayClick = (day: number) => {
    console.log(`Opening Carnaval day ${day}!`);
  };

  return (
    <div className="min-h-screen bg-carnaval-purple-light relative overflow-hidden">
      {/* Floating decorations */}
      <CarnavalFloatingIcons />

      {/* Decorative top bar */}
      <div className="absolute top-12 left-0 right-0 h-24 bg-gradient-to-b from-carnaval-purple/10 to-transparent" />

      {/* Header */}
      <motion.header
        className="px-4 py-3 pt-14 relative z-10"
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

          <span className="badge-festive bg-carnaval-purple text-white text-xs">
            UNIDOS DO CALENDÁRIO
          </span>

          <button className="w-10 h-10 rounded-full bg-carnaval-purple flex items-center justify-center shadow-card">
            <PartyPopper className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-carnaval-purple tracking-wide" style={{ fontFamily: "'Nunito', sans-serif" }}>
            CARNAVAL
          </h1>
          <h2 className="text-2xl font-extrabold text-carnaval-pink -mt-1">
            MÁGICO
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Prepare seu glitter e a fantasia!
          </p>
        </div>
      </motion.header>

      {/* Progress section */}
      <motion.section
        className="mx-4 mt-4 bg-card rounded-3xl p-4 shadow-card relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-carnaval-purple bg-carnaval-purple-light px-3 py-1 rounded-full">
            NO RITMO: 40%
          </span>
          <span className="text-sm font-semibold text-foreground">
            5 dias pro desfile! 🎉
          </span>
        </div>
        <div className="h-3 rounded-full bg-carnaval-purple-light overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-carnaval"
            initial={{ width: 0 }}
            animate={{ width: "40%" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.section>

      {/* Calendar section */}
      <section className="px-4 mt-6 relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Sparkles className="w-5 h-5 text-carnaval-purple" />
          <h2 className="text-sm font-bold text-carnaval-purple uppercase tracking-wider">
            Abra a sua Ala
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {calendarDays.map((dayData, index) => (
            <motion.div
              key={dayData.day}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                dayData.status === "available"
                  ? "bg-gradient-carnaval text-white shadow-lg"
                  : dayData.status === "opened"
                  ? "bg-card border-2"
                  : "bg-card"
              }`}
              style={{
                borderColor: dayData.status === "opened" 
                  ? index === 0 ? "#7dd3fc" : index === 1 ? "#f9a8d4" : "#fcd34d"
                  : undefined
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => dayData.status === "available" && handleDayClick(dayData.day)}
            >
              {dayData.status === "opened" && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
              
              <span className={`text-xl font-extrabold ${
                dayData.status === "available" ? "text-white text-2xl" : 
                dayData.status === "opened" ? "text-carnaval-purple" : "text-muted-foreground"
              }`}>
                {dayData.status === "available" ? (
                  <>
                    <Sparkles className="w-5 h-5 mb-1 mx-auto" />
                    DIA {dayData.day.toString().padStart(2, "0")}
                  </>
                ) : (
                  dayData.day.toString().padStart(2, "0")
                )}
              </span>
              
              {dayData.status === "available" && (
                <button className="mt-2 bg-carnaval-yellow text-carnaval-purple text-xs font-bold px-3 py-1 rounded-full">
                  CAIR NA FOLIA
                </button>
              )}
              
              {dayData.status === "locked" && (
                <>
                  <span className="text-muted-foreground mt-1">🔒</span>
                  {dayData.timeLeft && (
                    <span className="text-xs text-muted-foreground">{dayData.timeLeft}</span>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tip section */}
      <section className="px-4 mt-6 relative z-10">
        <div className="bg-carnaval-purple-light border border-carnaval-purple/20 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-carnaval-purple/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">📣</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-carnaval-purple">DICA DE FOLIÃO</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Já preparou o abadá? Amanhã o segredo vai fazer todo mundo pular junto no bloco!
            </p>
          </div>
        </div>
      </section>

      {/* Bottom actions */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-carnaval-purple-light/80 backdrop-blur-lg border-t border-carnaval-purple/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <motion.button
            className="flex-1 btn-festive flex items-center justify-center gap-2 bg-gradient-carnaval"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            CHAMAR O BLOCO
          </motion.button>
          <motion.button
            className="w-14 h-14 rounded-2xl bg-carnaval-purple shadow-card flex items-center justify-center"
            onClick={() => navigate("/configuracoes")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Spacer for fixed bottom */}
      <div className="h-28" />
    </div>
  );
};

export default CalendarioCarnaval;

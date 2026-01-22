import { motion } from "framer-motion";
import { ArrowLeft, Gift, Share2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import ProgressBar from "@/components/calendar/ProgressBar";

import mascotNatal from "@/assets/mascot-natal.jpg";

const calendarDays = Array.from({ length: 24 }, (_, i) => {
  const day = i + 1;
  if (day <= 6) return { day, status: "opened" as const, hasSpecialContent: day === 2 };
  if (day === 7) return { day, status: "available" as const, hasSpecialContent: true };
  const daysUntil = day - 7;
  return {
    day,
    status: "locked" as const,
    timeLeft: daysUntil === 1 ? "14h" : `${daysUntil}D`,
  };
});

export default function CalendarioNatal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden theme-natal">
      <FloatingDecorations theme="natal" />

      {/* Fundo suave */}
      <div className="absolute inset-0 bg-natal-cream" />

      <motion.header
        className="px-4 pt-6 pb-2 relative z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/meus-calendarios")}
            className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <span className="px-6 py-2 rounded-full bg-natal-red-light border border-natal-red/20 text-natal-red font-extrabold text-xs tracking-widest">
            UNIDOS DO CALENDÁRIO
          </span>

          <button className="w-12 h-12 rounded-full bg-natal-red shadow-card flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-4xl font-black leading-tight">
            <span className="block text-natal-green">NATAL</span>
            <span className="block text-natal-red -mt-1">ENCANTADO</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-base">A magia está chegando!</p>
        </div>
      </motion.header>

      <motion.section
        className="px-4 py-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-card rounded-3xl p-4 shadow-card">
          <ProgressBar progress={40} label="No clima: 40%" daysLeft={5} theme="natal" />
        </div>
      </motion.section>

      <section className="px-4 relative z-10">
        <motion.div
          className="flex items-center gap-3 mt-2 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="text-natal-red text-xl">❄️</span>
          <h2 className="text-lg font-black text-natal-green uppercase tracking-wide">
            Abra seu presente
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {calendarDays.slice(0, 9).map((d, idx) => {
            const isCta = d.status === "available";
            const isOpened = d.status === "opened";
            const isLocked = d.status === "locked";
            const borderTint = idx % 3 === 0 ? "border-natal-green/30" : idx % 3 === 1 ? "border-natal-red/20" : "border-accent/20";

            return (
              <motion.button
                key={d.day}
                onClick={() => console.log("open", d.day)}
                className={
                  isCta
                    ? "aspect-square rounded-3xl bg-natal-red text-primary-foreground shadow-elevated flex flex-col items-center justify-center gap-2"
                    : `aspect-square rounded-3xl bg-card border-2 ${borderTint} shadow-card flex flex-col items-center justify-center relative`
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isOpened && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-natal-green flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-black">✓</span>
                  </div>
                )}

                {isCta ? (
                  <>
                    <div className="text-center">
                      <div className="text-[11px] font-black tracking-widest opacity-90">DIA {String(d.day).padStart(2, "0")}</div>
                    </div>
                    <div className="w-[78%] py-2 rounded-2xl bg-accent text-accent-foreground font-black text-xs tracking-wide">
                      ABRIR PRESENTE
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`text-3xl font-black ${isLocked ? "text-muted-foreground" : "text-natal-green"}`}>
                      {String(d.day).padStart(2, "0")}
                    </div>

                    {isLocked && (
                      <div className="mt-1 flex flex-col items-center gap-1 text-muted-foreground">
                        <span className="text-sm">🔒</span>
                        <span className="text-xs font-bold">{d.timeLeft ?? ""}</span>
                      </div>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* Bottom actions (igual metodologia Carnaval) */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <motion.button
            className="flex-1 btn-festive flex items-center justify-center gap-2 bg-gradient-natal"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log("share natal")}
          >
            <Share2 className="w-5 h-5" />
            COMPARTILHAR MAGIA
          </motion.button>
          <motion.button
            className="w-14 h-14 rounded-2xl bg-natal-green shadow-card flex items-center justify-center"
            onClick={() => navigate("/configuracoes")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        </div>
      </motion.div>

      <div className="h-28" />
    </div>
  );
}

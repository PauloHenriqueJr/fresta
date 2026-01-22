import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export type RomanceDayStatus = "locked" | "available" | "opened";

export interface RomanceCalendarDay {
  day: number;
  status: RomanceDayStatus;
  timeLeft?: string;
}

interface RomanceDayGridProps {
  days: RomanceCalendarDay[];
  onCtaClick?: (day: number) => void;
}

/**
 * Grid 3x3 inspirado no screenshot “Nossa História”.
 * (Somente UI; sem mudança de lógica)
 */
export default function RomanceDayGrid({ days, onCtaClick }: RomanceDayGridProps) {
  const visible = days.slice(0, 9);
  const openedBadges = ["❤️", "∞", "❤️", "∞", "", "", "", "", ""]; // apenas detalhe visual

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
    >
      {visible.map((d, idx) => {
        const isCta = d.status === "available";
        const isOpened = d.status === "opened";
        const isLocked = d.status === "locked";

        return (
          <motion.button
            key={d.day}
            type="button"
            onClick={() => (isCta ? onCtaClick?.(d.day) : undefined)}
            className={
              isCta
                ? "aspect-square rounded-3xl bg-gradient-romance text-primary-foreground shadow-elevated flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                : isLocked
                ? "aspect-square rounded-3xl bg-card border-2 border-primary/20 border-dashed shadow-card flex flex-col items-center justify-center relative"
                : "aspect-square rounded-3xl bg-card border-2 border-primary/20 shadow-card flex flex-col items-center justify-center relative"
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isOpened && openedBadges[idx] ? (
              <div className="absolute top-3 right-3 text-primary text-lg leading-none">
                {openedBadges[idx]}
              </div>
            ) : null}

            {isCta ? (
              <>
                <div className="text-center">
                  <div className="text-[12px] font-black tracking-widest opacity-95">DIA {String(d.day).padStart(2, "0")}</div>
                </div>
                <div className="w-[78%] py-2.5 rounded-2xl bg-primary-foreground text-primary font-black text-xs tracking-wide">
                  REVELAR
                  <span className="block">MEMÓRIA</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
              </>
            ) : (
              <>
                <div className={isLocked ? "text-3xl font-black text-muted-foreground" : "text-3xl font-black text-muted-foreground/70"}>
                  {String(d.day).padStart(2, "0")}
                </div>

                {isLocked ? (
                  <div className="mt-2 flex flex-col items-center gap-2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                    <span className="text-xs font-bold">{d.timeLeft ?? ""}</span>
                  </div>
                ) : null}
              </>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

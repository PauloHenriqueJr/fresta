import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";

export type PascoaDayStatus = "locked" | "available" | "opened";

export interface PascoaCalendarDay {
  day: number;
  status: PascoaDayStatus;
  timeLeft?: string;
}

interface PascoaDayGridProps {
  days: PascoaCalendarDay[];
  onCtaClick?: (day: number) => void;
}

/**
 * Grid inspirado no screenshot de Páscoa.
 * Somente UI (não mexe na lógica).
 */
export default function PascoaDayGrid({ days, onCtaClick }: PascoaDayGridProps) {
  const visible = days.slice(0, 9);
  const borderCycle = [
    "border-brasil-blue/20",
    "border-pascoa-pink/20",
    "border-pascoa-yellow/30",
  ];

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
        const borderTint = borderCycle[idx % borderCycle.length];

        return (
          <motion.button
            key={d.day}
            type="button"
            onClick={() => (isCta ? onCtaClick?.(d.day) : undefined)}
            className={
              isCta
                ? "aspect-square rounded-3xl bg-gradient-pascoa text-primary-foreground shadow-elevated flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                : "aspect-square rounded-3xl bg-card border-2 shadow-card flex flex-col items-center justify-center relative"
            }
            style={!isCta ? { borderColor: undefined } : undefined}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {!isCta ? (
              <div className={`absolute inset-0 rounded-3xl border-2 ${borderTint}`} />
            ) : null}

            {isOpened && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brasil-green flex items-center justify-center shadow-card">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            {isCta ? (
              <>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-black tracking-widest opacity-95">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-foreground/80" />
                    <span>DIA {String(d.day).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-2 text-primary-foreground/90">🥚</div>
                </div>
                <div className="w-[78%] py-2.5 rounded-2xl bg-pascoa-yellow text-accent-foreground font-black text-xs tracking-wide">
                  PEGAR OVO
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
              </>
            ) : (
              <>
                <div className={isLocked ? "text-3xl font-black text-muted-foreground" : "text-3xl font-black text-muted-foreground/70"}>
                  {String(d.day).padStart(2, "0")}
                </div>

                {isLocked ? (
                  <div className="mt-2 flex flex-col items-center gap-1 text-muted-foreground">
                    <Lock className="w-4 h-4 text-accent" />
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

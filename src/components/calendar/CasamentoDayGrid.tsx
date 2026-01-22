import { motion } from "framer-motion";
import { Check, Gift, Lock } from "lucide-react";

export type CasamentoDayStatus = "locked" | "available" | "opened";

export interface CasamentoCalendarDay {
  day: number;
  status: CasamentoDayStatus;
  timeLeft?: string;
}

interface CasamentoDayGridProps {
  days: CasamentoCalendarDay[];
  onCtaClick?: (day: number) => void;
}

/**
 * Grid editorial creme/dourado (screenshot “Nosso grande dia”).
 * Apenas UI.
 */
export default function CasamentoDayGrid({ days, onCtaClick }: CasamentoDayGridProps) {
  const visible = days.slice(0, 12);

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
    >
      {visible.map((d) => {
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
                ? "aspect-square rounded-3xl bg-card border-2 border-wedding-gold shadow-card flex flex-col items-center justify-center gap-3 relative"
                : isLocked
                ? "aspect-square rounded-3xl bg-muted/70 border border-border flex flex-col items-center justify-center gap-2"
                : "aspect-square rounded-3xl bg-card border border-border shadow-card flex flex-col items-center justify-center gap-2"
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isOpened ? (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="text-wedding-gold font-black">{String(d.day).padStart(2, "0")}</div>
                <div className="mt-3 w-7 h-7 rounded-full bg-wedding-gold-soft flex items-center justify-center">
                  <Check className="w-4 h-4 text-wedding-gold" />
                </div>
              </div>
            ) : isCta ? (
              <>
                <div className="text-wedding-gold font-black">{String(d.day).padStart(2, "0")}</div>
                <Gift className="w-8 h-8 text-wedding-gold" />
                <div className="w-[78%] py-2 rounded-full bg-wedding-gold text-wedding-ink font-black text-xs tracking-wide">
                  VER SURPRESA
                </div>
              </>
            ) : (
              <>
                <div className="text-muted-foreground font-black">{String(d.day).padStart(2, "0")}</div>
                {isLocked ? <Lock className="w-4 h-4 text-muted-foreground" /> : null}
              </>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

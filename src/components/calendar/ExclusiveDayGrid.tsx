import { motion } from "framer-motion";

export type ExclusiveDayStatus = "locked" | "available" | "opened";

export interface ExclusiveCalendarDay {
  day: number;
  status: ExclusiveDayStatus;
  timeLeft?: string;
}

interface ExclusiveDayGridProps {
  days: ExclusiveCalendarDay[];
  ctaLabel: string;
  ctaHint?: string;
  ctaDayPrefix?: string;
  gradientClassName: string;
  onCtaClick?: (day: number) => void;
}

/**
 * Grid 3x3 no estilo “design exclusivo” (Carnaval/Natal), com um cartão CTA no dia disponível.
 * Não altera lógica/estado — apenas renderização.
 */
export default function ExclusiveDayGrid({
  days,
  ctaLabel,
  ctaHint,
  ctaDayPrefix = "DIA",
  gradientClassName,
  onCtaClick,
}: ExclusiveDayGridProps) {
  const visible = days.slice(0, 9);
  const borderCycle = ["border-primary/20", "border-accent/20", "border-secondary/40"];

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
                ? `aspect-square rounded-3xl ${gradientClassName} text-primary-foreground shadow-elevated flex flex-col items-center justify-center gap-2 relative overflow-hidden`
                : `aspect-square rounded-3xl bg-card border-2 ${borderTint} shadow-card flex flex-col items-center justify-center relative`
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isOpened && (
              <div className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-black">✓</span>
              </div>
            )}

            {isCta ? (
              <>
                <div className="text-center">
                  <div className="text-[11px] font-black tracking-widest opacity-95">
                    {ctaDayPrefix} {String(d.day).padStart(2, "0")}
                  </div>
                  {ctaHint ? (
                    <div className="mt-1 text-xs opacity-90">{ctaHint}</div>
                  ) : null}
                </div>
                <div className="w-[78%] py-2 rounded-2xl bg-accent text-accent-foreground font-black text-xs tracking-wide">
                  {ctaLabel}
                </div>

                {/* brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
              </>
            ) : (
              <>
                <div className={isLocked ? "text-3xl font-black text-muted-foreground" : "text-3xl font-black text-foreground"}>
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
  );
}

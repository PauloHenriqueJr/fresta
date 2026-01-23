import { motion } from "framer-motion";
import { Lock, Check, Gift, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export type DayStatus = "locked" | "available" | "opened";

interface DayCardProps {
  day: number;
  status: DayStatus;
  timeLeft?: string;
  onClick?: () => void;
  theme?: string;
  hasSpecialContent?: boolean;
  dateLabel?: string;
}

const DayCard = ({
  day,
  status,
  timeLeft,
  onClick,
  theme = "default",
  hasSpecialContent = false,
  dateLabel,
}: DayCardProps) => {
  const isInteractive = status !== "locked";

  const getCardClasses = () => {
    const base = "day-card relative overflow-hidden";

    switch (status) {
      case "locked":
        return cn(base, "day-card-locked");
      case "available":
        return cn(base, "day-card-available");
      case "opened":
        return cn(base, "day-card-opened");
      default:
        return base;
    }
  };

  const getIcon = () => {
    switch (status) {
      case "locked":
        return <Lock className="w-4 h-4 opacity-50" />;
      case "available":
        const isRomance = theme === "namoro" || theme === "casamento" || theme === "noivado" || theme === "bodas";
        return hasSpecialContent ? (
          <Sparkles className="w-5 h-5" />
        ) : isRomance ? (
          <Heart className="w-5 h-5 fill-current animate-pulse" />
        ) : (
          <Gift className="w-5 h-5" />
        );
      case "opened":
        return <Check className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={cn("relative w-full aspect-square perspective-1000", !isInteractive && "cursor-default")}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: day * 0.02 }}
    >
      <div className="relative w-full h-full transform-style-3d transition-transform duration-700">
        {/* Door Back (revealed content) */}
        <div className="absolute inset-0 bg-muted/30 rounded-2xl flex items-center justify-center border-2 border-border/20">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none">Aberto</span>
          </div>
        </div>

        {/* Door Front */}
        <motion.button
          className={cn(
            getCardClasses(),
            "absolute inset-0 z-10 origin-left backface-hidden flex flex-col items-center justify-center rounded-2xl"
          )}
          onClick={onClick}
          disabled={!isInteractive}
          animate={status === "opened" ? { rotateY: -110 } : { rotateY: 0 }}
          whileHover={isInteractive ? { scale: 1.02 } : undefined}
          whileTap={isInteractive ? { scale: 0.98 } : undefined}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          {/* Day number or Date Label */}
          {dateLabel && (
            <span className="text-[10px] font-black opacity-60 uppercase mb-0.5">{dateLabel}</span>
          )}
          <span
            className={cn(
              "font-black relative z-10 leading-none text-center px-1 uppercase tracking-tighter",
              status === "available" ? "text-xl" : "text-lg"
            )}
          >
            PORTA {day.toString().padStart(2, "0")}
          </span>

          {/* Icon */}
          <div className="mt-1 relative z-10">{getIcon()}</div>

          {/* Handle indicator */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-foreground/10 rounded-full" />

          {/* Time left indicator for locked cards */}
          {status === "locked" && timeLeft && (
            <span className="text-[10px] mt-1 opacity-60">{timeLeft}</span>
          )}

          {/* Shimmer effect for available cards */}
          {status === "available" && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%] rounded-2xl" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DayCard;

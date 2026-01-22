import { motion } from "framer-motion";
import { Lock, Check, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type DayStatus = "locked" | "available" | "opened";

interface DayCardProps {
  day: number;
  status: DayStatus;
  timeLeft?: string;
  onClick?: () => void;
  theme?: "default" | "carnaval" | "saojoao" | "natal" | "reveillon" | "pascoa" | "independencia" | "namoro" | "casamento";
  hasSpecialContent?: boolean;
}

const DayCard = ({
  day,
  status,
  timeLeft,
  onClick,
  theme = "default",
  hasSpecialContent = false,
}: DayCardProps) => {
  const isInteractive = status === "available";

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
        return hasSpecialContent ? (
          <Sparkles className="w-5 h-5" />
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
    <motion.button
      className={getCardClasses()}
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      whileHover={isInteractive ? { scale: 1.05 } : undefined}
      whileTap={isInteractive ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: day * 0.02 }}
    >
      {/* Day number */}
      <span
        className={cn(
          "text-xl font-extrabold",
          status === "available" && "text-2xl"
        )}
      >
        {day.toString().padStart(2, "0")}
      </span>

      {/* Icon */}
      <div className="mt-1">{getIcon()}</div>

      {/* Time left indicator for locked cards */}
      {status === "locked" && timeLeft && (
        <span className="text-[10px] mt-1 opacity-60">{timeLeft}</span>
      )}

      {/* Checkmark badge for opened cards */}
      {status === "opened" && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {/* Shimmer effect for available cards */}
      {status === "available" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
      )}
    </motion.button>
  );
};

export default DayCard;

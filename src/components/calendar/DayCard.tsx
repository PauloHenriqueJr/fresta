import { motion } from "framer-motion";
import { Lock, Check, Gift, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getThemeConfig } from "@/lib/themes/registry";

// ... (in component) - removing this lines 6-20 block by replacing up to export
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

// Pastel Color Maps for Themes
// removing THEME_COLORS as it's now in CSS variables

const THEME_BG_CLASSES: Record<string, string> = {
  carnaval: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800",
  saojoao: "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800",
  natal: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800",
  reveillon: "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800",
  default: "bg-white dark:bg-white/5 border-border/10",
};

const DayCard = ({
  day,
  status,
  timeLeft,
  onClick,
  theme = "default",
  hasSpecialContent = false,
  dateLabel,
}: DayCardProps) => {
  const premiumTheme = getThemeConfig(theme);

  // removed getThemeGradient
  const getThemeBg = () => {
    if (status === 'opened') return "bg-gray-100 dark:bg-white/5 border-transparent";
    return THEME_BG_CLASSES[theme] || THEME_BG_CLASSES["default"];
  };

  const getIcon = () => {
    switch (status) {
      case "locked":
        if (premiumTheme.styles?.card?.lockedIcon) return premiumTheme.styles.card.lockedIcon;
        return <Lock className="w-4 h-4 opacity-40" />;
      case "available":
        const isRomance = ["namoro", "casamento", "noivado", "bodas"].includes(theme);
        if (hasSpecialContent) return <Sparkles className="w-5 h-5 text-white animate-pulse" />;
        if (isRomance) return <Heart className="w-5 h-5 text-white fill-current" />;
        return <Gift className="w-5 h-5 text-white" />;
      case "opened":
        return <Check className="w-5 h-5 text-solidroad-green dark:text-green-400" />;
      default:
        return null;
    }
  };

  // Card Text Color
  const getTextColor = () => {
    if (status === 'available') return "text-white drop-shadow-sm";
    return "text-solidroad-text dark:text-white";
  };

  return (
    <motion.div
      className={cn("relative w-full aspect-square perspective-1000 group")}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: day * 0.02 }}
    >
      <div className="relative w-full h-full transform-style-3d transition-transform duration-700">

        {/* The Card */}
        <motion.button
          className={cn(
            "absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[1.5rem] shadow-sm transition-all overflow-hidden border",
            status === 'available' ? "border-transparent shadow-lg shadow-black/5" : getThemeBg()
          )}
          style={
            status === 'available' ? { background: `var(--gradient-${theme === 'default' ? 'festive' : (theme === 'namoro' || theme === 'casamento' ? 'romance' : theme)})` } :
              status === 'locked' ? {
                ...premiumTheme.styles?.card?.locked,
                ...(premiumTheme.styles?.card?.boxShadow ? { boxShadow: premiumTheme.styles.card.boxShadow } : {})
              } : undefined
          }
          onClick={onClick}
          whileHover={status !== "opened" ? {
            y: -4,
            scale: 1.02,
            boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)"
          } : {}}
          whileTap={{ scale: 0.95 }}
        >
          {/* Day Label */}
          <div className="flex flex-col items-center relative z-10">
            {dateLabel && (
              <span className={cn("text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5", getTextColor())}>
                {dateLabel}
              </span>
            )}
            <span className={cn("text-2xl md:text-3xl font-black leading-none", getTextColor())}>
              {day}
            </span>
          </div>

          {/* Status Icon Area */}
          <div className="mt-2 relative z-10">
            {/* If available, show icon in white. If locked/opened, colored */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              status === 'available' ? "bg-white/20 backdrop-blur-sm" : "bg-black/5 dark:bg-white/10"
            )}>
              {getIcon()}
            </div>
          </div>

          {/* Locked State Time */}
          {status === "locked" && timeLeft && (
            <span className="text-[9px] font-bold text-muted-foreground mt-2 px-2 py-0.5 bg-black/5 rounded-md">
              {timeLeft}
            </span>
          )}

          {/* Shine Effect for Available */}
          {status === "available" && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
          )}

        </motion.button>
      </div>
    </motion.div >
  );
};

export default DayCard;

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  label?: string;
  daysLeft?: number;
  theme?:
    | "default"
    | "carnaval"
    | "saojoao"
    | "natal"
    | "reveillon"
    | "pascoa"
    | "independencia"
    | "namoro"
    | "casamento";
}

const ProgressBar = ({
  progress,
  label,
  daysLeft,
  theme = "default",
}: ProgressBarProps) => {
  const getGradientClass = () => {
    switch (theme) {
      case "carnaval":
      case "namoro":
        return "bg-gradient-carnaval";
      case "saojoao":
        return "bg-gradient-saojoao";
      case "natal":
        return "bg-gradient-natal";
      case "pascoa":
        return "bg-gradient-pascoa";
      case "reveillon":
        return "bg-gradient-reveillon";
      case "independencia":
        return "bg-gradient-independencia";
      case "casamento":
        return "bg-gradient-romance";
      default:
        return "bg-gradient-festive";
    }
  };

  const getEmoji = () => {
    switch (theme) {
      case "carnaval":
        return "🎭";
      case "saojoao":
        return "🔥";
      case "natal":
        return "🎄";
      case "reveillon":
        return "🎆";
      case "pascoa":
        return "🐣";
      case "independencia":
        return "🇧🇷";
      case "namoro":
        return "💘";
      case "casamento":
        return "💍";
      default:
        return "🎄";
    }
  };

  return (
    <div className="space-y-3">
      {/* Labels */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-secondary px-3 py-1 rounded-full">
            {label || `${Math.round(progress)}% completado`}
          </span>
        </div>
        {daysLeft !== undefined && (
          <span className="text-sm font-semibold text-foreground">
            Faltam {daysLeft} dias! {getEmoji()}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-festive">
        <motion.div
          className={`progress-festive-bar ${getGradientClass()}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

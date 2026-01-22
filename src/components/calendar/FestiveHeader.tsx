import { motion } from "framer-motion";
import { ArrowLeft, Menu } from "lucide-react";

interface FestiveHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onBack?: () => void;
  theme?: "default" | "carnaval" | "saojoao";
}

const FestiveHeader = ({
  title,
  subtitle,
  badge,
  onBack,
  theme = "default",
}: FestiveHeaderProps) => {
  const getEmoji = () => {
    switch (theme) {
      case "carnaval":
        return "🎉";
      case "saojoao":
        return "🌽";
      default:
        return "🎄";
    }
  };

  return (
    <motion.header
      className="px-4 py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        {badge && (
          <span className="badge-festive bg-secondary text-secondary-foreground text-xs">
            {badge}
          </span>
        )}

        <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Title section */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center justify-center sm:justify-start gap-2">
          {title} <span>{getEmoji()}</span>
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </motion.header>
  );
};

export default FestiveHeader;

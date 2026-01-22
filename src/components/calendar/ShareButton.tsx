import { motion } from "framer-motion";
import { Share2, Settings } from "lucide-react";

interface ShareButtonProps {
  label: string;
  onClick?: () => void;
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

const ShareButton = ({ label, onClick, theme = "default" }: ShareButtonProps) => {
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

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <motion.button
          className={`flex-1 btn-festive flex items-center justify-center gap-2 ${getGradientClass()}`}
          onClick={onClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-5 h-5" />
          {label}
        </motion.button>
        <motion.button
          className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center hover:shadow-festive transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-6 h-6 text-muted-foreground" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShareButton;

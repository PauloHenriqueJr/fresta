import { motion } from "framer-motion";
import { Lightbulb, Megaphone, Flame } from "lucide-react";

interface TipCardProps {
  title: string;
  message: string;
  theme?: "default" | "carnaval" | "saojoao" | "pascoa" | "reveillon" | "namoro" | "casamento" | "independencia";
}

const TipCard = ({ title, message, theme = "default" }: TipCardProps) => {
  const getIcon = () => {
    switch (theme) {
      case "carnaval":
        return <Megaphone className="w-5 h-5 text-carnaval-purple" />;
      case "saojoao":
        return <Flame className="w-5 h-5 text-saojoao-orange" />;
      case "pascoa":
        return <Lightbulb className="w-5 h-5 text-primary" />;
      case "reveillon":
        return <Lightbulb className="w-5 h-5 text-primary" />;
      case "namoro":
      case "casamento":
        return <Lightbulb className="w-5 h-5 text-primary" />;
      case "independencia":
        return <Lightbulb className="w-5 h-5 text-primary" />;
      default:
        return <Lightbulb className="w-5 h-5 text-accent" />;
    }
  };

  const getIconBgClass = () => {
    switch (theme) {
      case "carnaval":
        return "bg-carnaval-purple-light";
      case "saojoao":
        return "bg-saojoao-orange-light";
      case "pascoa":
      case "reveillon":
      case "namoro":
      case "casamento":
      case "independencia":
        return "bg-secondary";
      default:
        return "bg-accent/20";
    }
  };

  return (
    <motion.div
      className="tip-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <div
        className={`w-10 h-10 rounded-xl ${getIconBgClass()} flex items-center justify-center flex-shrink-0`}
      >
        {getIcon()}
      </div>
      <div>
        <h4 className="font-bold text-sm text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
    </motion.div>
  );
};

export default TipCard;

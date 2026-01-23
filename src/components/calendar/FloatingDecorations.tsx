import { motion } from "framer-motion";

interface FloatingDecorationsProps {
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

const FloatingDecorations = ({ theme = "default" }: FloatingDecorationsProps) => {
  const getDecorations = () => {
    switch (theme) {
      case "carnaval":
        return ["🎭", "✨", "🎊", "💜", "🎪"];
      case "saojoao":
        return ["🌽", "🔥", "🎆", "🌾", "🪗"];
      case "natal":
        return ["🎄", "⭐", "🎁", "❄️", "🔔"];
      case "reveillon":
        return ["🎆", "🥂", "✨", "🕛", "🎉"];
      case "pascoa":
        return ["🐣", "🥚", "🍫", "🌷", "🐰"];
      case "independencia":
        return ["🇧🇷", "🎺", "✨", "🏛️", "🌟"];
      case "namoro":
        return ["💘", "💌", "🌹", "✨", "💞", "🍫", "💏", "🥂"];
      case "casamento":
        return ["💍", "👰‍♀️", "🤵‍♂️", "🥂", "💐", "💖", "💒", "🍰"];
      default:
        return ["✨", "🌈", "🎈", "🎁", "⭐"];
    }
  };

  const decorations = getDecorations();

  return (
    <div className="floating-icons">
      {decorations.map((emoji, index) => (
        <motion.span
          key={index}
          className="absolute text-2xl opacity-30"
          style={{
            left: `${15 + index * 18}%`,
            top: `${5 + (index % 2) * 3}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingDecorations;

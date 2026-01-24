import { motion } from "framer-motion";
import { HangingHearts, FlagBanner, WeddingShower } from "@/lib/themes/themeComponents";

// Import mascots
import mascotNatal from "@/assets/mascot-natal.jpg";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotPascoa from "@/assets/mascot-pascoa.jpg";
import mascotIndependencia from "@/assets/mascot-independencia.jpg";
import mascotNamoro from "@/assets/mascot-namoro.jpg";
import mascotCasamento from "@/assets/mascot-casamento.jpg";
import mascotAniversario from "@/assets/mascot-aniversario.jpg";
import mascotReveillon from "@/assets/mascot-reveillon.jpg";

const mascotMap: Record<string, string> = {
  natal: mascotNatal,
  carnaval: mascotCarnaval,
  saojoao: mascotSaoJoao,
  pascoa: mascotPascoa,
  independencia: mascotIndependencia,
  namoro: mascotNamoro,
  casamento: mascotCasamento,
  aniversario: mascotAniversario,
  reveillon: mascotReveillon,
};

interface FloatingDecorationsProps {
  theme?: string;
}

const FloatingDecorations = ({ theme = "default" }: FloatingDecorationsProps) => {
  const getDecorations = () => {
    switch (theme) {
      case "carnaval":
        return ["🎭", "✨", "🎊", "💜", "🎪"];
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
  const mascot = mascotMap[theme];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Mascot - Large and translucent to match Explorar look */}
      {mascot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.07, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 flex items-center justify-center translate-y-20 transform-gpu"
        >
          <img
            src={mascot}
            alt=""
            className="w-full max-w-4xl object-contain mix-blend-multiply dark:mix-blend-overlay opacity-80"
          />
        </motion.div>
      )}

      {/* Emoji Decorations */}
      <div className="absolute inset-0 z-10">
        {decorations.map((emoji, index) => (
          <motion.span
            key={index}
            className="absolute text-3xl md:text-5xl opacity-20 filter grayscale-[0.2]"
            style={{
              left: `${10 + (index * 15) % 80}%`,
              top: `${10 + (index * 25) % 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, index % 2 === 0 ? 10 : -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Specific Theme Component Overlays */}
      {theme === 'saojoao' && <FlagBanner />}
      {theme === 'casamento' && <WeddingShower />}
      {theme === 'namoro' && <HangingHearts />}
    </div>
  );
};

export default FloatingDecorations;

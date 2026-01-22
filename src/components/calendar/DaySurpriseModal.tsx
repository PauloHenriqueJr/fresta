import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";

interface DaySurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  content?: {
    type: "text" | "image" | "video" | "link";
    title?: string;
    message?: string;
    imageUrl?: string;
    linkUrl?: string;
  };
  theme?: "default" | "carnaval" | "saojoao";
}

const DaySurpriseModal = ({
  isOpen,
  onClose,
  day,
  content,
  theme = "default",
}: DaySurpriseModalProps) => {
  const getGradientClass = () => {
    switch (theme) {
      case "carnaval":
        return "bg-gradient-carnaval";
      case "saojoao":
        return "bg-gradient-saojoao";
      default:
        return "bg-gradient-festive";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="bg-card rounded-3xl shadow-elevated overflow-hidden">
              {/* Header with day number */}
              <div
                className={`${getGradientClass()} p-6 text-center relative overflow-hidden`}
              >
                {/* Sparkle effects */}
                <Sparkles className="absolute top-4 left-4 w-6 h-6 text-white/30 animate-pulse" />
                <Sparkles className="absolute top-6 right-6 w-4 h-4 text-white/40 animate-pulse" />
                <Sparkles className="absolute bottom-4 left-8 w-5 h-5 text-white/30 animate-pulse" />

                <Gift className="w-12 h-12 text-primary-foreground mx-auto mb-3" />
                <h2 className="text-3xl font-extrabold text-primary-foreground">
                  DIA {day.toString().padStart(2, "0")}
                </h2>
                <p className="text-primary-foreground/80 mt-1">
                  Surpresa disponível!
                </p>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {content?.type === "text" && (
                  <div className="text-center">
                    {content.title && (
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {content.title}
                      </h3>
                    )}
                    <p className="text-muted-foreground">{content.message}</p>
                  </div>
                )}

                {!content && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      🎊 Parabéns! Você abriu a porta do dia {day}!
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Volte amanhã para mais surpresas.
                    </p>
                  </div>
                )}

                {/* Action button */}
                <motion.button
                  className="w-full btn-festive mt-4"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Fechar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DaySurpriseModal;

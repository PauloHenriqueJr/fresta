import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import lostImage from "@/assets/404-lost.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-solidroad-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-solidroad-green/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Festive Illustration Container */}
        <div className="relative mb-10 w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 group">
          <img
            src={lostImage}
            alt="Perdido no Bloco"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <span className="bg-solidroad-accent text-solidroad-text px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
              Erro 404
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-12 px-2">
          <h1 className="text-4xl md:text-5xl font-black text-solidroad-text dark:text-white leading-[1.1]">
            Opa! Esse bloco mudou de rota
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            A página que você está procurando se perdeu na multidão ou ainda não foi criada.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full h-16 bg-solidroad-accent text-solidroad-text rounded-2xl font-black text-lg shadow-xl shadow-solidroad-accent/20 flex items-center justify-center gap-3 shadow-glow transition-all"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={3} />
            Voltar para o Início
          </motion.button>

          <button
            onClick={() => navigate("/explorar")}
            className="w-full h-16 bg-card border-2 border-border/10 text-foreground rounded-2xl font-black text-lg hover:bg-muted transition-all flex items-center justify-center gap-3 group"
          >
            <Search className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            Explorar Calendários
          </button>
        </div>

        <motion.p
          className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center justify-center gap-2"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-3 h-3" />
          Fresta: Onde as surpresas acontecem
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;

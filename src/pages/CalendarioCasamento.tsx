import { motion } from "framer-motion";
import { ArrowLeft, MoreHorizontal, Settings, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import CasamentoDayGrid from "@/components/calendar/CasamentoDayGrid";

const calendarDays = Array.from({ length: 24 }, (_, i) => {
  const day = i + 1;
  if (day <= 6) return { day, status: "opened" as const, hasSpecialContent: day === 2 };
  if (day === 7) return { day, status: "available" as const, hasSpecialContent: true };
  const daysUntil = day - 7;
  return {
    day,
    status: "locked" as const,
    timeLeft: daysUntil === 1 ? "14h" : `${daysUntil}D`,
  };
});

export default function CalendarioCasamento() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden theme-casamento">
      <FloatingDecorations theme="casamento" />

      <motion.header
        className="px-4 pt-6 pb-3 relative z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/meus-calendarios")}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>

            <h1 className="text-sm font-black tracking-[0.35em] uppercase text-foreground">
              Nosso grande dia
            </h1>

            <button
              type="button"
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow"
              onClick={() => console.log("casamento menu")}
              aria-label="Menu"
            >
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </motion.header>

      <motion.section
        className="px-4 py-2 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-card rounded-3xl p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-foreground bg-secondary px-4 py-2 rounded-full">
                Caminho do altar
              </span>
              <span className="text-sm font-black text-foreground">92%</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-wedding-gold"
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
              />
            </div>
            <p className="mt-3 text-sm italic text-muted-foreground text-right">
              O momento mais esperado está chegando...
            </p>
          </div>
        </div>
      </motion.section>

      <section className="px-4 mt-4 relative z-10">
        <div className="max-w-lg mx-auto">
          <CasamentoDayGrid days={calendarDays} onCtaClick={(d) => console.log("ver surpresa", d)} />
        </div>
      </section>

      <section className="px-4 mt-8 relative z-10">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-black text-foreground">Nota dos Noivos</h2>
          <div className="mt-3 rounded-3xl bg-card border border-border p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-wedding-gold" />
            <p className="text-sm leading-relaxed text-foreground/90 italic">
              “Cada dia que passa é um passo mais próximo do nosso ‘felizes para sempre’. Obrigado por
              fazerem parte dessa jornada inesquecível conosco!”
            </p>
            <p className="mt-4 text-sm font-black text-wedding-gold text-right italic">
              — Com amor, Noivos
            </p>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <motion.button
            className="flex-1 btn-festive flex items-center justify-center gap-2 bg-wedding-gold text-wedding-ink"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log("compartilhar padrinhos")}
          >
            <Share2 className="w-5 h-5" />
            COMPARTILHAR
          </motion.button>

          <motion.button
            className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center hover:shadow-festive transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/configuracoes")}
            aria-label="Configurações"
          >
            <Settings className="w-6 h-6 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      <div className="h-28" />
    </div>
  );
}

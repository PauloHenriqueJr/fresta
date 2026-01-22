import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import heroMascot from "@/assets/hero-mascot.png";

// Sample calendar data for demo
const sampleDays = Array.from({ length: 24 }, (_, i) => {
  const day = i + 1;
  if (day <= 3) {
    return { day, status: "opened" as const, hasSpecialContent: day === 2 };
  } else if (day === 4) {
    return { day, status: "available" as const, hasSpecialContent: true };
  } else {
    const daysUntil = day - 4;
    return {
      day,
      status: "locked" as const,
      timeLeft: daysUntil === 1 ? "1D" : `${daysUntil}D`,
    };
  }
});

const Index = () => {
  const navigate = useNavigate();

  const handleDayClick = (day: number) => {
    console.log(`Day ${day} clicked!`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating decorations */}
      <FloatingDecorations theme="default" />

      {/* Main content */}
      <main className="relative z-10 max-w-lg mx-auto pb-24">
        {/* Hero Section */}
        <section className="px-4 pt-6 pb-8">
          {/* Top navigation hint */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-12 h-12 rounded-full bg-card shadow-card flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <button className="text-sm font-semibold text-primary hover:underline">
              Entrar
            </button>
          </motion.div>

          {/* Hero title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
              Crie sua contagem
              <br />
              regressiva para o{" "}
              <span className="text-gradient-festive">Carnaval!</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-base">
              Acompanhe os dias até a folia
              <br />
              com surpresas diárias.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
              <img
                src={heroMascot}
                alt="Mascote do calendário festivo"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* Calendar Preview Section */}
        <section className="px-4">
          <CalendarGrid
            title="Meu Calendário"
            month="FEVEREIRO"
            days={sampleDays}
            onDayClick={handleDayClick}
            theme="default"
          />
        </section>

        {/* CTA Button */}
        <section className="px-4 mt-8">
          <motion.button
            className="w-full btn-festive flex items-center justify-center gap-2 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/calendario")}
          >
            <Sparkles className="w-5 h-5" />
            Criar meu calendário grátis
          </motion.button>
        </section>
      </main>
    </div>
  );
};

export default Index;

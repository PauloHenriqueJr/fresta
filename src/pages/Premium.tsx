import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ArrowRight, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  savings?: string;
}

const plans: PricingPlan[] = [
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 9,99",
    period: "/mês",
  },
  {
    id: "annual",
    name: "Anual",
    price: "R$ 49,90",
    period: "",
    badge: "MELHOR VALOR",
    savings: "Economize 58%",
  },
];

const features = [
  "Calendários Ilimitados",
  "Remover Branding",
  "Templates Exclusivos",
  "Exportar para PDF/Imagem",
  "Analytics Detalhado",
];

const Premium = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("annual");

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - mobile only */}
      <motion.header
        className="px-4 py-4 flex items-center justify-between lg:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <button className="text-primary font-semibold lg:hidden">Restaurar</button>
      </motion.header>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-4 py-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Seja Premium</h1>
            <p className="text-sm text-muted-foreground">Desbloqueie todo o potencial</p>
          </div>
        </div>
        <button className="text-primary font-semibold">Restaurar Assinatura</button>
      </div>

      <div className="px-4 max-w-[1600px] lg:mx-auto">
        {/* Crown Image */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-64 h-52 bg-gradient-to-b from-accent/20 to-transparent rounded-3xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className="w-24 h-24 text-accent" />
            </div>
            <div className="absolute bottom-4 w-40 h-28 bg-card/80 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-5xl">📅</span>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-extrabold text-foreground">
            Seja Premium e
          </h1>
          <h2 className="text-2xl font-extrabold text-primary">
            Crie sem Limites
          </h2>
          <p className="text-muted-foreground mt-2">
            Desbloqueie todo o potencial do seu calendário festivo.
          </p>
        </motion.div>

        {/* Features & Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-lg text-foreground mb-2">Recursos Inclusos</h3>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">{feature}</span>
              </div>
            ))}

            <div className="hidden lg:block pt-6">
              <motion.button
                onClick={() => navigate(`/checkout/${selectedPlan}`)}
                className="btn-festive w-full flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Assinar Agora
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Assinatura recorrente. Cancele quando quiser.
              </p>
            </div>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div
            className="flex flex-col md:flex-row lg:flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`flex-1 p-6 rounded-2xl border-2 transition-all relative text-left ${selectedPlan === plan.id
                  ? "border-primary bg-secondary/50 shadow-sm"
                  : "border-border bg-card hover:border-primary/50"
                  }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">
                      {plan.name}
                    </p>
                    <p className="text-3xl font-extrabold text-foreground">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {plan.period}
                      </span>
                    </p>
                    {plan.savings && (
                      <p className="text-xs text-primary font-bold mt-2 bg-primary/10 inline-block px-2 py-0.5 rounded">
                        {plan.savings}
                      </p>
                    )}
                  </div>
                  {selectedPlan === plan.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border lg:hidden">
        <motion.button
          onClick={() => navigate(`/checkout/${selectedPlan}`)}
          className="w-full max-w-lg mx-auto btn-festive flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Assinar Agora
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Payment methods */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span>📱</span> Pix
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <span>💳</span> Cartão
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <span>🔒</span> Seguro
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
          <button className="underline">Termos de Uso</button>
          <button className="underline">Privacidade</button>
        </div>
      </div>
    </div>
  );
};

export default Premium;

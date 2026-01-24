import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ArrowRight, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-[#F8F9F5]">
      {/* Premium Hero - High Impact */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-24 pt-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-16 right-[10%] w-40 h-40 bg-[#F9A03F]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-[15%] w-32 h-32 bg-[#4ECDC4]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <div className="flex justify-start mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <Crown className="w-5 h-5 text-solidroad-accent" />
            <span className="text-white text-sm font-bold tracking-widest uppercase">Experiência VIP</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-none">
            Crie sem <span className="text-solidroad-accent">Limites</span>
          </h1>
          <p className="text-xl text-white/70 font-medium max-w-lg mx-auto mb-8">
            Desbloqueie todo o potencial das suas contagens regressivas e surpreenda quem você ama.
          </p>

          <div className="flex justify-center -mb-32 relative z-20">
            <div className="w-64 h-48 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-solidroad-accent/10 to-transparent" />
              <Crown className="w-32 h-32 text-solidroad-accent/40 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 right-4 text-4xl transform rotate-12">🎁</div>
              <div className="absolute top-4 left-4 text-3xl transform -rotate-12">💖</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl pt-40 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Features Column */}
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h3 className="text-2xl font-black text-[#1A3E3A] mb-2">Por que ser Premium?</h3>
              <p className="text-[#5A7470] font-medium">Acesso total a todas as ferramentas criativas do Fresta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-[2rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 rounded-xl bg-solidroad-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Check className="w-5 h-5 text-solidroad-accent stroke-[3px]" />
                  </div>
                  <div>
                    <p className="font-black text-[#1A3E3A] mb-1">{feature}</p>
                    <p className="text-[10px] text-[#5A7470]/60 font-bold uppercase tracking-wider">Recurso Exclusivo</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-8 rounded-[2.5rem] bg-[#1A3E3A] text-white flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-solidroad-accent" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">Já é um dos nossos criadores?</p>
                <p className="text-white/60 text-sm">Restaure sua compra se você já assinou anteriormente em outro dispositivo.</p>
              </div>
              <button className="md:ml-auto px-6 h-12 rounded-xl bg-white text-[#1A3E3A] font-black text-sm hover:bg-solidroad-accent transition-colors shadow-lg">RESTAURAR</button>
            </div>
          </div>

          {/* Pricing Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-[rgba(0,0,0,0.04)] sticky top-32">
              <h3 className="text-xl font-black text-[#1A3E3A] mb-8 text-center uppercase tracking-widest">Escolha seu plano</h3>

              <div className="space-y-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "w-full p-6 rounded-[2.5rem] border-2 transition-all relative text-left group",
                      selectedPlan === plan.id
                        ? "border-solidroad-accent bg-solidroad-accent/5 shadow-xl scale-[1.02]"
                        : "border-[rgba(0,0,0,0.06)] bg-[#F8F9F5] hover:border-solidroad-accent/30"
                    )}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 left-8 bg-solidroad-accent text-solidroad-text text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg brightness-110">
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", selectedPlan === plan.id ? "text-solidroad-accent" : "text-[#5A7470]")}>
                        PLANO {plan.name}
                      </p>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedPlan === plan.id ? "bg-solidroad-accent border-solidroad-accent" : "border-slate-300"
                      )}>
                        {selectedPlan === plan.id && <Check className="w-3.5 h-3.5 text-solidroad-text stroke-[4px]" />}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#1A3E3A] tracking-tighter">{plan.price}</span>
                      <span className="text-sm font-bold text-[#5A7470]/60 lowercase">{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#E8F5E0] text-[#2D7A5F] text-[10px] font-black uppercase tracking-wider">
                        {plan.savings}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/checkout/${selectedPlan}`)}
                className="w-full h-16 bg-[#1A3E3A] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1A3E3A]/20 flex items-center justify-center gap-2 mt-8 hover:bg-[#1B4D3E] transition-all"
              >
                ASSINAR AGORA
                <ArrowRight className="w-6 h-6" />
              </motion.button>

              <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#5A7470]/40">
                <div className="flex items-center gap-2"><span>📱</span> PIX</div>
                <div className="flex items-center gap-2"><span>💳</span> CARTÃO</div>
                <div className="flex items-center gap-2"><span>🔒</span> SEGURO</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button - logic for mobile checkout? No, just the internal scroll is fine. */}
      {/* Footer support text */}
      <div className="container mx-auto px-6 max-w-5xl pb-16 text-center">
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#5A7470]/60">
          <button className="hover:text-solidroad-accent underline decoration-2 underline-offset-4">Termos de Uso</button>
          <span>•</span>
          <button className="hover:text-solidroad-accent underline decoration-2 underline-offset-4">Privacidade</button>
        </div>
      </div>
    </div>
  );
};

export default Premium;

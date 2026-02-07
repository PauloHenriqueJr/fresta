/**
 * Plus Page - Pay-Per-Calendar Model
 * Single payment for calendar upgrade, not subscription
 * Brand Identity: Verde Floresta + Dourado
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Sparkles,
  Camera,
  Video,
  Palette,
  Lock,
  Infinity as InfinityIcon,
  Gift,
  Zap,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PRICING } from "@/lib/services/payment";
import { useAuth } from "@/state/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import type { Calendar } from "@/lib/data/CalendarsRepository";

// Plus features list
const PREMIUM_FEATURES = [
  {
    icon: InfinityIcon,
    title: "Até 365 dias",
    description: "Contagens longas para eventos especiais",
  },
  {
    icon: Camera,
    title: "Fotos Ilimitadas",
    description: "Adicione memórias especiais em cada dia",
  },
  {
    icon: Video,
    title: "Vídeos do YouTube, TikTok, Spotify",
    description: "Embeds de suas mídias favoritas",
  },
  {
    icon: Palette,
    title: "Todos os Temas",
    description: "Acesso a temas exclusivos premium",
  },
  {
    icon: Lock,
    title: "Proteção por Senha",
    description: "Privacidade total do seu calendário",
  },
  {
    icon: Crown,
    title: "Sem Anúncios",
    description: "Experiência limpa e profissional",
  },
];

// Optional addons
const ADDONS = [
  {
    id: "addon_ai",
    name: "Gerador de Textos IA",
    description: "Deixe a IA criar mensagens especiais",
    price: PRICING.ADDON_AI.price_cents,
    icon: Zap,
  },
  {
    id: "pdf_kit",
    name: "Kit Memória Física",
    description: "Imprima seu calendário em PDF para ter uma lembrança física",
    price: PRICING.PDF_KIT.price_cents,
    icon: Gift,
  },
];

const Plus = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const calendarIdFromUrl = searchParams.get("calendar");

  const [userCalendars, setUserCalendars] = useState<Calendar[]>([]);
  const [loadingCalendars, setLoadingCalendars] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(calendarIdFromUrl);

  useEffect(() => {
    if (isAuthenticated && !calendarIdFromUrl) {
      loadUserCalendars();
    }
  }, [isAuthenticated, calendarIdFromUrl]);

  const loadUserCalendars = async () => {
    if (!user?.id) return;
    setLoadingCalendars(true);
    try {
      const { data, error } = await supabase
        .from("calendars")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const calendarsData = (data as any[]) || [];
      setUserCalendars(calendarsData as Calendar[]);

      // Auto-select first free calendar if available
      const freeCalendar = calendarsData.find(c => !c.is_premium);
      if (freeCalendar) {
        setSelectedCalendarId(freeCalendar.id);
      } else if (calendarsData.length > 0) {
        setSelectedCalendarId(calendarsData[0].id);
      }
    } catch (err) {
      console.error("Error loading calendars:", err);
    } finally {
      setLoadingCalendars(false);
    }
  };

  const handleCheckout = () => {
    if (selectedCalendarId) {
      navigate(`/checkout/${selectedCalendarId}`);
    } else {
      const url = isAuthenticated ? "/criar" : "/entrar?redirect=/plus";
      navigate(url);
    }
  };

  const formatPrice = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section - Brand Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-24 pt-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="circles" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="4" fill="white" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-[15%] w-64 h-64 bg-[#F9A03F]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-[10%] w-48 h-48 bg-[#4ECDC4]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          {/* Back button */}
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

          {/* Hero content */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Crown className="w-5 h-5 text-[#FFD166]" />
              <span className="text-white text-sm font-bold tracking-wider uppercase">
                Pagamento Único
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight"
            >
              Calendário <span className="text-[#FFD166]">Plus</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 font-medium max-w-lg mx-auto mb-8"
            >
              Desbloqueie todos os recursos e faça um presente inesquecível
            </motion.p>

            {/* Price card floating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-card rounded-3xl shadow-2xl p-8 -mb-20 border border-border/10"
            >
              <div className="text-muted-foreground text-sm font-medium mb-1">
                Pagamento único por calendário
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-black text-foreground">
                  {formatPrice(PRICING.PREMIUM.price_cents)}
                </span>
              </div>
              <div className="text-[#2D7A5F] text-sm font-bold">
                ✓ Vitalício para este calendário
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Selection / Journey Section */}
      {!calendarIdFromUrl && (
        <div className="container mx-auto px-6 max-w-4xl pt-32 pb-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">
              Sua jornada <span className="text-solidroad-accent">Plus</span> começa aqui
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Escolha como você quer começar sua experiência premium.
              {isAuthenticated ? " Crie algo novo ou turbine um de seus projetos." : " Entre para começar."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card: Create New */}
            <motion.button
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(249, 160, 63, 0.2)" }}
              onClick={() => navigate("/explorar")}
              className="group relative overflow-hidden rounded-[2.5rem] bg-card border border-border/10 p-8 text-left transition-all h-full flex flex-col justify-between min-h-[280px]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 text-solidroad-accent" />
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-solidroad-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palette className="w-7 h-7 text-solidroad-accent" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2 group-hover:text-solidroad-accent transition-colors tracking-tight">
                  Explorar Temas Premium
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Comece um novo calendário com temas exclusivos, layouts diferenciados e recursos Plus ilimitados.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-solidroad-accent font-black text-sm uppercase tracking-widest">
                Começar agora <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Card: Upgrade Existing */}
            <motion.button
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(45, 122, 95, 0.2)" }}
              onClick={() => navigate("/meus-calendarios")}
              className="group relative overflow-hidden rounded-[2.5rem] bg-card border border-border/10 p-8 text-left transition-all h-full flex flex-col justify-between min-h-[280px]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-solidroad-green">
                <CalendarIcon className="w-24 h-24" />
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-solidroad-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-solidroad-green" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2 group-hover:text-solidroad-green transition-colors tracking-tight">
                  Turbinar um Existente
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Selecione um calendário que você já criou para destravar o tempo vitalício e fotos ilimitadas.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-solidroad-green font-black text-sm uppercase tracking-widest">
                Ver meus projetos <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className={cn(
        "container mx-auto px-6 max-w-5xl pb-16",
        (!calendarIdFromUrl && isAuthenticated) ? "pt-12" : "pt-32"
      )}>
        <h2 className="text-2xl font-black text-foreground mb-2 text-center">
          Tudo que você desbloqueia
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Recursos exclusivos para criar o presente perfeito
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PREMIUM_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-card border border-border/10 hover:shadow-lg transition-all group"
            >
              <div className={cn(
                "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
                "bg-gradient-to-br from-[#1B4D3E]/10 to-[#2D7A5F]/10",
                "group-hover:scale-110 transition-transform"
              )}>
                <feature.icon className="w-6 h-6 text-[#2D7A5F]" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Comparison: Free vs Plus */}
      <div className="container mx-auto px-6 max-w-3xl pb-16">
        <div className="bg-[#1A3E3A] rounded-3xl p-8 text-white">
          <h3 className="text-xl font-bold mb-6 text-center">Free vs Plus</h3>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-white/40">Recurso</div>
            <div className="text-center font-bold text-white/40">Free</div>
            <div className="text-center font-bold text-[#FFD166]">Plus</div>

            <div>Dias do calendário</div>
            <div className="text-center">7</div>
            <div className="text-center text-[#FFD166]">365</div>

            <div>Mensagens de texto</div>
            <div className="text-center text-[#4ECDC4]">✓</div>
            <div className="text-center text-[#4ECDC4]">✓</div>

            <div>Links (vídeo, música, gif)</div>
            <div className="text-center text-[#4ECDC4]">✓</div>
            <div className="text-center text-[#4ECDC4]">✓</div>

            <div>Upload de fotos</div>
            <div className="text-center text-red-400">✗</div>
            <div className="text-center text-[#4ECDC4]">✓</div>

            <div>Upload de GIFs</div>
            <div className="text-center text-red-400">✗</div>
            <div className="text-center text-[#4ECDC4]">✓</div>

            <div>Temas Exclusivos</div>
            <div className="text-center text-red-400">✗</div>
            <div className="text-center text-[#4ECDC4]">✓</div>

            <div>Proteção por senha</div>
            <div className="text-center text-red-400">✗</div>
            <div className="text-center text-[#4ECDC4]">✓</div>

            <div>Sem anúncios</div>
            <div className="text-center text-red-400">✗</div>
            <div className="text-center text-[#4ECDC4]">✓</div>

            <div>Validade</div>
            <div className="text-center text-white/40">30 dias</div>
            <div className="text-center text-[#FFD166]">∞ Vitalício</div>
          </div>
        </div>
      </div>

      {/* Optional Addons */}
      <div className="container mx-auto px-6 max-w-3xl pb-16">
        <h3 className="text-xl font-bold text-foreground mb-6 text-center">
          Opções Extras
        </h3>

        <div className="space-y-3">
          {ADDONS.map((addon) => (
            <div
              key={addon.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/10"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <addon.icon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground">{addon.name}</h4>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">
                  +{formatPrice(addon.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 max-w-md pb-24">
        {/* Calendar Preview - Show which calendar will be upgraded */}
        {selectedCalendarId && userCalendars.length > 0 && (
          <div className="mb-6 p-5 rounded-2xl bg-card border-2 border-solidroad-accent/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-solidroad-accent/10 flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-solidroad-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Calendário Selecionado
                </p>
                <h4 className="font-bold text-foreground truncate">
                  {userCalendars.find(c => c.id === selectedCalendarId)?.title || "Meu Calendário"}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Este calendário será desbloqueado com todos os recursos Plus
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-solidroad-green">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">Pronto para upgrade</span>
            </div>
          </div>
        )}

        <motion.button
          whileHover={selectedCalendarId ? { scale: 1.02 } : {}}
          whileTap={selectedCalendarId ? { scale: 0.98 } : {}}
          onClick={handleCheckout}
          disabled={!selectedCalendarId}
          className={cn(
            "w-full py-5 rounded-2xl font-black text-lg",
            selectedCalendarId
              ? "bg-[#F9A03F] text-[#1A3E3A] shadow-lg shadow-[#F9A03F]/30 hover:shadow-xl"
              : "bg-muted text-muted-foreground cursor-not-allowed",
            "flex items-center justify-center gap-3",
            "transition-all"
          )}
        >
          <Sparkles className="w-6 h-6" />
          {selectedCalendarId ? "Desbloquear Este Calendário" : "Selecione um Calendário"}
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        {!selectedCalendarId && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            👆 Escolha uma das opções acima para continuar
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-6 text-xs font-bold text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <span>📱</span> PIX
          </div>
          <div className="flex items-center gap-2">
            <span>🔒</span> SEGURO
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span> INSTANTÂNEO
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 text-foreground">
          Pagamento processado via AbacatePay. Taxa fixa de R$ 0,80 por transação.
        </p>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 max-w-5xl pb-8 text-center text-foreground">
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-muted-foreground/60">
          <button onClick={() => navigate("/termos")} className="hover:text-foreground underline underline-offset-4">
            Termos de Uso
          </button>
          <span>•</span>
          <button onClick={() => navigate("/privacidade")} className="hover:text-foreground underline underline-offset-4">
            Privacidade
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plus;

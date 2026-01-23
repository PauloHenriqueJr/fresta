import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Gift,
  Share2,
  Heart,
  Star,
  PartyPopper,
  Users,
  Zap,
  ArrowRight,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";

// Assets
import mascotNoivado from "@/assets/mascot-noivado.jpg";
import mascotBodas from "@/assets/mascot-bodas.jpg";
import mascotPeeking from "@/assets/mascot-peeking.png";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotLove from "@/assets/mascot-love.png";
import calendarMockup from "@/assets/calendar-mockup.png";

type ThemeConfig = {
  id: 'carnaval' | 'love';
  name: string;
  primaryGradient: string;
  accentGradient: string;
  floatingElement: 'confetti' | 'hearts';
  mascot: any;
  emojis: {
    logo: string;
    hero: string;
    section: string;
  };
  colors: {
    primary: string;
    accent: string;
    textGradient: string;
    lightBloom: string;
  };
};

const THEMES: Record<string, ThemeConfig> = {
  carnaval: {
    id: 'carnaval',
    name: 'Carnaval',
    primaryGradient: 'bg-gradient-festive',
    accentGradient: 'bg-gradient-carnaval',
    floatingElement: 'confetti',
    mascot: mascotPeeking,
    emojis: {
      logo: '🎭',
      hero: '🎊',
      section: '🕺'
    },
    colors: {
      primary: 'hsl(270, 60%, 55%)',
      accent: 'hsl(45, 95%, 55%)',
      textGradient: 'text-gradient-festive',
      lightBloom: 'bg-amber-400/20'
    }
  },
  love: {
    id: 'love',
    name: 'Namoro',
    primaryGradient: 'bg-gradient-to-br from-red-500 to-rose-600',
    accentGradient: 'bg-gradient-to-br from-pink-400 to-red-400',
    floatingElement: 'hearts',
    mascot: mascotLove,
    emojis: {
      logo: '💌',
      hero: '💖',
      section: '👩‍❤️‍👨'
    },
    colors: {
      primary: 'hsl(350, 80%, 60%)',
      accent: 'hsl(340, 90%, 70%)',
      textGradient: 'bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent italic pb-2 pr-4',
      lightBloom: 'bg-red-400/10'
    }
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEMES.carnaval);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { settings, isLoading: isSettingsLoading } = useGlobalSettings();

  // Role-based redirect for logged-in users
  const { role: authRole } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Prefer role from hook, fallback to localStorage if needed
      const userRole = authRole || localStorage.getItem('fresta_user_role') || 'user';

      if (['admin', 'rh'].includes(userRole)) {
        navigate("/b2b", { replace: true });
      } else {
        navigate("/meus-calendarios", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, authRole]);

  // For Guests: Check if there's a last visited calendar to resume
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const lastCalendar = localStorage.getItem('fresta_last_visited_calendar');
      if (lastCalendar) {
        // If we have a saved calendar, offering a quick way back is great UX
        toast("Bem-vindo de volta! 🚪", {
          description: "Deseja voltar para o último fresta que você viu?",
          action: {
            label: "Voltar para calendário",
            onClick: () => navigate(lastCalendar)
          },
          duration: 8000
        });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Persistence: Check Global Settings on mount or update
  useEffect(() => {
    // 1. URL overrides everything (for testing)
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    if (themeParam && THEMES[themeParam]) {
      setCurrentTheme(THEMES[themeParam]);
      return;
    }

    // 2. Check Global Settings from Supabase
    if (!isSettingsLoading && settings.activeTheme) {
      const active = settings.activeTheme as string;
      // Map 'namoro' -> 'love' config if needed (or ensure consistency)
      // Our THEMES keys are 'carnaval', 'love'
      // If db activeTheme is 'namoro', we map to 'love'
      if (active === 'namoro' || active === 'love') {
        setCurrentTheme(THEMES.love);
      } else {
        setCurrentTheme(THEMES.carnaval);
      }
    }
  }, [isSettingsLoading, settings.activeTheme]);


  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const { scrollYProgress } = useScroll();
  const mascotOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0.4, 0.8, 1]);
  const lightIntensity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);

  const features = [
    {
      icon: Calendar,
      title: "Calendários Temáticos",
      description: currentTheme.id === 'love'
        ? "Dia dos Namorados, Aniversários e muito mais"
        : "Carnaval, São João, Natal e muito mais"
    },
    {
      icon: Gift,
      title: "Surpresas Diárias",
      description: "Textos, fotos, GIFs, cupons e links"
    },
    {
      icon: Share2,
      title: "Compartilhe com Amor",
      description: "Envie para quem você ama via WhatsApp"
    },
    {
      icon: Users,
      title: "Feito para Todos",
      description: "Casais, amigos, família e empresas"
    }
  ];

  const themeDisplay = [
    {
      name: "Carnaval",
      emoji: "🎭",
      gradientClass: "bg-gradient-carnaval",
      mascot: mascotCarnaval
    },
    {
      name: "São João",
      emoji: "🔥",
      gradientClass: "bg-gradient-saojoao",
      mascot: mascotSaoJoao
    },
    {
      name: "Namoro",
      emoji: "❤️",
      gradientClass: "bg-gradient-to-br from-red-500 to-rose-600",
      mascot: mascotLove
    }
  ];

  const testimonials = [
    {
      name: "Marina Silva",
      role: "Criadora de conteúdo",
      text: "Meu namorado amou! Cada dia foi uma surpresa diferente 💕",
      avatar: "👩🏻"
    },
    {
      name: "Pedro Santos",
      role: "Empreendedor",
      text: "Usei para engajar meus clientes no Carnaval. Resultado incrível!",
      avatar: "👨🏽"
    },
    {
      name: "Ana Costa",
      role: "Professora",
      text: "As crianças adoraram o calendário de São João da escola!",
      avatar: "👩🏼"
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: currentTheme.floatingElement === 'hearts' ? '#f43f5e' : [
                'hsl(270, 60%, 55%)',
                'hsl(330, 70%, 60%)',
                'hsl(45, 95%, 55%)',
                'hsl(25, 90%, 55%)',
                'hsl(145, 63%, 42%)'
              ][i % 5],
              opacity: 0.2
            }}
            animate={{ y: [0, -40, 0], rotate: [0, 180, 360], scale: [1, 1.3, 1] }}
            transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          >
            {currentTheme.floatingElement === 'hearts' ? <Heart className="w-4 h-4 fill-current" /> : <div className="w-3 h-3 rounded-sm bg-current" />}
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 lg:pt-28 overflow-hidden z-10 text-pretty">
        {/* Desktop Header */}
        <motion.header className="fixed top-0 left-0 right-0 z-50 hidden lg:block" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mx-auto max-w-[1500px] px-8">
            <div className="mt-4 rounded-2xl border border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center justify-between px-5 py-3">
                <button onClick={() => navigate("/")} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${currentTheme.primaryGradient} flex items-center justify-center text-xl`}>
                    🚪
                  </div>
                  <span className="font-extrabold text-xl">Fresta</span>
                </button>
                <nav className="flex items-center gap-1">
                  {['Explorar', 'Premium', isAuthenticated ? 'Meus Calendários' : 'Entrar'].map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        if (item === 'Meus Calendários') navigate('/meus-calendarios');
                        else if (item === 'Entrar') navigate('/portal');
                        else navigate(`/${item.toLowerCase()}`);
                      }}
                      className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-muted"
                    >
                      {item}
                    </button>
                  ))}
                </nav>
                <button onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")} className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${currentTheme.primaryGradient}`}>Criar calendário</button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center lg:max-w-[1500px] lg:px-8 lg:text-left">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
            {/* The Fresta: Door Animation */}
            <motion.div className="relative mb-12 lg:mb-0 lg:col-span-6 lg:order-2 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="relative w-72 h-[450px] lg:w-[450px] lg:h-[650px] xl:w-[550px] xl:h-[750px] perspective-2000">
                <div className="absolute inset-0 border-[12px] lg:border-[20px] border-amber-900/40 rounded-t-[3rem] lg:rounded-t-[4rem] overflow-hidden shadow-2xl bg-amber-950">
                  <div className="absolute inset-0 z-0">
                    <motion.img
                      src={currentTheme.mascot}
                      alt="Interior"
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700"
                      style={{
                        scale: useTransform(scrollYProgress, [0, 0.2], [1, 1.1]),
                        x: mousePos.x * 0.5,
                        y: mousePos.y * 0.5
                      }}
                    />
                    <div className={`absolute inset-0 ${currentTheme.colors.lightBloom} mix-blend-overlay`} />
                  </div>

                  <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/30 via-transparent to-transparent z-10 pointer-events-none" style={{ opacity: lightIntensity }} />

                  <div className="absolute inset-0 flex z-20">
                    {['left', 'right'].map(side => (
                      <motion.div
                        key={side}
                        className={`flex-1 h-full bg-gradient-to-b from-amber-800 to-amber-950 flex items-center ${side === 'left' ? 'border-r border-amber-700 justify-end' : 'border-l border-amber-700 justify-start relative'}`}
                        style={{ x: useTransform(scrollYProgress, [0, 0.2], ["0%", side === 'left' ? "-100%" : "100%"]), rotateY: useTransform(scrollYProgress, [0, 0.2], [0, side === 'left' ? -45 : 45]) }}
                      >
                        <div className={`w-1 h-[80%] bg-amber-700/30 rounded-full ${side === 'left' ? 'mr-2' : 'ml-2'}`} />
                        {side === 'right' && <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-12 lg:w-6 lg:h-20 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shadow-lg border border-amber-300/50" />}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hero Copy */}
            <div className="lg:col-span-6 lg:order-1 py-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative">
                <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] mb-8 lg:text-7xl xl:text-8xl xl:leading-[0.9] tracking-tighter py-2">
                  O que será que <br /> <span className={`inline-block pb-4 ${currentTheme.colors.textGradient}`}>tem lá dentro?</span>
                </h1>
                <p className="text-muted-foreground text-lg lg:text-xl xl:text-2xl font-medium leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0 lg:max-w-xl">
                  Crie calendários de surpresas para quem você ama. Uma porta por dia, uma emoção diferente.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
                  <button onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-xl text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${currentTheme.primaryGradient}`}>
                    <Sparkles className="w-6 h-6" /> Criar meu calendário
                  </button>
                  <button onClick={() => navigate("/explorar")} className="px-8 py-4 rounded-2xl font-black text-xl bg-muted hover:bg-muted/80 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                    {currentTheme.id === 'love' ? <Heart className="w-5 h-5" /> : <Star className="w-5 h-5" />} Ver exemplos
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="relative py-24 lg:py-48 px-4 bg-background overflow-hidden border-t border-border/50">
        <div className="max-w-[1500px] mx-auto relative z-10 text-pretty">
          <div className="text-center mb-24 px-4">
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-6 leading-tight">A Magia <span className={`pb-4 inline-block ${currentTheme.colors.textGradient}`}>por Trás da Porta</span></h2>
            <p className="text-muted-foreground text-lg lg:text-2xl font-medium max-w-2xl mx-auto">Cada dia é um novo portal para um momento inesquecível. Veja como o Fresta transforma sua espera em celebração.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative flex justify-center group px-4">
            <div className={`absolute inset-0 blur-[150px] rounded-full opacity-20 scale-125 transition-colors duration-1000 ${currentTheme.id === 'love' ? 'bg-rose-500' : 'bg-primary'}`} />
            <img src={calendarMockup} alt="Showcase" className="relative w-full max-w-5xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white z-10" />
            <div className="absolute -left-10 top-1/4 hidden xl:block z-20">
              <motion.div
                className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-2 max-w-[240px]"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className={`w-10 h-10 rounded-xl ${currentTheme.primaryGradient} flex items-center justify-center mb-3`}><Gift className="w-5 h-5 text-white" /></div>
                <h4 className="font-black text-lg">Presentes Diários</h4>
                <p className="text-sm text-muted-foreground font-medium">Fotos, mensagens e cupons escondidos em cada porta.</p>
              </motion.div>
            </div>
            <div className="absolute -right-10 bottom-1/4 hidden xl:block z-20">
              <motion.div
                className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-2 max-w-[240px]"
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className={`w-10 h-10 rounded-xl ${currentTheme.accentGradient} flex items-center justify-center mb-3`}><Zap className="w-5 h-5 text-white" /></div>
                <h4 className="font-black text-lg">Envio Instantâneo</h4>
                <p className="text-sm text-muted-foreground font-medium">Compartilhe o link e deixe a magia acontecer no navegador.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-border/50 bg-card/30">
        <div className="max-w-[1500px] mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { value: "50k+", label: "Portas Abertas", icon: PartyPopper },
              { value: "12k+", label: "Momentos Mágicos", icon: Heart },
              { value: "4.9/5", label: "Satisfação", icon: Star },
              { value: "100%", label: "Seguro & Privado", icon: Lock }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <div className="flex justify-center mb-4">
                    <Icon className={`w-8 h-8 opacity-50 ${currentTheme.id === 'love' ? 'text-rose-500' : 'text-primary'}`} />
                  </div>
                  <p className="text-4xl lg:text-6xl font-black text-foreground tracking-tighter mb-1">{stat.value}</p>
                  <p className="text-xs lg:text-sm font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 bg-background">
        <div className="max-w-[1500px] mx-auto lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} className="bg-card rounded-[2.5rem] p-10 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg ${currentTheme.primaryGradient}`}><feature.icon className="w-7 h-7" /></div>
                <h3 className="text-2xl font-black mb-3 tracking-tight leading-none h-12 flex items-center">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Display */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-[1500px] mx-auto lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6 px-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-4 leading-none">Temas para todas as <br /> <span className="text-gradient-carnaval">festas</span></h2>
              <p className="text-muted-foreground text-xl font-medium mt-6">Do Carnaval ao Natal, temos o visual perfeito para o seu momento mágico.</p>
            </div>
            <button onClick={() => navigate("/explorar")} className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs bg-muted text-foreground hover:bg-muted/80 transition-colors shadow-sm">Ver todos os temas</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {themeDisplay.map((item, index) => (
              <motion.div key={index} className={`relative overflow-hidden rounded-[3rem] p-10 ${item.gradientClass} text-primary-foreground group cursor-pointer shadow-2xl`} whileHover={{ y: -10 }} onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")}>
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                  <div>
                    <span className="text-4xl mb-4 block">{item.emoji}</span>
                    <h3 className="text-3xl font-black mb-2 tracking-tight">{item.name}</h3>
                    <p className="text-primary-foreground/90 font-bold leading-snug">Crie agora seu calendário de {item.name}</p>
                  </div>
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] bg-white/20 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">Começar agora <ArrowRight className="w-3 h-3" /></div>
                </div>
                <img src={item.mascot} alt={item.name} className="absolute -right-4 -bottom-4 w-44 h-44 object-contain opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 bg-background">
        <div className="max-w-[1500px] mx-auto lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-4 leading-none px-4">Quem usa, <br /> <span className={`inline-block pb-2 ${currentTheme.colors.textGradient}`}>ama de verdade</span> 💕</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} className="bg-card/50 backdrop-blur-xl rounded-[3rem] p-10 border border-white/20 shadow-2xl transition-all hover:scale-[1.02]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="flex gap-1 mb-6 text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
                <p className="text-foreground text-xl italic mb-8 leading-relaxed font-medium">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl shadow-inner border-2 border-white">{testimonial.avatar}</div>
                  <div>
                    <p className="font-extrabold text-foreground text-lg tracking-tight leading-none">{testimonial.name}</p>
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest opacity-60 mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24 lg:py-48 px-4">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className={`${currentTheme.primaryGradient} rounded-[4rem] p-12 lg:p-24 text-white text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
            <Zap className="w-16 h-16 mx-auto mb-8 text-yellow-300 relative z-10" />
            <h2 className="text-5xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] relative z-10 px-4">Libere a <br /> <span className="text-white/80">Magia Premium</span></h2>
            <p className="text-xl lg:text-3xl font-medium mb-12 max-w-2xl mx-auto opacity-90 relative z-10 px-4">Calendários ilimitados, mais tipos de surpresa e nenhuma marca d'água.</p>
            <button onClick={() => navigate("/premium")} className="py-6 px-12 rounded-[2rem] font-black text-2xl text-primary bg-white hover:bg-yellow-50 transition-all hover:shadow-2xl hover:scale-105 active:scale-95 relative z-10">Conhecer Planos</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-4 bg-card border-t border-border/50 text-center">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex items-center justify-center gap-2 mb-10"><span className="text-4xl">🚪</span><span className="font-black text-4xl tracking-tighter">Fresta</span></div>
          <p className="text-muted-foreground font-bold text-base">© 2024 Fresta. Feito com 💚 para o Brasil.</p>
          <div className="mt-8 flex justify-center gap-6 text-muted-foreground/60 font-black uppercase tracking-widest text-xs">
            <button className="hover:text-primary transition-colors">Ajuda</button>
            <button className="hover:text-primary transition-colors" onClick={() => navigate("/portal")}>Portal RH / Empresas</button>
            <button className="hover:text-primary transition-colors" onClick={() => navigate("/privacidade")}>Privacidade</button>
            <button className="hover:text-primary transition-colors" onClick={() => navigate("/termos")}>Termos</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

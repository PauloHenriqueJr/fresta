import { motion, useScroll, useTransform } from "framer-motion";
import {
    Calendar,
    Gift,
    Share2,
    Heart,
    Star,
    PartyPopper,
    Users,
    Zap,
    ArrowRight,
    Lock,
    DoorOpen,
    Sparkles,
    Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/state/auth/AuthProvider";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";

// Assets
import mascotPeeking from "@/assets/mascot-peeking.png";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotLove from "@/assets/mascot-love.png";
import calendarMockup from "@/assets/calendar-mockup.png";

// Simple CSS Particles Component (No dependencies)
// Simple CSS Particles Component (Multi-color Confetti)
const SimpleParticles = () => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const particles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 8 + 4,
            duration: Math.random() * 15 + 8,
            delay: Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute opacity-60"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px', // Circles and Squares
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `float ${p.duration}s infinite linear`,
                        animationDelay: `-${p.delay}s`
                    }}
                />
            ))}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.8; }
                    50% { transform: translateY(-100px) translateX(50px) rotate(180deg); opacity: 0.6; }
                    80% { opacity: 0.8; }
                    100% { transform: translateY(-200px) translateX(100px) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

type ThemeConfig = {
    id: 'carnaval' | 'love' | 'carnaval-unique';
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
    fresta: {
        id: 'carnaval-unique',
        name: 'Carnaval Folia',
        primaryGradient: 'bg-gradient-to-br from-[#8B5CF6] to-[#D946EF]', // Violet to Pink
        accentGradient: 'bg-gradient-to-br from-[#F59E0B] to-[#F97316]', // Amber to Orange
        floatingElement: 'confetti',
        mascot: mascotCarnaval, // CARNAVAL MASCOT
        emojis: {
            logo: '🎭',
            hero: '🎉',
            section: '🥁'
        },
        colors: {
            primary: '#7C3AED', // Violet-600
            accent: '#F59E0B',  // Amber-500
            textGradient: 'text-[#4C1D95]', // Dark Violet for text
            lightBloom: 'bg-purple-400/20'
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

const LandingPageBrand = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    // Theme state
    const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEMES.fresta);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const { settings, isLoading: isSettingsLoading } = useGlobalSettings();

    const { role: authRole } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            const userRole = authRole || localStorage.getItem('fresta_user_role') || 'user';
            if (['admin', 'rh'].includes(userRole)) {
                navigate("/b2b", { replace: true });
            } else {
                navigate("/meus-calendarios", { replace: true });
            }
        }
    }, [isAuthenticated, isLoading, navigate, authRole]);

    useEffect(() => {
        if (!isSettingsLoading && settings.activeTheme) {
            const active = settings.activeTheme as string;
            if (active === 'namoro' || active === 'love') {
                setCurrentTheme(THEMES.love);
            } else {
                setCurrentTheme(THEMES.fresta);
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
    const mascotOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0.4, 0.8, 1]); // Kept but unused ref
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

    // BRAND CONSTANTS
    // BRAND CONSTANTS (Overrides for Carnaval)
    const BRAND_BG_GRADIENT = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-white";

    return (
        // FRAME LAYOUT: Thicker White Frame and Mobile Responsive
        <div ref={containerRef} className="min-h-screen bg-white relative font-sans p-2 lg:p-4 pb-0">

            {/* SOLIDROAD STYLE HEADER - Exact Replica Notch */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
                {/* Desktop Notch - Wider and Cleaner */}
                <div className="hidden lg:flex pointer-events-auto bg-white px-12 py-5 rounded-b-[2rem] shadow-sm border-x border-b border-black/[0.03] items-center justify-between gap-16 min-w-[600px] relative">
                    <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: currentTheme.colors.primary }}>
                            <DoorOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight transition-colors duration-300" style={{ color: currentTheme.colors.primary }}>Fresta Folia</span>
                    </button>

                    <nav className="flex items-center gap-8">
                        {/* Dropdown triggers would go here, simplifying for now */}
                        {['Explorar', 'Premium', 'Para Empresas'].map(item => (
                            <button
                                key={item}
                                onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)}
                                className="text-base font-semibold text-[#5A7470] hover:text-[#1B4D3E] transition-colors flex items-center gap-1"
                            >
                                {item}
                                {/* Example chevron if needed: <ChevronDown className="w-4 h-4" /> */}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(isAuthenticated ? "/portal" : "/entrar")} className="font-bold hover:opacity-70 transition-opacity" style={{ color: currentTheme.colors.primary }}>
                            Entrar
                        </button>
                        <button
                            onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")}
                            className="px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                            style={{ backgroundColor: currentTheme.colors.accent }}
                        >
                            Criar calendário <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Header Mobile - Floating Capsule Style (Solidroad Reference) */}
                <div className="lg:hidden fixed top-0 inset-x-0 z-50 p-2 pointer-events-none">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-5 py-3 flex justify-between items-center pointer-events-auto">
                        <div className="flex items-center gap-2">
                            <DoorOpen className="w-6 h-6" style={{ color: currentTheme.colors.primary }} strokeWidth={2.5} />
                            <span className="font-extrabold text-lg" style={{ color: currentTheme.colors.primary }}>Fresta Folia</span>
                        </div>
                        <button className="p-2 -mr-2 text-gray-600 hover:text-gray-900">
                            <Menu className="w-6 h-6" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Background Particles - Confetes Coloridos */}
            <SimpleParticles />

            {/* Hero Section - Tema Light & Fun */}
            <section
                className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 pt-32 lg:pt-48 overflow-hidden z-10 rounded-[2rem] lg:rounded-[3rem] shadow-none w-full mt-2 lg:mt-0 transition-colors duration-500 bg-white"
            >

                {/* Subtle Texture/Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-fuchsia-100/60 via-transparent to-transparent opacity-80" />

                <div className="relative z-10 w-full max-w-lg mx-auto text-center lg:max-w-[1500px] lg:px-8 lg:text-left">
                    <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
                        {/* The Fresta: Door Animation (Kept mostly same but cleaner border) */}
                        <motion.div className="relative mb-12 lg:mb-0 lg:col-span-6 lg:order-2 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="relative w-72 h-[450px] lg:w-[450px] lg:h-[650px] xl:w-[550px] xl:h-[750px] perspective-2000">
                                <div className="absolute inset-0 border-[12px] lg:border-[20px] border-[#2D7A5F]/20 rounded-t-[3rem] lg:rounded-t-[4rem] overflow-hidden shadow-2xl bg-amber-950">
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
                                        {/* Slightly greener bloom */}
                                        <div className="absolute inset-0 bg-[#2D7A5F]/10 mix-blend-overlay" />
                                    </div>

                                    <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/30 via-transparent to-transparent z-10 pointer-events-none" style={{ opacity: lightIntensity }} />

                                    {/* Doors - Using Wood/Amber tones still as it matches the "Door" concept, but maybe with Green trims? */}
                                    <div className="absolute inset-0 flex z-20">
                                        {['left', 'right'].map(side => (
                                            <motion.div
                                                key={side}
                                                className={`flex-1 h-full bg-gradient-to-b from-amber-800 to-amber-950 flex items-center ${side === 'left' ? 'border-r border-amber-700 justify-end' : 'border-l border-amber-700 justify-start relative'}`}
                                                style={{ x: useTransform(scrollYProgress, [0, 0.15], ["0%", side === 'left' ? "-100%" : "100%"]), rotateY: useTransform(scrollYProgress, [0, 0.15], [0, side === 'left' ? -45 : 45]) }}
                                            >
                                                <div className={`w-1 h-[80%] bg-amber-700/30 rounded-full ${side === 'left' ? 'mr-2' : 'ml-2'}`} />
                                                {side === 'right' && <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-12 lg:w-6 lg:h-20 bg-gradient-to-b from-[#F9A03F] to-[#d97706] rounded-full shadow-lg border border-[#F9A03F]/50" />}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Copy - DARK TEXT ON LIGHT BG */}
                        <div className="lg:col-span-6 lg:order-1 py-8">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative">
                                <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-8 lg:text-7xl xl:text-8xl xl:leading-[1.0] tracking-tight py-2 text-slate-900">
                                    O Abre-Alas da <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 inline-block relative py-1">
                                        sua Alegria!
                                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#F59E0B]" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" /></svg>
                                    </span>
                                </h1>
                                <p className="text-slate-600 text-lg lg:text-xl xl:text-2xl font-medium leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0 lg:max-w-xl">
                                    Crie seu bloco de surpresas diárias. Desafios, fotos e momentos mágicos para animar sua folia.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
                                    <button onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")} className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-xl text-white shadow-xl shadow-violet-200 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-violet-600 to-fuchsia-600">
                                        <Sparkles className="w-6 h-6" /> Criar meu Bloco
                                    </button>
                                    <button onClick={() => navigate("/explorar")} className="px-8 py-4 rounded-full font-bold text-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                                        {currentTheme.id === 'love' ? <Heart className="w-5 h-5" /> : <Star className="w-5 h-5" />} Ver exemplos
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="relative py-24 lg:py-48 px-4 bg-white border-t border-[#1B4D3E]/5">
                <div className="max-w-[1500px] mx-auto relative z-10">
                    <div className="text-center mb-24 px-4">
                        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-[#1B4D3E]">A Magia <span className="text-[#2D7A5F]">por Trás da Porta</span></h2>
                        <p className="text-[#5A7470] text-lg lg:text-2xl font-medium max-w-2xl mx-auto">Cada dia é um novo portal para um momento inesquecível. Veja como o Fresta transforma sua espera em celebração.</p>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative flex justify-center group px-4">
                        <div className="absolute inset-0 blur-[150px] rounded-full opacity-20 scale-125 bg-[#5DBF94]" />
                        <img src={calendarMockup} alt="Showcase" className="relative w-full max-w-5xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white z-10" />

                        {/* Desktop floating cards - kept but styled with brand colors (white + green icons) */}
                        <div className="absolute -left-10 top-1/4 hidden xl:block z-20">
                            <motion.div
                                className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl space-y-2 max-w-[240px]"
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#E8F5E0] flex items-center justify-center mb-3"><Gift className="w-5 h-5 text-[#2D7A5F]" /></div>
                                <h4 className="font-bold text-lg text-[#1B4D3E]">Presentes Diários</h4>
                                <p className="text-sm text-[#5A7470] font-medium">Fotos, mensagens e cupons escondidos em cada porta.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section - SUTILE CURVES */}
            <section className="py-24 bg-violet-900 text-white rounded-[2rem] relative z-20 w-full my-2 shadow-sm">
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
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <Icon className="w-7 h-7 text-amber-400" />
                                        </div>
                                    </div>
                                    <p className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">{stat.value}</p>
                                    <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/60">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-4 bg-white">
                <div className="max-w-[1500px] mx-auto lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div key={feature.title} className="bg-[#F8F9F5] rounded-[2.5rem] p-10 hover:shadow-xl border border-transparent hover:border-[#2D7A5F]/20 transition-all duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg bg-violet-600"><feature.icon className="w-7 h-7" /></div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight leading-none h-12 flex items-center text-violet-900">{feature.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Themes Display - Maintained Dynamic because content is dynamic */}
            <section className="py-24 px-4 bg-[#E8F5E0]/30">
                <div className="max-w-[1500px] mx-auto lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6 px-4">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-none text-violet-900">Temas para todas as <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">festas</span></h2>
                        </div>
                        <button onClick={() => navigate("/explorar")} className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs bg-white text-violet-900 hover:bg-violet-50 transition-colors shadow-sm border border-violet-100">Ver todos os temas</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        {themeDisplay.map((item, index) => (
                            <motion.div key={index} className={`relative overflow-hidden rounded-[3rem] p-10 ${item.gradientClass} text-white group cursor-pointer shadow-xl`} whileHover={{ y: -10 }} onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")}>
                                <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                                    <div>
                                        <span className="text-4xl mb-4 block">{item.emoji}</span>
                                        <h3 className="text-3xl font-bold mb-2 tracking-tight">{item.name}</h3>
                                        <p className="text-white/90 font-medium leading-snug">Crie agora seu calendário de {item.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] bg-white/20 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">Começar agora <ArrowRight className="w-3 h-3" /></div>
                                </div>
                                <img src={item.mascot} alt={item.name} className="absolute -right-4 -bottom-4 w-44 h-44 object-contain opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Removed - Merged into Footer */}

            {/* Footer - SUTILE CURVES */}
            <footer className="pt-32 pb-12 px-4 bg-[#4C1D95] text-white overflow-hidden relative mt-2 rounded-t-[2rem] w-full mb-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="max-w-[1500px] mx-auto relative z-10">

                    {/* CTA PART */}
                    <div className="text-center mb-32 max-w-4xl mx-auto">
                        <div className="w-20 h-20 mx-auto mb-8 bg-amber-400 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                            <Sparkles className="w-10 h-10 text-violet-900" />
                        </div>
                        <h2 className="text-5xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
                            Crie a sua <span className="text-amber-400">Magia</span>
                        </h2>
                        <p className="text-xl lg:text-2xl text-[#A8E6CF] font-medium mb-12 max-w-2xl mx-auto">
                            Tudo pronto para surpreender? Comece agora e faça alguém sorrir todos os dias.
                        </p>
                        <button onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")} className="py-6 px-12 rounded-full font-bold text-2xl text-violet-900 bg-white hover:bg-gray-100 transition-all hover:shadow-2xl hover:scale-105 active:scale-95">
                            Começar Gratuitamente
                        </button>
                    </div>

                    <div className="h-px w-full bg-white/10 mb-12" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <DoorOpen className="w-8 h-8 text-amber-400" strokeWidth={2.5} />
                            <span className="font-extrabold text-3xl tracking-tight text-white">Fresta</span>
                        </div>

                        <div className="flex gap-8 text-[#A8E6CF] font-bold text-sm uppercase tracking-widest">
                            <button className="hover:text-white transition-colors">Ajuda</button>
                            <button className="hover:text-white transition-colors" onClick={() => navigate("/portal")}>Portal RH</button>
                            <button className="hover:text-white transition-colors" onClick={() => navigate("/privacidade")}>Privacidade</button>
                        </div>

                        <p className="text-white/40 font-medium text-sm">© 2024 Fresta.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPageBrand;

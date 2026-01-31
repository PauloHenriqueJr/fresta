/* eslint-disable react-hooks/rules-of-hooks */
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
    Menu,
    Sun,
    Moon,
} from "lucide-react";
import Loader from "@/components/common/Loader";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/state/auth/AuthProvider";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";

// Assets
import mascotPeeking from "@/assets/mascot-peeking.png";
import calendarMockup from "@/assets/calendar-mockup.png";
import { DynamicCalendarMockup } from "@/components/landing/DynamicCalendarMockup";
import { THEMES, type ThemeConfig } from "@/constants/landingThemes";

// Dynamic Theme Particles Component
const ThemeParticles = ({ theme }: { theme: string }) => {
    // Theme-specific particle configurations
    const themeConfigs: Record<string, { colors: string[]; shapes: ('circle' | 'square' | 'heart' | 'flag')[] }> = {
        carnaval: {
            colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
            shapes: ['circle', 'square']
        },
        saojoao: {
            colors: ['#EA580C', '#F59E0B', '#DC2626', '#15803D'],
            shapes: ['flag', 'circle']
        },
        namoro: {
            colors: ['#E11D48', '#FB7185', '#EC4899', '#F472B6'],
            shapes: ['heart']
        },
        casamento: {
            colors: ['#D4AF37', '#B8860B', '#F5F0E6', '#FBBF24'],
            shapes: ['circle']
        }
    };

    const config = themeConfigs[theme] || themeConfigs.carnaval;

    const particles = useMemo(() => {
        return Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 10 + 5,
            duration: Math.random() * 15 + 8,
            delay: Math.random() * 5,
            color: config.colors[Math.floor(Math.random() * config.colors.length)],
            rotation: Math.random() * 360,
            shape: config.shapes[Math.floor(Math.random() * config.shapes.length)]
        }));
    }, [config]);

    const renderShape = (p: typeof particles[0]) => {
        const baseStyle = {
            left: p.left,
            top: p.top,
            animation: `float ${p.duration}s infinite linear`,
            animationDelay: `-${p.delay}s`
        };

        switch (p.shape) {
            case 'heart':
                return (
                    <div key={p.id} className="absolute opacity-60" style={baseStyle}>
                        <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                );
            case 'flag':
                // Festa Junina Bandeirinha shape
                return (
                    <div key={p.id} className="absolute opacity-80" style={{ ...baseStyle, transform: `rotate(${p.rotation}deg)` }}>
                        <div style={{
                            width: `${p.size}px`,
                            height: `${p.size * 1.4}px`,
                            backgroundColor: p.color,
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)'
                        }} />
                    </div>
                );
            default:
                return (
                    <div
                        key={p.id}
                        className="absolute opacity-60"
                        style={{
                            ...baseStyle,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            backgroundColor: p.color,
                            borderRadius: p.shape === 'circle' ? '50%' : '2px',
                            transform: `rotate(${p.rotation}deg)`
                        }}
                    />
                );
        }
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map(renderShape)}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.7; }
                    50% { transform: translateY(-100px) translateX(50px) rotate(180deg); opacity: 0.5; }
                    80% { opacity: 0.7; }
                    100% { transform: translateY(-200px) translateX(100px) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};



const LandingPageBrand = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    // Theme state - default to carnaval or cached theme
    const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
        const cached = localStorage.getItem('fresta_active_theme');
        if (cached && THEMES[cached]) return THEMES[cached];
        return THEMES.carnaval;
    });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('fresta_theme');
        if (saved) return saved === 'dark';
        return false; // Default to light mode
    });

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = '#0E220E';
            localStorage.setItem('fresta_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.backgroundColor = '#F8F9F5';
            localStorage.setItem('fresta_theme', 'light');
        }
    };

    const { settings, isLoading: isSettingsLoading } = useGlobalSettings();

    // Prevent rendering content with wrong theme on initial load if no cache exists
    const [isStyleReady, setIsStyleReady] = useState(!!localStorage.getItem('fresta_active_theme'));

    const { role: authRole } = useAuth();

    useEffect(() => {
        if (!isSettingsLoading) {
            setIsStyleReady(true);
        }
    }, [isSettingsLoading]);

    // Force scroll to top on mount to ensure doors start closed
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // SEGURANÇA: authRole vem EXCLUSIVAMENTE do Supabase (user_roles table)
            // Não há possibilidade de manipulação via console/localStorage
            // O ProtectedRoute ainda valida novamente antes de renderizar qualquer rota protegida
            if (!authRole) return; // Aguarda role carregar do banco

            // Redirecionamento por role após login
            if (['admin', 'rh'].includes(authRole)) {
                navigate("/b2b", { replace: true });
            } else {
                navigate("/meus-calendarios", { replace: true });
            }
        }
    }, [isAuthenticated, isLoading, navigate, authRole]);

    useEffect(() => {
        if (!isSettingsLoading && settings.activeTheme) {
            const active = settings.activeTheme as string;
            // Map database theme to THEMES object
            // Support legacy 'love' mapping to 'namoro'
            const themeKey = active === 'love' ? 'namoro' : active;
            const theme = THEMES[themeKey];
            if (theme && theme.id !== currentTheme.id) {
                setCurrentTheme(theme);
                localStorage.setItem('fresta_active_theme', themeKey);
                console.log('[Theme] Theme synchronized with DB:', active, '-> Using:', themeKey);
            } else if (!theme) {
                // Fallback to carnaval if theme not found
                setCurrentTheme(THEMES.carnaval);
                localStorage.setItem('fresta_active_theme', 'carnaval');
                console.warn('[Theme] Unknown theme:', active, '-> Fallback to carnaval');
            }
        }
    }, [isSettingsLoading, settings.activeTheme, currentTheme.id]);

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
    const mascotScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
    const mascotOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0.4, 0.8, 1]); // Kept but unused ref
    const lightIntensity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);
    // Door animation transforms - MUST be defined at top level, not inside .map()
    const doorLeftX = useTransform(scrollYProgress, [0, 0.15], ["0%", "-100%"]);
    const doorLeftRotateY = useTransform(scrollYProgress, [0, 0.15], [0, -45]);
    const doorRightX = useTransform(scrollYProgress, [0, 0.15], ["0%", "100%"]);
    const doorRightRotateY = useTransform(scrollYProgress, [0, 0.15], [0, 45]);

    if (!isStyleReady) {
        return <Loader text="Entrando no Fresta..." />;
    }

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
            mascot: THEMES.carnaval.mascot
        },
        {
            name: "São João",
            emoji: "🔥",
            gradientClass: "bg-gradient-saojoao",
            mascot: THEMES.saojoao.mascot
        },
        {
            name: "Namoro",
            emoji: "❤️",
            gradientClass: "bg-gradient-to-br from-red-500 to-rose-600",
            mascot: THEMES.namoro.mascot
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
        // FRAME LAYOUT: Thicker White Frame and Mobile Responsive
        <div ref={containerRef} className="min-h-screen bg-white relative font-sans p-2 lg:p-4 pb-0">

            {/* SOLIDROAD STYLE HEADER - Exact Replica Notch */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
                {/* Desktop Notch - Wider and Cleaner */}
                <div className="hidden lg:flex pointer-events-auto bg-white dark:bg-zinc-900 px-12 py-5 rounded-b-[2rem] shadow-sm border-x border-b border-black/[0.03] dark:border-white/5 items-center justify-between gap-16 min-w-[600px] relative">
                    <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: currentTheme.colors.primary }}>
                            <DoorOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight transition-colors duration-300 dark:text-white" style={{ color: isDark ? 'white' : currentTheme.colors.primary }}>{currentTheme.brandName}</span>
                    </button>

                    <nav className="flex items-center gap-8">
                        {/* Dropdown triggers would go here, simplifying for now */}
                        {['Explorar', 'Premium', 'Para Empresas'].map(item => (
                            <button
                                key={item}
                                onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)}
                                className="text-base font-semibold transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
                                style={{ color: isDark ? 'white' : currentTheme.colors.primary }}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : `${currentTheme.colors.primary}10` }}
                            title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
                        >
                            {isDark ? <Sun className="w-5 h-5 text-yellow-500 fill-yellow-500/20" /> : <Moon className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />}
                        </button>
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

                {/* Header Mobile - Premium Floating Pill Style */}
                <div className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[500px] pointer-events-none">
                    <div className="w-full pointer-events-auto backdrop-blur-xl rounded-2xl shadow-lg border px-3.5 py-2.5 flex justify-between items-center" style={{ backgroundColor: isDark ? 'rgba(24, 24, 27, 0.92)' : 'rgba(255, 255, 255, 0.95)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : `${currentTheme.colors.primary}15` }}>
                        {/* Logo + Brand */}
                        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${currentTheme.primaryGradient}`}>
                                <DoorOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-lg" style={{ color: isDark ? 'white' : currentTheme.colors.primary }}>{currentTheme.brandName}</span>
                        </button>

                        {/* Actions - Premium CTAs instead of hamburger */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : `${currentTheme.colors.primary}10` }}
                            >
                                {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />}
                            </button>
                            <button
                                onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-sm text-white ${currentTheme.primaryGradient} shadow-lg`}
                                style={{ boxShadow: `0 4px 14px ${currentTheme.colors.primary}40` }}
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Background Particles - Dynamic per theme */}
            <ThemeParticles theme={currentTheme.id} />

            {/* Hero Section - Tema Light & Fun */}
            <section
                className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 pt-32 lg:pt-48 overflow-hidden z-10 rounded-[2rem] lg:rounded-[3rem] shadow-none w-full mt-2 lg:mt-0 transition-colors duration-500 bg-white"
            >

                {/* Subtle Texture/Gradient - Uses theme colors */}
                <div className="absolute inset-0 opacity-80" style={{ background: `radial-gradient(circle at top, ${currentTheme.colors.primary}15, transparent, transparent)` }} />

                <div className="relative z-10 w-full max-w-lg mx-auto text-center lg:max-w-[1500px] lg:px-8 lg:text-left">
                    <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
                        {/* The Fresta: Door Animation (Kept mostly same but cleaner border) */}
                        <motion.div className="relative mb-12 lg:mb-0 lg:col-span-6 lg:order-2 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="relative w-72 h-[450px] lg:w-[450px] lg:h-[650px] xl:w-[550px] xl:h-[750px] perspective-2000">
                                <div className="absolute inset-0 border-[12px] lg:border-[20px] border-[#2D7A5F]/20 rounded-t-[3rem] lg:rounded-t-[4rem] overflow-hidden shadow-2xl bg-amber-950">
                                    <div className="absolute inset-0 z-0">
                                        <motion.img
                                            src={currentTheme.doorMascot}
                                            alt="Interior"
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-700"
                                            style={{
                                                scale: mascotScale,
                                                x: mousePos.x * 0.5,
                                                y: mousePos.y * 0.5,
                                            }}
                                        />
                                        {/* Slightly greener bloom */}
                                        <div className="absolute inset-0 bg-[#2D7A5F]/10 mix-blend-overlay" />
                                    </div>

                                    <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/30 via-transparent to-transparent z-10 pointer-events-none" style={{ opacity: lightIntensity }} />

                                    {/* Doors - Using Wood/Amber tones still as it matches the "Door" concept, but maybe with Green trims? */}
                                    <div className="absolute inset-0 flex z-20">
                                        <motion.div
                                            key="left"
                                            className="flex-1 h-full bg-gradient-to-b from-amber-800 to-amber-950 flex items-center border-r border-amber-700 justify-end"
                                            initial={{ x: "0%", rotateY: 0 }}
                                            style={{ x: doorLeftX, rotateY: doorLeftRotateY }}
                                        >
                                            <div className="w-1 h-[80%] bg-amber-700/30 rounded-full mr-2" />
                                        </motion.div>
                                        <motion.div
                                            key="right"
                                            className="flex-1 h-full bg-gradient-to-b from-amber-800 to-amber-950 flex items-center border-l border-amber-700 justify-start relative"
                                            initial={{ x: "0%", rotateY: 0 }}
                                            style={{ x: doorRightX, rotateY: doorRightRotateY }}
                                        >
                                            <div className="w-1 h-[80%] bg-amber-700/30 rounded-full ml-2" />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-12 lg:w-6 lg:h-20 bg-gradient-to-b from-[#F9A03F] to-[#d97706] rounded-full shadow-lg border border-[#F9A03F]/50" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Copy - DARK TEXT ON LIGHT BG */}
                        <div className="lg:col-span-6 lg:order-1 py-8">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative">
                                {/* Launch Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-bold mb-6 border border-amber-200">
                                    <Zap className="w-4 h-4" />
                                    Oferta de Lançamento · 50% OFF
                                </div>
                                <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-6 lg:text-7xl xl:text-8xl xl:leading-[1.0] tracking-tight py-2 text-slate-900">
                                    O presente mais <br /> <span className="text-transparent bg-clip-text inline-block relative py-1" style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` }}>
                                        emocionante
                                        <svg className="absolute w-full h-3 -bottom-1 left-0" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ color: currentTheme.colors.accent }}><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" /></svg>
                                    </span>
                                </h1>
                                <p className="text-slate-600 text-lg lg:text-xl xl:text-2xl font-medium leading-relaxed mb-4 max-w-sm mx-auto lg:mx-0 lg:max-w-xl">
                                    Surpreenda quem você ama com uma porta por dia.
                                    Fotos, mensagens e momentos mágicos.
                                </p>
                                <p className="text-slate-500 text-base lg:text-lg font-medium mb-8 max-w-sm mx-auto lg:mx-0 lg:max-w-xl">
                                    🎁 Crie grátis em 2 minutos · 💳 Plus por apenas <span className="font-bold" style={{ color: currentTheme.colors.primary }}>R$ 14,90</span>
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
                                    <button onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-xl text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${currentTheme.primaryGradient}`}>
                                        <Sparkles className="w-6 h-6" /> Criar meu Calendário
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
            <section className="relative py-24 lg:py-48 px-4 bg-white" style={{ borderTop: `1px solid ${currentTheme.colors.primary}10` }}>
                <div className="max-w-[1500px] mx-auto relative z-10">
                    <div className="text-center mb-12 lg:mb-16 px-4">
                        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight" style={{ color: currentTheme.colors.primary }}>A Magia <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` }}>por Trás da Porta</span></h2>
                        <p className="text-slate-500 text-lg lg:text-2xl font-medium max-w-2xl mx-auto mb-8">Cada dia é um novo portal para um momento inesquecível. Veja como o Fresta transforma sua espera em celebração.</p>
                    </div>

                    {/* Mockup Container - Properly positioned below text */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative flex justify-center items-center px-4"
                    >
                        {/* Background Glow - Uses theme color */}
                        <div className="absolute inset-0 blur-[150px] rounded-full opacity-20 scale-125" style={{ backgroundColor: currentTheme.colors.primary }} />

                        {/* Dynamic Mockup - Uses currentTheme.id from GlobalSettings */}
                        <div className="relative z-10">
                            <DynamicCalendarMockup
                                theme={currentTheme.id}
                                className="transform hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>

                        {/* Desktop floating cards - positioned on sides */}
                        <div className="absolute -left-10 top-1/3 hidden xl:block z-20">
                            <motion.div
                                className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl space-y-2 max-w-[240px]"
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${currentTheme.primaryGradient}`}><Gift className="w-5 h-5 text-white" /></div>
                                <h4 className="font-bold text-lg" style={{ color: currentTheme.colors.primary }}>Presentes Diários</h4>
                                <p className="text-sm text-slate-500 font-medium">Fotos, mensagens e cupons escondidos em cada porta.</p>
                            </motion.div>
                        </div>

                        {/* Right floating card */}
                        <div className="absolute -right-10 top-1/2 hidden xl:block z-20">
                            <motion.div
                                className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl space-y-2 max-w-[240px]"
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${currentTheme.primaryGradient}`}><Share2 className="w-5 h-5 text-white" /></div>
                                <h4 className="font-bold text-lg" style={{ color: currentTheme.colors.primary }}>Compartilhe Amor</h4>
                                <p className="text-sm text-slate-500 font-medium">Envie por WhatsApp, email ou link direto.</p>
                            </motion.div>
                        </div>

                        {/* Additional Premium Cards */}
                        <div className="absolute -left-20 bottom-10 hidden 2xl:block z-20">
                            <motion.div
                                className="bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-lg flex items-center gap-4"
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${currentTheme.colors.accent}15` }}>
                                    <Sparkles className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Efeito</p>
                                    <p className="font-bold text-slate-700">Abertura Mágica</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="absolute -right-20 bottom-20 hidden 2xl:block z-20">
                            <motion.div
                                className="bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-lg flex items-center gap-4"
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.1 }}
                            >
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${currentTheme.colors.primary}15` }}>
                                    <Zap className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                                    <p className="font-bold text-slate-700">Lembrete de Afeto</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section - SUTILE CURVES */}
            <section className="py-24 text-white rounded-[2rem] relative z-20 w-full my-2 shadow-sm" style={{ backgroundColor: currentTheme.colors.primary }}>
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
                                            <Icon className="w-7 h-7" style={{ color: currentTheme.colors.accent }} />
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
                            <motion.div key={feature.title} className="bg-slate-50 rounded-[2.5rem] p-10 hover:shadow-xl border border-transparent transition-all duration-300" style={{ ['--hover-border-color' as string]: `${currentTheme.colors.primary}30` }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg ${currentTheme.primaryGradient}`}><feature.icon className="w-7 h-7" /></div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight leading-none h-12 flex items-center" style={{ color: currentTheme.colors.primary }}>{feature.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Themes Display - Maintained Dynamic because content is dynamic */}
            <section className="py-24 px-4" style={{ backgroundColor: `${currentTheme.colors.primary}08` }}>
                <div className="max-w-[1500px] mx-auto lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6 px-4">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-none" style={{ color: currentTheme.colors.primary }}>Temas para todas as <br /> <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` }}>festas</span></h2>
                        </div>
                        <button onClick={() => navigate("/explorar")} className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs bg-white hover:bg-gray-50 transition-colors shadow-sm border" style={{ color: currentTheme.colors.primary, borderColor: `${currentTheme.colors.primary}20` }}>Ver todos os temas</button>
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
            <footer className="pt-32 pb-12 px-4 text-white overflow-hidden relative mt-2 rounded-t-[2rem] w-full mb-0" style={{ backgroundColor: currentTheme.colors.primary }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="max-w-[1500px] mx-auto relative z-10">

                    {/* CTA PART */}
                    <div className="text-center mb-32 max-w-4xl mx-auto">
                        <div className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center shadow-2xl animate-pulse" style={{ backgroundColor: currentTheme.colors.accent }}>
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-5xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
                            Crie a sua <span style={{ color: currentTheme.colors.accent }}>Magia</span>
                        </h2>
                        <p className="text-xl lg:text-2xl text-white/80 font-medium mb-12 max-w-2xl mx-auto">
                            Tudo pronto para surpreender? Comece agora e faça alguém sorrir todos os dias.
                        </p>
                        <button onClick={() => navigate(isAuthenticated ? "/criar" : "/entrar?redirect=/criar")} className="py-6 px-12 rounded-full font-bold text-2xl bg-white hover:bg-gray-100 transition-all hover:shadow-2xl hover:scale-105 active:scale-95" style={{ color: currentTheme.colors.primary }}>
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

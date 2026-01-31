import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Ticket, ArrowRight, ArrowLeft } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useGlobalSettings } from "@/state/GlobalSettingsContext";
import { THEMES } from "@/constants/landingThemes";

export default function LoginEmployee() {
    const navigate = useNavigate();
    const { settings } = useGlobalSettings();

    const currentTheme = useMemo(() => {
        const active = settings.activeTheme || localStorage.getItem('fresta_active_theme') || 'carnaval';
        const themeKey = active === 'love' ? 'namoro' : active;
        return THEMES[themeKey] || THEMES.carnaval;
    }, [settings.activeTheme]);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mascotStyle = useMemo(() => {
        return isMobile
            ? (currentTheme.mobileMascotStyle || currentTheme.mascotStyle)
            : currentTheme.mascotStyle;
    }, [isMobile, currentTheme]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 p-3 rounded-full bg-white shadow-xl hover:bg-muted transition-all z-50"
            >
                <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>

            {/* Decorative balls - Thematic */}
            <div className="absolute top-0 right-0 p-20 opacity-20">
                <div className="w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: currentTheme.colors.primary }} />
            </div>
            <div className="absolute bottom-0 left-0 p-20 opacity-20">
                <div className="w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: currentTheme.colors.accent }} />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-background border border-border/50 rounded-[3rem] shadow-2xl p-10 md:p-14 space-y-12 relative z-10"
            >
                {/* Mascote Dinâmico */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-48 lg:w-56 h-[140px] lg:h-[160px] pointer-events-none flex items-end justify-center"
                    style={{ transform: 'translate(-50%, -100%)' }}
                >
                    <img
                        src={currentTheme.mascot}
                        alt="Mascote"
                        className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform"
                        style={{
                            transform: `scale(${mascotStyle?.scale || 1}) translateY(${mascotStyle?.bottomOffset || 0}px)`,
                            transformOrigin: 'bottom center'
                        }}
                    />
                </div>

                <div className="text-center space-y-3">
                    <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-xl ${currentTheme.primaryGradient}`}>
                        <span className="text-2xl">{currentTheme.emojis.logo}</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">Portal do Colaborador</h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Insira o código enviado pela sua empresa ou seu e-mail corporativo.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Código de Acesso</label>
                        <div className="relative group">
                            <Ticket className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Ex: FESTA-2026-RH"
                                className="w-full bg-muted/50 border border-border/20 rounded-2xl pl-14 pr-4 py-5 text-lg font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all uppercase"
                            />
                        </div>
                    </div>

                    <button
                        className="w-full py-5 text-white font-black rounded-3xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                        Acessar minha Jornada <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-muted-foreground/30">
                            <div className="h-[1px] flex-1 bg-current" />
                            <span className="text-[10px] uppercase font-black tracking-widest">Ou Acesso via e-mail</span>
                            <div className="h-[1px] flex-1 bg-current" />
                        </div>
                        <button className="text-sm font-black hover:underline" style={{ color: currentTheme.colors.primary }}>
                            Utilizar login corporativo (SSO)
                        </button>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground font-medium">
                            Sua empresa ainda não usa o Fresta? <br />
                            <button onClick={() => navigate("/contato")} className="text-primary font-black hover:underline mt-2">Indique o Fresta para o seu RH</button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Casamento (Wedding) Theme Components
// Custom header, progress bar, day cards, and footer for the wedding theme

import { motion } from "framer-motion";
import { Pencil, Plus, Lock, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandWatermark } from "@/components/calendar/BrandWatermark";

// Wedding Header
export const WeddingHeader = ({
    title = "O Grande Sim!",
    subtitle = "A contagem regressiva para o altar",
    isEditor = false,
    showWatermark = false
}: {
    title?: string;
    subtitle?: string;
    isEditor?: boolean;
    showWatermark?: boolean;
}) => {
    return (
        <div className="pt-4 pb-2 text-center relative z-10 font-display group px-4">
            {isEditor && (
                <div className="absolute top-0 left-0 w-full flex justify-center -mt-2">
                    <span className="text-[10px] font-bold text-wedding-gold-dark tracking-[0.2em] uppercase bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border border-wedding-gold/20">
                        Private Event
                    </span>
                </div>
            )}

            <div className="flex items-center justify-center gap-4 mb-2">
                {showWatermark && <BrandWatermark variant="compact" className="scale-75 origin-right" />}
                <h1 className="text-4xl font-display italic text-wedding-gold-dark drop-shadow-sm relative inline-block mb-1 font-medium">
                    {title}
                    {isEditor && (
                        <button className="absolute -top-1 -right-8 bg-[#FDFBF7] shadow-sm p-1.5 rounded-full text-wedding-gold hover:text-wedding-gold-dark transition-colors border border-wedding-gold/20">
                            <Pencil className="w-3 h-3" />
                        </button>
                    )}
                </h1>
                {showWatermark && <BrandWatermark variant="compact" className="scale-75 origin-left" />}
            </div>

            <div className="relative inline-block w-full max-w-xs mx-auto">
                <p className="text-slate-500 text-xs mt-1 font-medium tracking-wide uppercase">
                    {subtitle}
                </p>
                {isEditor && (
                    <button className="absolute top-1 -right-6 bg-[#FDFBF7] shadow-sm p-1 rounded-full text-wedding-gold hover:text-wedding-gold-dark transition-colors border border-wedding-gold/20">
                        <Pencil className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Wedding Progress Bar
export const WeddingProgress = ({ progress = 90 }: { progress?: number }) => {
    return (
        <div className="px-8 mt-6 relative z-10 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-end mb-2">
                <span className="text-wedding-gold-dark text-[10px] font-bold uppercase tracking-widest">{progress}% do caminho</span>
                <span className="text-slate-400 text-[10px] font-medium italic">Faltam 10 dias</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-wedding-gold via-wedding-gold-soft to-wedding-gold relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </motion.div>
            </div>
        </div>
    );
};

// Wedding Day Card
export const WeddingDayCard = ({
    dayNumber,
    status,
    imageUrl,
    onClick,
    isEditor = false
}: {
    dayNumber: number | string;
    status: 'locked' | 'unlocked' | 'empty';
    imageUrl?: string;
    onClick?: () => void;
    isEditor?: boolean;
}) => {
    const isLocked = status === 'locked';
    const isEmpty = status === 'empty';

    if (isEmpty) {
        return (
            <div className="aspect-square bg-white/50 border border-[#D4AF37]/20 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-2 relative group cursor-pointer hover:bg-white/80 transition-all font-display">
                <span className="text-[#E5CFAA] font-bold text-xl mb-1">{dayNumber}</span>
                <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Plus className="w-3 h-3" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            whileHover={!isLocked ? { y: -2 } : { scale: 1.01 }}
            onClick={onClick}
            className={cn(
                "aspect-square relative rounded-[2rem] overflow-hidden shadow-md transition-all font-display group",
                isLocked ? "border-[3px] border-[#F9F6F0]" : "bg-white cursor-pointer border border-[#D4AF37]/10"
            )}
            style={isLocked ? {
                background: `
            linear-gradient(135deg, #FDFBF7 0%, #F5F0E6 100%),
            url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0h20v1H0z' fill='%23D4AF37' fill-opacity='0.05'/%3E%3C/svg%3E")
          `,
                boxShadow: "inset 0 0 20px rgba(212,175,55,0.1)"
            } : {}}
        >
            {/* Content */}
            {!isLocked && status === 'unlocked' ? (
                <>
                    {imageUrl ? (
                        <div className={cn(
                            "absolute inset-0 bg-cover bg-center grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 blur-[30px] hover:blur-0",
                            isEditor && "blur-0"
                        )} style={{ backgroundImage: `url('${imageUrl}')` }} />
                    ) : (
                        <div
                            className={cn(
                                "absolute inset-0 bg-[#fffafa] transition-opacity duration-500",
                                !isEditor && "blur-[15px]"
                            )}
                            style={{
                                backgroundImage: `
                  linear-gradient(90deg, transparent 19px, #abced4 19px, #abced4 20px, transparent 20px),
                  linear-gradient(#eee 0.1em, transparent 0.1em)
                `,
                                backgroundSize: '100% 0.8em'
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A0E]/40 to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                        <span className="text-white font-romantic text-2xl drop-shadow-md">Dia {dayNumber}</span>
                    </div>
                    {isEditor ?
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm"><Pencil className="w-3 h-3" /></div>
                        :
                        <div className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37] animate-pulse"></div>
                    }
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center relative">
                    {/* Inner Border Line for 'Premium Card' effect */}
                    <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-[1.5rem] pointer-events-none"></div>

                    <span className="text-[#D4AF37] font-romantic text-4xl mb-1 opacity-80 drop-shadow-sm">{dayNumber}</span>

                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-1">
                        <Lock className="w-3 h-3 text-[#D4AF37]" />
                    </div>

                    {isEditor && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shadow-sm"><Pencil className="w-3 h-3" /></div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

// Wedding Highlight Card (Day 5 / Special)
export const WeddingSpecialCard = ({
    dayNumber,
    onClick,
    isEditor = false
}: {
    dayNumber: number | string;
    onClick?: () => void;
    isEditor?: boolean;
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="col-span-2 aspect-[2/1] bg-white rounded-[2rem] border border-[#D4AF37] p-1 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(212,175,55,0.15)] group cursor-pointer"
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFBF0_0%,#fff_100%)]"></div>

            {/* Decorative Lines */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#D4AF37]/30 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#D4AF37]/30 rounded-br-xl pointer-events-none"></div>

            <div className="relative h-full flex flex-col items-center justify-center text-center font-display z-10 px-6">
                <span className="text-[42px] font-romantic text-[#D4AF37] leading-none mb-1">Dia {dayNumber}</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-medium mb-5">Um presente para você</span>

                {isEditor ?
                    <button className="bg-[#D4AF37] text-white text-[10px] font-bold px-6 py-3 rounded-full shadow-lg hover:bg-[#B5942F] transition-all tracking-widest uppercase flex items-center gap-2">
                        <Pencil className="w-3 h-3" /> Definir Revelação
                    </button>
                    :
                    <button className="bg-[#D4AF37] text-white text-[10px] font-bold px-8 py-3 rounded-full shadow-lg shadow-[#D4AF37]/30 hover:bg-[#B5942F] hover:shadow-xl hover:-translate-y-0.5 transition-all tracking-widest uppercase">
                        Ver Surpresa
                    </button>
                }
            </div>
        </motion.div>
    );
};

// Wedding Diary Section
export const WeddingDiarySection = ({ isEditor = false }: { isEditor?: boolean }) => {
    return (
        <div className="mt-8 mx-4 bg-white rounded-[2.5rem] p-8 text-center shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)] border border-[#F9F6F0] relative overflow-hidden">
            <div className="flex justify-center mb-3">
                <div className="w-10 h-10 bg-[#F9F6F0] rounded-xl flex items-center justify-center text-[#D4AF37]">
                    <Quote className="w-5 h-5 fill-current" />
                </div>
            </div>

            <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-widest mb-3">Diário da Noiva</h3>

            <p className="font-romantic text-2xl text-[#8A8A8A] leading-relaxed max-w-xs mx-auto">
                "O segredo para uma entrada perfeita é o tempo. Respire fundo, aproveite cada segundo."
            </p>

            {isEditor && (
                <button className="absolute top-4 right-4 text-[#D4AF37] hover:text-[#B5942F] bg-[#F9F6F0] p-2 rounded-full">
                    <Pencil className="w-3 h-3" />
                </button>
            )}
        </div>
    );
};

// Wedding Footer
export const WeddingFooter = ({ isEditor = false }: { isEditor?: boolean }) => {
    if (isEditor) {
        return (
            <div className="fixed bottom-0 left-0 w-full p-6 pb-10 bg-white/90 backdrop-blur-xl border-t border-[#F9F6F0] z-50 font-display">
                <div className="max-w-md mx-auto">
                    <button className="w-full bg-[#D4AF37] text-white h-14 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95">
                        <Pencil className="w-4 h-4" /> Editar Calendário
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 w-full p-6 pb-10 bg-white/90 backdrop-blur-xl border-t border-[#F9F6F0] z-50 font-display">
            <div className="max-w-md mx-auto">
                <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#996515] hover:to-[#754C0E] text-white h-14 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-[#D4AF37]/25 transition-all active:scale-95">
                    Criar meu calendário
                </button>
            </div>
        </div>
    );
};

// São João Theme Configuration
// A festive Festa Junina theme with flags and rural aesthetics

import { Flame, Lock, Sparkles, Music } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { SaoJoaoDecorations } from './decorations';

export const saojoaoTheme: PlusThemeConfig = {
    id: 'saojoao',
    content: {
        capsule: {
            title: "Arraiá do Calendário",
            message: "Sua contagem para a fogueira! Cada janela é uma quadrilha de surpresas. 🔥🌽",
            icon: Flame
        },
        lockedModal: {
            title: "A fogueira ainda não acendeu! 🔥",
            message: "Calma, cabra! Ainda não é hora de abrir essa janela. Prepara o chapéu de palha que o forró já vai começar!"
        },
        footerMessage: "O arraial acaba, mas o amor fica! 🌽🔥",
        subtitle: "Sua contagem para a fogueira",
        editorSubtitle: "Monte seu arraial de surpresas! 🔥"
    },
    styles: {
        background: {
            backgroundColor: "#FFF8E8"
        }
    },
    FloatingComponent: SaoJoaoDecorations,
    ui: {
        layout: {
            bgClass: "bg-[#FFF8E8]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM45 40c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM15 40c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z' fill='%23D97706' fill-opacity='0.08'/%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-white/80 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-amber-200",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-festive",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-[#5D4037] font-extrabold tracking-tight text-[28px] drop-shadow-sm relative flex items-center gap-2",
            subtitle: "text-[#8D6E63] font-medium tracking-wide text-base",
            badgeText: "VILA DE SÃO JOÃO",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-white tracking-wide",
            badge: "bg-[#E65100] text-white",
            backButton: "bg-white text-[#5D4037] hover:bg-amber-50 transition-colors shadow-md"
        },
        actions: {
            like: {
                color: "text-orange-600",
                bgColor: "bg-white",
                borderColor: "border-orange-200",
                likedColor: "text-white",
                likedBgColor: "bg-orange-500"
            },
            share: {
                color: "text-orange-600",
                bgColor: "bg-white",
                borderColor: "border-orange-200"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-6 mt-6 relative z-10",
            label: "text-[#E65100] text-xs font-bold tracking-wider uppercase",
            labelText: "Janelas do São João",
            barContainer: "h-3 w-full rounded-full bg-[#FFCC80] overflow-hidden border border-[#FFB74D] shadow-inner",
            barFill: "h-full rounded-full bg-gradient-to-r from-[#E65100] to-[#FF8F00] relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-[#8D6E63] bg-[#5D4037] overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,rgba(255,255,255,0.1)_50%),linear-gradient(225deg,transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[#E65100] to-[#FF8F00] shadow-md z-[2] flex items-center justify-center",
                button: "bg-white text-[#5D4037] text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:bg-amber-50 transition-colors tracking-widest",
                buttonText: "ABRA A JANELA!",
                numberClass: "text-white",
                glowClass: "shadow-[0_0_20px_5px_rgba(230,81,0,0.3)]",
                borderClass: "border-[#8D6E63]"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-2xl opacity-90 border border-[#D7CCC8] overflow-hidden group cursor-pointer bg-[#EFEBE9]",
                style: { backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(141,110,99,0.15) 8px, rgba(141,110,99,0.15) 10px)` },
                overlay: "absolute inset-0 bg-white/10",
                number: "text-[#5D4037] font-extrabold text-2xl mb-1",
                iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-[#D7CCC8] shadow-sm backdrop-blur-sm",
                iconClass: "w-3 h-3 text-[#8D6E63]",
                text: "text-[8px] font-bold text-[#8D6E63] tracking-wide",
                badge: "bg-white/80 text-[#5D4037] text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-[#D7CCC8]"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-2xl bg-[#FFF8E1] border-2 border-[#FFB74D] shadow-sm overflow-hidden group cursor-pointer",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #FFB74D 19px, #FFB74D 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-[#5D4037] bg-white/80",
                iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
                borderClass: "border-[#FFB74D]",
                bgClass: "bg-[#FFF8E1]"
            },
            empty: {
                container: "aspect-[4/5] bg-[#FFF8E1] relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-[#FFB74D] border-dashed cursor-pointer hover:bg-[#FFECB3] transition-colors group",
                number: "text-[#8D6E63] font-extrabold text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-[#E65100] text-white flex items-center justify-center shadow-md",
                borderClass: "border-[#FFB74D]",
                bgClass: "bg-[#FFF8E1]"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex flex-col items-center justify-center gap-4 transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-3 transition-all",
            button: "bg-[#E65100] hover:bg-[#BF360C] text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-[#E65100]/30 transition-all active:scale-95 whitespace-nowrap",
            secondaryButton: "h-14 w-14 rounded-full bg-white text-[#5D4037] flex items-center justify-center border border-[#D7CCC8] shadow-md transition-colors hover:bg-[#FFF8E1]",
            message: "text-[#8D6E63] text-sm font-medium text-center mt-2"
        },
        editor: {
            topBar: {
                container: "border-[#D7CCC8]",
                backButton: "text-[#5D4037]",
                modeText: "text-[#E65100]",
                badgeText: "text-[#5D4037]",
                previewButtonActive: "bg-[#E65100] text-white shadow-[#E65100]/20",
                previewButtonInactive: "bg-white text-[#5D4037] border-[#D7CCC8]",
                settingsButton: "bg-white text-[#5D4037] border-[#D7CCC8]"
            },
            stats: {
                card: "border-[#D7CCC8]/50",
                number: "text-[#5D4037]",
                label: "text-[#8D6E63]"
            }
        },
        quote: {
            container: "mt-6 mx-4 p-5 rounded-2xl bg-white border border-[#D7CCC8] flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative",
            icon: "text-[#E65100] w-6 h-6 fill-current",
            title: "text-sm font-bold text-[#5D4037]",
            text: "text-sm text-[#8D6E63] leading-relaxed"
        },
        icons: {
            main: Flame,
            locked: Lock,
            open: Sparkles,
            quote: Music,
            footer: Flame
        }
    }
};

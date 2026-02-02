// Dia das Mães (Mother's Day) Theme Configuration
// A loving, elegant theme with flowers, hearts, and soft pink/rose tones

import { Heart, Lock, Gift, Flower2 } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { DiadasmaesDecorations } from './decorations';

export const diadasmaesTheme: PlusThemeConfig = {
    id: 'diadasmaes',
    content: {
        capsule: {
            title: "Feliz Dia das Mães!",
            message: "Para a mulher mais especial do mundo. Todo amor em cada surpresa. 💐💕",
            icon: Flower2
        },
        lockedModal: {
            title: "Ainda não, querida! 💐",
            message: "Esta surpresa está guardada com muito carinho. Aguarde o momento certo!"
        },
        footerMessage: "Com todo amor do mundo! 💕",
        subtitle: "Celebrando o amor mais puro 💐",
        editorSubtitle: "Dia das Mães: Prepare com carinho! 🌸"
    },
    styles: {
        background: {
            backgroundColor: "#FDF2F8" // rose-50
        }
    },
    FloatingComponent: DiadasmaesDecorations,
    ui: {
        layout: {
            bgClass: "bg-[#FDF2F8]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-white/90 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-pink-200",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-serif",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 font-serif tracking-tight text-[36px] drop-shadow-sm relative",
            subtitle: "text-pink-500 font-bold tracking-wide text-lg",
            badgeText: "Mãe, te amo!",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-white tracking-wide",
            backButton: "bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
        },
        actions: {
            like: {
                color: "text-pink-500",
                bgColor: "bg-white",
                borderColor: "border-pink-200",
                likedColor: "text-white",
                likedBgColor: "bg-pink-500"
            },
            share: {
                color: "text-pink-500",
                bgColor: "bg-white",
                borderColor: "border-pink-200"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-8 mt-6 relative z-10",
            label: "text-pink-600 text-xs font-bold tracking-wider",
            labelText: " Nível de Amor",
            barContainer: "h-3 w-full rounded-full bg-pink-100 overflow-hidden border border-pink-200 shadow-inner",
            barFill: "h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-pink-200 bg-white overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#fce7f3_50%),linear-gradient(225deg,transparent_50%,#fce7f3_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-md z-[2] flex items-center justify-center",
                button: "bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:from-pink-600 hover:to-rose-600 transition-colors tracking-widest",
                buttonText: "Abrir com Amor",
                glowClass: "shadow-[0_0_20px_5px_rgba(236,72,153,0.3)]",
                numberClass: "text-pink-600",
                borderClass: "border-pink-200"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-pink-200/50 overflow-hidden group cursor-pointer",
                style: { background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(252,231,243,0.5)), repeating-linear-gradient(45deg, #fce7f3 0, #fce7f3 10px, #fbcfe8 10px, #fbcfe8 11px)` },
                overlay: "absolute inset-0 bg-white/30 backdrop-blur-[1px]",
                number: "text-pink-500 font-serif text-3xl mb-1 drop-shadow-sm",
                iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-pink-200 shadow-sm backdrop-blur-sm",
                iconClass: "w-3 h-3 text-pink-500",
                text: "text-[8px] font-bold text-pink-600/80 tracking-wide",
                badge: "bg-white/80 text-pink-500 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-pink-200/50"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 border-pink-200 shadow-sm overflow-hidden group cursor-pointer",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #f9a8d4 19px, #f9a8d4 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-pink-700 bg-pink-50/80",
                iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
                borderClass: "border-pink-200",
                bgClass: "bg-white"
            },
            empty: {
                container: "aspect-[4/5] bg-pink-50/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-pink-300 border-dashed cursor-pointer hover:bg-pink-100/50 transition-colors group",
                number: "text-pink-400 font-serif text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md",
                borderClass: "border-pink-300",
                bgClass: "bg-pink-50/50"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4 transition-all",
            button: "bg-pink-500 hover:bg-pink-600 text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 transition-all active:scale-95 whitespace-nowrap",
            secondaryButton: "h-14 w-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-200 transition-colors hover:bg-pink-100"
        },
        editor: {
            topBar: {
                container: "border-pink-200",
                backButton: "text-pink-600",
                modeText: "text-pink-600",
                badgeText: "text-pink-900",
                previewButtonActive: "bg-pink-500 text-white shadow-pink-500/20",
                previewButtonInactive: "bg-zinc-50 text-pink-600 border-pink-200",
                settingsButton: "bg-zinc-50 text-pink-600 border-pink-200"
            },
            stats: {
                card: "border-pink-200/50",
                number: "text-pink-900",
                label: "text-pink-500"
            }
        },
        quote: {
            container: "mt-10 p-6 sm:p-8 rounded-[2rem] bg-white/70 border-2 border-pink-200 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative group backdrop-blur-sm",
            icon: "text-pink-500 w-8 h-8 fill-current opacity-90",
            title: "text-[10px] font-black uppercase tracking-[0.2em] text-pink-400 mb-1",
            text: "text-2xl sm:text-3xl text-pink-500 font-display leading-relaxed"
        },
        icons: {
            main: Flower2,
            locked: Lock,
            open: Gift,
            quote: Heart,
            footer: Heart
        }
    }
};

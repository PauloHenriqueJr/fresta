// Páscoa (Easter) Theme Configuration
// A magical Easter theme with eggs, bunnies, and spring colors

import { Gift, Lock, Sparkles, HeartHandshake } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { PascoaDecorations } from './decorations';

export const pascoaTheme: PlusThemeConfig = {
    id: 'pascoa',
    content: {
        capsule: {
            title: "Páscoa Doce",
            message: "Que a magia da Páscoa traga renovação e amor ao seu coração! 🐰🥚",
            icon: Gift
        },
        lockedModal: {
            title: "O coelhinho ainda não passou! 🐰",
            message: "Calma, essa surpresa ainda está escondida no jardim. Aguarde o momento certo!"
        },
        footerMessage: "Feliz Páscoa! Que seja doce como chocolate. 🍫🐣",
        subtitle: "Siga as pegadas do coelho!",
        editorSubtitle: "Monte sua caça aos ovos! 🥚"
    },
    styles: {
        background: {
            backgroundImage: "radial-gradient(#C084FC 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundColor: "#FDF4FF"
        }
    },
    FloatingComponent: PascoaDecorations,
    ui: {
        layout: {
            bgClass: "bg-[#FDF4FF]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='30' cy='30' rx='8' ry='10' fill='%23C084FC' fill-opacity='0.05'/%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-white/60 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-purple-100/50",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-festive",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-purple-600 font-black tracking-tight text-[36px] drop-shadow-sm relative uppercase",
            subtitle: "text-purple-400 font-medium tracking-wide text-base italic",
            badgeText: "🐰 Páscoa",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-purple-600 tracking-wide",
            badge: "bg-white/80 border border-purple-200",
            backButton: "bg-white/80 text-purple-600 hover:bg-white transition-colors shadow-sm"
        },
        actions: {
            like: {
                color: "text-purple-500",
                bgColor: "bg-white",
                borderColor: "border-purple-200",
                likedColor: "text-white",
                likedBgColor: "bg-purple-500"
            },
            share: {
                color: "text-purple-500",
                bgColor: "bg-white",
                borderColor: "border-purple-200"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-6 mt-6 relative z-10",
            label: "text-purple-700 text-xs font-black tracking-wider uppercase",
            labelText: "Cesta de Ovos",
            barContainer: "h-3 w-full rounded-full bg-purple-100 overflow-hidden border border-purple-200/50 shadow-inner",
            barFill: "h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-3xl shadow-lg cursor-pointer transition-transform duration-300 border border-purple-200/50 bg-gradient-to-br from-purple-100 to-pink-50 overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,rgba(255,255,255,0.3)_50%),linear-gradient(225deg,transparent_50%,rgba(255,255,255,0.3)_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-md z-[2] flex items-center justify-center",
                button: "bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:from-amber-500 hover:to-orange-500 transition-colors tracking-widest",
                buttonText: "PEGAR OVO",
                numberClass: "text-purple-600",
                glowClass: "shadow-[0_0_20px_5px_rgba(192,132,252,0.25)]",
                borderClass: "border-purple-200/50"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-3xl opacity-95 border border-purple-200/30 overflow-hidden group cursor-pointer bg-white/60 backdrop-blur-sm",
                style: { background: `linear-gradient(135deg, rgba(253,244,255,0.8) 0%, rgba(245,208,254,0.3) 100%)` },
                overlay: "absolute inset-0 bg-white/10 backdrop-blur-[0.5px]",
                number: "text-purple-200 font-display text-4xl mb-1 drop-shadow-sm font-bold",
                iconWrapper: "flex flex-col items-center gap-1 bg-white/70 px-3 py-1 rounded-full border border-pink-200 shadow-sm backdrop-blur-sm",
                iconClass: "w-3 h-3 text-pink-500",
                text: "text-[8px] font-bold text-pink-500/80 tracking-wide",
                badge: "bg-white/80 text-pink-500 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-purple-200/30"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-3xl bg-white/70 border-2 border-green-300 shadow-sm overflow-hidden group cursor-pointer backdrop-blur-sm",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #C084FC 19px, #C084FC 20px, transparent 20px), linear-gradient(#FDF4FF 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-green-600 bg-green-100/80",
                iconWrapper: "absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-md z-20",
                borderClass: "border-green-300",
                bgClass: "bg-white/70"
            },
            empty: {
                container: "aspect-[4/5] bg-white/40 relative flex flex-col items-center justify-center p-2 rounded-3xl border-2 border-purple-200/50 border-dashed cursor-pointer hover:bg-white/60 transition-colors group backdrop-blur-sm",
                number: "text-purple-300 font-display text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md",
                borderClass: "border-purple-200/50",
                bgClass: "bg-white/40"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex flex-col items-center justify-center gap-4 transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-3 transition-all",
            button: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-pink-400/25 transition-all active:scale-95 whitespace-nowrap uppercase tracking-wide",
            secondaryButton: "h-14 w-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200 shadow-md transition-colors hover:bg-purple-200",
            message: "text-purple-500 text-sm font-medium text-center mt-2"
        },
        editor: {
            topBar: {
                container: "border-purple-200",
                backButton: "text-purple-600",
                modeText: "text-purple-600",
                badgeText: "text-purple-900",
                previewButtonActive: "bg-purple-500 text-white shadow-purple-300/20",
                previewButtonInactive: "bg-white text-purple-600 border-purple-200",
                settingsButton: "bg-white text-purple-600 border-purple-200"
            },
            stats: {
                card: "border-purple-200/50",
                number: "text-purple-900",
                label: "text-purple-500"
            }
        },
        quote: {
            container: "mt-6 mx-4 p-5 rounded-2xl bg-purple-50/80 border border-purple-200/50 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative backdrop-blur-sm",
            icon: "text-purple-500 w-6 h-6 fill-current",
            title: "text-sm font-bold text-purple-700",
            text: "text-sm text-purple-600 leading-relaxed"
        },
        icons: {
            main: Gift,
            locked: Lock,
            open: Gift,
            quote: Sparkles,
            footer: HeartHandshake
        }
    }
};

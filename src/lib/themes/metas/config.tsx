// Metas (Goals/New Beginnings) Theme Configuration
// A motivational, modern theme with stars, rockets, and achievement vibes
// Colors: Deep purple/indigo with gold accents for inspiration

import { Target, Lock, Rocket, Star, Zap } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { MetasDecorations } from './decorations';

export const metasTheme: PlusThemeConfig = {
    id: 'metas',
    content: {
        capsule: {
            title: "Novas Conquistas!",
            message: "Cada dia é uma oportunidade de crescer. Vamos juntos nessa jornada! 🚀✨",
            icon: Target
        },
        lockedModal: {
            title: "Foco no objetivo! 🎯",
            message: "Esta conquista está guardada para o momento certo. Continue firme!"
        },
        footerMessage: "Rumo ao sucesso! 🚀",
        subtitle: "Um novo começo, infinitas possibilidades ✨",
        editorSubtitle: "Metas: Construa o futuro! 🎯"
    },
    styles: {
        background: {
            backgroundColor: "#1E1B4B" // indigo-950
        }
    },
    FloatingComponent: MetasDecorations,
    ui: {
        layout: {
            bgClass: "bg-[#1E1B4B]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-indigo-900/90 pb-6 rounded-b-[2.5rem] shadow-lg z-10 pt-6 backdrop-blur-sm border-b border-amber-500/30",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-sans",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-bold tracking-tight text-[36px] drop-shadow-sm relative",
            subtitle: "text-indigo-200 font-medium tracking-wide text-lg",
            badgeText: "Novo Ciclo",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-indigo-900 tracking-wide",
            backButton: "bg-indigo-800 text-amber-400 hover:bg-indigo-700 transition-colors"
        },
        actions: {
            like: {
                color: "text-amber-400",
                bgColor: "bg-indigo-800",
                borderColor: "border-amber-500/30",
                likedColor: "text-indigo-900",
                likedBgColor: "bg-amber-400"
            },
            share: {
                color: "text-amber-400",
                bgColor: "bg-indigo-800",
                borderColor: "border-amber-500/30"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-8 mt-6 relative z-10",
            label: "text-amber-400 text-xs font-bold tracking-wider",
            labelText: " Progresso",
            barContainer: "h-3 w-full rounded-full bg-indigo-800 overflow-hidden border border-amber-500/30 shadow-inner",
            barFill: "h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-amber-500/50 bg-indigo-900 overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,rgba(251,191,36,0.1)_50%),linear-gradient(225deg,transparent_50%,rgba(251,191,36,0.1)_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-md z-[2] flex items-center justify-center",
                button: "bg-gradient-to-r from-amber-400 to-yellow-300 text-indigo-900 text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:from-amber-500 hover:to-yellow-400 transition-colors tracking-widest",
                buttonText: "Revelar Meta",
                glowClass: "shadow-[0_0_20px_5px_rgba(251,191,36,0.3)]",
                numberClass: "text-amber-400",
                borderClass: "border-amber-500/50"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-indigo-700 overflow-hidden group cursor-pointer bg-indigo-900/80",
                style: { background: `radial-gradient(circle at 50% 50%, rgba(30,27,75,0.9), rgba(30,27,75,0.95))` },
                overlay: "absolute inset-0 bg-indigo-950/30 backdrop-blur-[1px]",
                number: "text-indigo-400 font-bold text-3xl mb-1 drop-shadow-sm",
                iconWrapper: "flex flex-col items-center gap-1 bg-indigo-800/60 px-3 py-1 rounded-full border border-indigo-600 shadow-sm backdrop-blur-sm",
                iconClass: "w-3 h-3 text-indigo-400",
                text: "text-[8px] font-bold text-indigo-400/80 tracking-wide",
                badge: "bg-indigo-800/80 text-indigo-300 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-indigo-700"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-900 border-2 border-amber-500/40 shadow-sm overflow-hidden group cursor-pointer",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #fbbf24 19px, #fbbf24 20px, transparent 20px), linear-gradient(#374151 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-amber-300 bg-indigo-800/80",
                iconWrapper: "absolute top-1 right-1 bg-indigo-800/80 rounded-full p-1 shadow-sm z-20",
                borderClass: "border-amber-500/40",
                bgClass: "bg-indigo-900"
            },
            empty: {
                container: "aspect-[4/5] bg-indigo-900/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-amber-500/30 border-dashed cursor-pointer hover:bg-indigo-800/50 transition-colors group",
                number: "text-amber-400/60 font-bold text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-amber-400 text-indigo-900 flex items-center justify-center shadow-md",
                borderClass: "border-amber-500/30",
                bgClass: "bg-indigo-900/50"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4 transition-all",
            button: "bg-amber-400 hover:bg-amber-500 text-indigo-900 w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all active:scale-95 whitespace-nowrap",
            secondaryButton: "h-14 w-14 rounded-full bg-indigo-800 text-amber-400 flex items-center justify-center border border-amber-500/30 transition-colors hover:bg-indigo-700"
        },
        editor: {
            topBar: {
                container: "border-amber-500/30 bg-indigo-900",
                backButton: "text-amber-400",
                modeText: "text-amber-400",
                badgeText: "text-amber-300",
                previewButtonActive: "bg-amber-400 text-indigo-900 shadow-amber-500/20",
                previewButtonInactive: "bg-indigo-800 text-amber-400 border-amber-500/30",
                settingsButton: "bg-indigo-800 text-amber-400 border-amber-500/30"
            },
            stats: {
                card: "border-amber-500/30 bg-indigo-800/50",
                number: "text-amber-300",
                label: "text-indigo-300"
            }
        },
        quote: {
            container: "mt-10 p-6 sm:p-8 rounded-[2rem] bg-indigo-900/70 border-2 border-amber-500/30 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative group backdrop-blur-sm",
            icon: "text-amber-400 w-8 h-8 fill-current opacity-90",
            title: "text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80 mb-1",
            text: "text-2xl sm:text-3xl text-amber-300 font-display leading-relaxed"
        },
        icons: {
            main: Target,
            locked: Lock,
            open: Rocket,
            quote: Star,
            footer: Zap
        }
    }
};

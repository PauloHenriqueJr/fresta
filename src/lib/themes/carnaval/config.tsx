// Carnaval Theme Configuration
// A vibrant Brazilian carnival theme with purple, pink, and festive decorations

import { PartyPopper, Lock, Sparkles, Music } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { CarnavalDecorations } from './decorations';

export const carnavalTheme: PlusThemeConfig = {
    id: 'carnaval',
    content: {
        capsule: {
            title: "Folia Eterna",
            message: "A vida é um carnaval ao seu lado! Vamos celebrar cada dia com alegria. 🎉🎭",
            icon: PartyPopper
        },
        lockedModal: {
            title: "O bloco ainda não saiu! 🎭",
            message: "Ainda não é hora de abrir essa porta. Segura a empolgação que a festa já vai começar!"
        },
        footerMessage: "O carnaval termina, as memórias não! 🎉🎭",
        subtitle: "Viva a folia em cada porta aberta! 🎊",
        editorSubtitle: "Carnaval: Crie seu bloco de surpresas! 🎭"
    },
    styles: {
        background: {
            backgroundColor: "#FDF4FF"
        }
    },
    FloatingComponent: CarnavalDecorations,
    ui: {
        layout: {
            bgClass: "bg-[#FDF4FF]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM45 40c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM15 40c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z' fill='%239333ea' fill-opacity='0.1'/%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-white/80 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-purple-100",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-festive",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 font-festive tracking-tight text-[36px] drop-shadow-sm relative",
            subtitle: "text-purple-400 font-bold tracking-wide text-lg",
            badgeText: `Carnaval ${new Date().getFullYear()}`,
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-white tracking-wide",
            badge: "bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400",
            backButton: "bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
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
            container: "flex flex-col gap-3 px-8 mt-6 relative z-10",
            label: "text-purple-600 text-xs font-bold tracking-wider",
            labelText: " Ritmo da Festa",
            barContainer: "h-3 w-full rounded-full bg-purple-100 overflow-hidden border border-purple-200 shadow-inner",
            barFill: "h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-purple-200 bg-white overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#f3e8ff_50%),linear-gradient(225deg,transparent_50%,#f3e8ff_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-md z-[2] flex items-center justify-center",
                button: "bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:from-purple-700 hover:to-pink-700 transition-colors tracking-widest",
                buttonText: "Abrir o Bloco",
                glowClass: "shadow-[0_0_20px_5px_rgba(147,51,234,0.3)]",
                borderClass: "border-purple-200"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-purple-200/30 overflow-hidden group cursor-pointer",
                style: { background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(243,232,255,0.5)), repeating-linear-gradient(45deg, #f3e8ff 0, #f3e8ff 10px, #e9d5ff 10px, #e9d5ff 11px)` },
                overlay: "absolute inset-0 bg-white/30 backdrop-blur-[1px]",
                number: "text-purple-400 font-festive text-3xl mb-1 drop-shadow-sm",
                iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-purple-100 shadow-sm backdrop-blur-sm",
                iconClass: "w-3 h-3 text-purple-400",
                text: "text-[8px] font-bold text-purple-500/80 tracking-wide",
                badge: "bg-white/80 text-purple-400 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-purple-200/30"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 border-purple-100 shadow-sm overflow-hidden group cursor-pointer",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #d8b4fe 19px, #d8b4fe 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-purple-600 bg-purple-50/80",
                iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
                borderClass: "border-purple-100",
                bgClass: "bg-white"
            },
            empty: {
                container: "aspect-[4/5] bg-purple-50/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-purple-200 border-dashed cursor-pointer hover:bg-purple-100/50 transition-colors group",
                number: "text-purple-300 font-festive text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md",
                borderClass: "border-purple-200",
                bgClass: "bg-purple-50/50"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4 transition-all",
            button: "bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-purple-500/30 transition-all active:scale-95 whitespace-nowrap",
            secondaryButton: "h-14 w-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 transition-colors hover:bg-purple-100"
        },
        editor: {
            topBar: {
                container: "border-purple-100",
                backButton: "text-purple-500",
                modeText: "text-purple-500",
                badgeText: "text-purple-900",
                previewButtonActive: "bg-purple-500 text-white shadow-purple-500/20",
                previewButtonInactive: "bg-zinc-50 text-purple-500 border-purple-100",
                settingsButton: "bg-zinc-50 text-purple-500 border-purple-100"
            },
            stats: {
                card: "border-purple-100/50",
                number: "text-purple-900",
                label: "text-purple-400"
            }
        },
        quote: {
            container: "mt-10 p-6 sm:p-8 rounded-[2rem] bg-white/70 border-2 border-purple-100 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative group backdrop-blur-sm",
            icon: "text-purple-500 w-8 h-8 fill-current opacity-90",
            title: "text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1",
            text: "text-2xl sm:text-3xl text-purple-500 font-romantic leading-relaxed"
        },
        icons: {
            main: PartyPopper,
            locked: Lock,
            open: Sparkles,
            quote: Music,
            footer: PartyPopper
        }
    }
};

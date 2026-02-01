// Aniversário (Birthday) Theme Configuration
// A festive birthday theme with balloons, confetti, and party vibes

import { PartyPopper, Lock, Gift } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { AniversarioDecorations } from './decorations';

export const aniversarioTheme: PlusThemeConfig = {
    id: 'aniversario',
    content: {
        capsule: {
            title: "Feliz Aniversário!",
            message: "Hoje celebramos você! Que seu novo ciclo seja repleto de luz e alegria. 🎂✨",
            icon: PartyPopper
        },
        lockedModal: {
            title: "Nem vem! 🎂",
            message: "Espere o dia certo para abrir seu presente. A curiosidade matou o gato, mas não o aniversariante!"
        },
        footerMessage: "Parabéns e muitas felicidades! 🎈🎉",
        subtitle: "Celebrando mais um ano incrível! 🥳",
        editorSubtitle: "Aniversário: Prepare a festa! 🎈"
    },
    styles: {
        background: {
            backgroundColor: "#F0F9FF"
        }
    },
    FloatingComponent: AniversarioDecorations,
    ui: {
        layout: {
            bgClass: "bg-[#F0F9FF]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-2.21 0-4-1.79-4-4 0-3.314-2.686-6-6-6-2.21 0-4-1.79-4-4-3.314 0-6-2.686-6-6-2.21 0-4-1.79-4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-white/90 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-sky-200",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-festive",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 font-festive tracking-tight text-[36px] drop-shadow-sm relative",
            subtitle: "text-sky-500 font-bold tracking-wide text-lg",
            badgeText: "Dia de Festa",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-white tracking-wide",
            backButton: "bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
        },
        actions: {
            like: {
                color: "text-sky-500",
                bgColor: "bg-white",
                borderColor: "border-sky-200",
                likedColor: "text-white",
                likedBgColor: "bg-sky-500"
            },
            share: {
                color: "text-sky-500",
                bgColor: "bg-white",
                borderColor: "border-sky-200"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-8 mt-6 relative z-10",
            label: "text-sky-600 text-xs font-bold tracking-wider",
            labelText: " Nível de Animação",
            barContainer: "h-3 w-full rounded-full bg-sky-100 overflow-hidden border border-sky-200 shadow-inner",
            barFill: "h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-sky-200 bg-white overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#e0f2fe_50%),linear-gradient(225deg,transparent_50%,#e0f2fe_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md z-[2] flex items-center justify-center",
                button: "bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:from-sky-600 hover:to-indigo-700 transition-colors tracking-widest",
                buttonText: "Abrir Presente",
                glowClass: "shadow-[0_0_20px_5px_rgba(14,165,233,0.3)]",
                numberClass: "text-sky-600",
                borderClass: "border-sky-200"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-sky-200/50 overflow-hidden group cursor-pointer",
                style: { background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(224,242,254,0.5)), repeating-linear-gradient(45deg, #e0f2fe 0, #e0f2fe 10px, #bae6fd 10px, #bae6fd 11px)` },
                overlay: "absolute inset-0 bg-white/30 backdrop-blur-[1px]",
                number: "text-sky-500 font-festive text-3xl mb-1 drop-shadow-sm",
                iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-sky-200 shadow-sm backdrop-blur-sm",
                iconClass: "w-3 h-3 text-sky-500",
                text: "text-[8px] font-bold text-sky-600/80 tracking-wide",
                badge: "bg-white/80 text-sky-500 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-sky-200/50"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 border-sky-200 shadow-sm overflow-hidden group cursor-pointer",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #7dd3fc 19px, #7dd3fc 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-sky-700 bg-sky-50/80",
                iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
                borderClass: "border-sky-200",
                bgClass: "bg-white"
            },
            empty: {
                container: "aspect-[4/5] bg-sky-50/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-sky-300 border-dashed cursor-pointer hover:bg-sky-100/50 transition-colors group",
                number: "text-sky-400 font-festive text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md",
                borderClass: "border-sky-300",
                bgClass: "bg-sky-50/50"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4 transition-all",
            button: "bg-sky-500 hover:bg-sky-600 text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-sky-500/30 transition-all active:scale-95 whitespace-nowrap",
            secondaryButton: "h-14 w-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 transition-colors hover:bg-sky-100"
        },
        editor: {
            topBar: {
                container: "border-sky-200",
                backButton: "text-sky-600",
                modeText: "text-sky-600",
                badgeText: "text-sky-900",
                previewButtonActive: "bg-sky-500 text-white shadow-sky-500/20",
                previewButtonInactive: "bg-zinc-50 text-sky-600 border-sky-200",
                settingsButton: "bg-zinc-50 text-sky-600 border-sky-200"
            },
            stats: {
                card: "border-sky-200/50",
                number: "text-sky-900",
                label: "text-sky-500"
            }
        },
        quote: {
            container: "mt-10 p-6 sm:p-8 rounded-[2rem] bg-white/70 border-2 border-sky-200 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative group backdrop-blur-sm",
            icon: "text-sky-500 w-8 h-8 fill-current opacity-90",
            title: "text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-1",
            text: "text-2xl sm:text-3xl text-sky-500 font-display leading-relaxed"
        },
        icons: {
            main: PartyPopper,
            locked: Lock,
            open: Gift,
            quote: PartyPopper,
            footer: PartyPopper
        }
    }
};

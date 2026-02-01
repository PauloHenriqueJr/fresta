// Reveillon (New Year's Eve) Theme Configuration
// A festive theme with lights, stars, and champagne vibes for new year celebrations

import { PartyPopper, Lock, Sparkles, Star } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { ReveillonDecorations } from './decorations';

export const reveillonTheme: PlusThemeConfig = {
    id: 'reveillon',
    content: {
        capsule: {
            title: "Contagem para o Novo Ano",
            message: "Cada janela é um passo rumo a um ano incrível cheio de conquistas! 🎆✨",
            icon: PartyPopper
        },
        lockedModal: {
            title: "Ainda não é a hora! 🎆",
            message: "A virada está chegando! Aguarde o momento certo para revelar essa surpresa especial."
        },
        headerBadge: {
            text: "Nova Era",
            className: "bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 font-black tracking-widest"
        },
        usageTip: "O ano novo é uma porta aberta para novas possibilidades.",
        tipTitle: "Reflexão de Ano Novo",
        footerMessage: "Que o próximo ano traga ainda mais momentos especiais! 🥂✨",
        subtitle: "Contagem regressiva para a virada",
        editorSubtitle: "Prepare sua contagem para o novo ano! 🎆"
    },
    FloatingComponent: ReveillonDecorations,
    styles: {
        background: {
            backgroundImage: "radial-gradient(circle at 50% 0%, #1e3a8a 0%, #0f172a 60%, #020617 100%)",
            backgroundSize: "100% 100%",
            backgroundColor: "#0f172a"
        }
    },
    ui: {
        layout: {
            bgClass: "bg-slate-900",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-gradient-to-b from-slate-800/90 to-slate-900/90 pb-6 rounded-b-[2.5rem] shadow-lg z-10 pt-6 backdrop-blur-md border-b border-amber-500/20",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-festive",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-[36px] font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] relative",
            subtitle: "text-slate-400 font-medium tracking-wide text-lg",
            badgeText: "🎆 Contagem Regressiva",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-amber-900 tracking-wide",
            badge: "bg-gradient-to-r from-amber-400 to-yellow-300",
            backButton: "bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors border border-amber-500/30"
        },
        actions: {
            like: {
                color: "text-amber-500",
                bgColor: "bg-white",
                borderColor: "border-amber-200",
                likedColor: "text-white",
                likedBgColor: "bg-amber-500"
            },
            share: {
                color: "text-amber-500",
                bgColor: "bg-white",
                borderColor: "border-amber-200"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-8 mt-6 relative z-10 font-display",
            label: "text-amber-400 text-xs font-bold tracking-wider uppercase",
            labelText: " até a virada",
            barContainer: "h-3 w-full rounded-full bg-slate-800 overflow-hidden border border-amber-500/30 shadow-inner shadow-amber-500/10",
            barFill: "h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-xl cursor-pointer transition-transform duration-300 border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,rgba(251,191,36,0.1)_50%),linear-gradient(225deg,transparent_50%,rgba(251,191,36,0.1)_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/50 z-[2] flex items-center justify-center",
                button: "bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 text-[10px] font-extrabold px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/30 hover:from-amber-300 hover:to-yellow-200 transition-all tracking-widest uppercase",
                buttonText: "Revelar Surpresa",
                numberClass: "text-amber-400",
                glowClass: "shadow-[0_0_30px_10px_rgba(251,191,36,0.2)]",
                borderClass: "border-amber-500/30"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-2xl border border-slate-700/50 overflow-hidden group cursor-pointer bg-slate-800/50 backdrop-blur-sm",
                style: { background: `linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.6) 100%)` },
                overlay: "absolute inset-0 bg-slate-950/20",
                number: "text-amber-400 font-festive text-3xl mb-1 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]",
                iconWrapper: "flex flex-col items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-full border border-amber-500/30 shadow-lg backdrop-blur-sm",
                iconClass: "w-3 h-3 text-amber-400",
                text: "text-[8px] font-bold text-slate-400 tracking-wide uppercase",
                badge: "bg-slate-800/80 text-amber-400 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-amber-500/20",
                borderClass: "border-slate-700/50"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800/80 border-2 border-amber-500/40 shadow-lg shadow-amber-500/10 overflow-hidden group cursor-pointer backdrop-blur-sm",
                imageOverlay: "blur-[30px] brightness-75",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #fbbf24 19px, #fbbf24 20px, transparent 20px), linear-gradient(#1e293b 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-amber-300 bg-slate-800/80 border border-amber-500/30",
                iconWrapper: "absolute top-2 right-2 bg-amber-500 rounded-full p-1.5 shadow-lg z-20",
                borderClass: "border-amber-500/40",
                bgClass: "bg-slate-800/80"
            },
            empty: {
                container: "aspect-[4/5] bg-slate-800/30 relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-slate-700/50 border-dashed cursor-pointer hover:bg-slate-800/50 transition-colors group backdrop-blur-sm",
                number: "text-slate-600 font-festive text-2xl mb-2",
                iconWrapper: "w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 flex items-center justify-center shadow-lg shadow-amber-500/30",
                borderClass: "border-slate-700/50",
                bgClass: "bg-slate-800/30"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4 transition-all",
            button: "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all active:scale-95 whitespace-nowrap",
            secondaryButton: "h-14 w-14 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center border border-amber-500/30 transition-colors hover:bg-slate-700"
        },
        editor: {
            topBar: {
                container: "border-slate-700/50",
                backButton: "text-amber-400",
                modeText: "text-amber-400",
                badgeText: "text-slate-200",
                previewButtonActive: "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 shadow-amber-500/20",
                previewButtonInactive: "bg-slate-800 text-amber-400 border-amber-500/30",
                settingsButton: "bg-slate-800 text-amber-400 border-amber-500/30"
            },
            stats: {
                card: "border-amber-500/20 bg-slate-800/50",
                number: "text-amber-400",
                label: "text-slate-400"
            }
        },
        quote: {
            container: "mt-10 p-6 sm:p-8 rounded-[2rem] bg-slate-800/50 border border-amber-500/20 flex flex-col items-center text-center gap-2 shadow-lg max-w-lg mx-auto relative group backdrop-blur-sm",
            icon: "text-amber-400 w-8 h-8 fill-current opacity-90",
            title: "text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60 mb-1",
            text: "text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200 font-festive leading-relaxed"
        },
        icons: {
            main: PartyPopper,
            locked: Lock,
            open: Sparkles,
            quote: Star,
            footer: PartyPopper
        }
    }
};

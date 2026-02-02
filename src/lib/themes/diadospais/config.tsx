// Dia dos Pais (Father's Day) Theme Configuration
// A strong, elegant theme with blue/slate tones and masculine elements

import { Crown, Lock, Gift, Star, Heart } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { DiadospaisDecorations } from './decorations';

export const diadospaisTheme: PlusThemeConfig = {
    id: 'diadospais',
    content: {
        capsule: {
            title: "Feliz Dia dos Pais!",
            message: "Para o herói que me inspira todos os dias. Obrigado por tudo, pai! 👔💙",
            icon: Crown
        },
        lockedModal: {
            title: "Calma, campeão! 👔",
            message: "Esta surpresa está guardada para o momento certo. Paciência é uma virtude!"
        },
        footerMessage: "Com todo respeito e amor! 💙",
        subtitle: "Celebrando o melhor pai do mundo 👔",
        editorSubtitle: "Dia dos Pais: Homenagem especial! 👔"
    },
    styles: {
        background: {
            backgroundColor: "#F1F5F9" // slate-100
        }
    },
    FloatingComponent: DiadospaisDecorations,
    ui: {
        layout: {
            bgClass: "bg-[#F1F5F9]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a5f' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-white/90 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-slate-200",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-display",
            titleFont: "font-serif",
            secondaryFont: "font-sans"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-blue-700 font-serif tracking-tight text-[36px] drop-shadow-sm relative",
            subtitle: "text-slate-500 font-bold tracking-wide text-lg",
            badgeText: "Pai, te amo!",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-white tracking-wide",
            backButton: "bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        },
        actions: {
            like: {
                color: "text-blue-600",
                bgColor: "bg-white",
                borderColor: "border-slate-200",
                likedColor: "text-white",
                likedBgColor: "bg-blue-600"
            },
            share: {
                color: "text-blue-600",
                bgColor: "bg-white",
                borderColor: "border-slate-200"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-8 mt-6 relative z-10",
            label: "text-slate-600 text-xs font-bold tracking-wider",
            labelText: " Nível de Orgulho",
            barContainer: "h-3 w-full rounded-full bg-slate-200 overflow-hidden border border-slate-300 shadow-inner",
            barFill: "h-full rounded-full bg-gradient-to-r from-slate-600 to-blue-600 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-slate-300 bg-white overflow-hidden group",
                pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#e2e8f0_50%),linear-gradient(225deg,transparent_50%,#e2e8f0_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
                seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-blue-600 shadow-md z-[2] flex items-center justify-center",
                button: "bg-gradient-to-r from-slate-600 to-blue-600 text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:from-slate-700 hover:to-blue-700 transition-colors tracking-widest",
                buttonText: "Abrir Presente",
                glowClass: "shadow-[0_0_20px_5px_rgba(71,85,105,0.3)]",
                numberClass: "text-slate-600",
                borderClass: "border-slate-300"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-slate-200/50 overflow-hidden group cursor-pointer",
                style: { background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(241,245,249,0.5)), repeating-linear-gradient(45deg, #e2e8f0 0, #e2e8f0 10px, #cbd5e1 10px, #cbd5e1 11px)` },
                overlay: "absolute inset-0 bg-white/30 backdrop-blur-[1px]",
                number: "text-slate-500 font-serif text-3xl mb-1 drop-shadow-sm",
                iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm",
                iconClass: "w-3 h-3 text-slate-500",
                text: "text-[8px] font-bold text-slate-500/80 tracking-wide",
                badge: "bg-white/80 text-slate-500 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-slate-200/50"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 border-slate-200 shadow-sm overflow-hidden group cursor-pointer",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "blur-[15px] opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #64748b 19px, #64748b 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-slate-700 bg-slate-100/80",
                iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
                borderClass: "border-slate-200",
                bgClass: "bg-white"
            },
            empty: {
                container: "aspect-[4/5] bg-slate-50/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-slate-300 border-dashed cursor-pointer hover:bg-slate-100/50 transition-colors group",
                number: "text-slate-400 font-serif text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center shadow-md",
                borderClass: "border-slate-300",
                bgClass: "bg-slate-50/50"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center transition-all",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4 transition-all",
            button: "bg-slate-600 hover:bg-slate-700 text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-slate-500/30 transition-all active:scale-95 whitespace-nowrap",
            secondaryButton: "h-14 w-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors hover:bg-slate-200"
        },
        editor: {
            topBar: {
                container: "border-slate-200",
                backButton: "text-slate-600",
                modeText: "text-slate-600",
                badgeText: "text-slate-800",
                previewButtonActive: "bg-slate-600 text-white shadow-slate-500/20",
                previewButtonInactive: "bg-zinc-50 text-slate-600 border-slate-200",
                settingsButton: "bg-zinc-50 text-slate-600 border-slate-200"
            },
            stats: {
                card: "border-slate-200/50",
                number: "text-slate-800",
                label: "text-slate-500"
            }
        },
        quote: {
            container: "mt-10 p-6 sm:p-8 rounded-[2rem] bg-white/70 border-2 border-slate-200 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative group backdrop-blur-sm",
            icon: "text-slate-500 w-8 h-8 fill-current opacity-90",
            title: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1",
            text: "text-2xl sm:text-3xl text-slate-600 font-display leading-relaxed"
        },
        icons: {
            main: Crown,
            locked: Lock,
            open: Gift,
            quote: Star,
            footer: Heart
        }
    }
};

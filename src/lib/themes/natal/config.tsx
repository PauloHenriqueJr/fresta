// Natal (Christmas) Theme Configuration
// A magical Christmas theme with snow, garlands, and festive decorations

import { Sparkles, Lock, Gift, Quote } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { NatalDecorationsFull } from './decorations';

export const natalTheme: PlusThemeConfig = {
    id: 'natal',
    content: {
        capsule: {
            title: "Natal Mágico",
            message: "Que este Natal traga momentos inesquecíveis e repletos de amor. 🎄✨",
            icon: Sparkles
        },
        lockedModal: {
            title: "Ainda não é Natal! 🎅",
            message: "Papai Noel está preparando sua surpresa. Volte na data certa para abrir seu presente!"
        },
        headerBadge: {
            text: "Natal Mágico",
            className: "bg-red-100 text-red-600 font-extrabold tracking-widest"
        },
        footerMessage: "Feliz Natal e um próspero Ano Novo! 🎄✨",
        subtitle: "A magia do Natal em cada surpresa",
        editorSubtitle: "Configurando sua magia de Natal"
    },
    styles: {
        background: {
            backgroundImage: "radial-gradient(#2E8B57 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backgroundColor: "#FDF5E6"
        }
    },
    FloatingComponent: NatalDecorationsFull,
    ui: {
        layout: {
            bgClass: "bg-[#FDF5E6]",
            bgSvg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10l2 4h4l-3 2 1 4-4-2-4 2 1-4-3-2h4z' fill='%23166534' fill-opacity='0.03'/%3E%3C/svg%3E")`,
            containerClass: "font-display",
            headerWrapper: "relative w-full bg-white/90 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-red-100",
            mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
            messageFont: "font-medium",
            titleFont: "font-black",
            secondaryFont: "font-bold"
        },
        header: {
            container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
            title: "text-[36px] font-black leading-tight text-red-700 drop-shadow-sm relative tracking-tight",
            subtitle: "text-green-700 font-bold text-xl uppercase tracking-wide",
            badgeText: "Natal Mágico",
            badgeTextClass: "text-[10px] xs:text-xs font-bold text-red-600 tracking-wide",
            backButton: "bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        },
        actions: {
            like: {
                color: "text-red-500",
                bgColor: "bg-white",
                borderColor: "border-red-200",
                likedColor: "text-white",
                likedBgColor: "bg-red-500"
            },
            share: {
                color: "text-red-500",
                bgColor: "bg-white",
                borderColor: "border-red-200"
            }
        },
        progress: {
            container: "flex flex-col gap-3 px-8 mt-6 relative z-10",
            label: "text-red-700 text-xs font-bold tracking-wider",
            labelText: " até o Natal",
            barContainer: "h-3 w-full rounded-full bg-green-100 overflow-hidden border border-green-200 shadow-inner",
            barFill: "h-full rounded-full bg-red-600 relative",
            barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
        },
        cards: {
            envelope: {
                container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-xl cursor-pointer transition-transform duration-300 border-4 border-red-500 bg-gradient-to-br from-red-100 via-white to-green-100 overflow-hidden group",
                pattern: "absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,#DC2626_48%,#DC2626_52%,transparent_52%),linear-gradient(-45deg,transparent_48%,#16A34A_48%,#16A34A_52%,transparent_52%)] z-[1] opacity-30",
                seal: "hidden",
                button: "bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-black px-5 py-3 rounded-full shadow-xl hover:from-red-500 hover:to-red-600 transition-all tracking-widest uppercase border-2 border-white",
                buttonText: "ABRIR PRESENTE",
                numberClass: "text-red-700",
                glowClass: "shadow-[0_0_30px_10px_rgba(220,38,38,0.3)]",
                borderClass: "border-red-500"
            },
            locked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-green-200/30 overflow-hidden group cursor-pointer",
                style: { background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(220,252,231,0.5)), repeating-linear-gradient(45deg, #f0fdf4 0, #f0fdf4 10px, #dcfce7 10px, #dcfce7 11px)` },
                overlay: "absolute inset-0 bg-white/30 backdrop-blur-[1px]",
                number: "text-green-700 font-festive text-3xl mb-1",
                iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-green-100 shadow-sm",
                iconClass: "w-3 h-3 text-red-600",
                text: "text-[8px] font-bold text-green-800 tracking-wide",
                badge: "bg-white/80 text-green-700 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                borderClass: "border-green-200/30"
            },
            unlocked: {
                container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 border-green-100 shadow-sm overflow-hidden group cursor-pointer",
                imageOverlay: "blur-[30px]",
                placeholderWrapper: "opacity-70",
                placeholderPattern: {
                    backgroundImage: `linear-gradient(90deg, transparent 19px, #166534 19px, #166534 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
                    backgroundSize: '100% 0.8em'
                },
                badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-red-600 bg-red-50",
                iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
                borderClass: "border-green-100",
                bgClass: "bg-white"
            },
            empty: {
                container: "aspect-[4/5] bg-green-50/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-green-200 border-dashed cursor-pointer hover:bg-green-100/50 transition-colors group",
                number: "text-green-300 font-festive text-2xl mb-2",
                iconWrapper: "w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md",
                borderClass: "border-green-200",
                bgClass: "bg-green-50/50"
            }
        },
        footer: {
            container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center",
            editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4",
            button: "bg-red-600 hover:bg-red-700 text-white px-8 h-14 rounded-full font-bold shadow-xl shadow-red-500/20 active:scale-95 transition-all",
            secondaryButton: "h-14 w-14 rounded-full bg-green-50 text-green-700 border border-green-100"
        },
        editor: {
            topBar: {
                container: "border-red-100",
                backButton: "text-red-500",
                modeText: "text-red-500",
                badgeText: "text-red-900",
                previewButtonActive: "bg-red-500 text-white shadow-red-500/20",
                previewButtonInactive: "bg-zinc-50 text-red-500 border-red-100",
                settingsButton: "bg-zinc-50 text-red-500 border-red-100"
            },
            stats: {
                card: "border-red-100/50",
                number: "text-red-900",
                label: "text-red-400"
            }
        },
        quote: {
            container: "mt-10 p-6 rounded-[2rem] bg-white/80 border-2 border-red-100 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative group",
            icon: "text-red-600 w-8 h-8 fill-current opacity-90",
            title: "text-[10px] font-black uppercase tracking-widest text-red-400 mb-1",
            text: "text-2xl text-green-800 font-festive leading-relaxed"
        },
        icons: {
            main: Sparkles,
            locked: Lock,
            open: Gift,
            quote: Quote,
            footer: null,
            envelopeSeal: Gift
        }
    }
};

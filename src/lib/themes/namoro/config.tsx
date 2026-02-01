// Namoro Theme Configuration
// A romantic theme for couples celebrating their relationship

import { Heart, Lock, Quote, Sparkles } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { HangingHearts } from './decorations';

export const namoroTheme: PlusThemeConfig = {
  id: 'namoro',
  content: {
    capsule: {
      title: "Nossa Jornada de Amor",
      message: "Cada momento que vivemos é um tesouro guardado com carinho. 💍💖",
      icon: Heart
    },
    lockedModal: {
      title: "Segura a ansiedade! ❤️",
      message: "Esta surpresa está sendo preparada com todo carinho. Volte no dia certo para abrir!"
    },
    headerBadge: {
      text: "Amor e Romance",
      className: "bg-pink-100 text-red-500 font-extrabold tracking-widest"
    },
    usageTip: "O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção.",
    tipTitle: "Dica dos Namorados",
    footerMessage: "Cada dia ao seu lado é um novo capítulo da nossa história de amor. ❤️",
    subtitle: "Uma jornada de amor para nós dois",
    editorSubtitle: "Configurando nossa jornada de amor"
  },
  styles: {
    background: {
      backgroundImage: "radial-gradient(#FFB6C1 1.5px, transparent 1.5px)",
      backgroundSize: "24px 24px",
      backgroundColor: "#FFF0F5"
    }
  },
  FloatingComponent: HangingHearts,
  ui: {
    layout: {
      bgClass: "bg-[#FFE5EC]",
      bgSvg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10c0-5 5-5 5 0s-5 10-5 10-5-5-5-10 5-5 5 0z' fill='%23e11d48' fill-opacity='0.05'/%3E%3C/svg%3E")`,
      containerClass: "font-display",
      headerWrapper: "relative w-full bg-white/80 pb-6 rounded-b-[2.5rem] shadow-festive z-10 pt-6 backdrop-blur-sm",
      mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
      messageFont: "font-festive",
      titleFont: "font-serif italic",
      secondaryFont: "font-display"
    },
    header: {
      container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
      title: "text-[36px] font-serif italic font-bold leading-tight text-rose-900 drop-shadow-sm relative",
      subtitle: "text-rose-500 font-festive text-2xl drop-shadow-sm",
      badgeText: "Amor e Romance",
      badgeTextClass: "text-[10px] xs:text-xs font-bold text-white tracking-wide",
      badge: "bg-gradient-to-r from-rose-500 to-pink-500",
      backButton: "bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
    },
    progress: {
      container: "flex flex-col gap-3 px-8 mt-6 relative z-10 font-display",
      label: "text-love-red text-xs font-bold tracking-wider",
      labelText: "% de puro amor",
      barContainer: "h-3 w-full rounded-full bg-rose-100 overflow-hidden border border-rose-200 shadow-inner",
      barFill: "h-full rounded-full bg-love-red relative",
      barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
    },
    cards: {
      envelope: {
        container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-love-red/20 bg-[#fdf2f8] overflow-hidden group",
        pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#fce7f3_50%),linear-gradient(225deg,transparent_50%,#fce7f3_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
        seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[radial-gradient(circle,#f43f5e_0%,#be123c_100%)] shadow-md z-[2] flex items-center justify-center",
        button: "bg-love-red text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:bg-rose-700 transition-colors tracking-widest",
        buttonText: "Abrir o Coração",
        numberClass: "text-rose-600",
        glowClass: "shadow-[0_0_20px_5px_rgba(225,29,72,0.3)]",
        borderClass: "border-love-red/20"
      },
      locked: {
        container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-rose-200/30 overflow-hidden group cursor-pointer",
        style: { background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(255,230,230,0.5)), repeating-linear-gradient(45deg, #ffe4e6 0, #ffe4e6 10px, #fecdd3 10px, #fecdd3 11px)` },
        overlay: "absolute inset-0 bg-white/30 backdrop-blur-[1px]",
        number: "text-rose-400 font-romantic text-3xl mb-1 drop-shadow-sm",
        iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-rose-100 shadow-sm backdrop-blur-sm",
        iconClass: "w-3 h-3 text-rose-400",
        text: "text-[8px] font-bold text-rose-500/80 tracking-wide",
        badge: "bg-white/80 text-rose-400 text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
        borderClass: "border-rose-200/30"
      },
      unlocked: {
        container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 border-rose-100 shadow-sm overflow-hidden group cursor-pointer",
        imageOverlay: "blur-[30px]",
        placeholderWrapper: "blur-[15px] opacity-70",
        placeholderPattern: {
          backgroundImage: `linear-gradient(90deg, transparent 19px, #abced4 19px, #abced4 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
          backgroundSize: '100% 0.8em'
        },
        badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-rose-600 bg-rose-50/80",
        iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
        borderClass: "border-rose-100",
        bgClass: "bg-white"
      },
      empty: {
        container: "aspect-[4/5] bg-rose-50/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-rose-200 border-dashed cursor-pointer hover:bg-rose-100/50 transition-colors group",
        number: "text-rose-300 font-romantic text-2xl mb-2",
        iconWrapper: "w-8 h-8 rounded-full bg-love-red text-white flex items-center justify-center shadow-md",
        borderClass: "border-rose-200",
        bgClass: "bg-rose-50/50"
      }
    },
    footer: {
      container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center transition-all",
      editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4 transition-all",
      button: "bg-love-red hover:bg-rose-700 text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-500/30 transition-all active:scale-95 whitespace-nowrap",
      secondaryButton: "h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 transition-colors hover:bg-rose-100"
    },
    editor: {
      topBar: {
        container: "border-rose-100",
        backButton: "text-rose-500",
        modeText: "text-rose-500",
        badgeText: "text-rose-900",
        previewButtonActive: "bg-rose-500 text-white shadow-rose-500/20",
        previewButtonInactive: "bg-zinc-50 text-rose-500 border-rose-100",
        settingsButton: "bg-zinc-50 text-rose-500 border-rose-100"
      },
      stats: {
        card: "border-rose-100/50",
        number: "text-rose-900",
        label: "text-rose-400"
      }
    },
    quote: {
      container: "mt-10 p-6 sm:p-8 rounded-[2rem] bg-white/70 border-2 border-rose-100 flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative group backdrop-blur-sm",
      icon: "text-red-500 w-8 h-8 fill-current opacity-90",
      title: "text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-1",
      text: "text-2xl sm:text-3xl text-rose-500 font-festive leading-relaxed"
    },
    icons: {
      main: Heart,
      locked: Lock,
      open: Heart,
      quote: Quote,
      footer: Sparkles
    }
  }
};

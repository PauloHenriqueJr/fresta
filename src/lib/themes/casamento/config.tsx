// Casamento (Wedding) Theme Configuration
// A luxurious theme for wedding celebrations

import { Heart, Lock, Quote } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { WeddingDecorations } from './decorations';

export const weddingTheme: PlusThemeConfig = {
  id: 'casamento',
  content: {
    capsule: {
      title: "O Início do Sempre",
      message: "Celebrando o amor, a união e a nossa história que começa agora. 💍🕊️",
      icon: Heart
    },
    lockedModal: {
      title: "Segura a emoção! 💍",
      message: "Este detalhe do nosso grande dia está sendo preparado com todo carinho. Volte na data certa para descobrir!"
    },
    headerBadge: {
      text: "Private Event",
      className: "bg-[#FFF9F0] text-[#B5942F] font-extrabold tracking-[0.2em]"
    },
    footerMessage: "Cada detalhe foi preparado com amor para você. ❤️",
    subtitle: "A CONTAGEM REGRESSIVA PARA O ALTAR",
    editorSubtitle: "Configurando o seu felizes para sempre"
  },
  styles: {
    background: {
      backgroundImage: "radial-gradient(#C5A059 1.5px, transparent 1.5px)",
      backgroundSize: "24px 24px",
      backgroundColor: "#FFFCF5"
    }
  },
  FloatingComponent: WeddingDecorations,
  ui: {
    layout: {
      bgClass: "bg-[#FDFBF7]",
      bgSvg: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10zm0-30c-5 0-10-5-10-10S45 0 50 0s10 5 10 10-5 10-10 10zm0 60c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10zm30-30c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10zm-60 0c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10z' fill='%23D4AF37' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      containerClass: "font-display",
      headerWrapper: "relative w-full bg-white/90 pb-6 rounded-b-[3rem] shadow-sm z-10 pt-6 border-b border-[#D4AF37]/10 backdrop-blur-md",
      mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
      messageFont: "font-serif italic text-[#B5942F]/80",
      titleFont: "font-serif italic",
      secondaryFont: "font-display"
    },
    header: {
      container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
      title: "text-[42px] font-serif italic text-[#B5942F] drop-shadow-sm relative leading-tight mb-2",
      subtitle: "text-[#D4AF37] font-medium tracking-[0.2em] uppercase text-[11px] sm:text-xs",
      badgeText: "Private Event",
      badgeTextClass: "text-[9px] font-black text-[#B5942F] uppercase tracking-[0.3em]",
      backButton: "bg-[#FDFBF7] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors border border-[#D4AF37]/20"
    },
    actions: {
      like: {
        color: "text-[#D4AF37]",
        bgColor: "bg-white",
        borderColor: "border-[#D4AF37]/20",
        likedColor: "text-white",
        likedBgColor: "bg-[#D4AF37]"
      },
      share: {
        color: "text-[#D4AF37]",
        bgColor: "bg-white",
        borderColor: "border-[#D4AF37]/20"
      }
    },
    progress: {
      container: "flex flex-col gap-2 px-8 mt-10 relative z-10 max-w-sm mx-auto",
      label: "text-[#B5942F] text-[10px] font-bold uppercase tracking-[0.2em]",
      labelText: " DO CAMINHO",
      barContainer: "h-2 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner",
      barFill: "h-full bg-gradient-to-r from-[#D4AF37] via-[#F7E7CE] to-[#B5942F] relative",
      barShimmer: "absolute inset-0 bg-white/30 animate-pulse"
    },
    cards: {
      envelope: {
        container: "aspect-square sm:aspect-[2/1] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-[2.5rem] shadow-xl cursor-pointer transition-all duration-500 border-2 border-[#D4AF37]/20 bg-white overflow-hidden group hover:shadow-2xl hover:scale-[1.02]",
        pattern: "absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFBF0_0%,#fff_100%)] z-[0]",
        seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B5942F] shadow-lg z-[2] flex items-center justify-center border-4 border-white",
        numberClass: "text-[#B5942F]",
        button: "bg-gradient-to-r from-[#D4AF37] to-[#B5942F] text-white text-[10px] font-black px-8 py-3 rounded-full hover:shadow-lg transition-all tracking-widest uppercase z-10 mt-16",
        buttonText: "VER SURPRESA",
        glowClass: "shadow-[0_0_40px_rgba(212,175,55,0.15)]",
        borderClass: "border-[#D4AF37]/20"
      },
      locked: {
        container: "aspect-square relative flex flex-col items-center justify-center p-2 rounded-[2rem] border-2 border-[#D4AF37]/5 bg-[#FDFBF7] overflow-hidden cursor-pointer group",
        style: { background: `linear-gradient(135deg, #FDFBF7 0%, #F5F0E6 100%)` },
        overlay: "absolute inset-0 bg-white/10 backdrop-blur-[1px]",
        number: "text-[#D4AF37] text-3xl font-serif italic mb-1 opacity-80",
        iconWrapper: "w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#D4AF37]/10",
        iconClass: "w-3 h-3 text-[#D4AF37]/60",
        text: "text-[8px] font-bold text-[#D4AF37]/40 tracking-[0.2em] uppercase",
        badge: "bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-bold px-2 py-0.5 rounded-full",
        borderClass: "border-[#D4AF37]/5"
      },
      unlocked: {
        container: "aspect-square relative flex flex-col items-center justify-center p-2 rounded-[2rem] bg-white border border-[#D4AF37]/10 shadow-md overflow-hidden cursor-pointer group",
        imageOverlay: "grayscale-[0.2] blur-[25px] group-hover:blur-0 transition-all duration-700",
        placeholderWrapper: "opacity-40",
        placeholderPattern: {
          backgroundImage: `linear-gradient(90deg, transparent 19px, #D4AF37 19px, #D4AF37 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
          backgroundSize: '100% 0.8em'
        },
        badge: "text-[9px] font-black px-3 py-1 rounded-full mb-1 text-[#B5942F] bg-[#FFF9F0] border border-[#D4AF37]/10 tracking-widest",
        iconWrapper: "absolute top-3 right-3 bg-white/90 rounded-full p-1.5 shadow-sm z-20 border border-[#D4AF37]/10",
        borderClass: "border-[#D4AF37]/10",
        bgClass: "bg-white"
      },
      empty: {
        container: "aspect-square bg-white/50 relative flex flex-col items-center justify-center p-2 rounded-[2rem] border border-[#D4AF37]/20 border-dashed cursor-pointer hover:bg-white transition-all",
        number: "text-[#E5CFAA] font-serif italic text-2xl mb-2",
        iconWrapper: "w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md",
        borderClass: "border-[#D4AF37]/20",
        bgClass: "bg-white/50"
      }
    },
    footer: {
      container: "relative w-full px-4 pt-12 pb-24 flex flex-col items-center justify-center gap-6",
      editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4",
      button: "bg-gradient-to-r from-[#D4AF37] to-[#B5942F] hover:to-[#754C0E] text-white px-10 h-14 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-[#D4AF37]/20 transition-all active:scale-95",
      secondaryButton: "h-14 w-14 rounded-2xl bg-[#FDFBF7] text-[#D4AF37] border border-[#D4AF37]/10 flex items-center justify-center hover:bg-[#D4AF37]/5",
      messageClass: "text-[#B5942F] font-serif italic text-center max-w-xs opacity-70 px-8"
    },
    editor: {
      topBar: {
        container: "border-[#D4AF37]/10 bg-white/90 backdrop-blur-md",
        backButton: "text-[#D4AF37]",
        modeText: "text-[#B5942F]",
        badgeText: "text-[#B5942F]",
        previewButtonActive: "bg-[#D4AF37] text-white shadow-[#D4AF37]/20",
        previewButtonInactive: "bg-[#FDFBF7] text-[#D4AF37] border-[#D4AF37]/10",
        settingsButton: "bg-[#FDFBF7] text-[#D4AF37] border-[#D4AF37]/10"
      },
      stats: {
        card: "border-[#D4AF37]/10 bg-white/50 backdrop-blur-sm",
        number: "text-[#B5942F]",
        label: "text-[#D4AF37]"
      }
    },
    quote: {
      container: "mt-10 p-8 rounded-[3rem] bg-white border border-[#D4AF37]/10 flex flex-col items-center text-center gap-4 shadow-sm max-w-lg mx-auto relative group",
      icon: "text-[#D4AF37] w-6 h-6 opacity-40 fill-current",
      title: "text-[10px] font-black uppercase tracking-[0.3em] text-[#B5942F]/50 mb-1",
      text: "text-2xl text-[#B5942F] font-serif italic leading-relaxed"
    },
    icons: {
      main: Heart,
      locked: Lock,
      open: Heart,
      quote: Quote,
      footer: Heart,
      envelopeSeal: Heart
    }
  }
};

import { Tables } from "@/lib/supabase/types";
import {
  Heart, Sparkles, Lock, Quote, PartyPopper, Bell, Pencil, Plus,
  Share2, Eye, Save, Rocket, MessageSquare, X, Play, Music,
  Camera, Gift, Settings, Clock, Download, Flame, GripHorizontal,
  Calendar, Star, Wand2, Coffee, Wine, Pizza, Utensils, Plane,
  MapPin, Sun, Moon, Cloud, Ghost, Palette, User, Info, HelpCircle, Ticket, Cake
} from "lucide-react";
import { HangingHearts, WeddingShower } from "./themeComponents";
import { CarnavalDecorations } from "./carnavalComponents";
import { SaoJoaoDecorations } from "./saojoaoComponents";

export interface PremiumThemeConfig {
  id: string;
  content: {
    capsule: {
      title: string;
      message: string;
      icon: any;
    };
    lockedModal: {
      title: string;
      message: string;
    };
    headerBadge?: {
      text: string;
      className: string;
    };
    usageTip?: string;
    tipTitle?: string;
    footerMessage: string;
    subtitle: string;
    editorSubtitle: string;
  };
  styles: {
    background?: {
      backgroundImage?: string;
      backgroundSize?: string;
      backgroundColor?: string;
    };
    card?: {
      locked?: {
        backgroundImage?: string;
        borderColor?: string;
        color?: string;
      };
      lockedIcon?: any;
      boxShadow?: string;
    };
    [key: string]: any;
  };
  FloatingComponent?: any;
  ui?: {
    layout: {
      bgClass: string;
      bgSvg?: string;
      containerClass: string;
      headerWrapper: string;
      mainClass: string;
      messageFont?: string; // Font for the main quote/letter texts
      titleFont?: string;   // Font for titles (Porta 1, etc)
      secondaryFont?: string; // Font for headers/badges
    };
    header: {
      container: string;
      title: string;
      subtitle: string;
      badge?: string;
      badgeText: string;
      badgeTextClass: string;
      backButton?: string;
    };
    progress: {
      container: string;
      label: string;
      labelText: string;
      barContainer: string;
      barFill: string;
      barShimmer: string;
    };
    cards: {
      envelope: {
        container: string;
        pattern: string;
        seal: string;
        button: string;
        buttonText: string;
        glowClass: string;
        borderClass: string;
      };
      locked: {
        container: string;
        style: any;
        overlay: string;
        number: string;
        iconWrapper: string;
        iconClass: string;
        text: string;
        badge: string;
        borderClass: string;
      };
      unlocked: {
        container: string;
        imageOverlay: string;
        placeholderWrapper: string;
        placeholderPattern: any;
        badge: string;
        iconWrapper: string;
        borderClass: string;
        bgClass: string;
      };
      empty: {
        container: string;
        number: string;
        iconWrapper: string;
        borderClass: string;
        bgClass: string;
      };
    };
    footer: {
      container: string;
      editorContainer: string;
      button: string;
      secondaryButton: string;
      message?: string;
    };
    editor?: {
      topBar: {
        container: string;
        backButton: string;
        modeText: string;
        badgeText: string;
        previewButtonActive: string;
        previewButtonInactive: string;
        settingsButton: string;
      };
      stats: {
        card: string;
        number: string;
        label: string;
      };
    };
    quote: {
      container: string;
      icon: string;
      title: string;
      text: string;
      fontClass?: string; // Specific font for the quote
    };
    icons: {
      main: any;
      locked: any;
      open: any;
      quote: any;
      footer: any;
    };
  };
}

export const natalTheme: PremiumThemeConfig = {
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
  ui: {
    layout: {
      bgClass: "bg-[#FDF5E6]",
      bgSvg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10l2 4h4l-3 2 1 4-4-2-4 2 1-4-3-2h4z' fill='%23166534' fill-opacity='0.03'/%3E%3C/svg%3E")`,
      containerClass: "font-display",
      headerWrapper: "relative w-full bg-white/90 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-red-100",
      mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
      messageFont: "font-festive",
      titleFont: "font-serif italic",
      secondaryFont: "font-display"
    },
    header: {
      container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
      title: "text-[36px] font-serif italic font-bold leading-tight text-red-900 drop-shadow-sm relative",
      subtitle: "text-green-700 font-festive text-2xl drop-shadow-sm",
      badgeText: "Natal Mágico",
      badgeTextClass: "text-[10px] xs:text-xs font-bold text-red-600 tracking-wide",
      backButton: "bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
        container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-red-200 bg-white overflow-hidden group",
        pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#fee2e2_50%),linear-gradient(225deg,transparent_50%,#fee2e2_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
        seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-600 shadow-md z-[2] flex items-center justify-center",
        button: "bg-red-600 text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition-colors tracking-widest",
        buttonText: "Abrir Presente",
        glowClass: "shadow-[0_0_20px_5px_rgba(220,38,38,0.2)]",
        borderClass: "border-red-200"
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
      footer: Bell
    }
  }
};

export const weddingTheme: PremiumThemeConfig = {
  id: 'casamento',
  content: {
    capsule: {
      title: "O Início do Sempre",
      message: "Celebrando o amor, a união e a nossa história que começa agora. 💍🕊️",
      icon: Heart
    },
    lockedModal: {
      title: "Ainda não é o momento... 💍",
      message: "Estamos preparando este detalhe com todo carinho do mundo. Em breve você verá!"
    },
    footerMessage: "Para sempre começa hoje. ❤️",
    subtitle: "Onde o amor ganha vida",
    editorSubtitle: "Configurando o seu felizes para sempre"
  },
  styles: {
    background: {
      backgroundImage: "radial-gradient(#C5A059 1.5px, transparent 1.5px)",
      backgroundSize: "24px 24px",
      backgroundColor: "#FFFCF5"
    }
  },
  FloatingComponent: WeddingShower,
  ui: {
    layout: {
      bgClass: "bg-[#FFFCF5]",
      bgSvg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20l5-5-5-5-5 5z' fill='%23D4AF37' fill-opacity='0.03'/%3E%3C/svg%3E")`,
      containerClass: "font-display",
      headerWrapper: "relative w-full bg-white pb-6 rounded-b-[3rem] shadow-sm z-10 pt-6 border-b border-wedding-gold/10",
      mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
      messageFont: "font-serif italic text-wedding-gold-dark/70",
      titleFont: "font-serif italic",
      secondaryFont: "font-display"
    },
    header: {
      container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
      title: "text-[36px] font-serif italic text-wedding-gold-dark drop-shadow-sm relative",
      subtitle: "text-slate-500 font-medium tracking-wide uppercase text-[10px]",
      badgeText: "Celebrando o Amor",
      badgeTextClass: "text-[10px] font-bold text-wedding-gold-dark uppercase tracking-widest",
      backButton: "bg-wedding-cream text-wedding-gold hover:bg-wedding-gold/10 transition-colors"
    },
    progress: {
      container: "flex flex-col gap-3 px-8 mt-6 relative z-10",
      label: "text-wedding-gold-dark text-[10px] font-bold uppercase tracking-widest",
      labelText: "% Concluído",
      barContainer: "h-2 w-full rounded-full bg-slate-100 overflow-hidden",
      barFill: "h-full bg-gradient-to-r from-wedding-gold to-wedding-gold-dark relative",
      barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
    },
    cards: {
      envelope: {
        container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border border-wedding-gold/20 bg-white overflow-hidden group",
        pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#FDFBF7_50%),linear-gradient(225deg,transparent_50%,#FDFBF7_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
        seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-wedding-gold shadow-md z-[2] flex items-center justify-center",
        button: "bg-wedding-gold text-white text-[10px] font-black px-6 py-2 rounded-full hover:bg-wedding-gold-dark transition-colors tracking-widest uppercase",
        buttonText: "Nossa Memória",
        glowClass: "shadow-[0_0_20px_rgba(212,175,55,0.1)]",
        borderClass: "border-wedding-gold/20"
      },
      locked: {
        container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-[2rem] border-2 border-wedding-gold/5 bg-wedding-cream overflow-hidden cursor-pointer",
        style: { background: `linear-gradient(135deg, #FDFBF7 0%, #F5F0E6 100%)` },
        overlay: "absolute inset-0 bg-white/10",
        number: "text-wedding-gold text-2xl font-serif italic mb-1",
        iconWrapper: "w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm",
        iconClass: "w-3 h-3 text-wedding-gold-soft",
        text: "text-[8px] font-bold text-wedding-gold-dark/40 tracking-widest uppercase",
        badge: "bg-wedding-gold/10 text-wedding-gold text-[8px] font-bold px-2 py-0.5 rounded-full",
        borderClass: "border-wedding-gold/5"
      },
      unlocked: {
        container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-[2rem] bg-white border border-wedding-gold/10 shadow-sm overflow-hidden cursor-pointer",
        imageOverlay: "opacity-40 grayscale-[0.5]",
        placeholderWrapper: "opacity-40",
        placeholderPattern: {
          backgroundImage: `linear-gradient(90deg, transparent 19px, #D4AF37 19px, #D4AF37 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
          backgroundSize: '100% 0.8em'
        },
        badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-wedding-gold-dark bg-wedding-cream",
        iconWrapper: "absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm z-20",
        borderClass: "border-wedding-gold/10",
        bgClass: "bg-white"
      },
      empty: {
        container: "aspect-[4/5] bg-wedding-cream/50 relative flex flex-col items-center justify-center p-2 rounded-[2rem] border border-wedding-gold/20 border-dashed cursor-pointer",
        number: "text-wedding-gold-soft font-serif italic text-2xl mb-2",
        iconWrapper: "w-8 h-8 rounded-full bg-wedding-gold text-white flex items-center justify-center shadow-md",
        borderClass: "border-wedding-gold/20",
        bgClass: "bg-wedding-cream/50"
      }
    },
    footer: {
      container: "relative w-full px-4 pt-12 pb-24 flex items-center justify-center",
      editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-4",
      button: "bg-wedding-gold hover:bg-wedding-gold-dark text-white px-8 h-14 rounded-full font-bold shadow-lg shadow-wedding-gold/20 transition-all",
      secondaryButton: "h-14 w-14 rounded-full bg-wedding-cream text-wedding-gold border border-wedding-gold/10"
    },
    editor: {
      topBar: {
        container: "border-wedding-gold/10",
        backButton: "text-wedding-gold",
        modeText: "text-wedding-gold",
        badgeText: "text-wedding-gold-dark",
        previewButtonActive: "bg-wedding-gold text-white shadow-wedding-gold/20",
        previewButtonInactive: "bg-wedding-cream text-wedding-gold border-wedding-gold/10",
        settingsButton: "bg-wedding-cream text-wedding-gold border-wedding-gold/10"
      },
      stats: {
        card: "border-wedding-gold/10",
        number: "text-wedding-gold-dark",
        label: "text-wedding-gold"
      }
    },
    quote: {
      container: "mt-10 p-8 rounded-[3rem] bg-white border border-wedding-gold/10 flex flex-col items-center text-center gap-4 shadow-sm max-w-lg mx-auto relative group",
      icon: "text-wedding-gold w-6 h-6 opacity-30",
      title: "text-[10px] font-bold uppercase tracking-[0.3em] text-wedding-gold-dark/40 mb-1",
      text: "text-xl text-wedding-gold-dark font-serif italic leading-relaxed"
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

export const namoroTheme: PremiumThemeConfig = {
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

export const carnavalTheme: PremiumThemeConfig = {
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

// === SÃO JOÃO THEME ===
export const saojoaoTheme: PremiumThemeConfig = {
  id: 'saojoao',
  content: {
    capsule: {
      title: "Arraiá do Calendário",
      message: "Sua contagem para a fogueira! Cada janela é uma quadrilha de surpresas. 🔥🌽",
      icon: Flame
    },
    lockedModal: {
      title: "A fogueira ainda não acendeu! 🔥",
      message: "Calma, cabra! Ainda não é hora de abrir essa janela. Prepara o chapéu de palha que o forró já vai começar!"
    },
    footerMessage: "O arraial acaba, mas o amor fica! 🌽🔥",
    subtitle: "Sua contagem para a fogueira",
    editorSubtitle: "Monte seu arraial de surpresas! 🔥"
  },
  styles: {
    background: {
      backgroundColor: "#FFF8E8"
    }
  },
  FloatingComponent: SaoJoaoDecorations,
  ui: {
    layout: {
      bgClass: "bg-[#FFF8E8]",
      bgSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM45 40c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM15 40c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z' fill='%23D97706' fill-opacity='0.08'/%3E%3C/svg%3E")`,
      containerClass: "font-display",
      headerWrapper: "relative w-full bg-white/80 pb-6 rounded-b-[2.5rem] shadow-sm z-10 pt-6 backdrop-blur-sm border-b border-amber-200",
      mainClass: "flex-1 px-4 py-8 pb-12 relative z-0",
      messageFont: "font-display",
      titleFont: "font-festive",
      secondaryFont: "font-sans"
    },
    header: {
      container: "px-6 mt-4 text-center relative z-10 flex flex-col items-center gap-2",
      title: "text-[#5D4037] font-extrabold tracking-tight text-[28px] drop-shadow-sm relative flex items-center gap-2",
      subtitle: "text-[#8D6E63] font-medium tracking-wide text-base",
      badgeText: "VILA DE SÃO JOÃO",
      badgeTextClass: "text-[10px] xs:text-xs font-bold text-white tracking-wide",
      badge: "bg-[#E65100] text-white",
      backButton: "bg-white text-[#5D4037] hover:bg-amber-50 transition-colors shadow-md"
    },
    progress: {
      container: "flex flex-col gap-3 px-6 mt-6 relative z-10",
      label: "text-[#E65100] text-xs font-bold tracking-wider uppercase",
      labelText: "Janelas do São João",
      barContainer: "h-3 w-full rounded-full bg-[#FFCC80] overflow-hidden border border-[#FFB74D] shadow-inner",
      barFill: "h-full rounded-full bg-gradient-to-r from-[#E65100] to-[#FF8F00] relative",
      barShimmer: "absolute inset-0 bg-white/20 animate-pulse"
    },
    cards: {
      envelope: {
        container: "aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-[#8D6E63] bg-[#5D4037] overflow-hidden group",
        pattern: "absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,rgba(255,255,255,0.1)_50%),linear-gradient(225deg,transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]",
        seal: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[#E65100] to-[#FF8F00] shadow-md z-[2] flex items-center justify-center",
        button: "bg-white text-[#5D4037] text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:bg-amber-50 transition-colors tracking-widest",
        buttonText: "ABRA A JANELA!",
        glowClass: "shadow-[0_0_20px_5px_rgba(230,81,0,0.3)]",
        borderClass: "border-[#8D6E63]"
      },
      locked: {
        container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-2xl opacity-90 border border-[#D7CCC8] overflow-hidden group cursor-pointer bg-[#EFEBE9]",
        style: { backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(141,110,99,0.15) 8px, rgba(141,110,99,0.15) 10px)` },
        overlay: "absolute inset-0 bg-white/10",
        number: "text-[#5D4037] font-extrabold text-2xl mb-1",
        iconWrapper: "flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-[#D7CCC8] shadow-sm backdrop-blur-sm",
        iconClass: "w-3 h-3 text-[#8D6E63]",
        text: "text-[8px] font-bold text-[#8D6E63] tracking-wide",
        badge: "bg-white/80 text-[#5D4037] text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm",
        borderClass: "border-[#D7CCC8]"
      },
      unlocked: {
        container: "aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-2xl bg-[#FFF8E1] border-2 border-[#FFB74D] shadow-sm overflow-hidden group cursor-pointer",
        imageOverlay: "blur-[30px]",
        placeholderWrapper: "blur-[15px] opacity-70",
        placeholderPattern: {
          backgroundImage: `linear-gradient(90deg, transparent 19px, #FFB74D 19px, #FFB74D 20px, transparent 20px), linear-gradient(#eee 0.1em, transparent 0.1em)`,
          backgroundSize: '100% 0.8em'
        },
        badge: "text-[10px] font-bold px-2 rounded-full mb-1 text-[#5D4037] bg-white/80",
        iconWrapper: "absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm z-20",
        borderClass: "border-[#FFB74D]",
        bgClass: "bg-[#FFF8E1]"
      },
      empty: {
        container: "aspect-[4/5] bg-[#FFF8E1] relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-[#FFB74D] border-dashed cursor-pointer hover:bg-[#FFECB3] transition-colors group",
        number: "text-[#8D6E63] font-extrabold text-2xl mb-2",
        iconWrapper: "w-8 h-8 rounded-full bg-[#E65100] text-white flex items-center justify-center shadow-md",
        borderClass: "border-[#FFB74D]",
        bgClass: "bg-[#FFF8E1]"
      }
    },
    footer: {
      container: "relative w-full px-4 pt-12 pb-24 flex flex-col items-center justify-center gap-4 transition-all",
      editorContainer: "relative w-full px-4 pt-8 pb-16 flex items-center justify-center gap-3 transition-all",
      button: "bg-[#E65100] hover:bg-[#BF360C] text-white w-14 h-14 sm:w-auto sm:px-8 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-[#E65100]/30 transition-all active:scale-95 whitespace-nowrap",
      secondaryButton: "h-14 w-14 rounded-full bg-white text-[#5D4037] flex items-center justify-center border border-[#D7CCC8] shadow-md transition-colors hover:bg-[#FFF8E1]",
      message: "text-[#8D6E63] text-sm font-medium text-center mt-2"
    },
    editor: {
      topBar: {
        container: "border-[#D7CCC8]",
        backButton: "text-[#5D4037]",
        modeText: "text-[#E65100]",
        badgeText: "text-[#5D4037]",
        previewButtonActive: "bg-[#E65100] text-white shadow-[#E65100]/20",
        previewButtonInactive: "bg-white text-[#5D4037] border-[#D7CCC8]",
        settingsButton: "bg-white text-[#5D4037] border-[#D7CCC8]"
      },
      stats: {
        card: "border-[#D7CCC8]/50",
        number: "text-[#5D4037]",
        label: "text-[#8D6E63]"
      }
    },
    quote: {
      container: "mt-6 mx-4 p-5 rounded-2xl bg-white border border-[#D7CCC8] flex flex-col items-center text-center gap-2 shadow-sm max-w-lg mx-auto relative",
      icon: "text-[#E65100] w-6 h-6 fill-current",
      title: "text-sm font-bold text-[#5D4037]",
      text: "text-sm text-[#8D6E63] leading-relaxed"
    },
    icons: {
      main: Flame,
      locked: Lock,
      open: Sparkles,
      quote: Music,
      footer: Flame
    }
  }
};

// === ANIVERSÁRIO THEME ===
export const aniversarioTheme: PremiumThemeConfig = {
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
  FloatingComponent: CarnavalDecorations,
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

export const getThemeConfig = (themeId: string): PremiumThemeConfig => {
  switch (themeId) {
    case 'natal': return natalTheme;
    case 'casamento': return weddingTheme;
    case 'namoro': return namoroTheme;
    case 'carnaval': return carnavalTheme;
    case 'saojoao': return saojoaoTheme;
    case 'aniversario': return aniversarioTheme;
    default: return namoroTheme;
  }
};


import React from "react";
import { Heart, Lock, Sparkles, Flame } from "lucide-react";
import { FlagBanner, WeddingShower, HangingHearts } from "./themeComponents";

// ------------------------------------------------------------------
// 1. INTERFACES
// ------------------------------------------------------------------

export interface ThemeContent {
  capsule: {
    title: string;
    message: string;
    icon?: React.ElementType;
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
}

// ... unchanged styles interface ...
export interface ThemeStyles {
  background: React.CSSProperties | undefined;
  card: {
    locked: React.CSSProperties;
    lockedIcon: React.ReactNode;
    boxShadow?: string;
  };
}

export interface PremiumThemeConfig {
  id: string;
  content: ThemeContent;
  styles: ThemeStyles;
  FloatingComponent?: React.ComponentType;
}

// ... default theme ... (keep usageTip/tipTitle undefined or add default)
const defaultTheme: PremiumThemeConfig = {
  id: 'default',
  content: {
    capsule: {
      title: "CÁPSULA DO TEMPO",
      message: "Colecione momentos, não coisas. Este calendário é um pedacinho da sua história.",
      icon: Sparkles
    },
    lockedModal: {
      title: "Calma, coração!",
      message: "Essa surpresa ainda está sendo preparada e só abre em breve. Segura a ansiedade!"
    },
    usageTip: "Um tema versátil para qualquer ocasião especial.",
    tipTitle: "Sobre este tema",
  },
  styles: {
    background: undefined,
    card: {
      locked: {},
      lockedIcon: <Lock className="w-4 h-4 opacity-40" />
    }
  }
};

// SÃO JOÃO
export const saoJoaoTheme: PremiumThemeConfig = {
  id: 'saojoao',
  content: {
    capsule: {
      title: "MEMÓRIAS DO ARRAIÁ",
      message: "Que a alegria dessa festa aqueça seu coração o ano todo! Guarde cada momento. 🔥🌽",
      icon: Flame
    },
    lockedModal: {
      title: "Opa, pera lá! 🌽",
      message: "A fogueira ainda tá esquentando! Segura a ansiedade que essa porta abre logo pro arraiá."
    },
    headerBadge: {
      text: "Vila de São João",
      className: "bg-orange-500 text-white"
    },
    usageTip: "Ideal para festas juninas, arraiás e esquentas de São João. 🔥",
    tipTitle: "Dica Junina"
  },
  styles: {
    background: {
      backgroundImage: "radial-gradient(#F9A03F 2px, transparent 2px), radial-gradient(#F9A03F 2px, transparent 2px)",
      backgroundSize: "32px 32px",
      backgroundPosition: "0 0, 16px 16px",
      backgroundColor: "#FFF8E8"
    },
    card: {
      locked: {
        backgroundImage: "repeating-linear-gradient(90deg, #8B4513, #8B4513 10px, #75380C 10px, #75380C 12px)",
        backgroundColor: '#8B4513',
        borderColor: '#5D2E0B'
      },
      lockedIcon: <Lock className="w-4 h-4 text-white/40" />
    }
  },
  FloatingComponent: FlagBanner
};

// CASAMENTO
export const casamentoTheme: PremiumThemeConfig = {
  id: 'casamento',
  content: {
    capsule: {
      title: "NOSSA JORNADA",
      message: "Cada dia ao seu lado é um presente que quero abrir para sempre. 💍💖",
      icon: Heart
    },
    lockedModal: {
      title: "Ainda não é o momento... 💍",
      message: "Estamos preparando este detalhe com todo carinho do mundo. Em breve você verá!"
    },
    headerBadge: {
      text: "Rumo ao Altar",
      className: "bg-[#C5A059] text-white"
    },
    usageTip: "Perfeito para contagem regressiva de casamentos. Para namoro, prefira o tema 'Romance'.",
    tipTitle: "Detalhe dos Noivos"
  },
  styles: {
    background: {
      backgroundImage: "radial-gradient(#C5A059 1.5px, transparent 1.5px)",
      backgroundSize: "24px 24px",
      backgroundColor: "#FFFCF5"
    },
    card: {
      locked: {
        backgroundImage: "linear-gradient(135deg, #FFFBF0 0%, #F5E6CC 100%)",
        borderColor: '#D4AF37',
        boxShadow: "0 4px 6px -1px rgba(212, 175, 55, 0.2)"
      },
      lockedIcon: <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] opacity-60" />,
      boxShadow: "0 10px 30px -5px rgba(212, 175, 55, 0.3)"
    }
  },
  FloatingComponent: WeddingShower
};

// NAMORO
export const namoroTheme: PremiumThemeConfig = {
  id: 'namoro',
  content: {
    capsule: {
      title: "NOSSA JORNADA DE AMOR",
      message: "Contando os dias para o nosso momento... Quero viver tudo com você!",
      icon: Heart
    },
    lockedModal: {
      title: "Calma, vida! ❤️",
      message: "Eu sei que você tá curiosa(o), mas guardei essa surpresa para o dia certo."
    },
    headerBadge: {
      text: "AMOR E ROMANCE",
      className: "bg-pink-100 text-red-500 font-extrabold tracking-widest"
    },
    usageTip: "\"Onde há amor, há vida. Prepare o coração, pois o que está por vir é eterno.\"",
    tipTitle: "Dica dos Namorados"
  },
  styles: {
    background: {
      backgroundImage: "radial-gradient(#FFB6C1 1.5px, transparent 1.5px)", // Light pink dots
      backgroundSize: "24px 24px",
      backgroundColor: "#FFF0F5" // Lavender Blush
    },
    card: {
      locked: {
        backgroundImage: "linear-gradient(135deg, #FFC0CB 0%, #FF69B4 100%)", // Pink gradient for locked
        borderColor: '#FF1493', // Deep Pink border
        color: 'white'
      },
      lockedIcon: <Heart className="w-4 h-4 text-white fill-white opacity-90" />,
      boxShadow: "0 8px 20px -5px rgba(255, 105, 180, 0.4)"
    }
  },
  FloatingComponent: HangingHearts
};

// ------------------------------------------------------------------
// 3. REGISTRY EXPORT
// ------------------------------------------------------------------

const themes: Record<string, PremiumThemeConfig> = {
  default: defaultTheme,
  saojoao: saoJoaoTheme,
  casamento: casamentoTheme,
  namoro: namoroTheme,
};

export const getThemeConfig = (id?: string): PremiumThemeConfig => {
  return themes[id || 'default'] || themes['default'];
};

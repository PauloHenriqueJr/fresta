import mascotCarnaval from "@/assets/mascot-login-header.png";
import mascotLove from "@/assets/mascot-love.png";
import mascotSaoJoao from "@/assets/saojoao.png";

export interface ThemeConfig {
    id: string;
    name: string;
    brandName: string;
    primaryGradient: string;
    accentGradient: string;
    floatingElement: 'confetti' | 'hearts' | 'flags' | 'flowers';
    mascot: string;
    mascotStyle?: {
        scale?: number;
        bottomOffset?: number;
    };
    mobileMascotStyle?: {
        scale?: number;
        bottomOffset?: number;
    };
    emojis: {
        logo: string;
        hero: string;
        section: string;
    };
    colors: {
        primary: string;
        accent: string;
        textGradient: string;
        lightBloom: string;
    };
}

export const THEMES: Record<string, ThemeConfig> = {
    carnaval: {
        id: 'carnaval',
        name: 'Carnaval Folia',
        brandName: 'Fresta Folia',
        primaryGradient: 'bg-gradient-to-br from-[#8B5CF6] to-[#D946EF]',
        accentGradient: 'bg-gradient-to-br from-[#F59E0B] to-[#F97316]',
        floatingElement: 'confetti',
        mascot: mascotCarnaval,
        mascotStyle: {
            scale: 1.3,
            bottomOffset: 75
        },
        mobileMascotStyle: {
            scale: 1.1,
            bottomOffset: 60
        },
        emojis: {
            logo: '🎭',
            hero: '🎉',
            section: '🥁'
        },
        colors: {
            primary: '#7C3AED',
            accent: '#F59E0B',
            textGradient: 'text-[#4C1D95]',
            lightBloom: 'bg-purple-400/20'
        }
    },
    namoro: {
        id: 'namoro',
        name: 'Dia dos Namorados',
        brandName: 'Fresta Love',
        primaryGradient: 'bg-gradient-to-br from-red-500 to-rose-600',
        accentGradient: 'bg-gradient-to-br from-pink-400 to-red-400',
        floatingElement: 'hearts',
        mascot: mascotLove,
        mascotStyle: {
            scale: 1,
            bottomOffset: 0
        },
        mobileMascotStyle: {
            scale: 0.9,
            bottomOffset: 0
        },
        emojis: {
            logo: '💌',
            hero: '💖',
            section: '👩‍❤️‍👨'
        },
        colors: {
            primary: '#E11D48',
            accent: '#FB7185',
            textGradient: 'bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent italic pb-2 pr-4',
            lightBloom: 'bg-red-400/10'
        }
    },
    saojoao: {
        id: 'saojoao',
        name: 'Festa Junina',
        brandName: 'Fresta Junina',
        primaryGradient: 'bg-gradient-to-br from-orange-500 to-amber-600',
        accentGradient: 'bg-gradient-to-br from-yellow-400 to-orange-400',
        floatingElement: 'flags',
        mascot: mascotSaoJoao,
        mascotStyle: {
            scale: 1.6,
            bottomOffset: 60
        },
        mobileMascotStyle: {
            scale: 1.3,
            bottomOffset: 50
        },
        emojis: {
            logo: '🔥',
            hero: '🌽',
            section: '🎶'
        },
        colors: {
            primary: '#EA580C',
            accent: '#F59E0B',
            textGradient: 'text-orange-800',
            lightBloom: 'bg-orange-400/20'
        }
    },
    casamento: {
        id: 'casamento',
        name: 'Casamento',
        brandName: 'Fresta Celebra',
        primaryGradient: 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]',
        accentGradient: 'bg-gradient-to-br from-[#F5F0E6] to-[#D4AF37]',
        floatingElement: 'flowers',
        mascot: mascotLove, // Can create specific mascot later
        emojis: {
            logo: '💍',
            hero: '💒',
            section: '🥂'
        },
        colors: {
            primary: '#D4AF37',
            accent: '#B8860B',
            textGradient: 'text-[#8B7355]',
            lightBloom: 'bg-amber-300/20'
        }
    }
};

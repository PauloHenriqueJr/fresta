import { useState, useMemo, ReactNode, forwardRef } from "react";
import { BrandWatermark } from "@/components/calendar/BrandWatermark";
import { motion } from "framer-motion";
import { Pencil, Plus, Share2, Heart, Lock, Eye, Save, Rocket, Quote, MessageSquare, Sparkles, X, Play, Music, Camera, Gift, Settings, PartyPopper, Clock, Bell, Download, Flame, GripHorizontal, Calendar, Star, Wand2, Coffee, Wine, Pizza, Utensils, Plane, MapPin, Sun, Moon, Cloud, Ghost, Palette, User, Info, HelpCircle, Ticket, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { canInstallPWA, promptInstall, isPWAInstalled } from "@/lib/push/notifications";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import { getThemeConfig, type PlusThemeConfig } from "./registry";

// --- Legacy Compatibility Aliases ---
// These allow older theme-specific pages to continue working after the standardization
export const EmptyDayCard = ({ dayNumber, isEditor }: { dayNumber: number | string, isEditor?: boolean }) => (
  <UniversalEmptyCard dayNumber={dayNumber} config={getThemeConfig('namoro').ui} />
);

export const LockedDayCard = ({ dayNumber, timeText, isEditor, onClick }: { dayNumber: number | string, timeText: string, isEditor?: boolean, onClick?: () => void }) => (
  <UniversalLockedCard dayNumber={dayNumber} timeText={timeText} config={getThemeConfig('namoro').ui} isEditor={isEditor} onClick={onClick} />
);

export const EnvelopeCard = ({ dayNumber, isEditor, onClick }: { dayNumber: number | string, isEditor?: boolean, onClick?: () => void }) => (
  <UniversalEnvelopeCard dayNumber={dayNumber} config={getThemeConfig('namoro').ui} isEditor={isEditor} onClick={onClick} />
);

export const UnlockedDayCard = ({ dayNumber, imageUrl, isEditor, onClick }: { dayNumber: number | string, imageUrl: string, isEditor?: boolean, onClick?: () => void }) => (
  <UniversalUnlockedCard dayNumber={dayNumber} imageUrl={imageUrl} config={getThemeConfig('namoro').ui} isEditor={isEditor} onClick={onClick} />
);

export const LoveHeader = ({ isEditor, onEdit }: { isEditor?: boolean, onEdit?: () => void }) => (
  <UniversalHeader
    title="Nossa Jornada de Amor"
    subtitle="Uma jornada de amor para nós dois"
    config={getThemeConfig('namoro')}
    isEditor={isEditor}
    onEdit={onEdit}
  />
);

export const LoveProgressBar = ({ progress, isEditor }: { progress: number, isEditor?: boolean }) => (
  <UniversalProgress progress={progress} config={getThemeConfig('namoro').ui} isEditor={isEditor} />
);

export const LoveQuote = ({ isEditor }: { isEditor?: boolean }) => (
  <UniversalQuote
    text="O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção."
    author="Dica dos Namorados"
    config={getThemeConfig('namoro')}
    isEditor={isEditor}
  />
);

export const LoveFooter = () => (
  <UniversalFooter config={getThemeConfig('namoro').ui} />
);

// --- Background ---
export const LoveBackground = () => {
  // SVG Pattern from user's HTML
  const petalPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10c0-5 5-5 5 0s-5 10-5 10-5-5-5-10 5-5 5 0z' fill='%23e11d48' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <div
      className="fixed inset-0 z-[-1] bg-background-light dark:bg-background-dark pointer-events-none"
      style={{ backgroundImage: petalPattern }}
    />
  );
};

// --- Hanging Hearts ---
export const HangingHearts = () => {
  const hearts = [
    { height: "h-10", color: "text-love-red", delay: 0 },
    { height: "h-16", color: "text-love-rose", delay: -0.5 },
    { height: "h-12", color: "text-love-red", delay: -1.2 },
    { height: "h-20", color: "text-rose-300", delay: -0.8 },
    { height: "h-14", color: "text-love-red", delay: -1.5 },
    { height: "h-18", color: "text-rose-400", delay: -0.3 },
    { height: "h-12", color: "text-love-red", delay: -1.0 },
  ];

  return (
    <div className="fixed top-0 left-0 w-full flex justify-around items-start z-40 pointer-events-none h-24 overflow-hidden px-2">
      {hearts.map((item, i) => (
        <motion.div
          key={i}
          className="hanging-heart flex flex-col items-center origin-top relative"
          style={{
            animationDelay: `${item.delay}s`
          }}
          animate={{
            rotate: [-5, 5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 2 // Add some randomness for React rendering
          }}
        >
          {/* Ribbon */}
          <div className={`w-[2px] ${item.height} bg-gradient-to-b from-love-rose to-rose-300`} />

          {/* Heart Icon */}
          <div className={`-mt-1 ${item.color}`}>
            <Heart className="w-6 h-6 fill-current drop-shadow-sm" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Header ---

export const UniversalHeader = ({ title, subtitle, config, isEditor, onEdit, onEditSubtitle, onShare, onLike, liked, headerBgSvg, showWatermark }: { title?: React.ReactNode, subtitle?: React.ReactNode, config: PlusThemeConfig, isEditor?: boolean, onEdit?: (e: React.MouseEvent) => void, onEditSubtitle?: (e: React.MouseEvent) => void, onShare?: () => void, onLike?: () => void, liked?: boolean, headerBgSvg?: string, showWatermark?: boolean }) => {
  const titleFont = config.ui?.layout.titleFont || "";
  const subtitleFont = config.ui?.layout.secondaryFont || "";
  return (
    <div className={cn(config.ui?.header.container, "group pointer-events-auto")}>
      <div className="flex items-center justify-center gap-4 w-full mb-2">
        {config.id === 'casamento' && (
          null
        )}
        {showWatermark && <BrandWatermark variant="compact" className="hidden sm:flex" />}
        <h1
          className={cn(config.ui?.header.title, titleFont, "relative cursor-pointer transition-all active:scale-[0.99] text-center")}
          onClick={isEditor ? (e) => onEdit?.(e) : undefined}
        >
          {title}
          {isEditor && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(e);
              }}
              className="absolute -top-2 -right-10 bg-white/90 shadow-lg p-2 rounded-full text-rose-500 hover:text-rose-600 transition-all hover:scale-110 active:scale-95 border border-rose-100 z-50 disabled:opacity-50"
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}
        </h1>
        {showWatermark && <BrandWatermark variant="compact" className="hidden sm:flex" />}
        {config.id === 'casamento' && (
          null
        )}
      </div>

      {/* Mobile Watermarks (stacked above title if needed or different layout) */}
      {showWatermark && (
        <div className="flex sm:hidden items-center justify-center gap-2 mb-4">
          <BrandWatermark variant="compact" />
          <BrandWatermark variant="compact" />
        </div>
      )}
      <div
        className="relative cursor-pointer transition-all active:scale-[0.99]"
        onClick={isEditor ? (e) => onEditSubtitle?.(e) : undefined}
      >
        <div className={cn(config.ui?.header.subtitle, subtitleFont)}>{subtitle}</div>
        {isEditor && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditSubtitle?.(e);
            }}
            className="absolute -top-1 -right-8 bg-white/90 shadow-lg p-1.5 rounded-full text-rose-500 hover:text-rose-600 transition-all hover:scale-110 active:scale-95 border border-rose-100 z-50"
          >
            <Pencil className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export const UniversalProgress = ({ progress = 0, config, isEditor, onEdit, labelText }: { progress?: number, config: any, isEditor?: boolean, onEdit?: () => void, labelText?: React.ReactNode }) => {
  return (
    <div
      className={cn(config.progress.container, "cursor-pointer pointer-events-auto transition-all active:scale-[0.99]")}
      onClick={isEditor ? onEdit : undefined}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={config.progress.label}>
          {progress}{labelText || config.progress.labelText}
        </span>
        {isEditor && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="text-[10px] font-bold text-rose-500/60 hover:text-rose-600 transition-colors uppercase tracking-widest flex items-center gap-1"
          >
            <Pencil className="w-2.5 h-2.5" /> Editar
          </button>
        )}
      </div>
      <div className={config.progress.barContainer}>
        <motion.div
          className={config.progress.barFill}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className={config.progress.barShimmer}></div>
        </motion.div>
      </div>
    </div>
  )
}

// --- Day Components ---

// Empty Day (For Editor "Add Surprise")
export const UniversalEmptyCard = ({ dayNumber, config, onClick }: { dayNumber: number | string, config: any, onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={cn(config.cards.empty.container, "group cursor-pointer")}
    >
      <span className={config.cards.empty.number}>{dayNumber}</span>
      <div className="flex flex-col items-center gap-1 group-hover:scale-105 transition-transform">
        <div className={config.cards.empty.iconWrapper}>
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-[8px] font-bold uppercase text-center leading-tight mt-1 opacity-70">Adicionar<br />Surpresa</span>
      </div>
    </div>
  )
}

// Locked Day (Future)
export interface UniversalLockedCardProps {
  dayNumber: number | string;
  timeText: string;
  config: any;
  isEditor?: boolean;
  onClick?: () => void;
}

export const UniversalLockedCard = ({ dayNumber, timeText, config, isEditor = false, onClick }: UniversalLockedCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(config.cards.locked.container, "cursor-pointer active:scale-95 transition-transform group")}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={config.cards.locked.style}
    >
      <div className={cn(config.cards.locked.overlay, "pointer-events-none")}></div>

      {isEditor && (
        <button className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-sm text-gray-500 z-20 hover:text-gray-700">
          <Pencil className="w-3 h-3" />
        </button>
      )}
      <div className="relative z-10 flex flex-col items-center transform transition-transform group-hover:scale-105 pointer-events-none text-center">
        <span className={config.cards.locked.number}>{dayNumber}</span>
        <div className={config.cards.locked.iconWrapper}>
          {config.icons.locked && <config.icons.locked className={config.cards.locked.iconClass} />}
          <span className={config.cards.locked.text}>{timeText}</span>
        </div>
      </div>

      {isEditor && (
        <div className="absolute bottom-2 left-0 right-0 text-center relative z-10 pointer-events-none">
          <span className={config.cards.locked.badge}>Abre em<br />{timeText}</span>
        </div>
      )}
    </motion.div>
  )
}

// Envelope Card (Current Day - To Open)
export const UniversalEnvelopeCard = ({ dayNumber, onClick, isEditor = false, config, openedCount = 0 }: { dayNumber: number | string, onClick?: () => void, isEditor?: boolean, config: any, openedCount?: number }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(config.cards.envelope.container, "group")}
    >
      {/* Envelope Pattern Background */}
      <div className={config.cards.envelope.pattern}></div>

      {/* Glow Aura */}
      {config.cards.envelope.glowClass && (
        <div className={cn("absolute inset-0 z-0 pointer-events-none rounded-xl", config.cards.envelope.glowClass)}></div>
      )}

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-4 text-center font-display">
        {/* Top: Day Number */}
        <span className={cn("text-2xl font-black", config.cards.envelope.numberClass || "text-foreground")}>
          Dia {dayNumber}
        </span>

        {/* Center: Icon / Seal (only if defined) */}
        <div className="flex-1 flex items-center justify-center">
          {config.icons?.envelopeSeal && (
            <div className={config.cards.envelope.seal}>
              <config.icons.envelopeSeal className="w-6 h-6 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Bottom: Button */}
        {isEditor ? (
          <button className={config.cards.envelope.button}>
            <Pencil className="w-3 h-3 inline mr-1" /> EDITAR
          </button>
        ) : (
          <button className={config.cards.envelope.button}>
            {config.cards.envelope.buttonText || "ABRIR"}
          </button>
        )}
      </div>

      {isEditor && (
        <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-sm text-primary z-20 hover:text-primary-foreground">
          <Pencil className="w-3 h-3" />
        </button>
      )}

      {!isEditor && openedCount > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full z-20">
          <Eye className="w-2 h-2 text-white" />
          <span className="text-[8px] font-black text-white">{openedCount}</span>
        </div>
      )}
    </motion.div>
  )
}

// Unlocked Day (Past/Opened)
export const UniversalUnlockedCard = ({ dayNumber, imageUrl, onClick, isEditor = false, config, contentType = 'photo', openedCount = 0 }: { dayNumber: number | string, imageUrl: string, onClick?: () => void, isEditor?: boolean, config: any, contentType?: string, openedCount?: number }) => {
  const [imgError, setImgError] = useState(false);
  const isVideo = contentType === 'video' || imageUrl?.includes('tiktok.com') || imageUrl?.includes('youtube.com') || imageUrl?.includes('instagram.com');
  const hasImage = imageUrl && !imgError && !isVideo;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(config.cards.unlocked.container, "group")}
    >
      {hasImage ? (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105",
            !isEditor && config.cards.unlocked.imageOverlay
          )}
          style={{ backgroundImage: `url('${imageUrl}')` }}
        >
          {/* Hidden img to detect errors */}
          <img
            src={imageUrl}
            className="hidden"
            onError={() => setImgError(true)}
            alt=""
          />
        </div>
      ) : isVideo ? (
        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shadow-lg mb-2">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5" />
        </div>
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-white/80 transition-opacity duration-500",
            !isEditor && config.cards.unlocked.placeholderWrapper
          )}
          style={config.cards.unlocked.placeholderPattern || {}}
        >
          <div className="absolute top-0 right-0 w-8 h-8 bg-current/10 rounded-bl-3xl" />
        </div>
      )}

      <div className={config.cards.unlocked.iconWrapper}>
        {isEditor ? <Pencil className="w-3 h-3" /> : (openedCount > 0 ? <Eye className="w-3 h-3" /> : <Heart className="w-3 h-3 fill-current" />)}
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <span className={cn(
          "text-[10px] font-bold px-2 rounded-full mb-1",
          (hasImage || isVideo) ? "text-white bg-black/30 backdrop-blur-sm" : config.cards.unlocked.badge
        )}>
          Dia {dayNumber}
        </span>
      </div>
      {!isEditor && openedCount > 0 && (
        <div className="absolute top-2 right-8 flex items-center gap-1 bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full z-20">
          <Eye className="w-2 h-2 text-white" />
          <span className="text-[8px] font-black text-white">{openedCount}</span>
        </div>
      )}
    </motion.div>
  )
}

// --- Quote ---
export const UniversalQuote = ({ text, author, config, isEditor, onEdit, calendarMessage }: { text?: React.ReactNode, author?: React.ReactNode, config: any, isEditor?: boolean, onEdit?: () => void, calendarMessage?: string }) => {
  return (
    <div
      className={cn(config.ui?.quote.container, "group relative cursor-pointer transition-all active:scale-[0.99] pointer-events-auto")}
      onClick={isEditor ? onEdit : undefined}
    >
      {isEditor && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="absolute -top-2 -right-2 bg-white/90 shadow-lg p-2 rounded-full text-rose-500 hover:text-rose-600 transition-all hover:scale-110 active:scale-95 border border-rose-100 z-50"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
      <Quote className={config.ui?.quote.icon} />
      <div>
        <h3 className={cn(config.ui?.quote.title, config.ui?.layout.secondaryFont)}>{author}</h3>
        <div className={cn(config.ui?.quote.text, config.ui?.layout.messageFont)}>
          {typeof text === 'string' ? `"${text}"` : text}
        </div>
      </div>
    </div>
  )
}

// --- Editor Header ---
export const EditorHeader = ({ onPreview }: { onPreview: () => void }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md pt-5 pb-3 px-4 shadow-sm border-b border-rose-100 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <button className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Modo Editor</span>
          <span className="text-sm font-bold text-rose-600 font-display">AMOR E ROMANCE</span>
        </div>
        <button onClick={onPreview} className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-love-red hover:bg-rose-100 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// --- Editor Footer ---
export const EditorFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-rose-100 z-50 flex items-center justify-between gap-3">
      <button className="flex-1 h-12 rounded-xl bg-rose-50 text-love-red font-bold text-sm flex items-center justify-center gap-2 border border-rose-100 hover:bg-rose-100 transition-colors">
        <Save className="w-4 h-4" />
        Salvar Rascunho
      </button>
      <button className="flex-1 h-12 rounded-xl bg-love-red text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-love-red/20 hover:bg-rose-700 transition-colors">
        <Rocket className="w-4 h-4" />
        Publicar
      </button>
    </div>
  )
}

// --- User Footer (Visitor CTA) ---
export const UniversalFooter = ({
  isEditor = false,
  onNavigate,
  config,
  buttonText
}: {
  isEditor?: boolean;
  onNavigate?: () => void;
  config: any;
  buttonText?: string;
}) => {
  return (
    <div
      className={cn(
        config.footer.container,
        "max-w-md mx-auto",
        isEditor ? "pb-24" : "pb-12"
      )}
    >
      <div className="flex flex-col items-center gap-6 w-full justify-center">
        <div className="flex items-center gap-3 w-full justify-center">
          <button
            onClick={onNavigate}
            className={cn(config.footer.button, "w-full sm:w-auto px-12 min-w-[200px] flex items-center justify-center gap-3")}
          >
            {config.icons.footer && <config.icons.footer className="w-4 h-4 fill-current" />}
            {buttonText ? buttonText : (isEditor ? "Salvar Alterações" : "Criar meu calendário")}
          </button>
        </div>

        {config.content?.footerMessage && !isEditor && (
          <p className={config.ui?.footer.messageClass}>
            {config.content.footerMessage}
          </p>
        )}
      </div>
    </div>
  );
};

// --- Legacy support for existing components if needed ---
export const FlagBanner = () => null;
// --- Wedding Theme Components ---

// Wedding Background
export const WeddingBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#FDFBF7] pointer-events-none text-[#D4AF37]/20">
      {/* Lace Pattern from User's HTML */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10zm0-30c-5 0-10-5-10-10S45 0 50 0s10 5 10 10-5 10-10 10zm0 60c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10zm30-30c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10zm-60 0c-5 0-10-5-10-10s5-10 10-10 10 5 10 10-5 10-10 10z' fill='%23D4AF37' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
      {/* Soft Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,#D4AF37_0%,transparent_70%)] opacity-[0.05] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,#F7E7CE_0%,transparent_70%)] opacity-[0.08] blur-3xl pointer-events-none" />
    </div>
  );
};

// Wedding Top Decorations (Flowers)
export const WeddingTopDecorations = () => {
  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {/* Center Flowers (From Explore Theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pt-2 gap-1 animate-in fade-in zoom-in duration-1000 z-50">
        <div className="text-4xl text-[#D4AF37]/40 select-none font-serif leading-none">✿</div>
        <div className="text-3xl text-[#D4AF37]/30 -mt-3 select-none font-serif leading-none">✿</div>
      </div>
    </div>
  )
}

// Wedding Shower (Falling Flowers)
export const WeddingShower = () => {
  const petals = [
    { height: "h-8", color: "text-[#D4AF37]/10", delay: 0, left: "10%" },
    { height: "h-12", color: "text-[#D4AF37]/20", delay: -0.5, left: "25%" },
    { height: "h-10", color: "text-[#B5942F]/15", delay: -1.2, left: "40%" },
    { height: "h-14", color: "text-[#D4AF37]/10", delay: -0.8, left: "60%" },
    { height: "h-9", color: "text-[#B5942F]/20", delay: -1.5, left: "75%" },
    { height: "h-11", color: "text-[#D4AF37]/15", delay: -0.3, left: "90%" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((item, i) => (
        <motion.div
          key={i}
          className={cn("absolute top-[-50px]", item.color)}
          style={{ left: item.left }}
          initial={{ y: -100, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "110vh",
            x: [0, 50, -50, 0],
            rotate: 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          <Flower2 className="w-6 h-6 fill-current opacity-40" />
        </motion.div>
      ))}
    </div>
  );
};

// Wedding Header
export const WeddingHeader = ({ title = "O Grande Sim!", subtitle = "A contagem regressiva para o altar", isEditor = false, showWatermark = false }: { title?: string, subtitle?: string, isEditor?: boolean, showWatermark?: boolean }) => {
  return (
    <div className="pt-4 pb-2 text-center relative z-10 font-display group px-4">
      {isEditor && (
        <div className="absolute top-0 left-0 w-full flex justify-center -mt-2">
          <span className="text-[10px] font-bold text-wedding-gold-dark tracking-[0.2em] uppercase bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border border-wedding-gold/20">
            Private Event
          </span>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mb-2">
        {showWatermark && <BrandWatermark variant="compact" className="scale-75 origin-right" />}
        <h1 className="text-4xl font-display italic text-wedding-gold-dark drop-shadow-sm relative inline-block mb-1 font-medium">
          {title}
          {isEditor && (
            <button className="absolute -top-1 -right-8 bg-[#FDFBF7] shadow-sm p-1.5 rounded-full text-wedding-gold hover:text-wedding-gold-dark transition-colors border border-wedding-gold/20">
              <Pencil className="w-3 h-3" />
            </button>
          )}
        </h1>
        {showWatermark && <BrandWatermark variant="compact" className="scale-75 origin-left" />}
      </div>

      <div className="relative inline-block w-full max-w-xs mx-auto">
        <p className="text-slate-500 text-xs mt-1 font-medium tracking-wide uppercase">
          {subtitle}
        </p>
        {isEditor && (
          <button className="absolute top-1 -right-6 bg-[#FDFBF7] shadow-sm p-1 rounded-full text-wedding-gold hover:text-wedding-gold-dark transition-colors border border-wedding-gold/20">
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

// Wedding Progress Bar
export const WeddingProgress = ({ progress = 90 }: { progress?: number }) => {
  return (
    <div className="px-8 mt-6 relative z-10 w-full max-w-sm mx-auto">
      <div className="flex justify-between items-end mb-2">
        <span className="text-wedding-gold-dark text-[10px] font-bold uppercase tracking-widest">{progress}% do caminho</span>
        <span className="text-slate-400 text-[10px] font-medium italic">Faltam 10 dias</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-wedding-gold via-wedding-gold-soft to-wedding-gold relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
        </motion.div>
      </div>
    </div>
  )
}

// Wedding Day Card
// Wedding Day Card
export const WeddingDayCard = ({ dayNumber, status, imageUrl, onClick, isEditor = false }: { dayNumber: number | string, status: 'locked' | 'unlocked' | 'empty', imageUrl?: string, onClick?: () => void, isEditor?: boolean }) => {
  const isLocked = status === 'locked';
  const isEmpty = status === 'empty';

  if (isEmpty) {
    return (
      <div className="aspect-square bg-white/50 border border-[#D4AF37]/20 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-2 relative group cursor-pointer hover:bg-white/80 transition-all font-display">
        <span className="text-[#E5CFAA] font-bold text-xl mb-1">{dayNumber}</span>
        <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <Plus className="w-3 h-3" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={!isLocked ? { y: -2 } : { scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "aspect-square relative rounded-[2rem] overflow-hidden shadow-md transition-all font-display group",
        isLocked ? "border-[3px] border-[#F9F6F0]" : "bg-white cursor-pointer border border-[#D4AF37]/10"
      )}
      style={isLocked ? {
        background: `
            linear-gradient(135deg, #FDFBF7 0%, #F5F0E6 100%),
            url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0h20v1H0z' fill='%23D4AF37' fill-opacity='0.05'/%3E%3C/svg%3E")
          `,
        boxShadow: "inset 0 0 20px rgba(212,175,55,0.1)"
      } : {}}
    >
      {/* Content */}
      {!isLocked && status === 'unlocked' ? (
        <>
          {imageUrl ? (
            <div className={cn(
              "absolute inset-0 bg-cover bg-center grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 blur-[30px] hover:blur-0",
              isEditor && "blur-0"
            )} style={{ backgroundImage: `url('${imageUrl}')` }} />
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-[#fffafa] transition-opacity duration-500",
                !isEditor && "blur-[15px]"
              )}
              style={{
                backgroundImage: `
                  linear-gradient(90deg, transparent 19px, #abced4 19px, #abced4 20px, transparent 20px),
                  linear-gradient(#eee 0.1em, transparent 0.1em)
                `,
                backgroundSize: '100% 0.8em'
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A0E]/40 to-transparent opacity-60" />
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="text-white font-romantic text-2xl drop-shadow-md">Dia {dayNumber}</span>
          </div>
          {isEditor ?
            <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm"><Pencil className="w-3 h-3" /></div>
            :
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37] animate-pulse"></div>
          }
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center relative">
          {/* Inner Border Line for 'Premium Card' effect */}
          <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-[1.5rem] pointer-events-none"></div>

          <span className="text-[#D4AF37] font-romantic text-4xl mb-1 opacity-80 drop-shadow-sm">{dayNumber}</span>

          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-1">
            <Lock className="w-3 h-3 text-[#D4AF37]" />
          </div>

          {isEditor && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shadow-sm"><Pencil className="w-3 h-3" /></div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Wedding Highlight Card (Day 5 / Special)
export const WeddingSpecialCard = ({ dayNumber, onClick, isEditor = false }: { dayNumber: number | string, onClick?: () => void, isEditor?: boolean }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="col-span-2 aspect-[2/1] bg-white rounded-[2rem] border border-[#D4AF37] p-1 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(212,175,55,0.15)] group cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFBF0_0%,#fff_100%)]"></div>

      {/* Decorative Lines */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#D4AF37]/30 rounded-tl-xl pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#D4AF37]/30 rounded-br-xl pointer-events-none"></div>

      <div className="relative h-full flex flex-col items-center justify-center text-center font-display z-10 px-6">
        <span className="text-[42px] font-romantic text-[#D4AF37] leading-none mb-1">Dia {dayNumber}</span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-medium mb-5">Um presente para você</span>

        {isEditor ?
          <button className="bg-[#D4AF37] text-white text-[10px] font-bold px-6 py-3 rounded-full shadow-lg hover:bg-[#B5942F] transition-all tracking-widest uppercase flex items-center gap-2">
            <Pencil className="w-3 h-3" /> Definir Revelação
          </button>
          :
          <button className="bg-[#D4AF37] text-white text-[10px] font-bold px-8 py-3 rounded-full shadow-lg shadow-[#D4AF37]/30 hover:bg-[#B5942F] hover:shadow-xl hover:-translate-y-0.5 transition-all tracking-widest uppercase">
            Ver Surpresa
          </button>
        }
      </div>
    </motion.div>
  );
};

// Wedding Diary Section
export const WeddingDiarySection = ({ isEditor = false }: { isEditor?: boolean }) => {
  return (
    <div className="mt-8 mx-4 bg-white rounded-[2.5rem] p-8 text-center shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)] border border-[#F9F6F0] relative overflow-hidden">
      <div className="flex justify-center mb-3">
        <div className="w-10 h-10 bg-[#F9F6F0] rounded-xl flex items-center justify-center text-[#D4AF37]">
          <Quote className="w-5 h-5 fill-current" />
        </div>
      </div>

      <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-widest mb-3">Diário da Noiva</h3>

      <p className="font-romantic text-2xl text-[#8A8A8A] leading-relaxed max-w-xs mx-auto">
        "O segredo para uma entrada perfeita é o tempo. Respire fundo, aproveite cada segundo."
      </p>

      {isEditor && (
        <button className="absolute top-4 right-4 text-[#D4AF37] hover:text-[#B5942F] bg-[#F9F6F0] p-2 rounded-full">
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

// Wedding Footer
export const WeddingFooter = ({ isEditor = false }: { isEditor?: boolean }) => {
  if (isEditor) return <EditorFooter />;

  return (
    <div className="fixed bottom-0 left-0 w-full p-6 pb-10 bg-white/90 backdrop-blur-xl border-t border-[#F9F6F0] z-50 font-display">
      <div className="max-w-md mx-auto">
        <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#996515] hover:to-[#754C0E] text-white h-14 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-[#D4AF37]/25 transition-all active:scale-95">
          Criar meu calendário
        </button>
      </div>
    </div>
  )


}

interface LoveLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  unlockDate: Date;
  onNotify?: () => void;
  theme?: string;
}

export const LoveLockedModal = ({ isOpen, onClose, dayNumber, unlockDate, onNotify, theme = 'namoro' }: LoveLockedModalProps) => {
  if (!isOpen) return null;

  const now = new Date();
  const diff = unlockDate.getTime() - now.getTime();
  const daysLeft = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  const themeConfig: Record<string, {
    title: string;
    message: string;
    buttonColor: string;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    descColor: string;
    icon: any;
  }> = {
    namoro: {
      title: "Ainda não é hora...",
      message: "O amor é paciente! Esta surpresa especial só estará disponível em breve.",
      buttonColor: "bg-love-red hover:bg-rose-700",
      iconColor: "text-rose-500",
      bgColor: "bg-white dark:bg-zinc-900",
      borderColor: "border-rose-100 dark:border-rose-900",
      textColor: "text-rose-900 dark:text-rose-100",
      descColor: "text-rose-600/80 dark:text-rose-300/80",
      icon: Lock
    },
    casamento: {
      title: "Falta pouco para o Sim!",
      message: "Estamos preparando esta memória com todo carinho. Aguarde a data!",
      buttonColor: "bg-wedding-gold hover:bg-wedding-gold-dark",
      iconColor: "text-wedding-gold",
      bgColor: "bg-[#FDFBF7] dark:bg-zinc-900",
      borderColor: "border-wedding-gold/20 dark:border-wedding-gold/10",
      textColor: "text-wedding-gold-dark dark:text-wedding-gold",
      descColor: "text-slate-500 dark:text-slate-400",
      icon: Lock
    },
    natal: {
      title: "O Papai Noel ainda não chegou!",
      message: "Os elfos ainda estão embrulhando essa surpresa natalina.",
      buttonColor: "bg-red-600 hover:bg-red-700",
      iconColor: "text-red-500",
      bgColor: "bg-[#FFF8E8] dark:bg-zinc-900",
      borderColor: "border-red-100 dark:border-red-900",
      textColor: "text-red-900 dark:text-red-100",
      descColor: "text-red-800/60 dark:text-red-300/60",
      icon: Lock
    },
    carnaval: {
      title: "Segura a empolgação!",
      message: "O bloco ainda não saiu! Essa surpresa é para o momento certo.",
      buttonColor: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
      iconColor: "text-purple-500",
      bgColor: "bg-[#FDF4FF] dark:bg-zinc-900",
      borderColor: "border-purple-200 dark:border-purple-900",
      textColor: "text-purple-900 dark:text-purple-100",
      descColor: "text-purple-600/80 dark:text-purple-300/80",
      icon: PartyPopper
    },
    aniversario: {
      title: "Nem vem! 🎂",
      message: "Essa surpresa está guardada para o momento certo! Segura a ansiedade para a festa.",
      buttonColor: "bg-sky-500 hover:bg-sky-600",
      iconColor: "text-sky-500",
      bgColor: "bg-[#F0F9FF] dark:bg-zinc-900",
      borderColor: "border-sky-200 dark:border-sky-900",
      textColor: "text-sky-900 dark:text-sky-100",
      descColor: "text-sky-700/80 dark:text-sky-300/80",
      icon: PartyPopper
    },
    saojoao: {
      title: "Eita, cabra apressado! 🔥",
      message: "A fogueira ainda não acendeu! Calma que o forró já vai começar.",
      buttonColor: "bg-[#E65100] hover:bg-[#BF360C]",
      iconColor: "text-[#E65100]",
      bgColor: "bg-[#FFF8E1] dark:bg-zinc-900",
      borderColor: "border-[#FFB74D] dark:border-[#E65100]/50",
      textColor: "text-[#5D4037] dark:text-[#FFB74D]",
      descColor: "text-[#8D6E63] dark:text-[#D7CCC8]",
      icon: Flame
    },
    pascoa: {
      title: "O coelhinho ainda não chegou! 🐰",
      message: "Calma, essa surpresa ainda está escondida no jardim. Aguarde o momento certo!",
      buttonColor: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
      iconColor: "text-purple-500",
      bgColor: "bg-[#FDF4FF] dark:bg-zinc-900",
      borderColor: "border-purple-200 dark:border-purple-900",
      textColor: "text-purple-900 dark:text-purple-100",
      descColor: "text-purple-600/80 dark:text-purple-300/80",
      icon: Gift
    },
    default: {
      title: "Calma, Coração!",
      message: "Essa surpresa ainda está sendo preparada. Segura a ansiedade!",
      buttonColor: "bg-primary hover:bg-primary/90",
      iconColor: "text-primary",
      bgColor: "bg-white dark:bg-zinc-900",
      borderColor: "border-border/50 dark:border-zinc-800",
      textColor: "text-foreground",
      descColor: "text-muted-foreground",
      icon: Lock
    }
  };

  const config = themeConfig[theme] || themeConfig['default'];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative overflow-hidden font-display text-center border-4",
          config.bgColor,
          config.borderColor
        )}
      >
        {/* Header Icon */}
        <div className={cn("mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 relative", config.iconColor, "bg-current/10")}>
          <Icon className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 rounded-full p-1 shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <h3 className={cn("text-2xl font-black mb-2", config.textColor)}>{config.title}</h3>

        <p className={cn("text-sm mb-6 leading-relaxed", config.descColor)}>
          {config.message} No <span className="font-bold">Dia {dayNumber}</span> você poderá ver.
        </p>

        {/* Countdown Box */}
        <div className={cn("rounded-xl p-4 mb-6 border", config.bgColor, config.borderColor)}>
          <div className={cn("flex items-center justify-center gap-2 font-black text-xl", config.textColor)}>
            <Clock className="w-5 h-5" />
            <span>{daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}</span>
          </div>
          <p className={cn("text-[10px] uppercase tracking-widest mt-1 font-black opacity-60", config.textColor)}>Restantes</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onNotify}
            className={cn(
              "w-full text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs",
              config.buttonColor
            )}
          >
            <Bell className="w-4 h-4" />
            Me avise quando abrir
          </button>

          {canInstallPWA() && !isPWAInstalled() && (
            <button
              onClick={promptInstall}
              className={cn(
                "w-full text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs",
                "bg-zinc-800 hover:bg-black border-2 border-white/10"
              )}
            >
              <Download className="w-5 h-5" />
              Instalar Aplicativo
            </button>
          )}

          <button
            onClick={onClose}
            className={cn("text-[10px] font-black uppercase tracking-widest py-2 opacity-60 hover:opacity-100", config.textColor)}
          >
            Vou esperar ansiosamente
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Carnaval Ticket Modal (Premium Festive) ---
interface CarnavalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any;
  theme?: string;
  content: {
    type: 'text' | 'image' | 'video';
    title?: string;
    message?: string;
    mediaUrl?: string;
  };
}

export const CarnavalTicketModal = ({ isOpen, onClose, content, config, theme = 'carnaval' }: CarnavalTicketModalProps) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  const isSaoJoao = theme === 'saojoao';
  const gradientClass = isSaoJoao
    ? 'bg-gradient-to-br from-[#FF4500] via-[#FF8C00] to-[#FFD700]'
    : 'bg-gradient-to-br from-[#6A0DAD] via-[#FF007F] to-[#FFD700]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Floating Confetti Decorations */}
      <div className="absolute top-8 left-8 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎭</div>
      <div className="absolute top-12 right-12 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎊</div>
      <div className="absolute bottom-20 left-10 text-2xl animate-pulse">✨</div>
      <div className="absolute bottom-16 right-8 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🎉</div>
      <div className="absolute top-1/3 left-6 text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>{isSaoJoao ? '🌽' : '🎭'}</div>
      <div className="absolute top-1/4 right-6 text-xl animate-bounce" style={{ animationDelay: '0.8s' }}>{isSaoJoao ? '🔥' : '💃'}</div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[380px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Ticket Perforated Edge (Top) */}
        <div className="absolute top-0 left-0 right-0 h-4 flex justify-between px-2 pointer-events-none z-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-black/60 -mt-1.5" />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-4 z-30 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <span className="text-lg font-bold">✕</span>
        </button>

        {/* Header with Gradient */}
        <div className={`${gradientClass} pt-8 pb-6 px-6 text-center relative overflow-hidden shrink-0`}>
          {/* Sparkle effects */}
          <Sparkles className="absolute top-4 left-6 w-5 h-5 text-white/40 animate-pulse" />
          <Sparkles className="absolute top-8 right-8 w-4 h-4 text-white/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-4 left-12 w-3 h-3 text-white/30 animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg"
          >
            <Ticket className="w-8 h-8 text-white drop-shadow-md" />
          </motion.div>

          <h2 className="text-3xl font-black text-white drop-shadow-lg tracking-tight">
            {content.title || `Surpresa!`}
          </h2>
          <p className="text-white/80 text-sm font-bold mt-1 uppercase tracking-widest">
            {isSaoJoao ? 'Arraiá do Fresta 🌽' : 'Carnaval do Fresta 🎭'}
          </p>
        </div>

        {/* Content Body - SCROLLABLE */}
        <div className="flex-1 p-6 bg-gradient-to-b from-white to-gray-50 overflow-y-auto overscroll-contain">
          {/* Media (Polaroid style) */}
          {content.mediaUrl && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-xl -rotate-1 mb-6 relative">
              {content.type === 'video' ? (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  {content.mediaUrl.includes('youtube.com') || content.mediaUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${content.mediaUrl.includes('youtu.be') ? content.mediaUrl.split('/').pop() : new URLSearchParams(new URL(content.mediaUrl).search).get('v')}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <a href={content.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-white">
                      <Play className="w-12 h-12" />
                      <span className="text-xs font-bold uppercase tracking-widest">Abrir Vídeo ↗</span>
                    </a>
                  )}
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  alt="Surpresa"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          )}

          {/* Text Content */}
          <div className="text-center space-y-4">
            {content.message && (
              <p className="text-lg text-gray-800 font-medium leading-relaxed">
                {content.message}
              </p>
            )}

            {!content.message && !content.mediaUrl && (
              <div className="py-8 text-center">
                <div className="text-5xl mb-4">{isSaoJoao ? '🌽🔥🎶' : '🎭🎉💃'}</div>
                <p className="text-gray-500 italic">Uma surpresa especial te espera!</p>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Perforated Edge (Bottom) */}
        <div className="absolute bottom-[72px] left-0 right-0 h-4 flex justify-between px-2 pointer-events-none z-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-gray-100 mt-0.5" />
          ))}
        </div>

        {/* Footer with Actions */}
        <div className={`p-4 ${gradientClass} flex items-center`}>
          <button
            onClick={async () => {
              const result = await shareContent({
                title: content.title || (isSaoJoao ? "Arraiá surpresa! 🌽" : "Surpresa de Carnaval! 🎭"),
                text: content.message || "Veja o que preparei para você no Fresta!",
                url: window.location.href,
                imageUrl: content.mediaUrl || undefined
              });

              if (result === "copied") {
                toast({
                  title: "Link copiado! ✨",
                  description: "O link já está na sua área de transferência.",
                });
              }
            }}
            className="flex-1 h-12 rounded-2xl bg-white text-gray-900 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            {isSaoJoao ? 'Compartilhar Forró!' : 'Compartilhar Folia!'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Love Letter Modal ---
interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any;
  content: {
    type: 'text' | 'image' | 'video';
    title?: string;
    message?: string;
    mediaUrl?: string;
  };
}

export const LoveLetterModal = ({ isOpen, onClose, content, config }: LoveLetterModalProps) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  const messageFont = config?.layout?.messageFont || "font-festive";
  const titleFont = config?.layout?.titleFont || "font-serif italic";
  const closingFont = config?.layout?.messageFont || "font-festive";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Floating Elements (Decorations) */}
      <div className="absolute top-10 left-10 w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.2)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-20 right-5 w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.2)_0%,transparent_70%)] pointer-events-none" />
      <span className="material-symbols-outlined absolute top-1/4 left-10 text-2xl text-love-rose opacity-60 animate-bounce-gentle">♥</span>
      <span className="material-symbols-outlined absolute top-1/3 right-12 text-xl text-love-red opacity-60 animate-pulse">♥</span>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col font-display"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-rose-900/40 transition-colors"
        >
          <span className="text-lg font-bold">✕</span>
        </button>

        {/* Header with Envelope Pattern */}
        <div className="h-10 bg-[#fdf2f8] w-full relative shrink-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, transparent 50%, #fbcfe8 50%), linear-gradient(225deg, transparent 50%, #fbcfe8 50%)`,
              backgroundSize: '50% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left top, right top'
            }}
          />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[radial-gradient(circle,#f43f5e_0%,#be123c_100%)] flex items-center justify-center shadow-sm z-10">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
        </div>

        {/* Paper Body - SCROLLABLE */}
        <div
          className="flex-1 px-6 pt-10 pb-6 flex flex-col items-center bg-[#fffafa] overflow-y-auto overscroll-contain"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
              linear-gradient(#eee 0.1em, transparent 0.1em)
            `,
            backgroundSize: '100% 1.2em',
            backgroundAttachment: 'local' // Important for scroll
          }}
        >
          {/* Media (Polaroid style) */}
          {content.mediaUrl && (
            <div className="w-full aspect-square rounded-2xl overflow-hidden border-8 border-white shadow-lg rotate-1 mb-6 relative shrink-0">
              {content.type === 'video' ? (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                  {content.mediaUrl.includes('youtube.com') || content.mediaUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${content.mediaUrl.includes('youtu.be') ? content.mediaUrl.split('/').pop() : new URLSearchParams(new URL(content.mediaUrl).search).get('v')}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : content.mediaUrl.includes('tiktok.com') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#010101] to-[#25F4EE]/20 text-white">
                      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg mb-4 border border-white/20">
                        <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                      </div>
                      <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 text-center">Assista no TikTok</p>
                      <a
                        href={content.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold transition-all border border-white/20 text-white"
                      >
                        ABRIR VÍDEO ↗
                      </a>
                    </div>
                  ) : content.mediaUrl.includes('instagram.com') ? (
                    <div className="w-full h-full relative bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex flex-col items-center justify-center">
                      <Play className="w-12 h-12 text-white fill-current mb-4" />
                      <a
                        href={content.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
                      >
                        VER REEL ↗
                      </a>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <Play className="w-12 h-12" />
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  alt="Memory"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3786&auto=format&fit=crop";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Text Content */}
          <div className="text-center space-y-3 relative z-10 w-full">
            <h2 className={cn("text-4xl text-rose-900 leading-tight block", titleFont)}>
              {content.title || "Uma Surpresa para Você"}
            </h2>

            <div className="px-2">
              <p className={cn("text-xl text-rose-800 leading-relaxed block break-words", messageFont)}>
                {content.message || "Às vezes as palavras não são suficientes para expressar o que eu sinto..."}
              </p>
            </div>

            {content.mediaUrl && content.type === 'image' && !content.message && (
              <p className={cn("text-lg text-rose-700/60 leading-relaxed italic", messageFont)}>
                Uma imagem vale mais que mil palavras. ❤️
              </p>
            )}

            <div className="pt-8">
              <span className={cn("text-3xl text-rose-700 block", closingFont)}>Com todo meu coração,</span>
              <div className="flex justify-center mt-1">
                <Heart className="w-5 h-5 text-love-red fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-rose-100 dark:border-rose-800 flex items-center gap-3 shrink-0">
          <button
            onClick={async () => {
              const result = await shareContent({
                title: content.title || "Um presente para você! ❤️",
                text: content.message || "Veja o que preparei para hoje no Fresta.",
                url: window.location.href,
                imageUrl: content.mediaUrl || undefined
              });

              if (result === "copied") {
                toast({
                  title: "Link copiado! ✨",
                  description: "O link já está na sua área de transferência.",
                });
              }
            }}
            className="flex-1 h-12 rounded-2xl bg-love-red text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-love-red/20 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar Este Momento
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Birthday Card Modal (Premium) ---
interface BirthdayCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any;
  content: {
    type: 'text' | 'image' | 'video';
    title?: string;
    message?: string;
    mediaUrl?: string;
  };
}

export const BirthdayCardModal = ({ isOpen, onClose, content, config }: BirthdayCardModalProps) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Floating Elements (Decorations) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎈</div>
        <div className="absolute bottom-40 right-10 text-3xl animate-pulse">✨</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</div>
        <div className="absolute top-1/2 left-4 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>🎂</div>
        <div className="absolute bottom-10 left-20 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[380px] max-h-[85vh] bg-[#F0F9FF] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-display border-[6px] border-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-sky-900/60 transition-colors shadow-sm"
        >
          <span className="text-lg font-bold">✕</span>
        </button>

        {/* Header */}
        <div className="pt-10 pb-4 text-center relative z-10 bg-gradient-to-b from-sky-100/50 to-transparent">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-lg flex items-center justify-center mx-auto mb-4 text-sky-500 rotate-3 border-4 border-sky-50">
            <PartyPopper className="w-10 h-10 drop-shadow-sm" />
          </div>
          <h2 className="text-3xl font-black text-sky-900 tracking-tight uppercase drop-shadow-sm px-4">
            {content.title || "Parabéns!"}
          </h2>
          <p className="text-sky-600/80 text-xs font-black uppercase tracking-widest mt-1">Sua surpresa chegou</p>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto overscroll-contain text-center">
          {/* Media */}
          {content.mediaUrl && (
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-sky-100 mb-6 relative group rotate-1">
              {content.type === 'video' || content.mediaUrl.includes('youtube') || content.mediaUrl.includes('tiktok') || content.mediaUrl.includes('instagram') ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  {/* Simplified Video Placeholder/Embed Logic */}
                  <a href={content.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-white group-hover:scale-105 transition-transform">
                    <Play className="w-12 h-12 fill-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Abrir Vídeo</span>
                  </a>
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=3870"}
                />
              )}
            </div>
          )}

          {content.message && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 relative group hover:scale-[1.02] transition-transform duration-300">
              <Quote className="w-6 h-6 text-sky-200 absolute -top-3 -left-2 fill-current" />
              <p className="text-sky-900 text-lg font-medium leading-relaxed font-festive">
                "{content.message}"
              </p>
              <div className="flex justify-center gap-3 mt-4 text-2xl opacity-100 grayscale-[0.2] group-hover:grayscale-0 transition-all">
                <span>🎂</span><span>🥳</span><span>🎁</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-sky-100 flex flex-col gap-3 relative z-20">
          <button
            onClick={async () => {
              const result = await shareContent({
                title: content.title || "Parabéns! 🎂",
                text: content.message || "Veja essa surpresa de aniversário!",
                url: window.location.href,
                imageUrl: content.mediaUrl
              });
              if (result === 'copied') {
                toast({ title: "Link copiado! 🎈", description: "Pronto para enviar." });
              }
            }}
            className="w-full h-14 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 active:scale-95 transition-all uppercase tracking-wide"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar Surpresa
          </button>
          <button onClick={onClose} className="text-sky-400 text-[10px] font-black uppercase tracking-widest py-2 hover:text-sky-600 transition-colors">
            Continuar vendo o calendário
          </button>
        </div>
      </motion.div>
    </div>
  )
};

// --- São João Barraca Modal (Premium - Festa Junina) ---
interface SaoJoaoBarracaModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any;
  content: {
    type: 'text' | 'image' | 'video';
    title?: string;
    message?: string;
    mediaUrl?: string;
  };
}

export const SaoJoaoBarracaModal = ({ isOpen, onClose, content, config }: SaoJoaoBarracaModalProps) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5D4037]/70 backdrop-blur-md animate-in fade-in duration-300">
      {/* Bandeirinhas e Decorações Juninas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-0">
          {['#E65100', '#FFEB3B', '#2196F3', '#E65100', '#FFEB3B', '#2196F3', '#E65100', '#FFEB3B'].map((color, i) => (
            <div
              key={i}
              className="w-8 h-12"
              style={{
                clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                backgroundColor: color,
                transform: `translateY(-${Math.random() * 5}px)`
              }}
            />
          ))}
        </div>
        <div className="absolute top-24 left-6 text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🌽</div>
        <div className="absolute bottom-32 right-8 text-4xl animate-pulse">🔥</div>
        <div className="absolute top-36 right-12 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🪗</div>
        <div className="absolute top-1/2 left-4 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>🎪</div>
        <div className="absolute bottom-16 left-16 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🥜</div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[380px] max-h-[85vh] bg-[#FFF8E1] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-display border-[6px] border-[#FFB74D]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#5D4037] transition-colors shadow-md"
        >
          <span className="text-lg font-bold">✕</span>
        </button>

        {/* Header */}
        <div className="pt-10 pb-4 text-center relative z-10 bg-gradient-to-b from-[#FFE0B2]/50 to-transparent">
          <div className="w-20 h-20 rounded-3xl bg-[#E65100] shadow-lg flex items-center justify-center mx-auto mb-4 text-white -rotate-3 border-4 border-[#FF8F00]">
            <Flame className="w-10 h-10 drop-shadow-sm" />
          </div>
          <h2 className="text-2xl font-black text-[#5D4037] tracking-tight drop-shadow-sm px-4">
            {content.title || "Arraiá! 🔥"}
          </h2>
          <p className="text-[#8D6E63] text-xs font-black uppercase tracking-widest mt-1">Surpresa da Fogueira</p>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto overscroll-contain text-center">
          {/* Media */}
          {content.mediaUrl && (
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-[#FFB74D] bg-[#FFECB3] mb-6 relative group -rotate-1">
              {content.type === 'video' || content.mediaUrl.includes('youtube') || content.mediaUrl.includes('tiktok') || content.mediaUrl.includes('instagram') ? (
                <div className="w-full h-full flex items-center justify-center bg-[#5D4037]">
                  <a href={content.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-white group-hover:scale-105 transition-transform">
                    <Play className="w-12 h-12 fill-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Abrir Vídeo</span>
                  </a>
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1529686342540-1b43aec0df75?q=80&w=3870"}
                />
              )}
            </div>
          )}

          {content.message && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#D7CCC8] relative group hover:scale-[1.02] transition-transform duration-300">
              <Flame className="w-6 h-6 text-[#E65100]/30 absolute -top-3 -left-2" />
              <p className="text-[#5D4037] text-lg font-medium leading-relaxed">
                "{content.message}"
              </p>
              <div className="flex justify-center gap-3 mt-4 text-2xl opacity-100 grayscale-[0.2] group-hover:grayscale-0 transition-all">
                <span>🌽</span><span>🔥</span><span>🪗</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-[#D7CCC8] flex flex-col gap-3 relative z-20">
          <button
            onClick={async () => {
              const result = await shareContent({
                title: content.title || "Arraiá do Calendário! 🔥",
                text: content.message || "Veja essa surpresa junina!",
                url: window.location.href,
                imageUrl: content.mediaUrl
              });
              if (result === 'copied') {
                toast({ title: "Link copiado! 🌽", description: "Bora pro arraiá!" });
              }
            }}
            className="w-full h-14 rounded-2xl bg-[#E65100] hover:bg-[#BF360C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E65100]/25 active:scale-95 transition-all uppercase tracking-wide"
          >
            <Share2 className="w-5 h-5" />
            Convidar pra Festa
          </button>
          <button onClick={onClose} className="text-[#8D6E63] text-[10px] font-black uppercase tracking-widest py-2 hover:text-[#5D4037] transition-colors">
            Voltar pro Arraial
          </button>
        </div>
      </motion.div>
    </div>
  )
};

// --- Páscoa Egg Modal (Premium - Easter) ---
interface PascoaEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any;
  content: {
    type: 'text' | 'image' | 'video';
    title?: string;
    message?: string;
    mediaUrl?: string;
  };
}

export const PascoaEggModal = ({ isOpen, onClose, content, config }: PascoaEggModalProps) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Decorações de Páscoa */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-16 left-8 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🥚</div>
        <div className="absolute bottom-32 right-10 text-3xl animate-pulse">🐰</div>
        <div className="absolute top-32 right-16 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌷</div>
        <div className="absolute top-1/2 left-6 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>🐣</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍫</div>
        <div className="absolute top-24 left-1/2 text-2xl animate-pulse" style={{ animationDelay: '0.7s' }}>🌸</div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[380px] max-h-[85vh] bg-[#FDF4FF] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-display border-[6px] border-purple-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-purple-600 transition-colors shadow-md"
        >
          <span className="text-lg font-bold">✕</span>
        </button>

        {/* Header */}
        <div className="pt-10 pb-4 text-center relative z-10 bg-gradient-to-b from-purple-100/50 to-transparent">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg flex items-center justify-center mx-auto mb-4 text-white rotate-3 border-4 border-white">
            <Gift className="w-10 h-10 drop-shadow-sm" />
          </div>
          <h2 className="text-2xl font-black text-purple-700 tracking-tight drop-shadow-sm px-4">
            {content.title || "Surpresa de Páscoa! 🐰"}
          </h2>
          <p className="text-pink-500 text-xs font-black uppercase tracking-widest mt-1">Ovo encontrado!</p>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto overscroll-contain text-center">
          {/* Media */}
          {content.mediaUrl && (
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-purple-200 bg-purple-50 mb-6 relative group rotate-1">
              {content.type === 'video' || content.mediaUrl.includes('youtube') || content.mediaUrl.includes('tiktok') || content.mediaUrl.includes('instagram') ? (
                <div className="w-full h-full flex items-center justify-center bg-purple-100">
                  <a href={content.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-purple-600 group-hover:scale-105 transition-transform">
                    <Play className="w-12 h-12 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Abrir Vídeo</span>
                  </a>
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?q=80&w=3870"}
                />
              )}
            </div>
          )}

          {content.message && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-purple-100 relative group hover:scale-[1.02] transition-transform duration-300">
              <Gift className="w-6 h-6 text-purple-300 absolute -top-3 -left-2" />
              <p className="text-purple-700 text-lg font-medium leading-relaxed italic">
                "{content.message}"
              </p>
              <div className="flex justify-center gap-3 mt-4 text-2xl opacity-100 grayscale-[0.2] group-hover:grayscale-0 transition-all">
                <span>🥚</span><span>🐰</span><span>🍫</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-purple-100 flex flex-col gap-3 relative z-20">
          <button
            onClick={async () => {
              const result = await shareContent({
                title: content.title || "Surpresa de Páscoa! 🐰",
                text: content.message || "Encontrei um ovo especial!",
                url: window.location.href,
                imageUrl: content.mediaUrl
              });
              if (result === 'copied') {
                toast({ title: "Link copiado! 🥚", description: "Espalhe a doçura!" });
              }
            }}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-300/25 active:scale-95 transition-all uppercase tracking-wide"
          >
            <Share2 className="w-5 h-5" />
            Espalhar Doçura
          </button>
          <button onClick={onClose} className="text-purple-400 text-[10px] font-black uppercase tracking-widest py-2 hover:text-purple-600 transition-colors">
            Continuar a Caça
          </button>
        </div>
      </motion.div>
    </div>
  )
};

// --- Reveillon Decorations (Top) ---
export const ReveillonDecorations = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none select-none overflow-hidden" style={{ height: '80px' }}>
      {/* String of lights */}
      <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lightString" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        {/* Curved string */}
        <path
          d="M -50 20 Q 25% 60, 50% 40 T 105% 20"
          stroke="url(#lightString)"
          strokeWidth="2"
          fill="none"
          className="drop-shadow-md"
        />
        <path
          d="M -50 20 Q 25% 60, 50% 40 T 105% 20"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth="4"
          fill="none"
        />
      </svg>

      {/* Colorful light bulbs */}
      {[
        { x: '5%', color: '#EF4444', delay: 0 },
        { x: '15%', color: '#3B82F6', delay: 0.2 },
        { x: '25%', color: '#F59E0B', delay: 0.4 },
        { x: '35%', color: '#10B981', delay: 0.6 },
        { x: '45%', color: '#8B5CF6', delay: 0.8 },
        { x: '55%', color: '#EC4899', delay: 1.0 },
        { x: '65%', color: '#06B6D4', delay: 1.2 },
        { x: '75%', color: '#F97316', delay: 1.4 },
        { x: '85%', color: '#84CC16', delay: 1.6 },
        { x: '95%', color: '#EF4444', delay: 1.8 },
      ].map((light, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full shadow-lg"
          style={{
            left: light.x,
            top: '28px',
            width: '16px',
            height: '20px',
            backgroundColor: light.color,
            boxShadow: `0 0 15px ${light.color}, 0 0 30px ${light.color}80`,
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: light.delay,
            ease: "easeInOut",
          }}
        >
          {/* Bulb cap */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-t-sm"
            style={{ backgroundColor: '#475569' }}
          />
        </motion.div>
      ))}

      {/* Floating stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-yellow-300 text-xl"
          style={{
            left: `${10 + i * 12}%`,
            top: `${50 + Math.random() * 20}px`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
};

// --- Reveillon Locked Modal ---
interface ReveillonLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  unlockDate: Date;
  onNotify?: () => void;
}

export const ReveillonLockedModal = ({ isOpen, onClose, dayNumber, unlockDate, onNotify }: ReveillonLockedModalProps) => {
  if (!isOpen) return null;

  const now = new Date();
  const diff = unlockDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-display border-4 border-amber-400"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pt-8 pb-4 text-center relative z-10 bg-gradient-to-b from-amber-50 to-white">
          {/* Hourglass icon */}
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/30 flex items-center justify-center mx-auto mb-3"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Clock className="w-8 h-8 text-slate-900" />
          </motion.div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight px-4">
            Ainda não é a hora! 🎆
          </h2>
          <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mt-1">
            Contagem Regressiva
          </p>
        </div>

        {/* Countdown Display */}
        <div className="px-6 pb-4 bg-gradient-to-b from-white to-amber-50/30">
          <div className="bg-white rounded-2xl p-5 border-2 border-amber-100 shadow-sm">
            <p className="text-slate-600 text-sm text-center mb-4">
              A virada está chegando! Aguarde o momento certo para revelar a surpresa do dia <span className="text-amber-600 font-bold">{dayNumber}</span>.
            </p>

            {/* Timer boxes */}
            <div className="flex items-center justify-center gap-2">
              <div className="bg-gradient-to-b from-amber-500 to-yellow-400 rounded-xl p-3 min-w-[70px] text-center shadow-lg shadow-amber-500/20">
                <span className="block text-3xl font-black text-slate-900">{days}</span>
                <span className="text-[10px] font-bold text-slate-800 uppercase">dias</span>
              </div>
              <span className="text-amber-500 text-2xl font-bold">:</span>
              <div className="bg-gradient-to-b from-amber-500 to-yellow-400 rounded-xl p-3 min-w-[70px] text-center shadow-lg shadow-amber-500/20">
                <span className="block text-3xl font-black text-slate-900">{hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-bold text-slate-800 uppercase">horas</span>
              </div>
              <span className="text-amber-500 text-2xl font-bold">:</span>
              <div className="bg-gradient-to-b from-amber-500 to-yellow-400 rounded-xl p-3 min-w-[70px] text-center shadow-lg shadow-amber-500/20">
                <span className="block text-3xl font-black text-slate-900">{minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-bold text-slate-800 uppercase">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-amber-100 flex flex-col gap-3 relative z-20">
          <button
            onClick={onNotify}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all uppercase tracking-wide"
          >
            <Bell className="w-5 h-5" />
            Me Avise Quando Abrir
          </button>
          <button
            onClick={onClose}
            className="text-amber-600 text-[10px] font-black uppercase tracking-widest py-2 hover:text-amber-700 transition-colors"
          >
            Continuar Explorando
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Reveillon Fireworks Modal (Surprise) ---
interface ReveillonFireworksModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any;
  content: {
    type: 'text' | 'image' | 'video';
    title?: string;
    message?: string;
    mediaUrl?: string;
  };
}

export const ReveillonFireworksModal = ({ isOpen, onClose, content, config }: ReveillonFireworksModalProps) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900/90 to-blue-950/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Animated fireworks background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 60}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 2, 0],
              opacity: [0, 1, 0.5, 0],
              rotate: [0, 45, 90],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          >
            <Sparkles
              className={`w-${6 + (i % 4)} h-${6 + (i % 4)}`}
              style={{
                color: ['#FCD34D', '#F59E0B', '#EC4899', '#3B82F6', '#10B981'][i % 5],
              }}
            />
          </motion.div>
        ))}

        {/* Floating stars */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-200 text-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[380px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-display border-4 border-amber-400"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pt-8 pb-4 text-center relative z-10 bg-gradient-to-b from-amber-50 to-white">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/30 flex items-center justify-center mx-auto mb-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PartyPopper className="w-8 h-8 text-slate-900" />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight px-4">
            {content.title || "Feliz Ano Novo! 🎉"}
          </h2>
          <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mt-1">
            Surpresa Especial
          </p>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 px-6 pb-4 overflow-y-auto overscroll-contain bg-gradient-to-b from-white to-amber-50/30">
          {/* Media */}
          {content.mediaUrl && (
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-amber-200 bg-amber-100 mb-5 relative group">
              {content.type === 'video' || content.mediaUrl.includes('youtube') || content.mediaUrl.includes('tiktok') || content.mediaUrl.includes('instagram') ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <a
                    href={content.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-white group-hover:scale-105 transition-transform"
                  >
                    <Play className="w-12 h-12 fill-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Assistir Vídeo</span>
                  </a>
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  alt="Surpresa"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2069"}
                />
              )}
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 text-2xl">🎆</div>
              <div className="absolute top-2 right-2 text-2xl">✨</div>
              <div className="absolute bottom-2 left-2 text-2xl">🥂</div>
              <div className="absolute bottom-2 right-2 text-2xl">🎊</div>
            </div>
          )}

          {content.message && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-amber-100 relative group hover:scale-[1.02] transition-transform duration-300">
              {/* Sparkle decorations */}
              <Sparkles className="w-6 h-6 text-amber-400/40 absolute -top-3 -left-2" />
              <Sparkles className="w-5 h-5 text-amber-400/40 absolute -bottom-2 -right-2 rotate-12" />

              <p className="text-slate-800 text-lg font-medium leading-relaxed text-center">
                "{content.message}"
              </p>

              {/* Bottom emoji decorations */}
              <div className="flex justify-center gap-2 mt-4 text-2xl">
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎆
                </motion.span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                >
                  🥂
                </motion.span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                >
                  ✨
                </motion.span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                >
                  🎊
                </motion.span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-amber-100 flex flex-col gap-3 relative z-20">
          <button
            onClick={async () => {
              const result = await shareContent({
                title: content.title || "Feliz Ano Novo! 🎉",
                text: content.message || "Veja essa surpresa especial!",
                url: window.location.href,
                imageUrl: content.mediaUrl
              });
              if (result === 'copied') {
                toast({ title: "Link copiado! 🎆", description: "Compartilhe a alegria!" });
              }
            }}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all uppercase tracking-wide"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar Magia
          </button>
          <button
            onClick={onClose}
            className="text-amber-600 text-[10px] font-black uppercase tracking-widest py-2 hover:text-amber-700 transition-colors"
          >
            Continuar Celebrando
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============ NATAL THEME COMPONENTS ============

// NatalDecorations - Hanging snowflakes and stars
export const NatalDecorations = () => {
  const decorations = [
    { type: '❄️', size: 'text-xl', delay: 0, left: '10%' },
    { type: '🎄', size: 'text-2xl', delay: -0.5, left: '25%' },
    { type: '⭐', size: 'text-xl', delay: -1, left: '40%' },
    { type: '🔔', size: 'text-lg', delay: -0.3, left: '55%' },
    { type: '🎁', size: 'text-xl', delay: -0.8, left: '70%' },
    { type: '❄️', size: 'text-lg', delay: -0.2, left: '85%' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-24 overflow-hidden pointer-events-none z-40">
      {decorations.map((item, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ left: item.left }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: [0, 5, 0],
            opacity: 1,
            rotate: [-5, 5, -5],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            opacity: { duration: 0.5 },
          }}
        >
          <div className={`${item.size} drop-shadow-lg`}>{item.type}</div>
          {/* String */}
          <div className="w-[2px] h-8 bg-gradient-to-b from-red-300/50 to-transparent mx-auto" />
        </motion.div>
      ))}
    </div>
  );
};

// NatalFireworksModal - Modal de surpresa
export const NatalFireworksModal = ({
  isOpen,
  onClose,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  content: { title?: string; message?: string; mediaUrl?: string; type?: string };
}) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-green-50 to-white relative">
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 text-2xl">🎄</div>
          <div className="absolute top-3 right-3 text-2xl">⭐</div>
          <div className="absolute bottom-3 left-3 text-xl">❄️</div>
          <div className="absolute bottom-3 right-3 text-xl">🎁</div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center pt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 shadow-lg">
              <Gift className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-black text-green-800">{content.title || "Feliz Natal! 🎄"}</h2>
            <p className="text-green-600/80 text-sm mt-1">Uma surpresa especial para você!</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-white">
          {/* Media */}
          {content.mediaUrl ? (
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-green-100 bg-green-50 mb-5 relative">
              {content.type === 'video' || content.mediaUrl.includes('youtube') || content.mediaUrl.includes('tiktok') || content.mediaUrl.includes('instagram') ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <a
                    href={content.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-white"
                  >
                    <Play className="w-12 h-12 fill-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Assistir Vídeo</span>
                  </a>
                </div>
              ) : (
                <img src={content.mediaUrl} alt="Surpresa" className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 left-2 text-2xl">🎄</div>
              <div className="absolute top-2 right-2 text-2xl">⭐</div>
              <div className="absolute bottom-2 left-2 text-xl">❄️</div>
              <div className="absolute bottom-2 right-2 text-xl">🎁</div>
            </div>
          ) : content.message ? (
            /* Message without media - show prominently */
            <div className="w-full min-h-[200px] rounded-2xl bg-gradient-to-br from-green-50 to-red-50 border-4 border-green-200 flex flex-col items-center justify-center mb-5 relative overflow-hidden p-6">
              {/* Background decorations */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 text-4xl">❄️</div>
                <div className="absolute top-4 right-4 text-4xl">⭐</div>
                <div className="absolute bottom-4 left-4 text-4xl">🎄</div>
                <div className="absolute bottom-4 right-4 text-4xl">🎁</div>
              </div>

              {/* Message is the main content */}
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-4">🎁</div>
                <p className="text-slate-800 text-xl font-medium leading-relaxed">
                  &ldquo;{content.message}&rdquo;
                </p>
              </div>
            </div>
          ) : (
            /* No content - show gift placeholder */
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-green-50 to-red-50 border-4 border-green-200 flex flex-col items-center justify-center mb-5 relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 text-4xl">❄️</div>
                <div className="absolute top-4 right-4 text-4xl">⭐</div>
                <div className="absolute bottom-4 left-4 text-4xl">🎄</div>
                <div className="absolute bottom-4 right-4 text-4xl">🎁</div>
              </div>

              {/* Large Gift Box */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="text-8xl mb-4">🎁</div>
              </motion.div>

              {/* Gift message */}
              <p className="text-green-700 font-bold text-lg text-center relative z-10 mt-2">
                Um presente especial!
              </p>
              <p className="text-green-600/70 text-sm text-center relative z-10">
                Abra com carinho 🎄
              </p>
            </div>
          )}

          {/* Only show message box if not already shown above */}
          {content.message && !content.mediaUrl && (
            <div className="flex justify-center gap-3 text-2xl">
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }}>🎄</motion.span>
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>⭐</motion.span>
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>🎁</motion.span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-green-100 flex flex-col gap-3">
          <button
            onClick={async () => {
              const result = await shareContent({
                title: content.title || "Feliz Natal! 🎄",
                text: content.message || "Veja essa surpresa especial!",
                url: window.location.href,
                imageUrl: content.mediaUrl
              });
              if (result === 'copied') {
                toast({ title: "Link copiado! 🎄", description: "Compartilhe a magia do Natal!" });
              }
            }}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-green-500/25 active:scale-95 transition-all uppercase tracking-wide"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar Magia
          </button>
          <button onClick={onClose} className="text-green-600 text-[10px] font-black uppercase tracking-widest py-2 hover:text-green-700">
            Continuar Celebrando
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// NatalLockedModal - Modal de cadeado
export const NatalLockedModal = ({
  isOpen,
  onClose,
  timeLeft,
}: {
  isOpen: boolean;
  onClose: () => void;
  timeLeft?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-sm bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-red-900/50 to-slate-900 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border-2 border-red-500/30 mb-4"
            >
              <span className="text-4xl">🎅</span>
            </motion.div>
            <h2 className="text-2xl font-black text-white">Ainda não é Natal!</h2>
            <p className="text-slate-400 text-sm mt-2">Papai Noel está preparando sua surpresa</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-900">
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-700">
            <p className="text-slate-300 text-sm mb-3">Volte na data certa para abrir seu presente!</p>
            {timeLeft && (
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-red-200 font-bold">{timeLeft}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-3 text-3xl">
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🎄</motion.span>
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>⭐</motion.span>
            <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🎁</motion.span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors"
          >
            Entendido 🎄
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Wedding Card Modal (Premium Gold/Champagne)
export const WeddingCardModal = ({ isOpen, onClose, content, config }: LoveLetterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Floating Elements (Decorations) - Premium Flowers */}
      <div className="absolute top-10 left-10 w-40 h-40 text-[#D4AF37] opacity-60 animate-pulse delay-700 pointer-events-none">
        <Flower2 className="w-full h-full rotate-[-15deg]" />
      </div>
      <div className="absolute bottom-20 right-5 w-40 h-40 text-[#D4AF37] opacity-60 animate-pulse delay-300 pointer-events-none">
        <Flower2 className="w-full h-full rotate-[15deg]" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[380px] max-h-[85vh] bg-[#FDFBF7] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col font-serif border border-[#D4AF37]/20"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center justify-center text-[#B5942F] transition-colors border border-[#D4AF37]/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Premium Header */}
        <div className="pt-10 pb-6 text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B5942F] shadow-lg flex items-center justify-center mx-auto mb-4 border-[3px] border-white">
            {<Heart className="w-8 h-8 text-white fill-white" />}
          </div>
          <h2 className="text-3xl font-serif italic text-[#B5942F]">
            {content.title}
          </h2>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto overscroll-contain relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>

          {/* Media */}
          {content.mediaUrl && (
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg border-[6px] border-white bg-white mb-6 relative shrink-0 rotate-1 transform">
              {content.type === 'video' || content.mediaUrl.includes('youtube') || content.mediaUrl.includes('youtu.be') || content.mediaUrl.includes('tiktok') || content.mediaUrl.includes('instagram') ? (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {content.mediaUrl.includes('youtube.com') || content.mediaUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${content.mediaUrl.includes('youtu.be') ? content.mediaUrl.split('/').pop() : new URLSearchParams(new URL(content.mediaUrl).search).get('v')}?autoplay=0&rel=0&showinfo=0`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : content.mediaUrl.includes('tiktok.com') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black text-white relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-[url('https://sf16-scmcdn-va.ibytedtos.com/goofy/tiktok/web/node/_next/static/images/logo-dark-e95da587b61920d5.png')] bg-cover bg-center" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-[#FE2C55] flex items-center justify-center shadow-lg mb-3 animate-pulse">
                          <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                        <p className="font-sans font-bold text-xs uppercase tracking-widest text-shadow">Abrir no TikTok</p>
                        <a
                          href={content.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 z-20"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-[#D4AF37]">
                      <Play className="w-12 h-12 opacity-80" />
                      <a href={content.mediaUrl} target="_blank" rel="noreferrer" className="mt-2 text-xs font-bold underline font-sans">
                        Ver Vídeo Original
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  alt="Wedding Memory"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          <div className="relative z-10 text-center">
            <p className="text-[#8C7335] text-lg leading-relaxed font-serif italic whitespace-pre-line">
              {content.message}
            </p>
          </div>

          <div className="mt-8 flex justify-center opacity-40">
            <div className="h-px w-20 bg-[#D4AF37]"></div>
            <Flower2 className="w-4 h-4 text-[#D4AF37] -mt-2 mx-2" />
            <div className="h-px w-20 bg-[#D4AF37]"></div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

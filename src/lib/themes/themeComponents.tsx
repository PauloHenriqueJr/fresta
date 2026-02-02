import { useState, useMemo, ReactNode, forwardRef } from "react";
import { BrandWatermark } from "@/components/calendar/BrandWatermark";
import { motion } from "framer-motion";
import { Pencil, Plus, Share2, Heart, Lock, Eye, Save, Rocket, Quote, MessageSquare, Sparkles, X, Play, Music, Camera, Gift, Settings, PartyPopper, Clock, Bell, Download, Flame, GripHorizontal, Calendar, Star, Wand2, Coffee, Wine, Pizza, Utensils, Plane, MapPin, Sun, Moon, Cloud, Ghost, Palette, User, Info, HelpCircle, Ticket, Flower2, Crown, Flower } from "lucide-react";
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
    metas: {
      title: "Calma, campeão! ⭐",
      message: "Essa meta ainda está guardada. O sucesso vem para quem sabe esperar!",
      buttonColor: "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-indigo-950",
      iconColor: "text-amber-400",
      bgColor: "bg-indigo-950 dark:bg-indigo-950",
      borderColor: "border-amber-400/30 dark:border-amber-400/30",
      textColor: "text-white dark:text-white",
      descColor: "text-indigo-200 dark:text-indigo-200",
      icon: Star
    },
    diadasmaes: {
      title: "Calma, querido(a)! 💐",
      message: "Essa surpresa para a mamãe ainda está sendo preparada com muito amor!",
      buttonColor: "bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600",
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-zinc-900",
      borderColor: "border-pink-200 dark:border-pink-900",
      textColor: "text-pink-900 dark:text-pink-100",
      descColor: "text-pink-600/80 dark:text-pink-300/80",
      icon: Heart
    },
    diadospais: {
      title: "Calma, campeão! 👔",
      message: "Essa surpresa para o paizão ainda está guardada. Paciência é uma virtude!",
      buttonColor: "bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700",
      iconColor: "text-slate-500",
      bgColor: "bg-slate-50 dark:bg-zinc-900",
      borderColor: "border-slate-200 dark:border-slate-800",
      textColor: "text-slate-900 dark:text-slate-100",
      descColor: "text-slate-600/80 dark:text-slate-300/80",
      icon: Crown
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


// ============================================================================
// MIGRATED MODALS - DO NOT ADD NEW MODALS HERE
// ============================================================================
// All theme-specific modals have been moved to their respective theme folders:
//
// Theme            | Modal                    | Location
// -----------------|--------------------------|----------------------------------
// namoro           | LoveLetterModal          | src/lib/themes/namoro/modals.tsx
// carnaval         | CarnavalTicketModal      | src/lib/themes/carnaval/modals.tsx
// saojoao          | SaoJoaoBarracaModal      | src/lib/themes/saojoao/modals.tsx
// aniversario      | BirthdayCardModal        | src/lib/themes/aniversario/modals.tsx
// pascoa           | PascoaEggModal           | src/lib/themes/pascoa/modals.tsx
// reveillon        | ReveillonFireworksModal  | src/lib/themes/reveillon/modals.tsx
// natal            | NatalFireworksModal      | src/lib/themes/natal/modals.tsx
// casamento        | WeddingCardModal         | src/lib/themes/casamento/modals.tsx
// metas            | MetasGoalModal           | src/lib/themes/metas/modals.tsx
// diadasmaes       | DiadasmaesModal          | src/lib/themes/diadasmaes/modals.tsx
// diadospais       | DiadospaisModal          | src/lib/themes/diadospais/modals.tsx
//
// For new themes, create a modals.tsx file in the theme folder following the
// pattern documented in .agent/skills/implementation-new-theme/SKILL.md
// ============================================================================
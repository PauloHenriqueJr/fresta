import { useState, useMemo, ReactNode, forwardRef } from "react";
import { BrandWatermark } from "@/components/calendar/BrandWatermark";
import { motion } from "framer-motion";
import { Pencil, Plus, Share2, Heart, Lock, Eye, Save, Rocket, Quote, MessageSquare, Sparkles, X, Play, Music, Camera, Gift, Settings, PartyPopper, Clock, Bell, Download, Flame, GripHorizontal, Calendar, Star, Wand2, Coffee, Wine, Pizza, Utensils, Plane, MapPin, Sun, Moon, Cloud, Ghost, Palette, User, Info, HelpCircle, Ticket, Flower2, Crown, Flower } from "lucide-react";
import { cn } from "@/lib/utils";
import { canInstallPWA, promptInstall, isPWAInstalled } from "@/lib/push/notifications";
import { useToast } from "@/hooks/use-toast";
import { shareContent } from "@/lib/utils/share-utils";
import { getThemeConfig, type PlusThemeConfig } from "./registry";

// =============================================================================
// RE-EXPORTS FOR BACKWARD COMPATIBILITY
// =============================================================================
// These re-exports allow existing files to continue importing from themeComponents
// while the actual implementations have been moved to their respective theme folders.

// Modals
export { LoveLetterModal } from "@/lib/themes/namoro/modals";
export { LoveLockedModal, LockedModal } from "@/lib/themes/shared/LockedModal";

// Theme-specific Locked Modal Aliases (wrap LockedModal with preset theme)
import { LockedModal as GenericLockedModal } from "@/lib/themes/shared/LockedModal";

type LockedModalAliasProps = {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  unlockDate: Date;
  onNotify?: () => void;
};

export const NatalLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="natal" />;
export const ReveillonLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="reveillon" />;
export const CarnavalLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="carnaval" />;
export const SaoJoaoLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="saojoao" />;
export const PascoaLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="pascoa" />;
export const AniversarioLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="aniversario" />;
export const CasamentoLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="casamento" />;
export const MetasLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="metas" />;
export const DiadasmaesLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="diadasmaes" />;
export const DiadospaisLockedModal = (props: LockedModalAliasProps) => <GenericLockedModal {...props} theme="diadospais" />;

// Wedding Components (decorations)
export { WeddingShower, WeddingTopDecorations, WeddingBackground, WeddingDecorations } from "@/lib/themes/casamento/decorations";

// Wedding Components (UI)
export { WeddingHeader, WeddingProgress, WeddingDayCard, WeddingSpecialCard, WeddingDiarySection, WeddingFooter } from "@/lib/themes/casamento/components";

// =============================================================================


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
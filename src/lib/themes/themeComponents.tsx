import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, Lock, Quote, Pencil, Plus, Settings, Rocket, Save, GripHorizontal, Eye, X, MessageSquare, Share2, Sparkles, Bell, Clock, Calendar, Play, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { canInstallPWA, promptInstall, isPWAInstalled } from "@/lib/push/notifications";

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
export const LoveHeader = ({ title = "Nossa Jornada de Amor", subtitle = "Contando os dias para o nosso momento", isEditor = false }: { title?: string, subtitle?: string, isEditor?: boolean }) => {
  return (
    <div className="px-6 mt-4 text-center relative z-10 font-display group flex flex-col items-center gap-2">
      <h1 className="text-[36px] font-romantic leading-tight text-rose-900 dark:text-rose-50 drop-shadow-sm relative">
        {title}
        {isEditor && (
          <button className="absolute -top-2 -right-6 bg-white shadow-sm p-1.5 rounded-full text-rose-500 hover:text-rose-600 transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </h1>
      <div className="relative">
        <p className="text-rose-500/80 dark:text-rose-200/80 font-medium font-festive text-lg">
          {subtitle}
        </p>
        {isEditor && (
          <button className="absolute -top-1 -right-6 bg-white shadow-sm p-1 rounded-full text-rose-500 hover:text-rose-600 transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

// --- Progress Bar ---
export const LoveProgressBar = ({ progress = 70, isEditor = false }: { progress?: number, isEditor?: boolean }) => {
  return (
    <div className="flex flex-col gap-3 px-8 mt-6 relative z-10 font-display">
      <div className="flex justify-between items-center mb-1">
        <span className="text-love-red dark:text-rose-400 text-xs font-bold uppercase tracking-wider">{progress}% de puro amor</span>
        {isEditor ? (
          <button className="text-rose-400 hover:text-rose-600 text-xs font-medium italic underline decoration-dashed underline-offset-4">
            Configurar progresso
          </button>
        ) : (
          <span className="text-rose-400 dark:text-rose-500 text-xs font-medium italic">Quase lá, vida...</span>
        )}
      </div>
      <div className="h-3 w-full rounded-full bg-rose-100 dark:bg-rose-950/50 overflow-hidden border border-rose-200 dark:border-rose-900 shadow-inner">
        <motion.div
          className="h-full rounded-full bg-love-red relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  )
}

// --- Day Components ---

// Empty Day (For Editor "Add Surprise")
export const EmptyDayCard = ({ dayNumber }: { dayNumber: number | string }) => {
  return (
    <div className="aspect-[4/5] bg-rose-50/50 relative flex flex-col items-center justify-center p-2 rounded-xl border-2 border-rose-200 border-dashed font-display cursor-pointer hover:bg-rose-100/50 transition-colors group">
      <span className="text-rose-300 font-romantic text-2xl mb-2">{dayNumber}</span>
      <div className="flex flex-col items-center gap-1 group-hover:scale-105 transition-transform">
        <div className="w-8 h-8 rounded-full bg-love-red text-white flex items-center justify-center shadow-md">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-[8px] font-bold text-love-red uppercase text-center leading-tight mt-1">Adicionar<br />Surpresa</span>
      </div>
    </div>
  )
}

// Locked Day (Future)
// Locked Day (Future)
export const LockedDayCard = ({ dayNumber, timeText, isEditor = false, onClick }: { dayNumber: number | string, timeText: string, isEditor?: boolean, onClick?: () => void }) => {
  return (
    <div
      className="aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-rose-200/30 dark:border-rose-800/30 font-display overflow-hidden group cursor-pointer"
      onClick={() => onClick && onClick()}
      style={{
        background: `
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(255,230,230,0.5)),
                repeating-linear-gradient(45deg, #ffe4e6 0, #ffe4e6 10px, #fecdd3 10px, #fecdd3 11px)
            `
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] transition-opacity group-hover:opacity-80 pointer-events-none"></div>

      {isEditor && (
        <button className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-sm text-rose-500 z-20 hover:text-rose-700">
          <Pencil className="w-3 h-3" />
        </button>
      )}
      <div className="relative z-10 flex flex-col items-center transform transition-transform group-hover:scale-105">
        <span className="text-rose-400 dark:text-rose-300 font-romantic text-3xl mb-1 drop-shadow-sm">{dayNumber}</span>
        <div className="flex flex-col items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-rose-100 shadow-sm backdrop-blur-sm">
          <Lock className="w-3 h-3 text-rose-400" />
          <span className="text-[8px] font-bold text-rose-500/80 uppercase tracking-wide">{timeText}</span>
        </div>
      </div>

      {isEditor && (
        <div className="absolute bottom-2 left-0 right-0 text-center relative z-10">
          <span className="text-[8px] font-bold text-rose-400 uppercase bg-white/80 px-2 py-0.5 rounded-full shadow-sm">ABRE EM<br />{timeText}</span>
        </div>
      )}
    </div>
  )
}

// Envelope Card (Current Day - To Open)
export const EnvelopeCard = ({ dayNumber, onClick, isEditor = false }: { dayNumber: number | string, onClick?: () => void, isEditor?: boolean }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="aspect-[4/5] sm:aspect-[2/1.4] col-span-1 sm:col-span-2 relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 border-2 border-love-red/20 bg-[#fdf2f8] overflow-hidden group"
    >
      {/* Envelope Pattern Background */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,transparent_50%,#fce7f3_50%),linear-gradient(225deg,transparent_50%,#fce7f3_50%)] bg-[length:50%_100%] bg-no-repeat bg-[position:left_top,right_top] z-[1]"></div>

      {/* Wax Seal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[radial-gradient(circle,#f43f5e_0%,#be123c_100%)] shadow-md z-[2] flex items-center justify-center">
        <Heart className="w-4 h-4 text-white fill-white" />
      </div>

      {/* Glow Aura */}
      <div className="absolute inset-0 shadow-[0_0_20px_5px_rgba(225,29,72,0.3)] z-0 pointer-events-none rounded-xl"></div>

      <div className="relative z-10 mt-8 flex flex-col items-center text-center font-display">
        <span className="text-rose-900 font-romantic text-3xl mb-1">Dia {dayNumber}</span>

        {isEditor ? (
          <button className="bg-love-red text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:bg-rose-700 transition-colors tracking-widest uppercase flex items-center gap-1">
            <Pencil className="w-3 h-3" /> EDITAR CONTEÚDO
          </button>
        ) : (
          <button className="bg-love-red text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-md hover:bg-rose-700 transition-colors tracking-widest uppercase">
            ABRIR O CORAÇÃO
          </button>
        )}
      </div>

      {isEditor && (
        <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-sm text-rose-500 z-20 hover:text-rose-700">
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  )
}

// Unlocked Day (Past/Opened)
// UnlockedDayCard
export const UnlockedDayCard = ({ dayNumber, imageUrl, onClick, isEditor = false }: { dayNumber: number | string, imageUrl: string, onClick?: () => void, isEditor?: boolean }) => {
  const [imgError, setImgError] = useState(false);
  const isTikTok = imageUrl?.includes('tiktok.com');
  const hasImage = imageUrl && !imgError && !isTikTok;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl bg-white border-2 border-rose-100 shadow-sm overflow-hidden group font-display cursor-pointer"
    >
      {hasImage ? (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105",
            !isEditor && "blur-[30px]" // High blur (3xl equivalent) for privacy
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
      ) : isTikTok ? (
        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shadow-lg mb-2">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-rose-500/10" />
        </div>
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-[#fffafa] transition-opacity duration-500",
            !isEditor && "blur-[15px] opacity-70"
          )}
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 19px, #abced4 19px, #abced4 20px, transparent 20px),
              linear-gradient(#eee 0.1em, transparent 0.1em)
            `,
            backgroundSize: '100% 0.8em'
          }}
        >
          <div className="absolute top-0 right-0 w-8 h-8 bg-rose-200/40 rounded-bl-3xl" />
        </div>
      )}

      <div className="absolute top-1 right-1 text-love-red bg-white/80 rounded-full p-1 shadow-sm z-20">
        {isEditor ? <Pencil className="w-3 h-3" /> : <Heart className="w-3 h-3 fill-current" />}
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <span className={cn(
          "text-[10px] font-bold px-2 rounded-full mb-1",
          hasImage ? "text-white bg-black/30 backdrop-blur-sm" : "text-rose-600 bg-rose-50/80"
        )}>
          Dia {dayNumber}
        </span>
      </div>
    </motion.div>
  )
}

// --- Quote ---
export const LoveQuote = ({ text = "Onde há amor, há vida. Prepare o coração, pois o que está por vir é eterno.", author = "Dica dos Namorados", isEditor = false }: { text?: string, author?: string, isEditor?: boolean }) => {
  return (
    <div className="mt-10 p-5 rounded-2xl bg-white/60 dark:bg-black/40 border-2 border-rose-100 dark:border-rose-900/50 flex flex-col items-center text-center gap-2 shadow-inner font-display max-w-lg mx-auto relative group">
      {isEditor && (
        <button className="absolute top-2 right-2 bg-rose-100 p-1.5 rounded-full shadow-sm text-rose-500 hover:text-rose-700 transition-colors">
          <Pencil className="w-3 h-3" />
        </button>
      )}
      <Quote className="text-love-red w-8 h-8 fill-current opacity-80" />
      <div>
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-100 font-festive">{author}</h3>
        <p className="text-sm text-rose-700/80 dark:text-rose-200/90 italic mt-1 leading-relaxed">
          "{text}"
        </p>
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
export const LoveFooter = ({
  isEditor = false,
  onNavigate,
}: {
  isEditor?: boolean;
  onNavigate?: () => void;
}) => {
  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 w-[92%] max-w-md p-4 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-lg border border-rose-100 dark:border-white/10 z-50 font-display rounded-3xl shadow-2xl shadow-rose-500/10 transition-all duration-300",
        isEditor ? "bottom-24" : "bottom-6"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigate}
          className="flex-1 h-12 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 bg-love-red hover:bg-rose-700 text-white shadow-rose-500/30"
        >
          <Sparkles className="w-4 h-4" />
          Criar meu calendário
        </button>
      </div>
    </div>
  );
};

// --- Legacy support for existing components if needed ---
export const FlagBanner = () => null;
export const WeddingShower = () => null;

// --- Wedding Theme Components ---

// --- Wedding Theme Components ---

// Wedding Background
export const WeddingBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#FDFBF7] pointer-events-none text-wedding-gold/20">
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
    <div className="fixed top-0 left-0 w-full flex justify-between items-start z-50 pointer-events-none px-4 pt-1 opacity-60">
      {/* Using Lucide Flower/Sparkles as approximations for 'filter_vintage' and 'local_florist' */}
      <Settings className="w-8 h-8 text-wedding-gold/40 animate-pulse-soft hidden" /> {/* Placeholder structure */}
      <div className="text-4xl text-wedding-gold/40">❀</div>
      <div className="text-3xl text-wedding-gold/30 mt-2">✿</div>
      <div className="text-4xl text-wedding-gold/40">❀</div>
      <div className="text-3xl text-wedding-gold/30 mt-2">✿</div>
      <div className="text-4xl text-wedding-gold/40">❀</div>
    </div>
  )
}

// Wedding Header
export const WeddingHeader = ({ title = "O Grande Sim!", subtitle = "A contagem regressiva para o altar", isEditor = false }: { title?: string, subtitle?: string, isEditor?: boolean }) => {
  return (
    <div className="pt-4 pb-2 text-center relative z-10 font-display group px-4">
      {isEditor && (
        <div className="absolute top-0 left-0 w-full flex justify-center -mt-2">
          <span className="text-[10px] font-bold text-wedding-gold-dark tracking-[0.2em] uppercase bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border border-wedding-gold/20">
            Private Event
          </span>
        </div>
      )}

      <h1 className="text-4xl font-display italic text-wedding-gold-dark drop-shadow-sm relative inline-block mb-1 font-medium">
        {title}
        {isEditor && (
          <button className="absolute -top-1 -right-8 bg-[#FDFBF7] shadow-sm p-1.5 rounded-full text-wedding-gold hover:text-wedding-gold-dark transition-colors border border-wedding-gold/20">
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </h1>

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
      <div className="max-w-md mx-auto flex items-center gap-3">
        <button className="flex-[3] bg-gradient-to-r from-[#D4AF37] to-[#996515] hover:to-[#754C0E] text-white h-14 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#D4AF37]/25 transition-all active:scale-95">
          Enviar Amor
        </button>
        <button className="flex-1 h-14 rounded-2xl bg-[#F9F6F0] text-[#996515] flex items-center justify-center hover:bg-[#E5CFAA]/20 transition-colors">
          <Heart className="w-5 h-5 fill-current" />
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
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
                "bg-zinc-800 hover:bg-black"
              )}
            >
              <Download className="w-4 h-4" />
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

// --- Love Letter Modal ---
interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    type: 'text' | 'image' | 'video';
    title?: string;
    message?: string;
    mediaUrl?: string;
  };
}

export const LoveLetterModal = ({ isOpen, onClose, content }: LoveLetterModalProps) => {
  if (!isOpen) return null;

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
        className="relative w-full max-w-[360px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col font-display"
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

        {/* Paper Body */}
        <div
          className="flex-1 px-6 pt-10 pb-6 flex flex-col items-center bg-[#fffafa] min-h-[300px]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
              linear-gradient(#eee 0.1em, transparent 0.1em)
            `,
            backgroundSize: '100% 1.2em'
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
            <h2 className="font-romantic text-4xl text-rose-900 leading-tight block">
              {content.title || "Uma Surpresa para Você"}
            </h2>

            <div className="px-2">
              <p className="font-festive text-xl text-rose-800 leading-relaxed block break-words">
                {content.message || "Às vezes as palavras não são suficientes para expressar o que eu sinto..."}
              </p>
            </div>

            {content.mediaUrl && content.type === 'image' && !content.message && (
              <p className="font-festive text-lg text-rose-700/60 leading-relaxed italic">
                Uma imagem vale mais que mil palavras. ❤️
              </p>
            )}

            <div className="pt-8">
              <span className="font-romantic text-3xl text-rose-700 block">Com todo meu coração,</span>
              <div className="flex justify-center mt-1">
                <Heart className="w-5 h-5 text-love-red fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-rose-100 dark:border-rose-800 flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              const shareData = {
                title: content.title || 'Um presente para você!',
                text: content.message || '',
                url: content.mediaUrl || window.location.href,
              };
              if (navigator.share) {
                navigator.share(shareData).catch(console.error);
              } else {
                navigator.clipboard.writeText(content.mediaUrl || window.location.href);
                alert('Link copiado!');
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

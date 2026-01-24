import { motion } from "framer-motion";
import { Heart, Lock, Quote, Pencil, Plus, Settings, Rocket, Save, GripHorizontal, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="px-6 mt-4 text-center relative z-10 font-display group">
      <h1 className="text-[36px] font-romantic leading-tight text-rose-900 dark:text-rose-100 drop-shadow-sm relative inline-block">
        {title}
        {isEditor && (
          <button className="absolute -top-2 -right-6 bg-white shadow-sm p-1.5 rounded-full text-rose-500 hover:text-rose-600 transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </h1>
      <div className="relative inline-block mt-1">
        <p className="text-rose-500/80 dark:text-rose-300/60 font-medium font-festive text-lg">
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
export const LockedDayCard = ({ dayNumber, timeText, isEditor = false }: { dayNumber: number | string, timeText: string, isEditor?: boolean }) => {
  return (
    <div
      className="aspect-[4/5] relative flex flex-col items-center justify-center p-2 rounded-xl opacity-90 border border-rose-200/30 dark:border-rose-800/30 font-display overflow-hidden group"
      style={{
        background: `
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(255,230,230,0.5)),
                repeating-linear-gradient(45deg, #ffe4e6 0, #ffe4e6 10px, #fecdd3 10px, #fecdd3 11px)
            `
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] transition-opacity group-hover:opacity-80"></div>

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
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="aspect-[4/5] relative flex flex-col items-center justify-end p-2 rounded-xl bg-white border-2 border-rose-100 shadow-sm overflow-hidden group font-display cursor-pointer"
    >
      <div
        className="absolute inset-0 bg-cover bg-center grayscale-[0.2] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      ></div>
      <div className="absolute top-1 right-1 text-love-red bg-white/80 rounded-full p-0.5 shadow-sm">
        {isEditor ? <Pencil className="w-3 h-3" /> : <Heart className="w-3 h-3 fill-current" />}
      </div>
      <span className="relative z-10 text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm px-2 rounded-full mb-1">
        Dia {dayNumber}
      </span>
    </motion.div>
  )
}

// --- Quote ---
export const LoveQuote = ({ text = "Onde há amor, há vida. Prepare o coração, pois o que está por vir é eterno.", author = "Dica dos Namorados", isEditor = false }: { text?: string, author?: string, isEditor?: boolean }) => {
  return (
    <div className="mt-10 p-5 rounded-2xl bg-white/60 dark:bg-rose-950/20 border-2 border-rose-100 dark:border-rose-900/50 flex flex-col items-center text-center gap-2 shadow-inner font-display max-w-lg mx-auto relative group">
      {isEditor && (
        <button className="absolute top-2 right-2 bg-rose-100 p-1.5 rounded-full shadow-sm text-rose-500 hover:text-rose-700 transition-colors">
          <Pencil className="w-3 h-3" />
        </button>
      )}
      <Quote className="text-love-red w-8 h-8 fill-current opacity-80" />
      <div>
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-100 font-festive">{author}</h3>
        <p className="text-sm text-rose-700/80 dark:text-rose-300 italic mt-1 leading-relaxed">
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

// --- User Footer ---
export const LoveFooter = ({ isEditor = false }: { isEditor?: boolean }) => {
  return (
    <div className={cn(
      "fixed left-1/2 -translate-x-1/2 w-[92%] max-w-md p-4 bg-white/80 dark:bg-surface-dark/95 backdrop-blur-lg border border-rose-100 dark:border-rose-900/50 z-50 font-display rounded-3xl shadow-2xl shadow-rose-500/10",
      isEditor ? "bottom-24" : "bottom-10"
    )}>
      <div className="flex items-center gap-3">
        <button className="flex-1 bg-love-red hover:bg-rose-700 text-white h-12 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-500/30 transition-all active:scale-95">
          <Heart className="w-4 h-4 fill-white" />
          Enviar Amor
        </button>
        {isEditor && (
          <button className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800">
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

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
      {!isLocked && imageUrl ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: `url('${imageUrl}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A0E]/60 to-transparent opacity-60" />
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
          className="flex-1 px-6 pt-10 pb-6 flex flex-col items-center bg-[#fffafa]"
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
              <img src={content.mediaUrl} alt="Memory" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Text Content */}
          <div className="text-center space-y-3 relative z-10">
            {content.title && (
              <h2 className="font-romantic text-4xl text-rose-900 leading-tight block">
                {content.title}
              </h2>
            )}

            {content.message && (
              <p className="font-festive text-xl text-rose-800 leading-relaxed px-2 block">
                {content.message}
              </p>
            )}

            <div className="pt-4">
              <span className="font-romantic text-3xl text-rose-700 block">Com todo meu coração,</span>
              <div className="flex justify-center mt-1">
                <Heart className="w-5 h-5 text-love-red fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/90 backdrop-blur-md border-t border-rose-100 flex items-center gap-3 shrink-0">
          <button className="flex-1 bg-love-red hover:bg-rose-700 text-white h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 transition-all active:scale-95">
            <Heart className="w-5 h-5 fill-white" />
            Responder com Carinho
          </button>
          <button className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 transition-colors hover:bg-rose-100">
            <Quote className="w-5 h-5" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};


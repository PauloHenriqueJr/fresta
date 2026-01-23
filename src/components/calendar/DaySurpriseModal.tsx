import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, Heart, Copy, Ticket, Play, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DaySurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  content?: {
    type: "text" | "photo" | "gif" | "link";
    message?: string;
    url?: string;
    label?: string;
  };
  theme?: string;
}

const DaySurpriseModal = ({
  isOpen,
  onClose,
  day,
  content,
  theme = "default",
}: DaySurpriseModalProps) => {
  const { toast } = useToast();
  const getGradientClass = () => {
    switch (theme) {
      case "carnaval":
        return "bg-gradient-carnaval";
      case "saojoao":
        return "bg-gradient-saojoao";
      case "namoro":
      case "noivado":
      case "bodas":
        return "bg-gradient-romance";
      case "casamento":
        return "bg-gradient-wedding";
      default:
        return "bg-gradient-festive";
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "namoro":
      case "noivado":
      case "bodas":
      case "casamento":
        return <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Heart className="w-12 h-12 text-white/90 mx-auto mb-3" /></motion.div>;
      default:
        return <Gift className="w-12 h-12 text-primary-foreground mx-auto mb-3" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto theme-${theme}`}
            initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="bg-card rounded-3xl shadow-elevated overflow-hidden">
              {/* Header with day number */}
              <div
                className={`${getGradientClass()} p-6 text-center relative overflow-hidden`}
              >
                {/* Sparkle effects */}
                <Sparkles className="absolute top-4 left-4 w-6 h-6 text-white/30 animate-pulse" />
                <Sparkles className="absolute top-6 right-6 w-4 h-4 text-white/40 animate-pulse" />
                <Sparkles className="absolute bottom-4 left-8 w-5 h-5 text-white/30 animate-pulse" />

                {getIcon()}
                <h2 className="text-3xl font-extrabold text-primary-foreground">
                  PORTA {day.toString().padStart(2, "0")}
                </h2>
                <p className="text-primary-foreground/80 mt-1">
                  Surpresa disponível!
                </p>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 relative bg-background/50 backdrop-blur-sm">
                {/* Decorative background motifs */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-primary rounded-full" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 border-[15px] border-accent rounded-full" />
                </div>
                {content?.type === "text" && (
                  <div className="text-center">
                    <p className="text-foreground font-medium text-lg leading-relaxed">
                      {content.message}
                    </p>
                  </div>
                )}

                {(content?.type === "photo" || content?.type === "gif") && (
                  <div className="space-y-4 text-center">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-muted group">
                      {/* Video Embed Support */}
                      {content.url?.includes('youtube.com') || content.url?.includes('youtu.be') ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${content.url.includes('youtu.be') ? content.url.split('/').pop() : new URLSearchParams(new URL(content.url).search).get('v')}`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : content.url?.includes('tiktok.com') ? (
                        // TikTok embed is tricky due to their scripts, we'll try a simple iframe of the video if possible or a better preview
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#010101] to-[#25F4EE]/20">
                          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border border-white/20">
                            <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                          </div>
                          <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Vídeo no TikTok</p>
                          <a
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-10"
                          />
                        </div>
                      ) : (content.url?.includes('instagram.com/reels') || content.url?.includes('instagram.com/p/')) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border border-white/40">
                            <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                          </div>
                          <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Reels no Instagram</p>
                          <a
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-10"
                          />
                        </div>
                      ) : (
                        <img
                          src={content.url}
                          alt={`Surpresa Porta ${day}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex flex-col items-center justify-center h-full p-6 text-center">
                                  <div class="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-destructive"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                  </div>
                                  <p class="text-xs font-bold text-destructive">Não conseguimos abrir este arquivo aqui.</p>
                                  <p class="text-[10px] text-muted-foreground mt-1 mb-4 italic">Pode ser um vídeo ou link externo.</p>
                                  <a href="${content.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-[10px] font-black uppercase text-foreground transition-all">
                                    Abrir em nova aba
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                  </a>
                                </div>
                              `;
                            }
                          }}
                        />
                      )}
                    </div>
                    {content.message && (
                      <p className="text-muted-foreground font-medium italic">
                        "{content.message}"
                      </p>
                    )}
                    {(content.url?.includes('tiktok.com') || content.url?.includes('instagram.com')) && (
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-muted/50 hover:bg-muted rounded-2xl text-xs font-black uppercase transition-all"
                      >
                        Abrir no App Original
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {content?.type === "link" && (
                  <div className="space-y-4 text-center">
                    {content.message && (
                      <p className="text-foreground font-medium mb-4">
                        {content.message}
                      </p>
                    )}

                    {/* Se o label for "CUPOM" ou similar, mostra estilo de cupom premium */}
                    {(content.label?.toUpperCase().includes("CUPOM") || content.url?.toUpperCase().includes("BLO")) ? (
                      <div className="space-y-6">
                        <div className="bg-primary/5 border-2 border-dashed border-primary/40 rounded-3xl p-8 relative overflow-hidden group">
                          {/* Ticket notches */}
                          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-card rounded-full shadow-inner" />
                          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-card rounded-full shadow-inner" />

                          <Ticket className="w-10 h-10 text-primary/20 absolute top-2 right-2 rotate-12 group-hover:rotate-0 transition-transform" />

                          <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">Vale Especial</p>
                            <span className="text-3xl font-black text-primary tracking-widest uppercase drop-shadow-sm">
                              {content.url.split('/').pop()?.toUpperCase() || "CUPOM"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(content.url);
                            toast({ title: "Copiado!", description: "Cupom pronto para usar. ❤️", duration: 2000 });
                          }}
                          className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-primary text-primary-foreground rounded-3xl font-black shadow-elevated hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                          <Copy className="w-6 h-6" />
                          COPIAR MEU PRESENTE
                        </button>
                      </div>
                    ) : (
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg hover:grayscale-[0.2] active:scale-95 transition-all"
                      >
                        <Sparkles className="w-5 h-5" />
                        {content.label || "Abrir Link"}
                      </a>
                    )}
                  </div>
                )}

                {!content && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      🎊 Parabéns! Você abriu a porta do dia {day}!
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Volte amanhã para mais surpresas.
                    </p>
                  </div>
                )}

                {/* Action button */}
                <motion.button
                  className="w-full bg-primary text-primary-foreground font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                  onClick={onClose}
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98, translateY: 0 }}
                >
                  Continuar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DaySurpriseModal;

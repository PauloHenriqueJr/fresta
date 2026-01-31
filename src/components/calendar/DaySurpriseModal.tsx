import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, Heart, Copy, Ticket, Play, ExternalLink, Music, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DaySurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  content?: {
    type: "text" | "photo" | "gif" | "link" | "image" | "video" | "music";
    message?: string;
    url?: string;
    label?: string;
    title?: string;
  };
  theme?: string;
  isTemplate?: boolean;
}

import { LoveLetterModal, CarnavalTicketModal, BirthdayCardModal, SaoJoaoBarracaModal, PascoaEggModal, ReveillonFireworksModal } from "@/lib/themes/themeComponents";

const DaySurpriseModal = ({
  isOpen,
  onClose,
  day,
  content,
  theme = "default",
  isTemplate = false,
}: DaySurpriseModalProps) => {
  const { toast } = useToast();

  if (theme === "aniversario") {
    return (
      <BirthdayCardModal
        isOpen={isOpen}
        onClose={onClose}
        content={{
          type: content?.type === "text" ? "text" : "image",
          title: `Porta ${day}`,
          message: content?.message || "",
          mediaUrl: content?.url,
        }}
      />
    )
  }

  if (theme === "saojoao") {
    return (
      <SaoJoaoBarracaModal
        isOpen={isOpen}
        onClose={onClose}
        content={{
          type: content?.type === "text" ? "text" : "image",
          title: `Janela ${day}`,
          message: content?.message || "",
          mediaUrl: content?.url,
        }}
      />
    )
  }

  if (theme === "pascoa") {
    return (
      <PascoaEggModal
        isOpen={isOpen}
        onClose={onClose}
        content={{
          type: content?.type === "text" ? "text" : "image",
          title: `Ovo ${day}`,
          message: content?.message || "",
          mediaUrl: content?.url,
        }}
      />
    )
  }

  if (theme === "reveillon") {
    return (
      <ReveillonFireworksModal
        isOpen={isOpen}
        onClose={onClose}
        content={{
          type: content?.type === "text" ? "text" : "image",
          title: `Janela ${day}`,
          message: content?.message || "",
          mediaUrl: content?.url,
        }}
      />
    )
  }

  const getGradientClass = () => {
    switch (theme) {
      case "carnaval":
        return "bg-gradient-to-br from-[#6A0DAD] via-[#FF007F] to-[#FFD700]";
      case "saojoao":
        return "bg-gradient-to-br from-[#FF4500] to-[#FFD700]";
      case "namoro":
      case "noivado":
      case "casamento":
      case "bodas":
        return "bg-gradient-romance";
      case "aniversario":
        return "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500";
      default:
        return "bg-gradient-festive";
    }
  };

  const getButtonClass = () => {
    switch (theme) {
      case "carnaval":
        return "bg-purple-600 hover:bg-purple-700 text-white";
      case "saojoao":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      case "aniversario":
        return "bg-sky-500 hover:bg-sky-600 text-white";
      case "namoro":
      case "noivado":
      case "casamento":
      case "bodas":
        return "bg-rose-500 hover:bg-rose-600 text-white";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "carnaval":
      case "saojoao":
        return <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Ticket className="w-8 h-8 md:w-12 md:h-12 text-white/90 mx-auto mb-3 drop-shadow-md" /></motion.div>;
      case "namoro":
      case "noivado":
      case "bodas":
      case "casamento":
        return <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Heart className="w-8 h-8 md:w-12 md:h-12 text-white/90 mx-auto mb-3" /></motion.div>;
      case "aniversario":
        return <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><PartyPopper className="w-8 h-8 md:w-12 md:h-12 text-white/90 mx-auto mb-3 drop-shadow-md" /></motion.div>;
      default:
        return <Gift className="w-8 h-8 md:w-12 md:h-12 text-primary-foreground mx-auto mb-3" />;
    }
  };

  if (isTemplate) {
    // Force a generic "Explore Template" design for strangers
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-foreground/60 backdrop-blur-md z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] max-w-sm mx-auto"
              initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
            >
              <div className="bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
                {/* Dynamic Gradient Header */}
                <div className={`p-8 text-center relative ${getGradientClass()}`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20">
                    {getIcon()}
                  </div>
                  <h2 className="text-2xl font-black text-white drop-shadow-sm">Visualização</h2>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">Modelo de Exemplo</p>

                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="p-8 text-center space-y-6">
                  <p className="text-foreground/80 font-medium leading-relaxed">
                    Este é um modelo do tema <span className="font-black text-primary">"{theme}"</span>.
                  </p>
                  <div className="bg-muted/50 rounded-2xl p-4 border border-border/5">
                    <p className="text-xs text-muted-foreground italic">
                      {theme === 'carnaval' ? '"Prepare-se para a folia! Aqui você pode adicionar fotos da galera, vídeos do bloquinho e mensagens divertidas! 🎉🎭"' :
                        theme === 'saojoao' ? '"Olha a cobra! É mentira! 🐍 Aqui vai ter foto de quadrilha, correio elegante e muita canjica virtual! 🌽🔥"' :
                          theme === 'aniversario' ? '"Parabéns! Aqui você pode colocar mensagens de carinho, retrospectiva de fotos e desejos para o novo ciclo! 🎂🎈"' :
                            (theme === 'namoro' || theme === 'casamento' || theme === 'noivado') ? '"No seu calendário, você poderá colocar mensagens carinhosas, fotos ou vídeos especiais aqui! ❤️"' :
                              '"No seu calendário, você poderá colocar mensagens carinhosas, fotos de momentos especiais ou vídeos favoritos aqui! ✨"'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => window.location.href = '#/criar'}
                      className={`w-full font-black py-4 rounded-2xl shadow-glow hover:scale-[1.02] transition-all ${getButtonClass()}`}
                    >
                      CRIAR MEU CALENDÁRIO
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full mt-3 text-muted-foreground text-xs font-bold uppercase tracking-widest"
                    >
                      Continuar Explorando
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (theme === "carnaval" || theme === "saojoao") {
    return (
      <CarnavalTicketModal
        isOpen={isOpen}
        onClose={onClose}
        theme={theme}
        content={{
          type: content?.type === "text" ? "text" : "image",
          title: `Porta ${day}`,
          message: content?.message || "",
          mediaUrl: content?.url,
        }}
      />
    );
  }

  if (theme === "namoro") {
    return (
      <LoveLetterModal
        isOpen={isOpen}
        onClose={onClose}
        content={{
          type: content?.type === "text" ? "text" : "image",
          title: `Porta ${day}`,
          message: content?.message || "",
          mediaUrl: content?.url,
        }}
      />
    );
  }



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
            className={`fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto max-h-[85vh] flex flex-col theme-${theme}`}
            initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className={`rounded-3xl shadow-elevated overflow-hidden flex flex-col h-full ${theme === 'aniversario' ? 'bg-[#F0F9FF] border-4 border-white' : 'bg-card'}`}>
              {/* Header with day number - FIXED */}
              <div
                className={`${getGradientClass()} p-6 text-center relative overflow-hidden shrink-0`}
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

              {/* Content - SCROLLABLE */}
              <div className="p-8 relative bg-background/50 backdrop-blur-sm overflow-y-auto overscroll-contain">
                {/* Decorative background motifs */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-primary rounded-full" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 border-[15px] border-accent rounded-full" />
                </div>
                {content?.type === "text" && (
                  <div className="text-center">
                    {theme === 'aniversario' ? (
                      <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-sky-100 relative overflow-hidden mx-2 my-2 group hover:scale-[1.01] transition-transform duration-500">
                        {/* Birthday Card Pattern */}
                        <div className="absolute inset-0 opacity-[0.4]" style={{
                          backgroundImage: "radial-gradient(#7dd3fc 2px, transparent 2px), radial-gradient(#fcd34d 2px, transparent 2px)",
                          backgroundSize: "30px 30px",
                          backgroundPosition: "0 0, 15px 15px"
                        }}></div>

                        {/* Decorative Corner Ribbons */}
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-sky-100 rotate-45"></div>
                        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-sky-100 rotate-45"></div>

                        <div className="relative z-10">
                          <p className={`text-sky-950 font-medium text-2xl leading-relaxed mb-6 font-festive drop-shadow-sm`}>
                            "{content.message}"
                          </p>

                          <div className="flex justify-center gap-4 mt-2">
                            <span className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🎂</span>
                            <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🥳</span>
                            <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground font-medium text-lg leading-relaxed">
                        {content.message}
                      </p>
                    )}
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
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#010101] to-[#25F4EE]/20 text-white">
                          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border border-white/20">
                            <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                          </div>
                          <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Vídeo no TikTok</p>
                          <a
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold transition-all border border-white/20"
                          >
                            Ver no TikTok ↗
                          </a>
                        </div>
                      ) : (content.url?.includes('instagram.com/reels') || content.url?.includes('instagram.com/reel/') || content.url?.includes('instagram.com/p/')) ? (
                        <div className="w-full h-full relative bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
                          <iframe
                            src={`${content.url.split('?')[0]}${content.url.endsWith('/') ? '' : '/'}embed/`}
                            className="w-full h-full bg-white opacity-0 transition-opacity duration-700"
                            onLoad={(e) => (e.target as any).classList.remove('opacity-0')}
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white pointer-events-none group-hover:pointer-events-auto">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/40 shadow-xl group-hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-white fill-current" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-center px-4 mb-4 drop-shadow-md">Se o perfil for privado, abra no app para ver</p>
                            <a
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 shadow-xl active:scale-95 pointer-events-auto"
                            >
                              Ver no Instagram ↗
                            </a>
                          </div>
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

                {content?.type === "music" && (
                  <div className="space-y-6 text-center pb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center mx-auto mb-2 border border-[#1DB954]/20">
                      <Music className="w-8 h-8 text-[#1DB954]" />
                    </div>

                    {content.message && (
                      <p className="text-foreground font-medium text-lg leading-relaxed px-2">
                        "{content.message}"
                      </p>
                    )}

                    {content.url && (content.url.includes('spotify.com')) && (() => {
                      const match = content.url.match(/open\.spotify\.com\/(?:[a-zA-Z-]+\/)?(track|playlist|album)\/([a-zA-Z0-9]+)/);
                      if (match) {
                        return (
                          <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-black animate-in fade-in zoom-in duration-500">
                            <iframe
                              src={`https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`}
                              width="100%"
                              height="152"
                              frameBorder="0"
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                              className="w-full"
                              loading="lazy"
                            />
                          </div>
                        );
                      }
                      return (
                        <a
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 p-6 bg-muted/50 hover:bg-muted rounded-2xl transition-all"
                        >
                          <Music className="w-6 h-6 text-[#1DB954]" />
                          <span className="font-bold text-foreground">Ouvir no Spotify</span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      );
                    })()}

                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-4 opacity-70">
                      Trilha Sonora Especial
                    </p>
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
                  className={`w-full font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mt-6 ${getButtonClass()}`}
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

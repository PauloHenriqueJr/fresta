import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  ExternalLink,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Como criar um calendário?",
    answer:
      "Toque no botão 'Criar Novo' na tela principal, escolha um tema festivo, defina o nome e a duração, e comece a adicionar surpresas em cada porta!",
  },
  {
    question: "Posso editar um calendário depois de criado?",
    answer:
      "Sim! Acesse 'Meus Calendários', selecione o calendário desejado e toque em qualquer porta para editar seu conteúdo.",
  },
  {
    question: "Como compartilhar meu calendário?",
    answer:
      "Vá até as Configurações do seu calendário e copie o link exclusivo. Você também pode compartilhar diretamente pelo WhatsApp, Instagram ou gerar um QR Code.",
  },
  {
    question: "O que está incluído no plano Premium?",
    answer:
      "O Premium desbloqueia calendários ilimitados, remove o branding, oferece templates exclusivos, exportação em PDF/imagem e analytics detalhado.",
  },
  {
    question: "Posso cancelar minha assinatura?",
    answer:
      "Sim, você pode cancelar a qualquer momento nas configurações da conta. O acesso Premium permanece até o fim do período pago.",
  },
];

const Ajuda = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaq = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Premium Hero - Welcoming */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F] pb-24 pt-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 right-[5%] w-32 h-32 bg-[#F9A03F]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-5 left-[10%] w-24 h-24 bg-[#4ECDC4]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-sm hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
            </motion.button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-2">
                <HelpCircle className="w-3 h-3 text-solidroad-accent" />
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Suporte Fresta</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Central de <span className="text-solidroad-accent">Ajuda</span>
              </h1>
            </div>
          </div>

          <p className="text-lg text-white/60 font-medium max-w-md">
            Tem alguma dúvida? Estamos aqui para garantir que sua experiência seja mágica.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl -mt-10 relative z-20 pb-24">
        {/* Floating Search Style from Explorar */}
        <motion.div
          className="bg-card rounded-[2rem] shadow-xl p-5 md:p-6 flex items-center gap-4 border border-border/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-solidroad-accent/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-solidroad-accent" />
            </div>
            <input
              type="text"
              placeholder="Qual sua dúvida hoje?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-bold text-lg"
            />
          </div>
        </motion.div>

        <div className="mt-12 space-y-12">
          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xs font-black text-[#5A7470]/50 uppercase tracking-[0.3em] mb-6 ml-1">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {filteredFaq.map((item, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "bg-card rounded-3xl border border-border/10 shadow-sm overflow-hidden transition-all duration-300",
                    expandedIndex === index ? "shadow-xl border-solidroad-accent/20 ring-4 ring-solidroad-accent/5" : "hover:border-solidroad-accent/10"
                  )}
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left group"
                  >
                    <span className={cn("font-black text-lg transition-colors", expandedIndex === index ? "text-foreground" : "text-muted-foreground/60 group-hover:text-foreground")}>
                      {item.question}
                    </span>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      expandedIndex === index ? "bg-solidroad-accent text-solidroad-text rotate-180" : "bg-muted text-muted-foreground"
                    )}>
                      <ChevronDown className="w-5 h-5 stroke-[3px]" />
                    </div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedIndex === index ? "auto" : 0,
                      opacity: expandedIndex === index ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2">
                      <div className="p-5 rounded-2xl bg-muted/30 text-foreground font-medium leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {filteredFaq.length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-[#FFF8E8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#F9A03F]" />
                </div>
                <p className="font-bold text-[#5A7470]">Nenhum resultado para sua busca...</p>
              </div>
            )}
          </motion.section>

          {/* Contact Section - Solid Cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xs font-black text-[#5A7470]/50 uppercase tracking-[0.3em] mb-6 ml-1">
              Fale Conosco
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-card border border-border/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-solidroad-green dark:bg-solidroad-green-dark text-[#2D7A5F] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-black text-foreground text-lg mb-1">WhatsApp</p>
                  <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">Suporte Humanizado</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground/20 group-hover:text-solidroad-accent transition-colors" />
              </button>

              <button className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-card border border-border/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-solidroad-turquoise dark:bg-solidroad-turquoise-dark text-[#1B4D3E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-black text-foreground text-lg mb-1">E-mail</p>
                  <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">Respostas em até 24h</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground/20 group-hover:text-solidroad-accent transition-colors" />
              </button>
            </div>
          </motion.section>

          {/* App Version */}
          <div className="text-center pt-8 border-t border-[rgba(0,0,0,0.04)]">
            <div className="inline-flex px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
              Versão do Sistema: 2.1.0-PREMIUM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ajuda;

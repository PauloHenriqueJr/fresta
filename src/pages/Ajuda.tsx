import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header
        className="px-4 py-4 lg:py-10 flex items-center gap-4 max-w-[1600px] lg:mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="lg:hidden w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-foreground">Ajuda e Suporte</h1>
          <p className="hidden lg:block text-sm text-muted-foreground">Estamos aqui para tirar suas dúvidas</p>
        </div>
      </motion.header>

      <div className="px-4 space-y-8 max-w-[1600px] lg:mx-auto pt-2 lg:pt-0 pb-12">
        {/* Search */}
        <motion.div
          className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar dúvidas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </motion.div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {filteredFaq.map((item, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-2xl shadow-card overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-foreground pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedIndex === index ? "auto" : 0,
                    opacity: expandedIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm text-muted-foreground">
                    {item.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-foreground mb-4">Fale Conosco</h2>
          <div className="space-y-3">
            <button className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-foreground">WhatsApp</p>
                <p className="text-xs text-muted-foreground">
                  Resposta rápida em horário comercial
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-foreground">E-mail</p>
                <p className="text-xs text-muted-foreground">
                  suporte@calendario.com.br
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.section>

        {/* App Version */}
        <motion.div
          className="text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Versão do App: 1.0.0</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Ajuda;

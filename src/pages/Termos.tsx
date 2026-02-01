import { motion } from "framer-motion";
import { ArrowLeft, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Termos = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-6 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center gap-4 mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-foreground">Termos de Uso</h1>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">As regras do jogo</p>
                    </div>
                </header>

                <div className="bg-card rounded-[2rem] p-8 lg:p-12 shadow-card border border-border/50 prose prose-slate max-w-none">
                    <div className="flex items-center gap-3 mb-8 text-primary">
                        <Scale className="w-8 h-8" />
                        <span className="font-black text-xl italic">Fresta: Termos e Condições</span>
                    </div>

                    <section className="space-y-6 text-muted-foreground leading-relaxed">
                        <p>
                            Ao utilizar o serviço <strong>Fresta</strong>, você concorda com os seguintes termos e condições. Recomendamos a leitura atenta antes de começar a criar seus calendários mágicos.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">1. Uso do Serviço</h2>
                        <p>
                            O Fresta é uma plataforma para criação de calendários interativos. Você é o único responsável pelo conteúdo que publica em seus calendários e deve garantir que possui os direitos das imagens e textos utilizados.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">2. Proibições</h2>
                        <p>
                            É estritamente proibido o uso do Fresta para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Disseminar conteúdo ilegal, violento ou de ódio.</li>
                            <li>Praticar qualquer forma de assédio ou phishing.</li>
                            <li>Violar direitos autorais de terceiros.</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">3. Planos e Pagamentos</h2>
                        <p>
                            Oferecemos versões gratuitas e planos Premium. O acesso Premium confere funcionalidades extras por um período determinado. Não realizamos estornos após a utilização das funcionalidades pagas.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">4. Modificações</h2>
                        <p>
                            Reservamo-nos o direito de modificar o serviço ou estes termos a qualquer momento, visando a melhoria contínua da experiência.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">5. Comunicações e Marketing</h2>
                        <p>
                            Ao aceitar estes termos e utilizar nossos formulários de cadastro ou login (como o Google Login), você concorda expressamente em receber comunicações eletrônicas, newsletters e materiais de marketing do <strong>Fresta</strong>. Utilizamos seu e-mail para enviar atualizações sobre seus presentes, dicas de uso e ofertas especiais. Você poderá cancelar a inscrição a qualquer momento através do link de "descadastro" presente em nossos e-mails.
                        </p>

                        <div className="mt-12 pt-8 border-t border-border/50 italic text-sm">
                            Última atualização: Fevereiro de 2026.
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Termos;

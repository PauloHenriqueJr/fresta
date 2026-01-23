import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacidade = () => {
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
                        <h1 className="text-3xl font-black tracking-tighter text-foreground">Política de Privacidade</h1>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Sua segurança é nossa prioridade</p>
                    </div>
                </header>

                <div className="bg-card rounded-[2rem] p-8 lg:p-12 shadow-card border border-border/50 prose prose-slate max-w-none">
                    <div className="flex items-center gap-3 mb-8 text-primary">
                        <Shield className="w-8 h-8" />
                        <span className="font-black text-xl italic">Privacidade Fresta</span>
                    </div>

                    <section className="space-y-6 text-muted-foreground leading-relaxed">
                        <p>
                            Na <strong>Fresta</strong>, levamos a sério a sua privacidade e a segurança dos seus dados. Esta política descreve como coletamos, usamos e protegemos as informações fornecidas por você ao usar nosso serviço de calendários de surpresas.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">1. Coleta de Informações</h2>
                        <p>
                            Coletamos apenas o essencial para o funcionamento do serviço: seu endereço de e-mail para autenticação e os conteúdos (textos, imagens, links) que você escolhe inserir em seus calendários.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">2. Uso de Dados</h2>
                        <p>
                            Seus dados são usados exclusivamente para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Permitir o acesso e a gestão dos seus calendários.</li>
                            <li>Entregar os links mágicos de acesso.</li>
                            <li>Melhorar a experiência do usuário através de análises anônimas.</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">3. Proteção e Compartilhamento</h2>
                        <p>
                            Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins publicitários. Utilizamos o <strong>Supabase</strong> para armazenamento seguro e criptografia de ponta a ponta em transações críticas.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">4. Seus Direitos</h2>
                        <p>
                            Você pode, a qualquer momento, solicitar a exclusão da sua conta e de todos os dados associados a ela através das configurações do seu perfil.
                        </p>

                        <div className="mt-12 pt-8 border-t border-border/50 italic text-sm">
                            Última atualização: Janeiro de 2026.
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacidade;

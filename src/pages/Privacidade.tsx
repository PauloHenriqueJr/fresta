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
                            Na <strong>Fresta</strong>, levamos a sério a sua privacidade e a segurança dos seus dados. Esta política descreve como coletamos, usamos e protegemos as informações fornecidas por você ao usar nosso serviço de calendários de contagem regressiva interativos.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">1. Dados que coletamos</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Endereço de e-mail:</strong> usado para criar e acessar sua conta.</li>
                            <li><strong>Conteúdo criado:</strong> textos, links, fotos e vídeos que você adiciona aos seus calendários.</li>
                            <li><strong>Dados de uso:</strong> visualizações e interações com calendários.</li>
                            <li><strong>Dados de compra:</strong> histórico de transações in-app, processados pelo RevenueCat e Apple.</li>
                            <li><strong>Identificador de dispositivo:</strong> usado pelo RevenueCat para gerenciar compras.</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">2. Como usamos seus dados</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Autenticar sua conta e manter sua sessão ativa.</li>
                            <li>Armazenar e exibir seus calendários criados.</li>
                            <li>Processar pagamentos e verificar acesso premium.</li>
                            <li>Melhorar a experiência do aplicativo.</li>
                            <li>Enviar notificações sobre seus calendários (se autorizado).</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">3. Serviços de terceiros</h2>
                        <p>Não vendemos seus dados. Utilizamos os seguintes serviços:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Supabase</strong> — banco de dados e autenticação</li>
                            <li><strong>RevenueCat</strong> — gerenciamento de compras in-app</li>
                            <li><strong>Apple App Store</strong> — distribuição e pagamentos</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">4. Armazenamento e segurança</h2>
                        <p>
                            Seus dados são armazenados em servidores seguros com criptografia em trânsito (HTTPS) e em repouso. Imagens e vídeos enviados ficam em buckets privados com acesso controlado.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">5. Seus direitos (LGPD)</h2>
                        <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Acessar os dados que temos sobre você.</li>
                            <li>Solicitar a correção de dados incorretos.</li>
                            <li>Solicitar a exclusão da sua conta e todos os dados associados.</li>
                            <li>Revogar o consentimento a qualquer momento.</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">6. Retenção de dados</h2>
                        <p>
                            Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar exclusão, todos os dados pessoais são removidos em até 30 dias.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">7. Contato</h2>
                        <p>
                            Dúvidas ou solicitações sobre seus dados:<br />
                            <strong>StorySpark Tecnologia</strong><br />
                            E-mail: <a href="mailto:contato@storyspark.com.br" className="text-primary hover:underline">contato@storyspark.com.br</a>
                        </p>

                        <div className="mt-12 pt-8 border-t border-border/50 italic text-sm">
                            Última atualização: 2 de março de 2026.
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacidade;

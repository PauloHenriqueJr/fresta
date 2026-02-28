import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExclusaoDados = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-6 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <motion.header
                    className="flex items-center gap-4 mb-12"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-foreground">Exclusão de Dados</h1>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Seus dados, seu controle</p>
                    </div>
                </motion.header>

                <motion.div
                    className="bg-card rounded-[2rem] p-8 lg:p-12 shadow-card border border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-8 text-destructive">
                        <Trash2 className="w-8 h-8" />
                        <span className="font-black text-xl italic">Política de Exclusão — Fresta</span>
                    </div>

                    <section className="space-y-6 text-muted-foreground leading-relaxed">
                        <p>
                            Na <strong>Fresta</strong>, você tem total controle sobre seus dados pessoais. Esta página explica
                            como solicitamos e processamos pedidos de exclusão de dados de usuários do aplicativo e da plataforma web.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">1. Dados que Coletamos</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Dados de conta:</strong> endereço de e-mail e nome de exibição.</li>
                            <li><strong>Conteúdo criado:</strong> calendários, textos das portas, URLs de vídeos.</li>
                            <li><strong>Mídias enviadas:</strong> fotos e GIFs carregados para os calendários.</li>
                            <li><strong>Dados de uso:</strong> portas abertas, visualizações e curtidas (dados anônimos).</li>
                            <li><strong>Dados de pagamento:</strong> processados pelo AbacatePay e RevenueCat — não armazenamos dados de cartão.</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">2. Como Solicitar a Exclusão</h2>
                        <p>
                            Você pode solicitar a exclusão completa da sua conta e de todos os dados associados de <strong>três formas</strong>:
                        </p>
                        <ol className="list-decimal pl-6 space-y-3">
                            <li>
                                <strong>Pelo App ou Web:</strong> acesse <em>Perfil {'>'} Configurações {'>'} Excluir minha conta</em>.
                                A exclusão é imediata e irreversível.
                            </li>
                            <li>
                                <strong>Por e-mail:</strong> envie uma solicitação para{" "}
                                <a
                                    href="mailto:elmineirodev@gmail.com"
                                    className="text-primary underline underline-offset-4 hover:opacity-70"
                                >
                                    elmineirodev@gmail.com
                                </a>{" "}
                                com o assunto <em>"Solicitação de Exclusão de Dados"</em> e o e-mail cadastrado na conta.
                            </li>
                            <li>
                                <strong>Via formulário:</strong> caso prefira, você pode descrever sua solicitação em nosso canal
                                de suporte com o título "Exclusão de Dados".
                            </li>
                        </ol>

                        <h2 className="text-xl font-black text-foreground pt-4">3. O que é Excluído</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Perfil de usuário (e-mail, nome, avatar).</li>
                            <li>Todos os calendários e conteúdos criados.</li>
                            <li>Mídias armazenadas nos buckets do Supabase Storage.</li>
                            <li>Histórico de portas abertas e curtidas vinculadas à conta.</li>
                            <li>Assinaturas ativas (o acesso Premium encerra junto com a conta).</li>
                        </ul>

                        <h2 className="text-xl font-black text-foreground pt-4">4. Prazo de Processamento</h2>
                        <p>
                            Solicitações via e-mail são processadas em até <strong>30 dias corridos</strong>.
                            Após a confirmação, todos os dados são removidos permanentemente de nossos sistemas e backups
                            ativos dentro desse prazo. Dados retidos por obrigação legal (ex.: registros fiscais de transações)
                            são mantidos pelo período exigido por lei e depois excluídos.
                        </p>

                        <h2 className="text-xl font-black text-foreground pt-4">5. Dados de Terceiros</h2>
                        <p>
                            Dados processados pelo <strong>RevenueCat</strong> (compras in-app) e <strong>AbacatePay</strong> (PIX) são
                            regidos pelas políticas de privacidade desses serviços. Nossa exclusão de conta não afeta registros
                            mantidos por essas plataformas para fins de conformidade financeira.
                        </p>

                        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="italic text-sm">Última atualização: Fevereiro de 2026.</p>
                            <button
                                onClick={() => navigate("/privacidade")}
                                className="text-sm font-bold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                                Ver Política de Privacidade completa →
                            </button>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default ExclusaoDados;

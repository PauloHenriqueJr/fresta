import { motion } from "framer-motion";
import { ArrowLeft, Mail, Building2, Send, DoorOpen, Sparkles, Loader2, ChevronRight, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import mascotLoginHeader from "@/assets/mascot-login-header.png";

const Contato = () => {
    const navigate = useNavigate();
    const [imageReady, setImageReady] = useState(false);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        company: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = mascotLoginHeader;
        img.onload = () => setImageReady(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const { error: dbError } = await (supabase
                .from('contact_requests') as any)
                .insert([{
                    name: formState.name,
                    email: formState.email,
                    company: formState.company,
                    message: formState.message
                }]);

            if (dbError) throw dbError;
            setSent(true);
        } catch (err: any) {
            console.error("Contato: Error submitting form:", err);
            setError("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-solidroad-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 p-2 rounded-full bg-card border border-border/10 shadow-sm text-muted-foreground hover:text-primary transition-colors z-50 lg:top-8 lg:left-8 lg:bg-white/80 lg:backdrop-blur-md"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-full max-w-[1100px] bg-card rounded-[3rem] shadow-2xl min-h-[650px] grid lg:grid-cols-2 border border-border/10 relative overflow-hidden">

                {/* Lado Esquerdo - Visual (Desktop Only) */}
                <div className="hidden lg:block relative bg-solidroad-beige dark:bg-black/20 overflow-hidden border-r border-border/10">
                    <div className="relative z-20 p-16 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 group w-fit mb-12 absolute top-12 left-12">
                            <div className="w-12 h-12 rounded-2xl bg-solidroad-accent flex items-center justify-center text-2xl shadow-glow text-solidroad-text">
                                <DoorOpen className="w-6 h-6" />
                            </div>
                            <span className="font-black text-3xl text-solidroad-text dark:text-white tracking-tight">Fresta</span>
                        </div>

                        <div className="relative z-10">
                            <h1 className="text-6xl font-black text-solidroad-text dark:text-white leading-[1.05] mb-8 tracking-tighter">
                                Vamos criar algo <br />
                                <span className="text-solidroad-accent shadow-glow">incrível?</span>
                            </h1>
                            <p className="text-muted-foreground text-xl font-medium max-w-sm leading-relaxed">
                                Transforme o engajamento da sua equipe com calendários personalizados e experiências memoráveis.
                            </p>
                        </div>
                    </div>

                    {/* Decorative mascot in background (transparent/subtle) */}
                    <img
                        src={mascotLoginHeader}
                        alt=""
                        className="absolute bottom-0 right-0 w-80 opacity-10 grayscale pointer-events-none translate-y-1/4 translate-x-1/4"
                    />
                </div>

                {/* Lado Direito - Form Contato */}
                <div className={`flex flex-col justify-center p-8 lg:p-16 relative bg-card transition-all duration-700 ${imageReady ? 'opacity-100' : 'opacity-0'}`}>

                    {/* Floating mascot on Mobile */}
                    <div className="lg:hidden absolute -top-[120px] left-1/2 -translate-x-1/2 z-10 w-48 pointer-events-none">
                        <img src={mascotLoginHeader} alt="Mascote" className="w-full drop-shadow-2xl" />
                    </div>

                    <div className="max-w-md mx-auto w-full">
                        {sent ? (
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Send className="w-12 h-12 text-primary" />
                                </div>
                                <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Mensagem Enviada!</h2>
                                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                    Nossa equipe comercial recebeu sua solicitação e entrará em contato em breve para apresentar o Fresta Corporativo.
                                </p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="w-full py-5 bg-solidroad-accent text-solidroad-text font-black rounded-2xl shadow-xl shadow-solidroad-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow"
                                >
                                    VOLTAR AO INÍCIO
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="text-center lg:text-left mb-10">
                                    <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-3 tracking-tighter">Contato Corporativo</h2>
                                    <p className="text-muted-foreground font-medium">Preencha os dados e entraremos em contato.</p>
                                </div>

                                {error && (
                                    <div className="p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-solidroad-accent transition-colors">Seu Nome</label>
                                            <input
                                                required
                                                value={formState.name}
                                                onChange={e => setFormState({ ...formState, name: e.target.value })}
                                                className="w-full p-4 bg-background dark:bg-black/20 border-2 border-transparent rounded-2xl text-foreground font-bold focus:outline-none focus:bg-card focus:border-solidroad-accent/20 transition-all"
                                                placeholder="Nome"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-solidroad-accent transition-colors">Empresa</label>
                                            <input
                                                required
                                                value={formState.company}
                                                onChange={e => setFormState({ ...formState, company: e.target.value })}
                                                className="w-full p-4 bg-background dark:bg-black/20 border-2 border-transparent rounded-2xl text-foreground font-bold focus:outline-none focus:bg-card focus:border-solidroad-accent/20 transition-all"
                                                placeholder="Sua Org"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-solidroad-accent transition-colors">Email Corporativo</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-solidroad-accent transition-colors" />
                                            <input
                                                required
                                                type="email"
                                                value={formState.email}
                                                onChange={e => setFormState({ ...formState, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-background dark:bg-black/20 border-2 border-transparent rounded-2xl text-foreground font-bold focus:outline-none focus:bg-card focus:border-solidroad-accent/20 transition-all"
                                                placeholder="exemplo@empresa.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-solidroad-accent transition-colors">Mensagem</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground/40 group-focus-within:text-solidroad-accent transition-colors" />
                                            <textarea
                                                required
                                                rows={4}
                                                value={formState.message}
                                                onChange={e => setFormState({ ...formState, message: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-background dark:bg-black/20 border-2 border-transparent rounded-2xl text-foreground font-bold focus:outline-none focus:bg-card focus:border-solidroad-accent/20 transition-all resize-none"
                                                placeholder="Como podemos ajudar?"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-5 bg-gradient-to-r from-primary to-green-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                ENVIANDO...
                                            </>
                                        ) : (
                                            <>
                                                SOLICITAR APRESENTAÇÃO <ChevronRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contato;

import { motion } from "framer-motion";
import { ArrowLeft, Mail, MessageSquare, Building2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Contato = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        company: "",
        message: ""
    });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        // Real implementation would send data here
    };

    return (
        <div className="min-h-screen bg-background pb-24 lg:flex lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-background lg:via-background lg:to-amber-500/5">
            <div className="w-full lg:max-w-[700px] lg:mx-auto">
                <motion.header
                    className="px-4 py-4 flex items-center gap-4 lg:mb-8 lg:p-0"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:bg-muted transition-colors lg:bg-white"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-foreground lg:text-3xl lg:font-black lg:tracking-tighter">Contato Corporativo</h1>
                        <p className="text-xs text-muted-foreground lg:text-sm lg:font-medium">Transforme a jornada dos seus colaboradores</p>
                    </div>
                </motion.header>

                <div className="px-4 lg:px-0">
                    <motion.div
                        className="bg-card rounded-[2.5rem] p-8 shadow-card border border-border/50 lg:p-12 lg:bg-white lg:shadow-2xl lg:shadow-amber-500/5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {sent ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-10 h-10 text-amber-600" />
                                </div>
                                <h2 className="text-3xl font-black text-foreground mb-4">Mensagem Enviada!</h2>
                                <p className="text-muted-foreground mb-8">
                                    Nossa equipe comercial entrará em contato com você em breve para apresentar o Fresta Corporativo.
                                </p>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-10 py-4 bg-amber-500 text-white font-black rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                                >
                                    VOLTAR
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-2">Seu Nome</label>
                                        <input
                                            required
                                            value={formState.name}
                                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                                            className="w-full p-4 bg-background border-2 border-border rounded-2xl focus:border-amber-500 outline-none transition-all lg:bg-muted/30"
                                            placeholder="Nome completo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-2">Email Corporativo</label>
                                        <input
                                            required
                                            type="email"
                                            value={formState.email}
                                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                                            className="w-full p-4 bg-background border-2 border-border rounded-2xl focus:border-amber-500 outline-none transition-all lg:bg-muted/30"
                                            placeholder="exemplo@empresa.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-2">Empresa</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                        <input
                                            required
                                            value={formState.company}
                                            onChange={e => setFormState({ ...formState, company: e.target.value })}
                                            className="w-full p-4 pl-12 bg-background border-2 border-border rounded-2xl focus:border-amber-500 outline-none transition-all lg:bg-muted/30"
                                            placeholder="Nome da sua organização"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-2">Como podemos ajudar?</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formState.message}
                                        onChange={e => setFormState({ ...formState, message: e.target.value })}
                                        className="w-full p-4 bg-background border-2 border-border rounded-2xl focus:border-amber-500 outline-none transition-all lg:bg-muted/30 resize-none"
                                        placeholder="Conte-nos um pouco sobre sua necessidade (ex: engajamento de colaboradores, datas comemorativas...)"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-lg rounded-[1.5rem] shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    SOLICITAR APRESENTAÇÃO <ChevronRight className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Simple Chevron for the button since it's common
const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export default Contato;

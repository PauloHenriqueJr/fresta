import { Save, Image as ImageIcon, Link as LinkIcon, Type, Smartphone, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CorporateEditor() {
    return (
        <div className="space-y-8 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
                        Editor de Conteúdo
                    </h1>
                    <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
                        Personalize as mensagens e recompensas de cada etapa da jornada
                    </p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F6D045] text-[#0E220E] font-bold transition-all hover:shadow-lg active:scale-95">
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl p-6 md:p-8 border border-border/10 bg-white dark:bg-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">Configuração da Porta #1</h2>
                            <span className="px-3 py-1 rounded-full bg-[#F6D045]/10 text-[#2D7A5F] dark:text-[#F6D045] text-xs font-bold uppercase tracking-wider">Boas-vindas</span>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Título da Etapa</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-border/10 bg-[#F9F9F9] dark:bg-white/5 text-[#0E220E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F6D045]/20 font-semibold"
                                    defaultValue="Boas-vindas à nossa Jornada!"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Conteúdo da Mensagem</label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border border-border/10 bg-[#F9F9F9] dark:bg-white/5 text-[#0E220E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F6D045]/20 font-medium leading-relaxed"
                                    defaultValue="Estamos muito felizes em ter você aqui. Hoje vamos iniciar um novo capítulo em nossa história..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-border/5 dark:border-white/5 bg-[#F9F9F9] dark:bg-white/5 text-sm font-bold text-[#0E220E] dark:text-white/80 hover:border-[#F6D045]/40 transition-all">
                                    <ImageIcon className="w-5 h-5 text-[#F6D045]" />
                                    Mídia (Imagem/Vídeo)
                                </button>
                                <button className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-border/5 dark:border-white/5 bg-[#F9F9F9] dark:bg-white/5 text-sm font-bold text-[#0E220E] dark:text-white/80 hover:border-[#F6D045]/40 transition-all">
                                    <LinkIcon className="w-5 h-5 text-[#4ECDC4]" />
                                    Botão de Call-to-Action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-border/10 bg-white dark:bg-white/5 overflow-hidden">
                        <div className="p-4 border-b border-border/5 flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Preview Mobile</span>
                        </div>
                        <div className="p-6 bg-[#F9F9F9] dark:bg-black/20 flex justify-center">
                            {/* Visual Mock of iPhone Frame */}
                            <div className="w-[260px] aspect-[9/19] rounded-[2.5rem] border-8 border-[#0E220E] dark:border-[#163316] bg-white dark:bg-[#0E220E] relative shadow-2xl overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0E220E] dark:bg-[#163316] rounded-b-2xl z-10" />

                                <div className="p-6 pt-12 flex flex-col items-center text-center space-y-4">
                                    <motion.div
                                        className="w-16 h-16 rounded-2xl bg-[#F6D045] flex items-center justify-center shadow-lg"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <Sparkles className="w-8 h-8 text-[#0E220E]" />
                                    </motion.div>
                                    <h4 className="text-lg font-black text-[#0E220E] dark:text-white leading-tight">Boas-vindas!</h4>
                                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed">Clique para abrir sua primeira recompensa da jornada...</p>

                                    <div className="w-full h-24 rounded-xl bg-muted/30 dark:bg-white/5 border border-dashed border-border" />
                                    <div className="w-full py-2 rounded-lg bg-[#F6D045] text-[#0E220E] text-[10px] font-black uppercase">Começar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl p-6 border border-border/10 bg-[#F6D045]/5 dark:bg-[#F6D045]/2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#F6D045] mb-2">Dica de Especialista</h4>
                        <p className="text-xs text-[#0E220E]/70 dark:text-white/50 leading-relaxed">
                            Mantenha os títulos curtos e impactantes para garantir melhor leitura em dispositivos móveis.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Sparkles = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
    </svg>
);

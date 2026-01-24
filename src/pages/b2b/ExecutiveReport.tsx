import { Download, FileText, TrendingUp, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ExecutiveReport() {
    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
                        Relatório Executivo
                    </h1>
                    <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
                        Visão estratégica consolidada para tomada de decisão
                    </p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0E220E] dark:bg-[#F6D045] text-white dark:text-[#0E220E] font-bold transition-all hover:shadow-lg active:scale-95">
                    <Download className="w-5 h-5" />
                    Exportar Relatório
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    className="rounded-2xl p-8 border border-border/10 bg-white dark:bg-white/5 flex flex-col items-center text-center group transition-all hover:bg-[#F6D045]/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 rounded-2xl bg-[#F6D045]/10 flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                        <TrendingUp className="w-10 h-10 text-[#0E220E] dark:text-[#F6D045]" />
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground/60 dark:text-white/40 uppercase tracking-widest mb-2">Engajamento Médio</h3>
                    <p className="text-6xl font-black text-[#0E220E] dark:text-white mb-6">87.4%</p>
                    <p className="text-sm text-muted-foreground/50 max-w-[300px]">
                        Dos colaboradores interagiram com mais de 70% das notificações enviadas na última campanha.
                    </p>
                </motion.div>

                <motion.div
                    className="rounded-2xl p-8 border border-border/10 bg-white dark:bg-white/5 flex flex-col items-center text-center group transition-all hover:bg-[#2D7A5F]/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                        <Users className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground/60 dark:text-white/40 uppercase tracking-widest mb-2">Alcance Organizacional</h3>
                    <p className="text-6xl font-black text-[#0E220E] dark:text-white mb-6">1.42k</p>
                    <p className="text-sm text-muted-foreground/50 max-w-[300px]">
                        Colaboradores únicos alcançados em todos os departamentos e canais de comunicação integrados.
                    </p>
                </motion.div>
            </div>

            <div className="rounded-2xl p-6 md:p-8 border border-border/10 bg-white dark:bg-white/5">
                <h2 className="text-xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045] mb-8">Destaques Estratégicos</h2>
                <div className="space-y-4">
                    {[
                        { text: "Pico de acesso consolidado entre 08:45 e 09:30 AM.", type: "time" },
                        { text: "Adesão de 94% ao tema de 'Inovação e Processos'.", type: "trend" },
                        { text: "Dispositivos mobile representam 72% de todo o tráfego.", type: "device" }
                    ].map((insight, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-border/5 bg-[#F9F9F9] dark:bg-white/5 group transition-all hover:translate-x-2">
                            <div className="w-10 h-10 rounded-lg bg-[#F6D045] flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-[#0E220E]" />
                            </div>
                            <p className="text-sm font-bold text-[#0E220E]/80 dark:text-white/80 flex-1">{insight.text}</p>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { Upload, FileSpreadsheet, Send, UserPlus, X, Download } from "lucide-react";
import { B2BRepository } from "@/lib/data/B2BRepository";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BulkInvite() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMember, setNewMember] = useState({ name: "", email: "" });
    const orgId = "00000000-0000-0000-0000-000000000000";

    useEffect(() => {
        B2BRepository.getMembers(orgId)
            .then(setMembers)
            .finally(() => setLoading(false));
    }, []);

    const handleInvite = async () => {
        if (!newMember.name || !newMember.email) return;
        try {
            await B2BRepository.inviteMember(orgId, { ...newMember, role: 'editor' });
            toast.success("Convite enviado!");
            setMembers([{ ...newMember, status: 'invited' }, ...members]);
            setNewMember({ name: "", email: "" });
        } catch (err) {
            toast.error("Erro ao enviar.");
        }
    };

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
                    Convite em Massa
                </h1>
                <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
                    Importe sua base de colaboradores e automatize o acesso
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <motion.div
                        className="rounded-[2.5rem] p-10 md:p-12 border-2 border-dashed border-border/10 bg-white dark:bg-white/5 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-solidroad-accent/40 hover:bg-solidroad-accent/5 transition-all shadow-sm"
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="w-20 h-20 rounded-[1.5rem] bg-solidroad-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-10 h-10 text-solidroad-accent" strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-black text-solidroad-text dark:text-white mb-2">Upload de Arquivo</h3>
                        <p className="text-sm text-muted-foreground/60 mb-8 max-w-[280px] font-medium leading-relaxed">Arraste seu arquivo .CSV ou .XLSX aqui para importar os dados da sua equipe.</p>
                        <button className="px-8 py-4 bg-solidroad-accent text-solidroad-text text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">Selecionar Arquivo</button>
                    </motion.div>

                    <div className="p-6 rounded-[2rem] bg-solidroad-accent/10 border border-solidroad-accent/20 flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-solidroad-accent flex items-center justify-center shrink-0 shadow-md">
                            <FileSpreadsheet className="w-6 h-6 text-solidroad-text" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                            <p className="text-base font-bold text-solidroad-text dark:text-white/90">Layout Esperado</p>
                            <p className="text-sm text-solidroad-text/60 dark:text-white/40 mt-1 leading-relaxed">
                                O arquivo deve conter: <span className="font-black text-solidroad-text dark:text-white">NOME, EMAIL, DEPARTAMENTO</span>.
                            </p>
                            <button className="text-xs font-black text-solidroad-text/80 dark:text-solidroad-accent underline mt-4 flex items-center gap-1 hover:opacity-80 uppercase tracking-wider">
                                <Download className="w-3 h-3" /> Baixar Template .CSV
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-[2.5rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 flex flex-col shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-2 h-8 rounded-full bg-solidroad-accent block" />
                        <h3 className="text-2xl font-black text-solidroad-text dark:text-white">Convite Individual</h3>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Nome do Colaborador</label>
                            <input
                                type="text"
                                className="w-full px-5 py-3 rounded-2xl border border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white focus:outline-none focus:ring-2 focus:ring-solidroad-accent/20 font-bold placeholder:font-normal transition-all"
                                placeholder="João Silva"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">E-mail Corporativo</label>
                            <input
                                type="email"
                                className="w-full px-5 py-3 rounded-2xl border border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white focus:outline-none focus:ring-2 focus:ring-solidroad-accent/20 font-bold placeholder:font-normal transition-all"
                                placeholder="joao@empresa.com"
                                value={newMember.email}
                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleInvite}
                        className="w-full mt-10 py-4 bg-solidroad-accent text-solidroad-text font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] hover:-translate-y-0.5"
                    >
                        <Send className="w-4 h-4 stroke-[3px]" />
                        Enviar Convite
                    </button>

                    <div className="mt-10 pt-8 border-t border-dashed border-border/10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Últimos Enviados</span>
                            <div className="px-3 py-1 rounded-lg bg-[#F9F9F9] dark:bg-white/5 text-[10px] font-bold text-solidroad-text/60 dark:text-white/40 uppercase cursor-pointer hover:bg-muted transition-colors">
                                Ver Histórico
                            </div>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="animate-pulse space-y-2">
                                    <div className="h-4 bg-muted/50 rounded w-3/4" />
                                    <div className="h-4 bg-muted/50 rounded w-1/2" />
                                </div>
                            ) : members.length === 0 ? (
                                <div className="py-6 text-center bg-[#F9F9F9] dark:bg-white/5 rounded-2xl">
                                    <UserPlus className="w-6 h-6 mx-auto text-muted-foreground/30 mb-2" />
                                    <p className="text-xs text-muted-foreground/40 font-medium">Nenhum convite recente.</p>
                                </div>
                            ) : members.slice(0, 3).map((m, i) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-[#F9F9F9] dark:bg-white/5 border border-border/5 hover:border-solidroad-accent/10 transition-all">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-solidroad-text dark:text-white truncate">{m.email}</p>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground/40 mt-0.5">{m.name || 'Sem nome'}</p>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2D7A5F] dark:text-[#5DBF94] bg-solidroad-green dark:bg-solidroad-green-dark px-3 py-1.5 rounded-lg border border-[#2D7A5F]/10">
                                        {m.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

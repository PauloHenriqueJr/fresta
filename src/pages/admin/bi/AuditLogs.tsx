import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Search, Shield, User, Filter } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";

export default function AuditLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        AdminRepository.getAuditLogs()
            .then(setLogs)
            .catch((err) => {
                console.error("AuditLogs fetch error:", err);
                setLogs([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredLogs = logs.filter(l =>
        l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Logs de Auditoria</h1>
                    <p className="text-muted-foreground">Rastreabilidade completa de todas as ações administrativas.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar ação ou detalhe..."
                            className="bg-muted/50 border-border/40 rounded-xl pl-9 pr-4 py-2 text-xs font-bold w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-muted/50 border border-border/40 text-muted-foreground hover:bg-muted transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/40 bg-muted/30">
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Admin / Usuário</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Ação</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Detalhes</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Gravidade</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Data/Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center italic text-muted-foreground">Carregando logs...</td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center italic text-muted-foreground">Nenhuma atividade registrada.</td>
                                </tr>
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{log.profiles?.display_name || "Sistema"}</p>
                                                <p className="text-[10px] text-muted-foreground">{log.ip_address || "Internal"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-black uppercase tracking-tight text-primary">{log.action}</td>
                                    <td className="p-4 text-sm font-medium text-foreground/80">{log.details}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${log.severity === 'critical' ? 'bg-rose-500/10 text-rose-600' :
                                            log.severity === 'warning' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'
                                            }`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground font-medium">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

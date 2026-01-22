import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download, Cloud, Clock, RefreshCw, Trash2, Database } from "lucide-react";
import { toast } from "sonner";

export default function BackupManager() {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [backups, setBackups] = useState([
        { id: '1', date: "22/01/2026 14:30", size: "2.4 MB", type: "Full", status: "Succeeded" },
        { id: '2', date: "21/01/2026 03:00", size: "2.1 MB", type: "Full", status: "Succeeded" },
        { id: '3', date: "20/01/2026 03:00", size: "1.9 MB", type: "Incremental", status: "Succeeded" },
    ]);

    const handleNewBackup = () => {
        setIsBackingUp(true);
        toast.info("Iniciando backup completo do banco de dados...");
        setTimeout(() => {
            const newBackup = {
                id: Date.now().toString(),
                date: new Date().toLocaleString(),
                size: "2.5 MB",
                type: "Full",
                status: "Succeeded"
            };
            setBackups([newBackup, ...backups]);
            setIsBackingUp(false);
            toast.success("Backup realizado com sucesso!");
        }, 3000);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Gerenciador de Backups</h1>
                    <p className="text-muted-foreground">Segurança total: snapshots manuais e rotinas de salvamento em nuvem.</p>
                </div>
                <button
                    onClick={handleNewBackup}
                    disabled={isBackingUp}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                    {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                    Novo Snapshot
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 flex items-center gap-4">
                    <Database className="w-8 h-8 text-primary" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Tamanho do Banco</p>
                        <p className="text-2xl font-black">12.4 MB</p>
                    </div>
                </Card>
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 flex items-center gap-4">
                    <Clock className="w-8 h-8 text-indigo-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Frequência Auto</p>
                        <p className="text-2xl font-black">24 Horas</p>
                    </div>
                </Card>
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Status Rotina</p>
                        <p className="text-2xl font-black">Seguro</p>
                    </div>
                </Card>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-xl font-black">Lista de Snapshots</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border/40">
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Data/Hora</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Tamanho</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Tipo</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {backups.map((bkp) => (
                                    <tr key={bkp.id} className="hover:bg-muted/20">
                                        <td className="p-4 text-sm font-bold">{bkp.date}</td>
                                        <td className="p-4 text-sm font-medium text-muted-foreground">{bkp.size}</td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">{bkp.type}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" title="Baixar">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20" title="Excluir">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ShieldCheck({ className }: { className?: string }) {
    return <Clock className={className} />; // Re-using for breadcrumb
}

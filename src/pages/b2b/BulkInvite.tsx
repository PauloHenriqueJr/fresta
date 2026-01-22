import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Send, UserPlus } from "lucide-react";
import { B2BRepository } from "@/lib/data/B2BRepository";
import { toast } from "sonner";

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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">Convite em Massa</h1>
                <p className="text-muted-foreground">Importe seus colaboradores via CSV ou Excel para liberar o acesso.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm border-dashed border-2 p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-primary/5 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-black mb-2">Upload de Arquivo</h3>
                        <p className="text-sm font-medium text-muted-foreground mb-6">Arraste seu .CSV ou .XLSX aqui ou clique para procurar.</p>
                        <button className="px-6 py-2.5 bg-muted text-foreground text-xs font-black rounded-xl uppercase tracking-widest border border-border/40">Selecionar Arquivo</button>
                    </Card>

                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex gap-4">
                        <FileSpreadsheet className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            Certifique-se que o arquivo possui as colunas: <span className="font-black">NOME, EMAIL, DEPARTAMENTO</span>.
                            <button className="underline ml-2">Baixar Template</button>
                        </p>
                    </div>
                </div>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-black">Convite Individual</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nome do Colaborador</label>
                                <input
                                    type="text"
                                    className="w-full bg-background/50 border border-border/40 rounded-xl px-4 py-2.5 text-sm font-bold"
                                    placeholder="Ex: João da Silva"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail Corporativo</label>
                                <input
                                    type="email"
                                    className="w-full bg-background/50 border border-border/40 rounded-xl px-4 py-2.5 text-sm font-bold"
                                    placeholder="joao@empresa.com.br"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleInvite}
                            className="w-full py-3 bg-primary text-white text-xs font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Enviar Convite
                        </button>
                        <div className="pt-6 mt-6 border-t border-border/10">
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                                <span>Últimos Enviados</span>
                                <UserPlus className="w-4 h-4" />
                            </div>
                            <div className="space-y-3">
                                {loading ? (
                                    <p className="text-[10px] text-muted-foreground italic">Carregando...</p>
                                ) : members.length === 0 ? (
                                    <p className="text-[10px] text-muted-foreground italic">Nenhum enviado.</p>
                                ) : members.map((m, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm font-bold">
                                        <span>{m.email}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-emerald-500">{m.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

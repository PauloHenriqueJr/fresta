import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, Search, Trash2, Users, ExternalLink } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";

export default function B2BClients() {
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrgs = async () => {
        setLoading(true);
        try {
            const data = await AdminRepository.getB2BOrgs();
            setOrgs(data);
        } catch (err) {
            toast.error("Erro ao carregar empresas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta organização removerá todos os membros e campanhas vinculados. Confirmar?")) return;
        try {
            await AdminRepository.deleteOrg(id);
            toast.success("Organização removida");
            fetchOrgs();
        } catch (err) {
            toast.error("Erro ao remover organização");
        }
    };

    const filteredOrgs = orgs.filter(o =>
        o.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Empresas (B2B)</h1>
                    <p className="text-muted-foreground">Gestão de contas corporativas e portais de RH.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar empresa..."
                        className="bg-muted/50 border-border/40 rounded-xl pl-9 pr-4 py-2 text-xs font-bold w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Carregando...</p>
                ) : filteredOrgs.length === 0 ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Nenhuma empresa encontrada.</p>
                ) : filteredOrgs.map((org) => (
                    <Card key={org.id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight">{org.name}</h3>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">ID: {org.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(org.id)}
                                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-border/10 pt-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Membros</p>
                                    <div className="flex items-center justify-center gap-1.5 font-black text-foreground">
                                        <Users className="w-3 h-3 text-indigo-500" />
                                        {org.b2b_members?.[0]?.count || 0}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Status</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">Ativo</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Cor Primária</p>
                                    <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: `hsl(${org.primary_hue || 220}, 70%, 50%)` }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

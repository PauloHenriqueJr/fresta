import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Trash2, Mail, Calendar, Search, Filter } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";

export default function B2CCustomers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await AdminRepository.getUsers();
            setUsers(data);
        } catch (err) {
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.")) return;
        try {
            await AdminRepository.deleteUser(id);
            toast.success("Usuário removido");
            fetchUsers();
        } catch (err) {
            toast.error("Erro ao remover usuário");
        }
    };

    const filteredUsers = users.filter(u =>
        u.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Clientes B2C</h1>
                    <p className="text-muted-foreground">Gestão de usuários finais e assinantes individuais.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar nome ou e-mail..."
                            className="bg-muted/50 border-border/40 rounded-xl pl-9 pr-4 py-2 text-xs font-bold w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Carregando usuários...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Nenhum usuário encontrado.</p>
                ) : filteredUsers.map((user) => (
                    <Card key={user.id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight">{user.display_name || "Usuário"}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex justify-between items-center bg-background/30 p-4 rounded-2xl border border-border/10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Plano Atual</p>
                                    <p className="text-sm font-black text-primary uppercase">{user.subscriptions?.[0]?.status === 'active' ? 'Assinante Pro' : 'Gratuito'}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Membro desde</p>
                                    <p className="text-xs font-bold">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Trash2, Mail, Calendar, Search, Filter } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, ShieldCheck, UserCog } from "lucide-react";

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

    const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await AdminRepository.deleteUser(userToDelete.id);
            toast.success("Usuário removido");
            setUserToDelete(null);
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-card border-border/50 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">
                                            Gestão de Usuário
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group"
                                        >
                                            <UserCog className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-bold">Gerenciar Perfil</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group"
                                        >
                                            <ShieldCheck className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-bold">Mudar Plano</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-border/50 my-2" />
                                        <DropdownMenuItem
                                            onClick={() => setUserToDelete({ id: user.id, name: user.display_name || user.email })}
                                            className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-rose-500/10 text-rose-500 transition-colors group"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="text-sm font-bold">Remover Usuário</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent className="bg-card border-border/50 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-sm">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 mx-auto">
                            <Trash2 className="w-8 h-8 text-rose-500" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-center text-foreground tracking-tight">
                            Remover Cliente?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-muted-foreground font-medium pt-2">
                            Você está prestes a remover <span className="text-foreground font-black">"{userToDelete?.name}"</span>. Esta ação é irreversível e removerá todos os dados vinculados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-3 mt-8">
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="w-full rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black py-6 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                        >
                            Confirmar Remoção
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full rounded-2xl border-border bg-background hover:bg-muted font-bold py-6">
                            Cancelar
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

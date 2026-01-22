import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Building2, Trash2, Calendar as CalIcon, Loader2 } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uData, oData] = await Promise.all([
        AdminRepository.getUsers().catch(() => []),
        AdminRepository.getB2BOrgs().catch(() => [])
      ]);
      setUsers(uData);
      setOrgs(oData);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Excluir este usuário? Isso pode afetar seus calendários.")) return;
    try {
      await AdminRepository.deleteUser(id);
      toast.success("Usuário removido");
      fetchData();
    } catch (err) {
      toast.error("Erro ao remover usuário");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Gestão de Clientes</h1>
        <p className="text-muted-foreground">Controle total de Usuários B2C e Organizações B2B.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users List */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Usuários (B2C)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? <Loader2 className="animate-spin mx-auto my-8 text-primary" /> :
              users.length === 0 ? <p className="text-xs italic text-muted-foreground text-center py-8">Nenhum usuário encontrado.</p> :
                users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/10 hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                        {user.avatar || '👤'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{user.display_name || user.email}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteUser(user.id)} className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
            }
          </CardContent>
        </Card>

        {/* Orgs List */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Organizações (B2B)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? <Loader2 className="animate-spin mx-auto my-8 text-primary" /> :
              orgs.length === 0 ? <p className="text-xs italic text-muted-foreground text-center py-8">Nenhuma organização cadastrada.</p> :
                orgs.map(org => (
                  <div key={org.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{org.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{org.plan || 'Plano Pro'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full">Ativo</span>
                      <button onClick={() => AdminRepository.deleteOrg(org.id).then(fetchData)} className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

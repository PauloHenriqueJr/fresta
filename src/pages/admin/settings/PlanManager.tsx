import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Shield, Zap, Edit3, Save, X, Power, PowerOff } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PlanManager() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>(null);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await AdminRepository.getPlans();
            setPlans(data);
        } catch (err) {
            toast.error("Erro ao carregar planos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const startEditing = (plan: any) => {
        setEditingId(plan.id);
        setEditData({ ...plan });
    };

    const handleSave = async () => {
        try {
            await AdminRepository.updatePlan(editingId!, {
                price_cents: editData.price_cents,
                name: editData.name,
                status: editData.status
            });
            toast.success("Plano atualizado!");
            setEditingId(null);
            fetchPlans();
        } catch (err) {
            toast.error("Erro ao salvar");
        }
    };

    const handleToggleStatus = async (plan: any) => {
        try {
            const newStatus = plan.status === 'active' ? 'inactive' : 'active';
            await AdminRepository.updatePlan(plan.id, { status: newStatus });
            toast.success(`Plano ${newStatus === 'active' ? 'ativado' : 'desativado'}`);
            fetchPlans();
        } catch (err) {
            toast.error("Erro ao mudar status");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">Gestão de Planos</h1>
                <p className="text-muted-foreground">Configure os preços, recursos e disponibilidade dos planos de assinatura.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Carregando planos...</p>
                ) : plans.length === 0 ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Nenhum plano disponível.</p>
                ) : plans.map((plan) => (
                    <Card key={plan.id} className={`border-border/40 bg-card/50 backdrop-blur-sm relative group overflow-hidden ${plan.status === 'inactive' ? 'opacity-60' : ''}`}>
                        {plan.name === 'Pro' && <div className="absolute top-0 right-0 bg-primary text-[8px] font-black p-1 px-3 uppercase text-white -rotate-12 translate-x-4 translate-y-2">Mais Popular</div>}

                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl ${plan.name === 'Gratuito' ? 'bg-muted text-muted-foreground' : plan.name === 'Pro' ? 'bg-primary/20 text-primary' : 'bg-indigo-500/20 text-indigo-500'}`}>
                                    {plan.name === 'Gratuito' ? <Activity className="w-6 h-6" /> : plan.name === 'Pro' ? <Zap className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(plan)}
                                        className={`p-2 rounded-lg transition-all ${plan.status === 'active' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}
                                    >
                                        {plan.status === 'active' ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                                    </button>
                                    <button
                                        onClick={() => editingId === plan.id ? handleSave() : startEditing(plan)}
                                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all transition-all"
                                    >
                                        {editingId === plan.id ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                                    </button>
                                    {editingId === plan.id && (
                                        <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                {editingId === plan.id ? (
                                    <Input
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="text-2xl font-black bg-background/50"
                                    />
                                ) : (
                                    <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
                                )}
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{plan.interval}</p>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-muted-foreground">R$</span>
                                {editingId === plan.id ? (
                                    <Input
                                        type="number"
                                        value={editData.price_cents / 100}
                                        onChange={(e) => setEditData({ ...editData, price_cents: parseFloat(e.target.value) * 100 })}
                                        className="text-4xl font-black bg-background/50 w-32"
                                    />
                                ) : (
                                    <span className="text-4xl font-black">{(plan.price_cents / 100).toFixed(2)}</span>
                                )}
                                <span className="text-xs font-bold text-muted-foreground">/mês</span>
                            </div>

                            <ul className="space-y-3">
                                {(plan.features as string[] || []).map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

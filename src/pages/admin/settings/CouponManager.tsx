import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TicketPercent, Plus, Trash2, Power, PowerOff } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { MoreVertical, Copy, RotateCcw } from "lucide-react";

export default function CouponManager() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discount_percent: 10,
        usage_limit: 100,
        is_active: true
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await AdminRepository.getCoupons();
            setCoupons(data);
        } catch (err) {
            console.error("Coupons fetch error:", err);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreate = async () => {
        if (!newCoupon.code) return toast.error("Código é obrigatório");
        try {
            await AdminRepository.createCoupon(newCoupon);
            toast.success("Cupom criado com sucesso!");
            setIsDialogOpen(false);
            setNewCoupon({ code: "", discount_percent: 10, usage_limit: 100, is_active: true });
            fetchCoupons();
        } catch (err) {
            toast.error("Erro ao criar cupom");
        }
    };

    const [couponToDelete, setCouponToDelete] = useState<{ id: string, code: string } | null>(null);

    const handleDelete = async () => {
        if (!couponToDelete) return;
        try {
            await AdminRepository.deleteCoupon(couponToDelete.id);
            toast.success("Cupom excluído");
            setCouponToDelete(null);
            fetchCoupons();
        } catch (err) {
            toast.error("Erro ao excluir");
        }
    };

    const handleToggleStatus = async (coupon: any) => {
        try {
            await AdminRepository.updateCoupon(coupon.id, { is_active: !coupon.is_active });
            toast.success(`Cupom ${!coupon.is_active ? 'ativado' : 'desativado'}`);
            fetchCoupons();
        } catch (err) {
            toast.error("Erro ao atualizar status");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Gestão de Cupons</h1>
                    <p className="text-muted-foreground">Crie e gerencie códigos de desconto para promoções.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all uppercase tracking-widest shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" />
                            Novo Cupom
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border/40 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight text-primary">Novo Cupom de Desconto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Código do Cupom</label>
                                <Input
                                    placeholder="EX: FESTA2024"
                                    className="bg-background/50 border-border/40 font-bold uppercase"
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Desconto (%)</label>
                                    <Input
                                        type="number"
                                        className="bg-background/50 border-border/40 font-bold"
                                        value={newCoupon.discount_percent}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_percent: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Limite de Usos</label>
                                    <Input
                                        type="number"
                                        className="bg-background/50 border-border/40 font-bold"
                                        value={newCoupon.usage_limit}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" className="font-black uppercase text-xs tracking-widest" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button className="font-black uppercase text-xs tracking-widest bg-primary hover:bg-primary/90" onClick={handleCreate}>Criar Cupom</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Carregando...</p>
                ) : coupons.length === 0 ? (
                    <p className="col-span-full text-center py-8 italic text-muted-foreground">Nenhum cupom cadastrado.</p>
                ) : coupons.map((coupon) => (
                    <Card key={coupon.id} className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TicketPercent className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg font-black">{coupon.code}</CardTitle>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${coupon.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                }`}>
                                {coupon.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-3xl font-black text-foreground">{coupon.discount_percent}% <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">OFF</span></div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Expiração</p>
                                <p className="text-sm font-black text-foreground">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Nunca'}</p>
                            </div>
                            <div className="pt-4 border-t border-border/10 flex justify-between items-center">
                                <p className="text-xs font-bold text-muted-foreground">{coupon.usage_count} / {coupon.usage_limit} usos</p>
                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-card border-border/50 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">
                                                Ações do Cupom
                                            </DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    navigator.clipboard.writeText(coupon.code);
                                                    toast.success("Código copiado!");
                                                }}
                                                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group"
                                            >
                                                <Copy className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-bold">Copiar Código</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleToggleStatus(coupon)}
                                                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group"
                                            >
                                                {coupon.is_active ? (
                                                    <PowerOff className="w-4 h-4 text-rose-500" />
                                                ) : (
                                                    <Power className="w-4 h-4 text-emerald-500" />
                                                )}
                                                <span className="text-sm font-bold">{coupon.is_active ? 'Desativar Cupom' : 'Ativar Cupom'}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors group"
                                            >
                                                <RotateCcw className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-bold">Resetar Usos</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-border/50 my-2" />
                                            <DropdownMenuItem
                                                onClick={() => setCouponToDelete({ id: coupon.id, code: coupon.code })}
                                                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-rose-500/10 text-rose-500 transition-colors group"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-sm font-bold">Excluir Permanente</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={!!couponToDelete} onOpenChange={(open) => !open && setCouponToDelete(null)}>
                <AlertDialogContent className="bg-card border-border/50 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-sm">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 mx-auto">
                            <Trash2 className="w-8 h-8 text-rose-500" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-center text-foreground tracking-tight">
                            Excluir Cupom?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-muted-foreground font-medium pt-2">
                            Tem certeza que deseja remover o cupom <span className="text-foreground font-black">"{couponToDelete?.code}"</span>? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-3 mt-8">
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="w-full rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black py-6 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                        >
                            Sim, Excluir Cupom
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full rounded-2xl border-border bg-background hover:bg-muted font-bold py-6">
                            Manter Cupom
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

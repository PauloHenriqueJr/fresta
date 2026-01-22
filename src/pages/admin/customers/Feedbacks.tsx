import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Star, Bug, CheckCircle, Archive } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";

export default function Feedbacks() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const data = await AdminRepository.getFeedbacks();
            setFeedbacks(data);
        } catch (err) {
            console.error("Feedbacks fetch error:", err);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await AdminRepository.updateFeedbackStatus(id, status);
            toast.success(`Feedback ${status === 'resolved' ? 'resolvido' : 'arquivado'}`);
            fetchFeedbacks();
        } catch (err) {
            toast.error("Erro ao atualizar feedback");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Gestão de Feedbacks</h1>
                    <p className="text-muted-foreground">Central de escuta ativa: sugestões, bugs e elogios.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <p className="text-center py-8 italic text-muted-foreground">Carregando feedbacks...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-center py-8 italic text-muted-foreground">Nenhum feedback recebido ainda.</p>
                ) : feedbacks.filter(f => f.status !== 'archived').map((f, i) => (
                    <Card key={i} className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardContent className="flex items-start gap-6 pt-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${f.status === 'bug' ? 'bg-festive-red/10 text-festive-red' :
                                f.rating >= 4 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                {f.status === 'bug' ? <Bug className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-black text-foreground">
                                        {f.profiles?.display_name || "Usuário"}
                                        <span className="text-[10px] font-medium text-muted-foreground ml-2">{new Date(f.created_at).toLocaleDateString()}</span>
                                    </p>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`w-3 h-3 ${s <= (f.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-muted/30'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-foreground/80 leading-relaxed">{f.comment}</p>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleStatusUpdate(f.id, 'resolved')}
                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:underline"
                                    >
                                        <CheckCircle className="w-3 h-3" /> Resolvido
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(f.id, 'archived')}
                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:underline"
                                    >
                                        <Archive className="w-3 h-3" /> Arquivar
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

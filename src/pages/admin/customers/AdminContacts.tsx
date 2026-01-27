import { useEffect, useState } from "react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import {
    Mail,
    Building2,
    Calendar,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    MoreVertical,
    ChevronRight,
    User,
    MessageSquare
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminContacts() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await AdminRepository.getContactRequests();
            setRequests(data);
        } catch (err: any) {
            console.error("AdminContacts: Error fetching data:", err);
            setError("Erro ao carregar solicitações de contato.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await AdminRepository.updateContactStatus(id, status);
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
        } catch (err: any) {
            alert("Erro ao atualizar status.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;
        try {
            await AdminRepository.deleteContactRequest(id);
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (err: any) {
            alert("Erro ao excluir solicitação.");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><Clock className="w-3 h-3" /> Novo</span>;
            case 'in_progress':
                return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><Activity className="w-3 h-3" /> Em Atendimento</span>;
            case 'completed':
                return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> Finalizado</span>;
            default:
                return <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full">{status}</span>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Solicitações de Contato</h1>
                    <p className="text-muted-foreground font-medium">Gestão de leads corporativos e parcerias.</p>
                </div>
                <div className="flex bg-card p-1 rounded-2xl border border-border/10">
                    <button onClick={fetchData} className="px-4 py-2 text-xs font-bold hover:bg-muted rounded-xl transition-all">Atualizar</button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold">
                    <AlertCircle className="w-5 h-5" /> {error}
                </div>
            )}

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-card/40 rounded-[2rem] animate-pulse border border-border/10" />
                    ))}
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-card/40 rounded-[2.5rem] border border-dashed border-border/50 p-20 text-center">
                    <Mail className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium italic">Nenhuma solicitação de contato encontrada.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <div key={req.id} className="group relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-[2rem] p-6 hover:border-primary/50 transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-lg text-foreground tracking-tight">{req.name}</h3>
                                            {getStatusBadge(req.status)}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {req.email}</span>
                                            {req.company && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {req.company}</span>}
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {format(new Date(req.created_at), "dd 'de' MMMM", { locale: ptBR })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 flex-1 lg:max-w-md bg-muted/30 p-4 rounded-2xl border border-border/5">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-1">
                                        <MessageSquare className="w-3 h-3" /> Mensagem
                                    </p>
                                    <p className="text-sm text-foreground/80 leading-relaxed italic line-clamp-2 italic">
                                        "{req.message}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 self-end lg:self-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-3 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border/10">
                                            <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Mudar Status</div>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'new')} className="rounded-xl flex gap-2 font-bold focus:bg-blue-500/10 focus:text-blue-500">
                                                <Clock className="w-4 h-4" /> Marcar como Novo
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'in_progress')} className="rounded-xl flex gap-2 font-bold focus:bg-amber-500/10 focus:text-amber-500">
                                                <Activity className="w-4 h-4" /> Em Atendimento
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'completed')} className="rounded-xl flex gap-2 font-bold focus:bg-emerald-500/10 focus:text-emerald-500">
                                                <CheckCircle className="w-4 h-4" /> Marcar como Finalizado
                                            </DropdownMenuItem>
                                            <div className="h-px bg-border/20 my-2" />
                                            <DropdownMenuItem onClick={() => handleDelete(req.id)} className="rounded-xl flex gap-2 font-bold text-red-500 focus:bg-red-500/10 focus:text-red-500">
                                                <Trash2 className="w-4 h-4" /> Excluir Registro
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Mock of Activity icon if it doesn't exist in lucide
const Activity = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

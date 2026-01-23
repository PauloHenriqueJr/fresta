import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Database, Server, Cpu, RefreshCw } from "lucide-react";

export default function SystemHealth() {
    const [uptime, setUptime] = useState("99.98%");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const metrics = [
        { label: "Banco de Dados", value: "Saudável", icon: Database, color: "text-emerald-500" },
        { label: "Processamento Cloud", value: "Ativo", icon: Server, color: "text-emerald-500" },
        { label: "Armazenamento", value: "92% Disponível", icon: Cpu, color: "text-blue-500" },
        { label: "Sincronização", value: "Conectado", icon: Activity, color: "text-emerald-500" },
    ];

    const refreshMetrics = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Integridade do Sistema</h1>
                    <p className="text-muted-foreground">Monitoramento em tempo real dos serviços core do Fresta.</p>
                </div>
                <button
                    onClick={refreshMetrics}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-muted text-foreground text-xs font-black hover:bg-muted/80 transition-all uppercase tracking-widest border border-border/40"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Recarregar Status
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m) => (
                    <Card key={m.label} className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{m.label}</CardTitle>
                            <m.icon className={`w-4 h-4 ${m.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">{m.value}</div>
                            <div className="w-full bg-muted/30 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className={`h-full ${m.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: isRefreshing ? '0%' : '100%' }} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-black">Histórico de Uptime (30 dias)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-1 h-32 items-end">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-emerald-500/60 rounded-t-sm hover:bg-emerald-500 transition-all cursor-pointer group relative"
                                style={{ height: `${85 + Math.random() * 15}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-[8px] text-background rounded font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    22/01/26: 100%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

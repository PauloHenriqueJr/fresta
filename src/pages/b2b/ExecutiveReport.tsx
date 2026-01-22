import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download, FileText, TrendingUp, Users } from "lucide-react";

export default function ExecutiveReport() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Relatório Executivo</h1>
                    <p className="text-muted-foreground">Versão simplificada e elegante para apresentação à diretoria.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all uppercase tracking-widest shadow-lg shadow-primary/20">
                    <Download className="w-4 h-4" />
                    Exportar PDF
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <TrendingUp className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Engajamento Total</h3>
                    <p className="text-5xl font-black text-primary mb-4">87.4%</p>
                    <p className="text-sm font-medium text-muted-foreground max-w-[250px]">
                        Dos colaboradores engajaram com pelo menos 5 portas na última campanha.
                    </p>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Alcance da Rede</h3>
                    <p className="text-5xl font-black text-emerald-500 mb-4">1,420</p>
                    <p className="text-sm font-medium text-muted-foreground max-w-[250px]">
                        Colaboradores ativos e participando das dinâmicas gamificadas.
                    </p>
                </Card>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-black">Principais Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        "O pico de acesso ocorre entre 08:30 e 09:15 da manhã.",
                        "O tema 'Cultura Organizacional' teve 94% de feedbacks positivos.",
                        "Usuários desktop representam 65% do engajamento total."
                    ].map((insight, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/10">
                            <FileText className="w-5 h-5 text-primary mt-0.5" />
                            <p className="text-sm font-bold text-foreground/80">{insight}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

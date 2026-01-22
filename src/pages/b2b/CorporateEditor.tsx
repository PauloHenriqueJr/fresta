import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Save, Image as ImageIcon, Link as LinkIcon, Type } from "lucide-react";

export default function CorporateEditor() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Editor de Conteúdo</h1>
                    <p className="text-muted-foreground">Personalize as mensagens e avisos em cada porta da jornada.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all uppercase tracking-widest">
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-black">Configuração da Porta #1</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Título da Mensagem</label>
                                <input type="text" className="w-full bg-background/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-bold" defaultValue="Boas-vindas à nossa Jornada!" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Conteúdo Interno</label>
                                <textarea rows={6} className="w-full bg-background/50 border border-border/40 rounded-xl px-4 py-3 text-sm font-medium" defaultValue="Estamos muito felizes em ter você aqui. Hoje vamos falar sobre..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-border/40 bg-muted/30 text-xs font-black uppercase tracking-widest hover:bg-muted/50 transition-all">
                                    <ImageIcon className="w-4 h-4" /> Imagem / Vídeo
                                </button>
                                <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-border/40 bg-muted/30 text-xs font-black uppercase tracking-widest hover:bg-muted/50 transition-all">
                                    <LinkIcon className="w-4 h-4" /> Adicionar Link
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Preview Mobile</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 aspect-[9/16] bg-slate-900 relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
                                <div className="w-16 h-16 rounded-2xl bg-primary mb-4 animate-bounce" />
                                <h4 className="text-white text-lg font-black shrink-0">Boas-vindas!</h4>
                                <p className="text-white/60 text-xs mt-2 line-clamp-3">Clique para abrir sua primeira recompensa da jornada...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

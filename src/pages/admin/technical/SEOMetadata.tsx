import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, Globe, Share2, Save, RefreshCcw } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SEOMetadata() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        AdminRepository.getSettings()
            .then(setSettings)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await AdminRepository.updateSettings(settings);
            toast.success("Configurações SEO salvas!");
        } catch (err) {
            toast.error("Erro ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center italic text-muted-foreground">Carregando...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">SEO & Metadados</h1>
                <p className="text-muted-foreground">Configure como o Fresta aparece no Google, Redes Sociais e WhatsApp.</p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3 text-primary">
                                <Search className="w-5 h-5" />
                                <CardTitle className="text-xl font-black text-foreground">Indexação e Busca</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meta Title Global</label>
                                <Input
                                    value={settings?.site_title || ""}
                                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                                    placeholder="Ex: Fresta - Calendários Natalinos Interativos"
                                    className="bg-background/50 border-border/40 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meta Description</label>
                                <Textarea
                                    value={settings?.site_description || ""}
                                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                    rows={4}
                                    placeholder="Descreva seu site para os buscadores..."
                                    className="bg-background/50 border-border/40 font-medium"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3 text-indigo-500">
                                <Share2 className="w-5 h-5" />
                                <CardTitle className="text-xl font-black text-foreground">Open Graph & Social</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Imagem de Compartilhamento (URL)</label>
                                <div className="flex gap-3">
                                    <Input
                                        value={settings?.og_image || ""}
                                        onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                                        placeholder="https://sua-cdn.com/og-image.jpg"
                                        className="bg-background/50 border-border/40 font-medium"
                                    />
                                    <button className="px-4 py-2 bg-muted rounded-xl text-xs font-black uppercase hover:bg-muted/80 transition-all border border-border/20">Preview</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Estado da Publicação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest">Live no Google</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-6 bg-primary font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                    {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}

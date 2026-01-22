import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Lock, Globe, Fingerprint } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { B2BRepository } from "@/lib/data/B2BRepository";
import { toast } from "sonner";

export default function PrivacySettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const orgId = "00000000-0000-0000-0000-000000000000"; // Mock org for demo

    useEffect(() => {
        B2BRepository.getOrgStatus(orgId)
            .then(setSettings)
            .finally(() => setLoading(false));
    }, []);

    const handleUpdate = async (patch: any) => {
        try {
            await B2BRepository.updateOrgSecurity(orgId, patch);
            setSettings({ ...settings, ...patch });
            toast.success("Configuração salva!");
        } catch (err) {
            toast.error("Erro ao salvar.");
        }
    };

    if (loading) return <div className="p-8 text-center italic text-muted-foreground">Carregando...</div>;
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">Segurança e Privacidade</h1>
                <p className="text-muted-foreground">Controle quem pode acessar o conteúdo da sua empresa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary" />
                            <CardTitle className="text-xl font-black">Restrição de Domínio</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm font-medium text-muted-foreground italic">Permitir apenas e-mails terminados em:</p>
                        <div className="flex gap-2">
                            <input type="text" className="flex-1 bg-background/50 border border-border/40 rounded-xl px-4 py-2 text-sm font-bold" defaultValue="@empresa.com.br" />
                            <button className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl uppercase tracking-widest">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {settings?.allowed_domains?.map((d: string) => (
                                <span key={d} className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-widest text-foreground/70 border border-border/20">{d} ×</span>
                            ))}
                            {!settings?.allowed_domains?.length && <p className="text-[10px] text-muted-foreground italic">Nenhum domínio restrito.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-indigo-500" />
                            <CardTitle className="text-xl font-black">SSO / SAML 2.0</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/10">
                            <div>
                                <p className="text-sm font-black">Ativar Autenticação Única</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Azure AD, Okta, Google Workspace</p>
                            </div>
                            <Switch
                                checked={settings?.sso_enabled}
                                onCheckedChange={(val) => handleUpdate({ sso_enabled: val })}
                            />
                        </div>
                        <button className="w-full py-3 rounded-2xl border border-indigo-500/20 text-indigo-500 text-xs font-black hover:bg-indigo-500/5 transition-all uppercase tracking-widest">
                            Configurar Identity Provider
                        </button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-amber-500" />
                            <CardTitle className="text-xl font-black">Proteção de Conteúdo</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <p className="text-sm font-bold">Bloquear Prints</p>
                            <Switch
                                checked={settings?.block_screenshots}
                                onCheckedChange={(val) => handleUpdate({ block_screenshots: val })}
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-bold">Marca D'água Dinâmica</p>
                            <Switch
                                checked={settings?.watermark_enabled}
                                onCheckedChange={(val) => handleUpdate({ watermark_enabled: val })}
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-bold">Expiração de Link</p>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

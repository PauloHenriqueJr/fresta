import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Send, Settings, Save, RefreshCcw } from "lucide-react";
import { AdminRepository } from "@/lib/data/AdminRepository";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TransactionalEmails() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        AdminRepository.getSettings()
            .then(setSettings)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await AdminRepository.updateSettings(settings);
            toast.success("Templates salvos!");
        } catch (err) {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center italic text-muted-foreground">Carregando...</div>;

    const templates = [
        { id: 'welcome', name: "Boas-vindas (B2C)", subject: "Bem-vindo ao Fresta! 🎄", key: 'email_welcome_b2c' },
        { id: 'invite', name: "Convite Colaborador (B2B)", subject: "Você foi convidado para uma jornada 💼", key: 'email_invite_b2b' },
        { id: 'payment', name: "Sucesso no Pagamento", subject: "Sua assinatura Pro está ativa! 🚀", key: 'email_payment_success' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">E-mails Transacionais</h1>
                    <p className="text-muted-foreground">Personalize a comunicação automatizada com seus usuários.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all uppercase tracking-widest"
                >
                    {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar Templates
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {templates.map((tpl) => (
                    <Card key={tpl.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg font-black">{tpl.name}</CardTitle>
                            </div>
                            <Settings className="w-4 h-4 text-muted-foreground cursor-pointer" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assunto</label>
                                <Input
                                    value={settings?.[`${tpl.key}_subject`] || tpl.subject}
                                    onChange={(e) => setSettings({ ...settings, [`${tpl.key}_subject`]: e.target.value })}
                                    className="bg-background/50 border-border/40 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Corpo do E-mail (HTML/Text)</label>
                                <Textarea
                                    rows={6}
                                    value={settings?.[`${tpl.key}_body`] || "Olá, obrigado por usar o Fresta!"}
                                    onChange={(e) => setSettings({ ...settings, [`${tpl.key}_body`]: e.target.value })}
                                    className="bg-background/50 border-border/40 font-medium"
                                />
                            </div>
                            <div className="pt-4 flex justify-between items-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Variáveis: {'{{name}}'}, {'{{link}}'}</p>
                                <button className="flex items-center gap-1.5 text-xs font-black text-primary hover:underline uppercase tracking-widest">
                                    <Send className="w-3.5 h-3.5" /> Enviar Teste
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

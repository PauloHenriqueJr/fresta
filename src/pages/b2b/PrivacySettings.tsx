import { useEffect, useState } from "react";
import { Shield, Lock, Globe, Fingerprint, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { B2BRepository } from "@/lib/data/B2BRepository";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6D045]" />
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
                    Segurança e Privacidade
                </h1>
                <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
                    Controle quem pode acessar o conteúdo da sua empresa
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Domain Restriction */}
                <div className="rounded-[2.5rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 space-y-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-solidroad-accent/10 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-solidroad-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-solidroad-text dark:text-white">Restrição de Domínio</h2>
                            <p className="text-sm text-muted-foreground/60">Controle de acesso por domínio</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-medium text-solidroad-text/80 dark:text-white/80 leading-relaxed">
                            Permitir apenas e-mails corporativos autenticados com os domínios listados abaixo.
                        </p>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                className="flex-1 px-5 py-3 rounded-2xl border border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white focus:outline-none focus:ring-2 focus:ring-solidroad-accent/20 text-sm font-bold placeholder:font-normal"
                                placeholder="@empresa.com"
                            />
                            <button className="px-5 py-3 bg-solidroad-accent text-solidroad-text text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95">
                                Adicionar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {settings?.allowed_domains?.map((d: string) => (
                                <span key={d} className="inline-flex items-center gap-2 px-4 py-2 bg-solidroad-green dark:bg-solidroad-green-dark rounded-xl text-xs font-bold text-[#2D7A5F] dark:text-[#5DBF94] border border-transparent hover:border-[#2D7A5F]/20 transition-all">
                                    {d} <X className="w-3 h-3 opacity-50 cursor-pointer hover:opacity-100 hover:scale-110 transition-transform" />
                                </span>
                            ))}
                            {!settings?.allowed_domains?.length && (
                                <p className="text-xs text-muted-foreground/40 italic pl-1">Nenhum domínio restrito configurado.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SSO Toggle */}
                <div className="rounded-[2.5rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 space-y-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Fingerprint className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-solidroad-text dark:text-white">SSO / SAML 2.0</h2>
                            <p className="text-sm text-muted-foreground/60">Autenticação única corporativa</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-[#F9F9F9] dark:bg-white/5 border border-border/5">
                            <div>
                                <p className="text-sm font-bold text-solidroad-text dark:text-white">Ativar Autenticação Única</p>
                                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mt-1">Azure AD, Okta, Google Workspace</p>
                            </div>
                            <Switch
                                className="data-[state=checked]:bg-solidroad-accent data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-white/10"
                                checked={settings?.sso_enabled}
                                onCheckedChange={(val) => handleUpdate({ sso_enabled: val })}
                            />
                        </div>
                        <button className="w-full py-4 rounded-2xl border-2 border-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black hover:bg-blue-500/5 dark:hover:bg-blue-500/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                            Configurar Identity Provider
                        </button>
                    </div>
                </div>

                {/* Content Protection */}
                <div className="md:col-span-2 rounded-[2.5rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-solidroad-accent/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-solidroad-accent" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-solidroad-text dark:text-white">Proteção de Conteúdo</h2>
                            <p className="text-sm text-muted-foreground/60">Segurança da informação e vazamento de dados</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Bloquear Prints", sub: "Evita capturas de tela", key: "block_screenshots", icon: Shield },
                            { label: "Marca D'água", sub: "ID do usuário no fundo", key: "watermark_enabled", icon: Fingerprint },
                            { label: "Link Expirável", sub: "Válido por 24 horas", key: "expiring_links", icon: Lock }
                        ].map((item) => (
                            <div key={item.label} className="flex flex-row md:flex-col items-center md:items-start justify-between gap-4 p-6 rounded-3xl bg-[#F9F9F9] dark:bg-white/5 border border-border/5 transition-all hover:bg-solidroad-accent/5 hover:border-solidroad-accent/20 group">
                                <div className="flex items-center gap-3 md:mb-4">
                                    <div className="p-2 rounded-xl bg-white dark:bg-white/10 shadow-sm w-fit group-hover:scale-110 transition-transform">
                                        <item.icon className="w-4 h-4 text-solidroad-text/60 dark:text-white/60" />
                                    </div>
                                    <div className="md:hidden">
                                        <p className="text-sm font-bold text-solidroad-text dark:text-white">{item.label}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-base font-bold text-solidroad-text dark:text-white">{item.label}</p>
                                    <p className="text-xs text-muted-foreground/50 font-medium mt-1">{item.sub}</p>
                                </div>
                                <Switch
                                    className="data-[state=checked]:bg-solidroad-accent"
                                    checked={settings?.[item.key] ?? (item.key === "expiring_links")}
                                    onCheckedChange={(val) => item.key !== "expiring_links" && handleUpdate({ [item.key]: val })}
                                    disabled={item.key === "expiring_links"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

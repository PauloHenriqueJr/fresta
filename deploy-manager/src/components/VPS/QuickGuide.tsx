import { FileText, ShieldCheck } from 'lucide-react'

export function QuickGuide() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText className="w-24 h-24" />
                </div>
                <h3 className="text-amber-400 font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    Guia Rápido
                </h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-white text-xs font-bold uppercase tracking-widest opacity-50">Onde encontrar o IP?</p>
                        <p className="text-zinc-400 text-sm leading-relaxed">No painel da Hostinger, verifique em VPS -&gt; Gerenciar -&gt; Detalhes do Servidor.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white text-xs font-bold uppercase tracking-widest opacity-50">Qual usuário usar?</p>
                        <p className="text-zinc-400 text-sm leading-relaxed">Sempre utilize <strong className="text-emerald-500">root</strong> em servidores recém-criados para garantir permissões totais.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white text-xs font-bold uppercase tracking-widest opacity-50">Dica Pro</p>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 italic text-zinc-500 text-xs text-pretty font-medium">
                            A segurança é prioridade. Em breve adicionaremos suporte direto a chaves SSH .pem/.ppk
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 shadow-xl shadow-emerald-500/5 transition-all hover:bg-emerald-500/15">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-emerald-400 font-bold text-sm">Status do Servidor</h4>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 h-1.5 bg-emerald-500 rounded-full opacity-50" />
                    <div className="flex-1 h-1.5 bg-emerald-500 rounded-full opacity-50" />
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full" />
                </div>
                <p className="mt-3 text-[10px] text-zinc-500 font-bold tracking-widest uppercase opacity-80">Conexão monitorada via SSH v2</p>
            </div>
        </div>
    )
}

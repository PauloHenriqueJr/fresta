import { useState, useEffect } from 'react'
import { Server, Save, Play, Globe, User, Hash, Lock, Sparkles, Key, Copy, Check, FileKey, Info } from 'lucide-react'
import { useToast } from '../Shared/Toast'

export function VPSForm() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [config, setConfig] = useState({
        host: '',
        username: 'root',
        port: 22,
        password: '',
        privateKeyPath: ''
    })

    const [authMode, setAuthMode] = useState<'password' | 'key'>('password')
    const [detectedKeys, setDetectedKeys] = useState<{ name: string, path: string }[]>([])
    const [showAssistant, setShowAssistant] = useState(false)
    const [generatedKey, setGeneratedKey] = useState<{ path: string, publicKey: string } | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        ; (window as any).ipcRenderer.invoke('config:get', 'vps').then((saved: any) => {
            if (saved) {
                setConfig(saved)
                if (saved.privateKeyPath) setAuthMode('key')
            }
        })

            // Detect local keys
            ; (window as any).ipcRenderer.invoke('ssh:detectLocalKeys').then((keys: any) => {
                setDetectedKeys(keys || [])
            })
    }, [])

    const handleSave = async () => {
        setLoading(true)
        try {
            const finalConfig = { ...config }
            if (authMode === 'password') finalConfig.privateKeyPath = ''
            else finalConfig.password = ''

            await (window as any).ipcRenderer.invoke('config:set', 'vps', finalConfig)
            showToast('success', 'Configuração Salva', 'As credenciais da VPS foram atualizadas com sucesso.')
        } catch (err) {
            console.error(err)
            showToast('error', 'Falha ao Salvar', 'Não foi possível salvar as configurações.')
        } finally {
            setLoading(false)
        }
    }

    const handleTest = async () => {
        setLoading(true)
        try {
            const testConfig = { ...config }
            if (authMode === 'password') testConfig.privateKeyPath = ''
            else testConfig.password = ''

            await (window as any).ipcRenderer.invoke('ssh:connect', testConfig)
            showToast('success', 'Conexão Bem-sucedida', 'A comunicação com o servidor VPS foi validada.')
        } catch (err: any) {
            console.error(err)
            showToast('error', 'Falha na Conexão', err.message || 'Não foi possível conectar ao servidor.')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateKey = async () => {
        setLoading(true)
        try {
            const res = await (window as any).ipcRenderer.invoke('ssh:generateKey', { email: 'fresta@deploy.manager' })
            if (res.success) {
                setGeneratedKey(res)
                setConfig({ ...config, privateKeyPath: res.path })
                showToast('success', 'Chave Gerada!', 'Sua nova chave id_fresta_ed25519 foi criada.')
            } else {
                showToast('error', 'Erro ao Gerar', res.error)
            }
        } catch (err) {
            showToast('error', 'Erro Fatal', 'Não foi possível executar a geração da chave.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold tracking-tight">Configurações de Acesso</h3>
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Protocolo SSH v2</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="group">
                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                            <Globe className="w-3.5 h-3.5" />
                            Endereço Host ou IP
                        </label>
                        <input
                            type="text"
                            value={config.host}
                            onChange={(e) => setConfig({ ...config, host: e.target.value })}
                            className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-lg font-medium placeholder:text-zinc-700"
                            placeholder="ex: 123.456.78.90"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                                <User className="w-3.5 h-3.5" />
                                Usuário SSH
                            </label>
                            <input
                                type="text"
                                value={config.username}
                                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 transition-all outline-none font-medium"
                                placeholder="root"
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                                <Hash className="w-3.5 h-3.5" />
                                Porta SSH
                            </label>
                            <input
                                type="number"
                                value={config.port}
                                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                                className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 transition-all outline-none font-medium"
                                placeholder="22"
                            />
                        </div>

                        <div className="col-span-2">
                            <div className="flex gap-4 p-1 bg-black/40 border border-zinc-800 rounded-2xl mb-6">
                                <button
                                    onClick={() => setAuthMode('password')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${authMode === 'password' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <Lock className="w-4 h-4" />
                                    Senha
                                </button>
                                <button
                                    onClick={() => setAuthMode('key')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${authMode === 'key' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <Key className="w-4 h-4" />
                                    Chave SSH
                                </button>
                            </div>

                            {authMode === 'password' ? (
                                <div className="group animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                                        <Lock className="w-3.5 h-3.5" />
                                        Senha de Acesso (Root Password)
                                    </label>
                                    <input
                                        type="password"
                                        value={config.password}
                                        onChange={(e) => setConfig({ ...config, password: e.target.value })}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 transition-all outline-none font-medium placeholder:text-zinc-800"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="group">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                                                <FileKey className="w-3.5 h-3.5" />
                                                Caminho da Chave Privada
                                            </label>
                                            <button
                                                onClick={() => setShowAssistant(!showAssistant)}
                                                className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"
                                            >
                                                <Sparkles className="w-3 h-3" />
                                                Assistente
                                            </button>
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                readOnly
                                                value={config.privateKeyPath}
                                                className="flex-1 bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white font-medium text-sm placeholder:text-zinc-700"
                                                placeholder="C:/Users/.../.ssh/id_rsa"
                                            />
                                            <button
                                                onClick={async () => {
                                                    const path = await (window as any).ipcRenderer.invoke('dialog:openFile', {
                                                        filters: [{ name: 'SSH Keys', extensions: ['pem', 'ppk', 'key', '*'] }]
                                                    })
                                                    if (path) setConfig({ ...config, privateKeyPath: path })
                                                }}
                                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-6 py-4 rounded-2xl font-bold border border-zinc-700 transition-all active:scale-95"
                                            >
                                                Procurar
                                            </button>
                                        </div>
                                    </div>

                                    {detectedKeys.length > 0 && !config.privateKeyPath && (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Chaves Sugeridas do Sistema</p>
                                            <div className="flex flex-wrap gap-2">
                                                {detectedKeys.map((key, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setConfig({ ...config, privateKeyPath: key.path })}
                                                        className="bg-zinc-900/50 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 group"
                                                    >
                                                        <Key className="w-3 h-3 text-zinc-600 group-hover:text-emerald-500" />
                                                        {key.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {showAssistant && (
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-500">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-white font-bold text-sm">Geração Inteligente</h4>
                                                    <p className="text-zinc-500 text-xs leading-relaxed">
                                                        Não tem uma chave? Podemos gerar uma chave Ed25519 segura para você agora mesmo.
                                                    </p>
                                                </div>
                                            </div>

                                            {!generatedKey ? (
                                                <button
                                                    onClick={handleGenerateKey}
                                                    disabled={loading}
                                                    className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                                                >
                                                    {loading ? "Gerando..." : "Gerar Nova Chave Fresta"}
                                                </button>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="bg-black/40 rounded-2xl p-4 border border-emerald-500/20">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sua Chave Pública</span>
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(generatedKey.publicKey)
                                                                    setCopied(true)
                                                                    setTimeout(() => setCopied(false), 2000)
                                                                    showToast('info', 'Copiado!', 'Chave pública copiada para o clipboard.')
                                                                }}
                                                                className="text-emerald-400 hover:text-white transition-colors"
                                                            >
                                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                        <div className="text-[10px] font-mono text-zinc-400 break-all leading-relaxed bg-[#050505] p-3 rounded-lg border border-white/5 max-h-[100px] overflow-y-auto">
                                                            {generatedKey.publicKey}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-zinc-900/80 p-4 rounded-2xl border border-white/5">
                                                        <Info className="w-5 h-5 text-emerald-500 shrink-0" />
                                                        <p className="text-[10px] text-zinc-400 leading-tight">
                                                            Copie o conteúdo acima e cole no arquivo <code className="text-emerald-400">~/.ssh/authorized_keys</code> da sua VPS para liberar o acesso.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold transition-all border border-white/5 active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            Salvar Dados
                        </button>

                        <button
                            onClick={handleTest}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading && !showAssistant ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <Play className="w-5 h-5 fill-current" />
                            )}
                            Testar Conexão
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { useState, useEffect } from 'react'
import { Plus, Trash2, Play, Settings, RefreshCcw, ExternalLink, Activity, Info, Folder, Github, Server, CircuitBoard } from 'lucide-react'
import { useToast } from '../Shared/Toast'

interface EnvConfig {
    branch: string
    remotePath: string
    envVars: Record<string, string>
}

interface AppConfig {
    id: string
    name: string
    repoUrl?: string
    localPath?: string
    sourceType: 'github' | 'local'
    buildLocation: 'local' | 'remote'
    environments: {
        production: EnvConfig
        staging: EnvConfig
    }
    lastDeploy?: string
    lastEnv?: 'production' | 'staging'
    status?: 'running' | 'error' | 'idle'
}

interface AppListProps {
    onDeployStart?: () => void
}

export function AppList({ onDeployStart }: AppListProps) {
    const { showToast } = useToast()
    const [apps, setApps] = useState<Record<string, AppConfig>>({})
    const [showForm, setShowForm] = useState(false)
    const [deploying, setDeploying] = useState<string | null>(null)
    const [editingApp, setEditingApp] = useState<AppConfig | null>(null)

    useEffect(() => {
        loadApps()
    }, [])

    const loadApps = async () => {
        const savedApps = await (window as any).ipcRenderer.invoke('config:get', 'apps') || {}
        // Migration/Defaults
        const migratedApps = Object.entries(savedApps as Record<string, any>).reduce((acc, [id, app]) => {
            if (!app.environments) {
                acc[id] = {
                    ...app,
                    environments: {
                        production: {
                            branch: 'main',
                            remotePath: app.remotePath || '/root/app',
                            envVars: app.envVars || {}
                        },
                        staging: {
                            branch: 'dev',
                            remotePath: (app.remotePath || '/root/app') + '-dev',
                            envVars: app.envVars || {}
                        }
                    }
                }
            } else {
                acc[id] = app
            }
            return acc
        }, {} as Record<string, AppConfig>)
        setApps(migratedApps)
    }

    const saveApps = async (newApps: Record<string, AppConfig>) => {
        await (window as any).ipcRenderer.invoke('config:set', 'apps', newApps)
        setApps(newApps)
    }

    const handleAddOrUpdate = (app: AppConfig) => {
        const newApps = { ...apps, [app.id]: app }
        saveApps(newApps)
        setShowForm(false)
        setEditingApp(null)
        showToast('success', 'Projeto Salvo', `As configurações de ${app.name} foram atualizadas.`)
    }

    const handleDelete = (id: string) => {
        const appName = apps[id]?.name || 'a aplicação'
        if (confirm(`Tem certeza que deseja excluir ${appName}?`)) {
            const { [id]: _, ...rest } = apps
            saveApps(rest)
            showToast('info', 'Projeto Removido', `O projeto ${appName} foi removido da sua lista.`)
        }
    }

    const [showEnvSelector, setShowEnvSelector] = useState<string | null>(null)

    const handleDeploy = async (id: string, env: 'production' | 'staging') => {
        const appName = apps[id]?.name || 'App'
        setDeploying(id)
        setShowEnvSelector(null)
        onDeployStart?.()
        try {
            await (window as any).ipcRenderer.invoke('deploy:start', id, env)
            showToast('success', 'Deploy Concluído', `A aplicação ${appName} em ${env.toUpperCase()} foi implantada com sucesso!`)
        } catch (err: any) {
            console.error(err)
            showToast('error', 'Falha no Deploy', `Erro ao implantar ${appName}: ${err.message}`)
        } finally {
            setDeploying(null)
        }
    }

    const handleAutoDetectEnv = async (targetEnv: 'production' | 'staging') => {
        const detected = await (window as any).ipcRenderer.invoke('env:detect', editingApp?.localPath)
        if (editingApp) {
            setEditingApp({
                ...editingApp,
                environments: {
                    ...editingApp.environments,
                    [targetEnv]: {
                        ...editingApp.environments[targetEnv],
                        envVars: { ...editingApp.environments[targetEnv].envVars, ...detected }
                    }
                }
            })
            showToast('info', 'Variáveis Detectadas', `O arquivo .env foi mapeado para ${targetEnv.toUpperCase()}.`)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center">
                <button
                    onClick={async () => {
                        const detected = await (window as any).ipcRenderer.invoke('project:detect')
                        setEditingApp({
                            id: Date.now().toString(),
                            name: detected?.name || '',
                            repoUrl: detected?.repoUrl || '',
                            localPath: detected?.path || '',
                            sourceType: 'github',
                            buildLocation: 'remote',
                            environments: {
                                production: { branch: 'main', remotePath: '/root/app', envVars: detected?.envVars || {} },
                                staging: { branch: 'dev', remotePath: '/root/app-dev', envVars: detected?.envVars || {} }
                            },
                            status: 'idle'
                        })
                        setShowForm(true)
                    }}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Nova Aplicação
                </button>
            </div>

            {showForm && editingApp && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6 md:p-12">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        <div className="p-10 md:p-14 space-y-12">
                            <div className="flex justify-between items-center border-b border-zinc-800 pb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        {apps[editingApp.id] ? 'Editar Aplicação' : 'Nova Aplicação'}
                                    </h2>
                                    <p className="text-zinc-500 text-sm mt-1">Configure os parâmetros de implantação do seu projeto.</p>
                                </div>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all active:scale-95 text-2xl"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="space-y-10">
                                {/* Seção: Identificação */}
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Identificação do Projeto
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="group">
                                            <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Nome do Projeto</label>
                                            <input
                                                type="text"
                                                value={editingApp.name}
                                                onChange={e => setEditingApp({ ...editingApp, name: e.target.value })}
                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-lg font-medium"
                                                placeholder="Ex: Fresta App"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Seção: Origem */}
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Origem do Código
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                            <button
                                                onClick={() => setEditingApp({ ...editingApp, sourceType: 'github' })}
                                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${editingApp.sourceType === 'github' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                                            >
                                                <Github className="w-5 h-5" />
                                                GitHub
                                            </button>
                                            <button
                                                onClick={() => setEditingApp({ ...editingApp, sourceType: 'local' })}
                                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${editingApp.sourceType === 'local' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                                            >
                                                <Folder className="w-5 h-5" />
                                                Pasta Local
                                            </button>
                                        </div>

                                        {editingApp.sourceType === 'github' ? (
                                            <div className="group animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Repositório GitHub (SSH ou HTTPS)</label>
                                                <input
                                                    type="text"
                                                    value={editingApp.repoUrl}
                                                    onChange={e => setEditingApp({ ...editingApp, repoUrl: e.target.value })}
                                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500/50 transition-all outline-none text-sm font-medium"
                                                    placeholder="https://github.com/usuario/repo.git"
                                                />
                                            </div>
                                        ) : (
                                            <div className="group animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Caminho da Pasta Local</label>
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={editingApp.localPath}
                                                        className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500/50 transition-all outline-none text-sm font-medium"
                                                        placeholder="Escolha a pasta do projeto..."
                                                    />
                                                    <button
                                                        onClick={async () => {
                                                            const path = await (window as any).ipcRenderer.invoke('dialog:openDirectory')
                                                            if (path) {
                                                                const detected = await (window as any).ipcRenderer.invoke('env:detect', path)
                                                                setEditingApp({
                                                                    ...editingApp,
                                                                    localPath: path,
                                                                    environments: {
                                                                        production: { ...editingApp.environments.production, envVars: { ...editingApp.environments.production.envVars, ...detected } },
                                                                        staging: { ...editingApp.environments.staging, envVars: { ...editingApp.environments.staging.envVars, ...detected } }
                                                                    }
                                                                })
                                                            }
                                                        }}
                                                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-2xl font-bold border border-zinc-700 transition-all active:scale-95"
                                                    >
                                                        Selecionar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Seção: Implantação & Ambientes */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Configuração por Ambiente
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Produção */}
                                        <div className="bg-zinc-950/30 border border-zinc-800/50 rounded-3xl p-8 space-y-6 relative overflow-hidden group/prod">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/prod:opacity-20 transition-opacity">
                                                <Server className="w-12 h-12 text-amber-500" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Produção (PROD)</span>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Branch</label>
                                                    <input
                                                        value={editingApp.environments.production.branch}
                                                        onChange={e => setEditingApp({
                                                            ...editingApp,
                                                            environments: {
                                                                ...editingApp.environments,
                                                                production: { ...editingApp.environments.production, branch: e.target.value }
                                                            }
                                                        })}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white"
                                                        placeholder="main"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Caminho Remoto</label>
                                                    <input
                                                        value={editingApp.environments.production.remotePath}
                                                        onChange={e => setEditingApp({
                                                            ...editingApp,
                                                            environments: {
                                                                ...editingApp.environments,
                                                                production: { ...editingApp.environments.production, remotePath: e.target.value }
                                                            }
                                                        })}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white"
                                                        placeholder="/root/app"
                                                    />
                                                </div>
                                                <div className="pt-2">
                                                    <button
                                                        onClick={() => handleAutoDetectEnv('production')}
                                                        className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black rounded-lg transition-all"
                                                    >
                                                        Mapear .env de PROD
                                                    </button>
                                                </div>

                                                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {Object.entries(editingApp.environments.production.envVars).map(([key, val], idx) => (
                                                        <div key={idx} className="space-y-1">
                                                            <span className="text-[8px] font-black text-zinc-600 uppercase">{key}</span>
                                                            <input
                                                                value={val as string}
                                                                onChange={e => setEditingApp({
                                                                    ...editingApp,
                                                                    environments: {
                                                                        ...editingApp.environments,
                                                                        production: {
                                                                            ...editingApp.environments.production,
                                                                            envVars: { ...editingApp.environments.production.envVars, [key]: e.target.value }
                                                                        }
                                                                    }
                                                                })}
                                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] text-white focus:border-amber-500/30 outline-none"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desenvolvimento */}
                                        <div className="bg-zinc-950/30 border border-zinc-800/50 rounded-3xl p-8 space-y-6 relative overflow-hidden group/dev">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/dev:opacity-20 transition-opacity">
                                                <CircuitBoard className="w-12 h-12 text-blue-500" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Desenvolvimento (DEV)</span>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Branch</label>
                                                    <input
                                                        value={editingApp.environments.staging.branch}
                                                        onChange={e => setEditingApp({
                                                            ...editingApp,
                                                            environments: {
                                                                ...editingApp.environments,
                                                                staging: { ...editingApp.environments.staging, branch: e.target.value }
                                                            }
                                                        })}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white"
                                                        placeholder="dev"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Caminho Remoto</label>
                                                    <input
                                                        value={editingApp.environments.staging.remotePath}
                                                        onChange={e => setEditingApp({
                                                            ...editingApp,
                                                            environments: {
                                                                ...editingApp.environments,
                                                                staging: { ...editingApp.environments.staging, remotePath: e.target.value }
                                                            }
                                                        })}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white"
                                                        placeholder="/root/app-dev"
                                                    />
                                                </div>
                                                <div className="pt-2">
                                                    <button
                                                        onClick={() => handleAutoDetectEnv('staging')}
                                                        className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black rounded-lg transition-all"
                                                    >
                                                        Mapear .env de DEV
                                                    </button>
                                                </div>

                                                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {Object.entries(editingApp.environments.staging.envVars).map(([key, val], idx) => (
                                                        <div key={idx} className="space-y-1">
                                                            <span className="text-[8px] font-black text-zinc-600 uppercase">{key}</span>
                                                            <input
                                                                value={val as string}
                                                                onChange={e => setEditingApp({
                                                                    ...editingApp,
                                                                    environments: {
                                                                        ...editingApp.environments,
                                                                        staging: {
                                                                            ...editingApp.environments.staging,
                                                                            envVars: { ...editingApp.environments.staging.envVars, [key]: e.target.value }
                                                                        }
                                                                    }
                                                                })}
                                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] text-white focus:border-blue-500/30 outline-none"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Seção: Build Strategy */}
                                <section className="space-y-6">
                                    <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Estratégia de Build
                                    </h3>
                                    <div className="flex gap-4 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm">
                                        <button
                                            type="button"
                                            onClick={() => setEditingApp({ ...editingApp, buildLocation: 'remote' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-black ${editingApp.buildLocation === 'remote' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-600 hover:text-white'}`}
                                        >
                                            <Server className="w-4 h-4" />
                                            Remoto (VPS)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingApp({ ...editingApp, buildLocation: 'local' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-black ${editingApp.buildLocation === 'local' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-600 hover:text-white'}`}
                                        >
                                            <CircuitBoard className="w-4 h-4" />
                                            PC Local
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 leading-relaxed font-medium">
                                        {editingApp.buildLocation === 'local'
                                            ? 'Build no seu PC economiza RAM na VPS. Requer Docker local.'
                                            : 'Build na VPS é mais simples, mas exige pelo menos 1GB de RAM livre.'}
                                    </p>
                                </section>
                            </div>

                            <div className="flex gap-4 pt-10 border-t border-zinc-800">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-8 py-5 rounded-2xl border border-zinc-800 text-zinc-400 font-bold hover:bg-zinc-800 transition-all active:scale-95"
                                >
                                    Descartar
                                </button>
                                <button
                                    onClick={() => handleAddOrUpdate(editingApp)}
                                    className="flex-[2] px-8 py-5 rounded-2xl bg-emerald-500 text-black font-black text-lg hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    Finalizar e Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(apps).map((app) => (
                    <div key={app.id} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${app.lastEnv === 'staging' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
                                <Activity className={`w-6 h-6 ${app.lastEnv === 'staging' ? 'text-blue-400' : 'text-amber-400'}`} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingApp(app); setShowForm(true); }} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                                    <Settings className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(app.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
                        <p className="text-zinc-500 text-[10px] mb-4 flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-ellipsis">
                            {app.sourceType === 'github' ? <Github className="w-3 h-3 min-w-[12px]" /> : <Folder className="w-3 h-3 min-w-[12px]" />}
                            {app.sourceType === 'github' ? (app.repoUrl || 'Sem repositório') : (app.localPath || 'Sem pasta')}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-black mb-6">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-amber-500" />
                                PROD ({app.environments.production.branch})
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                DEV ({app.environments.staging.branch})
                            </span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowEnvSelector(app.id)}
                                disabled={!!deploying}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${deploying === app.id
                                    ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-xl shadow-emerald-500/10 active:scale-[0.98]'
                                    }`}
                            >
                                <Play className={`w-4 h-4 ${deploying === app.id ? 'animate-pulse' : ''}`} />
                                {deploying === app.id ? 'Implantando...' : 'Iniciar Deploy'}
                            </button>

                            {showEnvSelector === app.id && (
                                <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleDeploy(app.id, 'staging')}
                                            className="flex flex-col items-center gap-1 py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all group/opt"
                                        >
                                            <span className="text-[10px] font-black uppercase">Desenvolvimento</span>
                                            <span className="text-[8px] opacity-50 font-bold group-hover/opt:opacity-100">{app.environments.staging.branch}</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeploy(app.id, 'production')}
                                            className="flex flex-col items-center gap-1 py-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl transition-all group/opt"
                                        >
                                            <span className="text-[10px] font-black uppercase">Produção</span>
                                            <span className="text-[8px] opacity-50 font-bold group-hover/opt:opacity-100">{app.environments.production.branch}</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowEnvSelector(null)}
                                        className="w-full py-2 mt-2 text-[8px] text-zinc-600 hover:text-white uppercase font-black"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {Object.keys(apps).length === 0 && (
                    <div className="col-span-full border-2 border-dashed border-zinc-800 rounded-2xl p-12 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                            <Info className="w-8 h-8 text-zinc-700" />
                        </div>
                        <div>
                            <p className="text-zinc-400 font-medium">Nenhuma aplicação configurada</p>
                            <p className="text-zinc-600 text-sm">Adicione seu primeiro projeto para começar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

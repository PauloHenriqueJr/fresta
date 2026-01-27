import React, { useState, useEffect } from 'react'
import {
    RefreshCcw, Clock, Box, Play, StopCircle,
    RotateCw, Trash2, Server, ExternalLink,
    HardDrive, FileCode, Folder, Upload, ChevronLeft,
    Image as ImageIcon, Database, Download
} from 'lucide-react'
import { useToast } from '../Shared/Toast'

interface TraefikDiscovery {
    found: boolean
    containerName?: string
    networks: string[]
}

interface ImageStatus {
    id: string
    repo: string
    tag: string
    size: string
    createdAt: string
}

interface FileInfo {
    name: string
    size: string
    isDir: boolean
    modified: string
}

interface ContainerStatus {
    id: string;
    names: string;
    image: string;
    status: string;
    ports: string;
}

export function StatusView() {
    const { showToast } = useToast()
    const [activeTab, setActiveTab] = useState<'containers' | 'images' | 'files'>('containers')
    const [containers, setContainers] = useState<ContainerStatus[]>([])
    const [images, setImages] = useState<ImageStatus[]>([])
    const [files, setFiles] = useState<FileInfo[]>([])
    const [currentPath, setCurrentPath] = useState('.')
    const [discovery, setDiscovery] = useState<TraefikDiscovery | null>(null)
    const [loading, setLoading] = useState(false)
    const [actionId, setActionId] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    const fetchStatus = async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            if (activeTab === 'containers') {
                const [containersData, discoveryData] = await Promise.all([
                    (window as any).ipcRenderer.invoke('deploy:get-status'),
                    (window as any).ipcRenderer.invoke('deploy:detect-traefik')
                ])
                setContainers(containersData)
                setDiscovery(discoveryData)
            } else if (activeTab === 'images') {
                const data = await (window as any).ipcRenderer.invoke('deploy:get-images')
                setImages(data)
            } else if (activeTab === 'files') {
                try {
                    const data = await (window as any).ipcRenderer.invoke('deploy:list-files', currentPath)
                    setFiles(data)
                } catch (fileErr: any) {
                    console.warn('Failed to list files:', fileErr)
                    showToast('error', 'Erro ao Listar Arquivos', 'Não foi possível ler este diretório ou permissão negada.')
                    if (currentPath !== '.') setCurrentPath('.')
                }
            }

            setLastUpdate(new Date())
            if (!silent) showToast('success', 'Status Atualizado', 'As informações foram sincronizadas com a VPS.')
        } catch (err: any) {
            if (!silent) showToast('error', 'Erro ao Sincronizar', err.message || 'Falha ao conectar com o servidor.')
        } finally {
            if (!silent) setLoading(false)
        }
    }

    const handleAction = async (id: string, action: string) => {
        setActionId(id)
        try {
            const channel = `deploy:${action}-container`
            await (window as any).ipcRenderer.invoke(channel, id)
            showToast('success', 'Ação Concluída', `O container foi ${action === 'stop' ? 'parado' : action === 'start' ? 'iniciado' : action === 'restart' ? 'reiniciado' : 'removido'} com sucesso.`)
            await fetchStatus(true)
        } catch (err: any) {
            showToast('error', 'Falha na Ação', err.message || 'Erro ao executar comando no container.')
        } finally {
            setActionId(null)
        }
    }

    const handleRemoveImage = async (id: string) => {
        setActionId(id)
        try {
            await (window as any).ipcRenderer.invoke('deploy:remove-image', id)
            showToast('success', 'Imagem Removida', 'A imagem Docker foi removida com sucesso.')
            await fetchStatus(true)
        } catch (err: any) {
            showToast('error', 'Falha ao Remover Imagem', err.message || 'Erro ao remover imagem Docker.')
        } finally {
            setActionId(null)
        }
    }

    const navigateTo = async (path: string) => {
        let newPath = currentPath === '.' ? path : `${currentPath}/${path}`
        if (path === '..') {
            const parts = currentPath.split('/')
            parts.pop()
            newPath = parts.join('/') || '.'
        }
        setCurrentPath(newPath)
    }

    const handleDeleteFile = async (fileName: string) => {
        try {
            await (window as any).ipcRenderer.invoke('deploy:delete-file', `${currentPath}/${fileName}`)
            showToast('success', 'Arquivo Excluído', 'O arquivo foi excluído com sucesso.')
            await fetchStatus(true)
        } catch (err: any) {
            showToast('error', 'Falha ao Excluir Arquivo', err.message || 'Erro ao excluir o arquivo.')
        }
    }

    const handleUpload = async () => {
        try {
            const localPath = await (window as any).ipcRenderer.invoke('dialog:selectFile')
            if (!localPath) return

            setLoading(true)
            const remotePath = `${currentPath}/${localPath.split(/[\\/]/).pop()}`
            await (window as any).ipcRenderer.invoke('deploy:upload-file', localPath, remotePath)
            showToast('success', 'Upload Concluído', 'O arquivo foi enviado para a VPS.')
            await fetchStatus(true)
        } catch (err: any) {
            showToast('error', 'Erro no Upload', err.message || 'Falha ao enviar arquivo.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStatus(true)
    }, [activeTab, currentPath])

    useEffect(() => {
        const interval = setInterval(() => fetchStatus(true), 15000)
        return () => clearInterval(interval)
    }, [activeTab, currentPath])

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                        {lastUpdate ? `Atualizado em: ${lastUpdate.toLocaleTimeString()}` : 'Sincronizando...'}
                    </span>
                </div>
                <button
                    onClick={() => fetchStatus()}
                    disabled={loading}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/5 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar Agora
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        Status Real
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">Monitoramento e Gestão de Recursos VPS</p>
                </div>
                <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('containers')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'containers' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        CONTAINERS
                    </button>
                    <button
                        onClick={() => setActiveTab('images')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'images' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        IMAGENS
                    </button>
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'files' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        ARQUIVOS
                    </button>
                </div>
            </div>

            {/* Traefik Intelligence */}
            {discovery?.found && activeTab === 'containers' && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-5 text-center md:text-left">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl">
                            <Server className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold tracking-tight">Traefik Detectado Inteligente</h4>
                            <p className="text-emerald-500/60 text-xs">Encontramos o container <span className="text-emerald-400 font-mono font-bold capitalize">{discovery.containerName}</span> pronto para rotear seu app.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="px-4 py-2 bg-zinc-950/50 rounded-xl border border-white/5 space-y-1">
                            <p className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">Rede Recomendada</p>
                            <p className="text-xs font-mono text-zinc-300 font-bold">{discovery.networks[0] || 'traefik-public'}</p>
                        </div>
                        <div className="text-zinc-500 text-[10px] max-w-[200px] leading-relaxed italic">
                            Use esta rede e defina seu DOMAIN_NAME nas variáveis da aplicação para roteamento automático.
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'files' && (
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => navigateTo('..')}
                            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 truncate">
                            <Folder className="w-3.5 h-3.5 text-amber-500/70" />
                            {currentPath}
                        </div>
                    </div>
                    <button
                        onClick={handleUpload}
                        className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black transition-all border border-emerald-500/20"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        UPLOAD
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {activeTab === 'containers' && (
                    containers.length > 0 ? (
                        containers.map((container) => {
                            const isFrestaManaged = container.names.toLowerCase().includes('fresta') ||
                                container.names.toLowerCase().includes('-dev') ||
                                container.names.toLowerCase().includes('-app');
                            const isRunning = container.status.toLowerCase().includes('up') ||
                                container.status.toLowerCase().includes('running');
                            const isProcessing = actionId === container.id;

                            return (
                                <div key={container.id} className="group bg-zinc-900 hover:bg-zinc-800/80 border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/20">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className={`p-4 rounded-2xl transition-all duration-500 ${isRunning ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    <Box className={`w-7 h-7 ${isRunning && isProcessing ? 'animate-pulse' : ''}`} />
                                                </div>
                                                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-4 border-zinc-900 ${isRunning ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-black text-white tracking-tight">{container.names}</h3>
                                                    {isFrestaManaged && (
                                                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black rounded-lg border border-indigo-500/20 uppercase tracking-tighter">
                                                            Fresta Managed
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-bold font-mono text-zinc-500">
                                                    <span className="text-zinc-300">{container.image}</span>
                                                    <span className="text-zinc-700">•</span>
                                                    <span>{container.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                            {isRunning ? (
                                                <button
                                                    onClick={() => handleAction(container.id, 'stop')}
                                                    disabled={isProcessing}
                                                    className="flex-1 md:flex-none p-3 bg-zinc-800 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-400 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                                                    title="Parar Container"
                                                >
                                                    <StopCircle className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(container.id, 'start')}
                                                    disabled={isProcessing}
                                                    className="flex-1 md:flex-none p-3 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                                                    title="Iniciar Container"
                                                >
                                                    <Play className="w-5 h-5" />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleAction(container.id, 'restart')}
                                                disabled={isProcessing}
                                                className="flex-1 md:flex-none p-3 bg-zinc-800 hover:bg-indigo-500/20 hover:text-indigo-400 text-zinc-400 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                                                title="Reiniciar Container"
                                            >
                                                <RotateCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                                            </button>

                                            <button
                                                onClick={() => handleAction(container.id, 'remove')}
                                                disabled={isProcessing}
                                                className="flex-1 md:flex-none p-3 bg-zinc-800 hover:bg-rose-500 text-white rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                                                title="Remover Container"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            {container.ports && (
                                                <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/50 rounded-2xl border border-white/5 text-[10px] font-mono text-zinc-400">
                                                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
                                                    {container.ports}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-dashed border-white/5 rounded-[40px] text-center px-6">
                            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                                <Box className="w-10 h-10 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Nenhum container encontrado</h3>
                            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed font-bold">Inicie um deploy para ver o status dos seus serviços aqui em tempo real.</p>
                        </div>
                    )
                )}

                {activeTab === 'images' && (
                    images.length > 0 ? (
                        images.map((img) => (
                            <div key={img.id} className="group bg-zinc-900 hover:bg-zinc-800/80 border border-white/5 rounded-3xl p-6 transition-all">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                                            <ImageIcon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white tracking-tight truncate max-w-[300px]">{img.repo}</h3>
                                            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 font-bold">
                                                <span className="text-indigo-400">TAG: {img.tag}</span>
                                                <span className="text-zinc-700">•</span>
                                                <span>{img.size}</span>
                                                <span className="text-zinc-700">•</span>
                                                <span className="text-[10px] uppercase">{img.id.replace('sha256:', '').substring(0, 12)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveImage(img.id)}
                                        disabled={actionId === img.id}
                                        className="p-3 bg-zinc-800 hover:bg-rose-500 text-white rounded-2xl transition-all active:scale-90"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-dashed border-white/5 rounded-[40px] text-center">
                            <Database className="w-12 h-12 text-zinc-700 mb-4" />
                            <p className="text-zinc-500 font-bold">Nenhuma imagem Docker na VPS.</p>
                        </div>
                    )
                )}

                {activeTab === 'files' && (
                    <div className="bg-zinc-900 border border-white/5 rounded-[32px] overflow-hidden">
                        <div className="max-h-[500px] overflow-y-auto">
                            {files.length > 0 ? (
                                files.map((file) => (
                                    <div key={file.name} className="group flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-zinc-800/50 transition-all cursor-pointer"
                                        onClick={async () => {
                                            if (file.isDir) {
                                                navigateTo(file.name)
                                            } else {
                                                try {
                                                    const remotePath = currentPath === '.' ? file.name : `${currentPath}/${file.name}`
                                                    showToast('info', 'Abrindo Arquivo', 'O arquivo está sendo baixado e será aberto em breve.')
                                                    const result = await (window as any).ipcRenderer.invoke('deploy:open-remote-file', remotePath)
                                                    if (result.success) {
                                                        showToast('success', 'Arquivo Aberto', `Visualizando arquivo temporário em: ${result.localPath}`)
                                                    }
                                                } catch (err: any) {
                                                    showToast('error', 'Falha ao Abrir', err.message || 'Erro ao abrir arquivo remoto.')
                                                }
                                            }
                                        }}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${file.isDir ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'}`}>
                                                {file.isDir ? <Folder className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white tracking-tight">{file.name}</p>
                                                <p className="text-[10px] text-zinc-500 font-mono italic">{file.size} • {file.modified}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!file.isDir && (
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            const remotePath = currentPath === '.' ? file.name : `${currentPath}/${file.name}`
                                                            const result = await (window as any).ipcRenderer.invoke('deploy:download-file-save-as', remotePath)
                                                            if (result.success) {
                                                                showToast('success', 'Download Concluído', `Arquivo salvo em: ${result.filePath}`)
                                                            }
                                                        } catch (err: any) {
                                                            showToast('error', 'Falha no Download', err.message || 'Erro ao salvar arquivo.')
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all"
                                                    title="Salvar Como..."
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                            {!file.isDir && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.name); }}
                                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-zinc-500 font-bold italic">Pasta vazia</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

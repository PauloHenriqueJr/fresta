import { useState } from 'react'
import { Layout } from './components/Layout/Layout'
import { VPSForm } from './components/VPS/VPSForm'
import { TerminalView } from './components/Terminal/TerminalView'
import { AppList } from './components/Apps/AppList'
import { ViewHeader } from './components/Shared/ViewHeader'
import { QuickGuide } from './components/VPS/QuickGuide'
import { ToastProvider } from './components/Shared/Toast'
import { ShieldCheck, Terminal } from 'lucide-react'

function AppContent() {
    const [currentView, setCurrentView] = useState('vps')

    return (
        <Layout currentView={currentView} onViewChange={setCurrentView}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* VPS View */}
                <div className={currentView === 'vps' ? 'block' : 'hidden'}>
                    <ViewHeader
                        title="Gerenciador VPS"
                        description="Configure e valide sua infraestrutura de implantação"
                        badge={
                            <>
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Altos Padrões de Segurança</span>
                            </>
                        }
                    />
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        <div className="xl:col-span-4">
                            <VPSForm />
                        </div>
                        <div className="xl:col-span-5 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-[560px] flex flex-col shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <div className="flex items-center gap-2 mb-4 font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
                                <Terminal className="w-3.5 h-3.5" />
                                Terminal em Tempo Real
                            </div>
                            <div className="flex-1 overflow-hidden rounded-2xl bg-black/60 border border-white/5 p-4 shadow-inner">
                                <TerminalView />
                            </div>
                        </div>
                        <div className="xl:col-span-3">
                            <QuickGuide />
                        </div>
                    </div>
                </div>

                {/* Apps View */}
                {currentView === 'apps' && (
                    <>
                        <ViewHeader
                            title="Minhas Aplicações"
                            description="Gerencie seus projetos e implantações inteligentes"
                        />
                        <AppList onDeployStart={() => setCurrentView('terminal')} />
                    </>
                )}

                {/* Full Terminal View */}
                <div className={currentView === 'terminal' ? 'flex flex-col h-[calc(100vh-8rem)]' : 'hidden'}>
                    <ViewHeader
                        title="Terminal de Acesso"
                        description="Conexão direta segura via SSH ao servidor"
                        badge={
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Sessão Ativa</span>
                            </div>
                        }
                    />
                    <div className="flex-1 bg-black/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 p-4 shadow-2xl">
                        {/* We use the same component here. If they are in the same component tree, 
                            xterm might conflict if we have two instances listening to the same IPC.
                            However, the user wants the same logs. 
                            Actually, rendering two TerminalView components will result in two xterm instances.
                            If they both listen to 'terminal:data', they will both show the same thing.
                            But they will have independent focus/scroll state.
                        */}
                        <TerminalView />
                    </div>
                </div>

                {/* Logs View */}
                {currentView === 'logs' && (
                    <div className="space-y-6">
                        <ViewHeader
                            title="Histórico de Logs"
                            description="Acompanhe eventos de implantação e atividades do sistema"
                        />
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl font-mono text-sm">
                            <div className="space-y-3 text-zinc-500">
                                <p className="flex gap-4"><span className="text-emerald-500/50">[2027-01-27 13:40]</span> Painel iniciado com sucesso.</p>
                                <p className="flex gap-4"><span className="text-emerald-500/50">[2027-01-27 13:41]</span> Verificação de conexão VPS pendente.</p>
                                <p className="flex gap-4"><span className="text-emerald-500/50">[2027-01-27 14:00]</span> Conexão SSH estabelecida com sucesso.</p>
                            </div>
                        </div>
                    </div>
                )}
                {currentView === 'settings' && (
                    <div className="max-w-2xl space-y-6">
                        <ViewHeader
                            title="Configurações"
                            description="Preferências e ajustes globais do sistema"
                        />
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl space-y-8">
                            <div className="group">
                                <label className="block text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">Idioma Principal</label>
                                <select className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 transition-all outline-none">
                                    <option>Português (Brasil)</option>
                                    <option disabled>English (Soon)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">Tema de Visualização</label>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-bold">Escuro (Premium)</button>
                                    <button className="flex-1 py-4 bg-white/5 border border-transparent text-zinc-500 rounded-2xl font-bold opacity-50 cursor-not-allowed">Claro (Em breve)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

function App() {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    )
}

export default App

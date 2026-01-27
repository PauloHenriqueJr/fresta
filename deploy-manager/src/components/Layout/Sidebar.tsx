import { Server, CircuitBoard, Terminal, FileText, Settings } from 'lucide-react'

interface SidebarProps {
    currentView: string
    onViewChange: (view: string) => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
    const menuItems = [
        { icon: Server, label: 'Gerenciador VPS', id: 'vps' },
        { icon: CircuitBoard, label: 'Aplicações', id: 'apps' },
        { icon: Terminal, label: 'Terminal', id: 'terminal' },
        { icon: FileText, label: 'Logs', id: 'logs' },
    ]

    return (
        <div className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-6" style={{ webkitAppRegion: 'drag' } as any}>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    Deploy Manager
                    <span className="text-amber-400 ml-1">Pro</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2" style={{ webkitAppRegion: 'no-drag' } as any}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${currentView === item.id
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-emerald-400' : 'group-hover:text-emerald-300'}`} />
                        <span className="font-medium">{item.label}</span>
                        {currentView === 'apps' && item.id === 'apps' && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        )}
                        {currentView === item.id && item.id !== 'apps' && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-zinc-800" style={{ webkitAppRegion: 'no-drag' } as any}>
                <button
                    onClick={() => onViewChange('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'settings'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Configurações</span>
                </button>
            </div>
        </div>
    )
}

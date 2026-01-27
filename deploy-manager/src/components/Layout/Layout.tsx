import { Sidebar } from './Sidebar'

interface LayoutProps {
    children: React.ReactNode
    currentView: string
    onViewChange: (view: string) => void
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
    return (
        <div className="flex h-screen w-full bg-zinc-950 text-foreground overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[100px] rounded-full" />
            </div>

            <Sidebar currentView={currentView} onViewChange={onViewChange} />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden backdrop-blur-sm bg-black/20">
                {/* Titlebar / Drag Area */}
                <header className="h-10 w-full flex items-center justify-between px-6 shrink-0 relative z-30 pointer-events-none">
                    <div className="h-full flex-1 pointer-events-auto" style={{ webkitAppRegion: 'drag' } as any} />
                    {/* 
                        ZONA MORTA PARA BOTÕES DO WINDOWS
                        Deixamos este espaço sem 'drag' para o Windows receber os cliques do Overlay 
                    */}
                    <div className="h-full w-[140px] pointer-events-none" style={{ webkitAppRegion: 'no-drag' } as any} />
                </header>

                <div className="flex-1 overflow-auto no-scrollbar scroll-smooth relative z-10 px-12 py-4">
                    {children}
                </div>
            </main>
        </div>
    )
}

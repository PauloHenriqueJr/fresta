import { useEffect, useRef, useState } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react'
import '@xterm/xterm/css/xterm.css'

export function TerminalView() {
    const terminalRef = useRef<HTMLDivElement>(null)
    const termInstance = useRef<Terminal | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!terminalRef.current) return

        const term = new Terminal({
            theme: {
                background: '#09090b',
                foreground: '#e4e4e7',
                cursor: '#10b981',
                selectionBackground: 'rgba(16, 185, 129, 0.3)',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 12, // Slightly smaller to fit more logs
            lineHeight: 1.5,
            cursorBlink: true,
            convertEol: true,
        })
        termInstance.current = term

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)

        term.open(terminalRef.current)
        fitAddon.fit()

        // Listen for data from main process
        try {
            ; (window as any).ipcRenderer.on('terminal:data', (_event: any, data: string) => {
                term.write(data)
            })
        } catch (e) {
            console.error("IPC not available", e)
            term.write('IPC connection not available.\r\n')
        }

        term.write('\x1b[32m$ \x1b[0mIniciando monitoramento de logs...\r\n')

        const handleResize = () => fitAddon.fit()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            term.dispose()
                ; (window as any).ipcRenderer.off('terminal:data', () => { })
        }
    }, [])

    const handleCopy = () => {
        if (!termInstance.current) return

        // Strategy: Select all and copy
        termInstance.current.selectAll()
        const text = termInstance.current.getSelection()
        termInstance.current.clearSelection()

        if (text) {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Terminal de Saída</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 text-[10px] font-bold text-zinc-400 hover:text-white transition-all active:scale-95"
                    title="Copiar Logs"
                >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copiado' : 'Copiar'}
                </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
                <div ref={terminalRef} className="w-full h-full" />
            </div>
        </div>
    )
}

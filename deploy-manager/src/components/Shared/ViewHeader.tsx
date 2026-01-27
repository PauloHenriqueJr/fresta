import { ReactNode } from 'react'

interface ViewHeaderProps {
    title: string
    description?: string
    badge?: ReactNode
    action?: ReactNode
}

export function ViewHeader({ title, description, badge, action }: ViewHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{title}</h1>
                {description && <p className="text-zinc-400 text-lg">{description}</p>}
            </div>
            <div className="flex items-center gap-4">
                {badge && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                        {badge}
                    </div>
                )}
                {action}
            </div>
        </div>
    )
}

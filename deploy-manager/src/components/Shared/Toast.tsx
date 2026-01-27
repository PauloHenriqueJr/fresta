import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    title: string
    message: string
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((type: ToastType, title: string, message: string) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, type, title, message }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }, [])

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "group relative overflow-hidden backdrop-blur-xl border p-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-right-8 fade-in duration-500",
                            toast.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                            toast.type === 'error' && "bg-rose-500/10 border-rose-500/20 text-rose-400",
                            toast.type === 'info' && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                            toast.type === 'warning' && "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        )}
                    >
                        <div className="flex gap-4">
                            <div className={cn(
                                "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                                toast.type === 'success' && "bg-emerald-500 text-black",
                                toast.type === 'error' && "bg-rose-500 text-white",
                                toast.type === 'info' && "bg-blue-500 text-white",
                                toast.type === 'warning' && "bg-amber-500 text-black"
                            )}>
                                {toast.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                                {toast.type === 'error' && <AlertCircle className="w-6 h-6" />}
                                {toast.type === 'info' && <Info className="w-6 h-6" />}
                                {toast.type === 'warning' && <Bell className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <h4 className="font-black text-sm uppercase tracking-wider mb-1">{toast.title}</h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {/* Progress Bar */}
                        <div className={cn(
                            "absolute bottom-0 left-0 h-1 transition-all duration-[5000ms] ease-linear",
                            toast.type === 'success' && "bg-emerald-500/50 w-full",
                            toast.type === 'error' && "bg-rose-500/50 w-full",
                            toast.type === 'info' && "bg-blue-500/50 w-full",
                            toast.type === 'warning' && "bg-amber-500/50 w-full"
                        )} style={{ animation: 'toast-progress 5s linear forwards' }} />
                    </div>
                ))}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

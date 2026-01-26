import { motion, AnimatePresence } from 'framer-motion';
import { X, LucideIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    icon?: LucideIcon;
    iconClassName?: string;
    iconBgClassName?: string;
    accentColor?: string;
    confirmButtonClassName?: string;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'CONFIRMAR',
    cancelText = 'CANCELAR',
    isLoading = false,
    icon: Icon,
    iconClassName = 'text-gray-600',
    iconBgClassName = 'bg-gray-100',
    accentColor = 'bg-gray-500',
    confirmButtonClassName = 'bg-gray-600 hover:bg-gray-700 text-white',
}: ConfirmModalProps) {
    // Bloquear scroll do body quando modal estiver aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative z-[10000] w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <div className="p-5 sm:p-8">
                            {/* Barra de acento */}
                            <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`} />

                            {/* Botão fechar */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Ícone */}
                            {Icon && (
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${iconBgClassName} flex items-center justify-center mb-4 sm:mb-5`}>
                                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconClassName}`} />
                                </div>
                            )}

                            {/* Título */}
                            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2 sm:mb-3">
                                {title}
                            </h2>

                            {/* Descrição */}
                            <p className="text-[0.9375rem] sm:text-lg text-gray-600 font-medium mb-6 sm:mb-8 leading-relaxed">
                                {description}
                            </p>

                            {/* Botões */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 h-11 sm:h-14 rounded-xl font-bold border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-500 transition-all disabled:opacity-50 text-sm sm:text-base"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 h-11 sm:h-14 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 text-sm sm:text-base ${confirmButtonClassName}`}
                                >
                                    {isLoading ? 'Carregando...' : confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    // Usar createPortal para renderizar diretamente no body
    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }

    return null;
}

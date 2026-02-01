import { motion, AnimatePresence } from "framer-motion";
import { Crown, CreditCard, Eye, CheckCircle2 } from "lucide-react";
import { getThemeDefinition } from "@/lib/offline/themes";
import { BASE_THEMES } from "@/lib/offline/themes";
import { useNavigate } from "react-router-dom";

interface UpgradeChoiceModalProps {
    themeId: string | null;
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
}

export const UpgradeChoiceModal = ({
    themeId,
    isOpen,
    onClose,
    isAuthenticated,
}: UpgradeChoiceModalProps) => {
    const navigate = useNavigate();
    const theme = themeId ? BASE_THEMES.find(t => t.id === themeId) : null;

    if (!isOpen) return null;

    const handleViewSample = () => {
        if (!themeId) return;
        // In demo pages, this might just close or refresh. In Explorar it navigates.
        // For consistency, we handle the navigation if we're not already there.
        const currentPath = window.location.hash.replace('#', '');
        const demoUrl = `/calendario/${themeId}`;

        if (currentPath.startsWith(demoUrl)) {
            onClose();
        } else {
            navigate(`${demoUrl}?template=true`);
            onClose();
        }
    };

    const handleCreate = () => {
        if (!themeId) return;
        const url = isAuthenticated
            ? `/criar?theme=${themeId}`
            : `/entrar?redirect=/criar?theme=${themeId}`;
        navigate(url);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] max-w-lg mx-auto"
                        initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
                        animate={{ opacity: 1, scale: 1, y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
                    >
                        <div className="bg-card rounded-[3rem] shadow-2xl overflow-hidden border border-border/10">
                            <div className="p-8 md:p-12 text-center">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-[#F9A03F]/10 flex items-center justify-center mx-auto mb-6">
                                    <Crown className="w-8 h-8 text-[#F9A03F]" />
                                </div>

                                <h3 className="text-3xl font-black text-foreground mb-4 leading-tight">
                                    Tema Plus Selecionado
                                </h3>

                                <p className="text-muted-foreground font-medium mb-8">
                                    O tema <span className="text-foreground font-bold italic">"{theme?.name || themeId}"</span> é exclusivo do Plano Plus. Deseja ver um exemplo ou começar a criação agora?
                                </p>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleCreate}
                                        className="w-full py-5 bg-[#F9A03F] text-white font-black rounded-2xl text-lg shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        CRIAR COM ESTE TEMA
                                    </button>

                                    <button
                                        onClick={handleViewSample}
                                        className="w-full py-5 bg-card text-foreground border-2 border-border/50 font-black rounded-2xl text-lg hover:bg-muted/50 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Eye className="w-6 h-6" />
                                        VER EXEMPLO GRÁTIS
                                    </button>
                                </div>

                                <div className="mt-8 flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Até 365 dias de duração
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Upload de fotos e vídeos
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="mt-8 text-muted-foreground text-sm font-bold uppercase tracking-widest hover:text-foreground transition-colors"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

import { UniversalHeader, UniversalProgress, UniversalQuote, UniversalFooter, UniversalEmptyCard, UniversalEnvelopeCard, UniversalUnlockedCard, UniversalLockedCard } from "@/lib/themes/themeComponents";
import { BrandWatermark } from "@/components/calendar/BrandWatermark";
import { parseISO, startOfDay, isAfter, addDays } from "date-fns";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Eye, Settings, Clock, Save, X, Check, Heart, Share2, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import type { PlusThemeConfig } from "@/lib/themes/registry";
import { PLUS_THEMES } from "@/hooks/usePlanLimits";
import { UpgradeChoiceModal } from "@/components/modals/UpgradeChoiceModal";
import { useAuth } from "@/state/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

// --- MAIN TEMPLATE ---

interface UniversalTemplateProps {
    config: PlusThemeConfig;
    calendar: Tables<"calendars"> & { views?: number; header_message?: string; footer_message?: string; message?: string; capsule_title?: string };
    days: Tables<"calendar_days">[];
    openedDays: number[];
    isEditor?: boolean;
    isEditorContext?: boolean; // Is the user the owner?
    onNavigateBack: () => void;
    onShare: () => void;
    onLike?: () => void;
    liked?: boolean;
    onDayClick: (day: number) => void;
    onLockedClick?: (day: number, date: Date) => void;
    onSettings?: () => void;
    onTogglePreview?: () => void;
    previewMode?: boolean;
    onUpdateCalendar?: (data: Partial<Tables<"calendars">>) => Promise<void>;
    onStats?: () => void;
    showWatermark?: boolean;
    isDemoMode?: boolean;
}

export const UniversalTemplate = ({
    config,
    calendar,
    days,
    openedDays,
    isEditorContext = false,
    onNavigateBack,
    onShare,
    onLike,
    liked = false,
    onDayClick,
    onLockedClick,
    onSettings,
    onTogglePreview,
    previewMode = false,
    onUpdateCalendar,
    onStats,
    showWatermark = false,
    isDemoMode = false
}: UniversalTemplateProps) => {
    const { isAuthenticated, role } = useAuth();
    const navigate = useNavigate();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const isAdmin = useMemo(() => role === 'admin', [role]);
    const ui = config.ui!;
    const FloatingComponent = config.FloatingComponent;

    // Inline Editing State
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValues, setTempValues] = useState({
        title: calendar.title || config.content.capsule.title || "Cápsula do Tempo",
        header_message: calendar.header_message || config.content.subtitle || "",
        footer_message: calendar.footer_message || calendar.message || config.content.footerMessage || "",
        capsule_title: calendar.capsule_title || ui.progress.labelText || ""
    });
    const [isSaving, setIsSaving] = useState(false);

    // Sync local state when prop changes (while not actively editing)
    useEffect(() => {
        if (!editingField) {
            setTempValues({
                title: calendar.title || config.content.capsule.title || "Cápsula do Tempo",
                header_message: calendar.header_message || config.content.subtitle || "",
                footer_message: calendar.footer_message || calendar.message || config.content.footerMessage || "",
                capsule_title: calendar.capsule_title || ui.progress.labelText || ""
            });
        }
    }, [calendar.title, calendar.header_message, calendar.footer_message, calendar.capsule_title, calendar.id, editingField]);

    const bgStyle = {
        ...config.styles.background,
        backgroundImage: ui.layout.bgSvg ? `${ui.layout.bgSvg}, ${config.styles.background?.backgroundImage || 'none'}` : config.styles.background?.backgroundImage
    };

    const completionPercentage = Math.round(((days as any[]).filter(d => (d.opened_count || 0) > 0).length / (calendar.duration || 1)) * 100);
    const progress = (isEditorContext && !previewMode)
        ? Math.round(((days as any[]).filter(d => d.message || d.url).length / (calendar.duration || 1)) * 100)
        : Math.round((openedDays.length / (days.length || 1)) * 100);

    const showEditingControls = isEditorContext && !previewMode;

    const handleSave = async (field: keyof typeof tempValues) => {
        console.log(`[UniversalTemplate] handleSave triggered for field: ${field}`, tempValues[field]);
        if (!onUpdateCalendar) {
            console.error("[UniversalTemplate] onUpdateCalendar prop is missing!");
            return;
        }
        setIsSaving(true);
        try {
            await onUpdateCalendar({ [field]: tempValues[field] });
            console.log(`[UniversalTemplate] Save successful for: ${field}`);
            setEditingField(null);
        } catch (error) {
            console.error("[UniversalTemplate] Failed to update calendar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const renderEditableText = (field: keyof typeof tempValues, originalText: string | React.ReactNode, className: string, placeholder: string, type: 'input' | 'textarea' = 'input') => {
        // FILTER: Remove classes that make the input text/cursor invisible
        const filteredClassName = className
            .replace(/text-transparent/g, '')
            .replace(/bg-clip-text/g, '')
            .replace(/bg-gradient-to-[^ ]+/g, '')
            .replace(/from-[^ ]+/g, '')  // Extra precaution: remove gradient stops
            .replace(/to-[^ ]+/g, '')
            .replace(/via-[^ ]+/g, '');

        if (editingField === field) {
            return (
                <div
                    className="relative w-full group/input min-w-[300px] my-4 mx-auto max-w-lg animate-in fade-in zoom-in duration-200 pointer-events-auto z-[80]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-0 bg-primary/5 -m-4 rounded-[2rem] blur-xl opacity-50 pointer-events-none"></div>
                    {type === 'input' ? (
                        <input
                            autoFocus
                            value={tempValues[field]}
                            onChange={(e) => setTempValues({ ...tempValues, [field]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave(field)}
                            className={cn(
                                "w-full bg-white dark:bg-zinc-900 border-2 border-primary/40 rounded-2xl px-6 py-4 text-center focus:border-primary focus:ring-8 focus:ring-primary/10 transition-all outline-none shadow-xl font-bold text-lg relative z-10 text-foreground caret-primary",
                                filteredClassName
                            )}
                            placeholder={placeholder}
                        />
                    ) : (
                        <textarea
                            autoFocus
                            value={tempValues[field]}
                            onChange={(e) => setTempValues({ ...tempValues, [field]: e.target.value })}
                            className={cn(
                                "w-full bg-white dark:bg-zinc-900 border-2 border-primary/40 rounded-2xl px-6 py-4 text-center focus:border-primary focus:ring-8 focus:ring-primary/10 transition-all outline-none min-h-[140px] text-base leading-relaxed shadow-xl relative z-10 text-foreground caret-primary",
                                filteredClassName
                            )}
                            placeholder={placeholder}
                        />
                    )}

                    {/* Floating Controls Overlay */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[90] animate-in slide-in-from-top-2 pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSave(field);
                            }}
                            disabled={isSaving}
                            type="button"
                            className={cn(
                                "text-white px-5 py-2.5 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs font-black flex items-center gap-2 ring-2 ring-white relative z-[100]",
                                ui.footer.button.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('from-') || c.startsWith('to-') || c.startsWith('via-')).join(' ') || "bg-primary"
                            )}
                        >
                            {isSaving ? <Check className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
                            SALVAR
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingField(null);
                                setTempValues({ ...tempValues, [field]: typeof originalText === 'string' ? originalText : "" });
                            }}
                            type="button"
                            className="bg-white text-zinc-500 p-2.5 rounded-full shadow-lg hover:text-rose-500 active:scale-95 transition-all ring-2 ring-white border border-zinc-100 relative z-[100]"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            );
        }
        return originalText;
    };

    return (
        <div className={cn("min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-500 font-display", ui.layout.bgClass, ui.layout.containerClass)} style={bgStyle}>
            {FloatingComponent && <FloatingComponent />}

            {/* Editor Top Bar */}
            {isEditorContext && (
                <div className={cn("relative z-50 bg-white/95 backdrop-blur-md px-6 py-2 flex items-center justify-between border-b", ui.editor?.topBar.container || ui.cards.envelope.borderClass || "border-rose-100 shadow-sm")}>
                    <div className="flex items-center gap-3">
                        <button onClick={onNavigateBack} className={cn("opacity-40 hover:opacity-100 transition-opacity p-1", ui.editor?.topBar.backButton || "text-rose-500")}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col">
                            <span className={cn("text-[10px] font-black tracking-widest uppercase", ui.editor?.topBar.modeText || "text-rose-500")}>Modo {previewMode ? "Visualização" : "Edição"}</span>
                            <span className={cn("text-[10px] font-bold leading-none mt-0.5", ui.editor?.topBar.badgeText || "text-rose-900")}>{ui.header.badgeText}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onTogglePreview}
                            className={cn("p-2 rounded-lg transition-all", previewMode ? (ui.editor?.topBar.previewButtonActive || "bg-rose-500 text-white shadow-lg shadow-rose-500/20") : (ui.editor?.topBar.previewButtonInactive || "bg-zinc-50 text-rose-500 border border-rose-100"))}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={onSettings} className={cn("p-2 rounded-lg transition-colors hover:bg-white", ui.editor?.topBar.settingsButton || "bg-zinc-50 text-rose-500 border border-rose-100")}>
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {!isEditorContext && (
                <div className="absolute top-6 left-0 w-full px-6 flex items-center justify-between z-[60] pointer-events-none">
                    <button
                        onClick={onNavigateBack}
                        className={cn(
                            "flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all active:scale-90 hover:scale-105 pointer-events-auto backdrop-blur-sm border-2",
                            ui.actions?.like?.bgColor || "bg-white",
                            ui.actions?.like?.borderColor || "border-rose-50",
                            ui.actions?.like?.color || "text-red-500"
                        )}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <button
                            onClick={onLike}
                            className={cn(
                                "flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all active:scale-90 hover:scale-105 border-2",
                                liked
                                    ? (ui.actions?.like?.likedBgColor || ui.actions?.like?.bgColor || "bg-red-500") + " " + (ui.actions?.like?.likedColor || "text-white") + " " + (ui.actions?.like?.borderColor || "border-red-400")
                                    : (ui.actions?.like?.bgColor || "bg-white") + " " + (ui.actions?.like?.color || "text-red-500") + " " + (ui.actions?.like?.borderColor || "border-rose-50")
                            )}
                        >
                            <Heart className={cn("w-5 h-5 transition-colors", liked && "fill-current")} />
                        </button>
                        <button
                            onClick={onShare}
                            className={cn(
                                "flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all active:scale-90 hover:scale-105 border-2 pointer-events-auto",
                                ui.actions?.share?.bgColor || "bg-white",
                                ui.actions?.share?.borderColor || "border-rose-50",
                                ui.actions?.share?.color || "text-red-500"
                            )}
                        >
                            <Share2 className="w-5 h-5 stroke-[2.5px]" />
                        </button>
                    </div>
                </div>
            )}

            <div className={cn(ui.layout.headerWrapper, "pt-24 sm:pt-32 pb-8")}>
                {!isEditorContext && ui.header.badge && (
                    <div className="flex justify-center mb-4">
                        <span className={cn("px-4 py-1.5 rounded-full text-center", ui.header.badge, ui.header.badgeTextClass)}>
                            {config.content.headerBadge?.text || ui.header.badgeText}
                        </span>
                    </div>
                )}

                <UniversalHeader
                    title={renderEditableText('title', calendar.title || config.content.capsule.title || "Cápsula do Tempo", ui.header.title, "Digite o título...")}
                    subtitle={renderEditableText('header_message', calendar.header_message || config.content.subtitle || "", ui.header.subtitle, "Digite a mensagem...", 'textarea')}
                    config={config}
                    isEditor={showEditingControls}
                    onEdit={() => setEditingField('title')}
                    onEditSubtitle={() => setEditingField('header_message')}
                    onShare={onShare}
                    onLike={onLike}
                    liked={liked}
                    headerBgSvg={ui.layout.bgSvg}
                    showWatermark={showWatermark}
                />

                <UniversalProgress
                    progress={progress}
                    config={ui}
                    isEditor={showEditingControls}
                    onEdit={() => setEditingField('capsule_title')}
                    labelText={renderEditableText('capsule_title', calendar.capsule_title || ui.progress.labelText || "", "text-xs italic", "Digite o texto da barra...")}
                />

                {/* Future Calendar Banner */}
                {(() => {
                    const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar.created_at || new Date().toISOString());
                    const isFuture = isAfter(startOfDay(baseDate), startOfDay(new Date()));
                    if (isFuture && !previewMode) {
                        const diff = Math.ceil((startOfDay(baseDate).getTime() - startOfDay(new Date()).getTime()) / (1000 * 60 * 60 * 24));
                        return (
                            <motion.div
                                className="mt-6 mx-6 p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-foreground leading-tight">
                                            Estreia em {diff} {diff === 1 ? 'dia' : 'dias'}
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            Prepare-se para essa jornada mágica!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }
                    return null;
                })()}
            </div>

            <main className={ui.layout.mainClass}>
                {isEditorContext && !previewMode && (
                    <div className="grid grid-cols-2 gap-4 mb-8 px-2 max-w-lg mx-auto">
                        <div className={cn("bg-white/40 backdrop-blur-sm rounded-2xl p-4 border flex flex-col items-center text-center", ui.editor?.stats.card || "border-rose-100/50")}>
                            <span className={cn("text-xl font-black", ui.editor?.stats.number || "text-rose-900")}>{calendar.views || 0}</span>
                            <span className={cn("text-[8px] font-bold tracking-widest text-center", ui.editor?.stats.label || "text-rose-400")}>Visualizações</span>
                        </div>
                        <div className={cn("bg-white/40 backdrop-blur-sm rounded-2xl p-4 border flex flex-col items-center text-center", ui.editor?.stats.card || "border-rose-100/50")}>
                            <span className={cn("text-xl font-black", ui.editor?.stats.number || "text-rose-900")}>{completionPercentage}%</span>
                            <span className={cn("text-[8px] font-bold tracking-widest", ui.editor?.stats.label || "text-rose-400")}>Concluído</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                    {days.map((d) => {
                        const baseDate = calendar.start_date ? parseISO(calendar.start_date) : parseISO(calendar.created_at || new Date().toISOString());
                        const doorDate = startOfDay(addDays(baseDate, d.day - 1));
                        const isLocked = isAfter(doorDate, startOfDay(new Date()));

                        const isOpened = isEditorContext
                            ? (previewMode ? (openedDays.includes(d.day)) : !!(d.message || d.url))
                            : (openedDays.includes(d.day) || (d.opened_count || 0) > 0);

                        if ((previewMode || !isEditorContext) && isLocked) {
                            return (
                                <UniversalLockedCard
                                    key={d.day}
                                    dayNumber={d.day}
                                    timeText="Bloqueado"
                                    config={ui}
                                    isEditor={false}
                                    onClick={() => onLockedClick && onLockedClick(d.day, doorDate)}
                                />
                            );
                        }

                        if (isOpened) {
                            const isMedia = d.url && (d.content_type === 'photo' as any || d.content_type === 'gif' as any || d.content_type === 'video' as any);

                            if (!isMedia) {
                                return (
                                    <UniversalEnvelopeCard
                                        key={d.day}
                                        dayNumber={d.day}
                                        config={ui}
                                        onClick={() => onDayClick(d.day)}
                                        isEditor={showEditingControls}
                                        openedCount={d.opened_count || 0}
                                    />
                                );
                            }

                            return (
                                <UniversalUnlockedCard
                                    key={d.day}
                                    dayNumber={d.day}
                                    imageUrl={d.url || ""}
                                    config={ui}
                                    onClick={() => onDayClick(d.day)}
                                    isEditor={showEditingControls}
                                    contentType={d.content_type || 'photo'}
                                    openedCount={d.opened_count || 0}
                                />
                            );
                        }

                        if (isEditorContext && !previewMode && !d.message && !d.url) {
                            return <UniversalEmptyCard key={d.day} dayNumber={d.day} config={ui} onClick={() => onDayClick(d.day)} />;
                        }

                        return (
                            <UniversalEnvelopeCard
                                key={d.day}
                                dayNumber={d.day}
                                config={ui}
                                onClick={() => onDayClick(d.day)}
                                isEditor={showEditingControls}
                                openedCount={d.opened_count || 0}
                            />
                        );
                    })}
                </div>

                <UniversalQuote
                    text={renderEditableText('footer_message', calendar.footer_message || calendar.message || config.content.footerMessage || "", ui.quote.text, "Digite a mensagem de encerramento...", 'textarea')}
                    author={calendar.title || config.content.capsule.title || config.content.tipTitle || ""}
                    config={config}
                    isEditor={showEditingControls}
                    onEdit={() => setEditingField('footer_message')}
                    calendarMessage={calendar.footer_message || calendar.message}
                />
            </main>

            {showEditingControls ? null : (
                <UniversalFooter
                    config={ui}
                    isEditor={false}
                    onNavigate={() => {
                        const isPlus = PLUS_THEMES.includes(config.id);
                        if (isDemoMode && isPlus && !isAdmin) {
                            setShowUpgradeModal(true);
                        } else {
                            navigate(`/criar?theme=${config.id}`);
                        }
                    }}
                />
            )}

            {/* Footer Watermark for Free Users */}
            {showWatermark && (
                <div className="py-12 flex justify-center relative z-10">
                    <BrandWatermark />
                </div>
            )}

            <UpgradeChoiceModal
                themeId={config.id}
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                isAuthenticated={isAuthenticated}
            />

            {/* Floating Editor Action Bar (Owners Only) */}
            {showEditingControls && (
                <div className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 w-auto p-2.5 bg-white/95 backdrop-blur-xl border border-primary/10 z-[70] flex items-center gap-2 rounded-full shadow-2xl animate-in slide-in-from-bottom-8 duration-500 ring-1 ring-black/5">
                    <button
                        onClick={onShare}
                        className={cn(
                            "flex items-center justify-center gap-2 h-11 px-4 lg:px-6 rounded-full font-black text-[10px] uppercase tracking-widest text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap",
                            ui.footer.button.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('from-') || c.startsWith('to-') || c.startsWith('via-')).join(' ') || "bg-primary"
                        )}
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden lg:inline">Compartilhar</span>
                    </button>
                    <button
                        onClick={onStats}
                        className={cn(
                            "w-11 h-11 rounded-full bg-zinc-50 flex items-center justify-center border transition-all active:scale-90 hover:bg-zinc-100",
                            ui.footer.secondaryButton.split(' ').find(c => c.startsWith('text-')) || "text-primary",
                            "border-current/10"
                        )}
                        title="Ver Estatísticas"
                    >
                        <BarChart3 className="w-5 h-5 text-current" />
                    </button>
                </div>
            )}
        </div>
    );
};

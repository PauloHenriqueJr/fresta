import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Smartphone, Gift, ArrowLeft, Download, Calendar, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

/**
 * /c/:id — ALWAYS shows app download page. No web viewer at all.
 * Calendar viewing is exclusive to the mobile app.
 * If the app is installed, Android App Links / iOS Universal Links
 * intercept the URL before the browser even opens this page.
 */
export default function CalendarAppRedirect() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [calendarTitle, setCalendarTitle] = useState<string | null>(null);
    const [calendarTheme, setCalendarTheme] = useState<string | null>(null);
    const [ownerName, setOwnerName] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);

    const androidUrl = "https://play.google.com/store/apps/details?id=com.storyspark.fresta";
    const iosUrl = "https://apps.apple.com/app/fresta/id000000000";
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const deepLink = `fresta://c/${id}`;
    // Android intent:// URI — tries to open app, falls back to Play Store
    const androidIntentLink = `intent://c/${id}#Intent;scheme=fresta;package=com.storyspark.fresta;S.browser_fallback_url=${encodeURIComponent(androidUrl)};end`;

    // On mobile, attempt to open the app via deep link automatically
    useEffect(() => {
        // Remove the inline splash screen from index.html
        const splash = document.getElementById("fresta-calendar-splash");
        if (splash) splash.remove();
        const splashStyle = document.getElementById("fresta-splash");
        if (splashStyle) splashStyle.remove();

        if (!id) return;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            // Use intent:// on Android (reliable app opening), custom scheme on iOS
            window.location.href = isAndroid ? androidIntentLink : deepLink;
        }
    }, [id, deepLink, isAndroid, androidIntentLink]);

    // Fetch minimal calendar info for context
    useEffect(() => {
        if (!id) return;
        const fetchInfo = async () => {
            try {
                const { data } = await supabase
                    .from("calendars")
                    .select("title, theme_id, profiles:owner_id(display_name)")
                    .eq("id", id)
                    .single() as { data: any };
                if (data) {
                    setCalendarTitle(data.title);
                    setCalendarTheme(data.theme_id);
                    setOwnerName((data.profiles as any)?.display_name || null);
                }
            } catch {
                // Ignore — show generic message
            } finally {
                setFetching(false);
            }
        };
        fetchInfo();
    }, [id]);

    const themeLabels: Record<string, string> = {
        namoro: "Amor & Romance",
        casamento: "Casamento",
        bodas: "Bodas",
        noivado: "Noivado",
        aniversario: "Aniversário",
        natal: "Natal",
        viagem: "Viagem",
        carnaval: "Carnaval",
        saojoao: "São João",
        reveillon: "Réveillon",
        pascoa: "Páscoa",
        diadasmaes: "Dia das Mães",
        diadospais: "Dia dos Pais",
        diadascriancas: "Dia das Crianças",
        independencia: "Independência",
        estudos: "Estudos",
        metas: "Metas",
        default: "Calendário",
    };

    const themeLabel = calendarTheme ? (themeLabels[calendarTheme] || "Calendário") : "Calendário";

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Gift animation */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 rounded-3xl bg-white/20 backdrop-blur-sm animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Gift className="w-12 h-12 text-amber-300" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-bounce" />
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Você recebeu um presente!
                    </h1>

                    {fetching ? (
                        <div className="flex items-center justify-center gap-2 text-white/60">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Carregando...
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {calendarTitle && (
                                <p className="text-xl font-bold text-amber-300">
                                    &quot;{calendarTitle}&quot;
                                </p>
                            )}
                            <p className="text-white/80 text-lg leading-relaxed">
                                {ownerName
                                    ? `${ownerName} preparou um calendário especial de ${themeLabel} para você!`
                                    : `Alguém preparou um calendário especial de ${themeLabel} para você!`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Why download */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left space-y-3">
                    <p className="text-white font-bold text-sm uppercase tracking-wider">
                        Para abrir seu presente:
                    </p>
                    {[
                        { icon: Download, text: "Baixe o app Fresta (é grátis e leve)" },
                        { icon: Calendar, text: "O calendário abre automaticamente" },
                        { icon: Sparkles, text: "A cada dia, uma nova surpresa!" },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-white/90 text-sm font-medium">{text}</span>
                        </div>
                    ))}
                </div>

                {/* Already have the app? */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                    <p className="text-white/60 text-sm">
                        Já tem o app?{" "}
                        <a href={isAndroid ? androidIntentLink : deepLink} className="text-amber-300 font-bold underline underline-offset-2">
                            Toque aqui para abrir
                        </a>
                    </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-3">
                    <a
                        href={isIOS ? iosUrl : androidUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Smartphone className="w-5 h-5" />
                        {isIOS ? "Baixar na App Store" : "Baixar no Google Play"}
                    </a>

                    {!isIOS && (
                        <a
                            href={iosUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
                        >
                            Também disponível na App Store
                        </a>
                    )}
                </div>

                {/* Back */}
                <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar à página inicial
                </button>
            </div>
        </div>
    );
}
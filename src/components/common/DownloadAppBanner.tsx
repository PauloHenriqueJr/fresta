import { X, Smartphone, Sparkles } from "lucide-react";
import { useState } from "react";

const DISMISSED_KEY = "fresta_app_banner_dismissed";

export default function DownloadAppBanner() {
    const [dismissed, setDismissed] = useState(
        () => sessionStorage.getItem(DISMISSED_KEY) === "1"
    );

    if (dismissed) return null;

    const handleDismiss = () => {
        sessionStorage.setItem(DISMISSED_KEY, "1");
        setDismissed(true);
    };

    // TODO: Replace with real store URLs when published
    const androidUrl = "https://play.google.com/store/apps/details?id=com.storyspark.fresta";
    const iosUrl = "https://apps.apple.com/app/fresta/id000000000";
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const storeUrl = isIOS ? iosUrl : androidUrl;

    return (
        <div className="relative bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-amber-500/20 border-b border-amber-200/50 dark:border-amber-500/20 px-4 py-3">
            <div className="flex items-center justify-center gap-3 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <Smartphone className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                        <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                        A melhor experiência é no app!
                        <span className="hidden sm:inline"> Crie calendários com câmera, notificações e mais.</span>
                    </p>
                </div>
                <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm"
                >
                    Baixar App
                </a>
                <button
                    onClick={handleDismiss}
                    className="shrink-0 p-1 rounded-full hover:bg-amber-500/10 transition-colors text-amber-600 dark:text-amber-400"
                    aria-label="Fechar"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

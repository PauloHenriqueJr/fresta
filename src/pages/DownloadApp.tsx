import { Smartphone, ArrowLeft, Star, Shield, Bell, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Standalone page shown when B2C web routes are fully deprecated.
 * Explains that the feature moved to the mobile app and links to stores.
 */
export default function DownloadAppPage() {
    const navigate = useNavigate();

    // TODO: Replace with real store URLs when published
    const androidUrl = "https://play.google.com/store/apps/details?id=com.storyspark.fresta";
    const iosUrl = "https://apps.apple.com/app/fresta/id000000000";
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const features = [
        { icon: Camera, text: "Tire fotos direto da câmera" },
        { icon: Bell, text: "Receba lembretes de novas portas" },
        { icon: Shield, text: "Acesso offline aos seus calendários" },
        { icon: Star, text: "Experiência nativa e mais rápida" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Smartphone className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-foreground tracking-tight">
                        Mudamos para o app!
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        A criação de calendários agora é exclusiva do app Fresta.
                        Baixe grátis e tenha a melhor experiência.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 text-left">
                    {features.map(({ icon: Icon, text }) => (
                        <div
                            key={text}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border/50"
                        >
                            <Icon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-foreground">{text}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                    <a
                        href={isIOS ? iosUrl : androidUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isIOS ? "Baixar na App Store" : "Baixar no Google Play"}
                    </a>

                    {!isIOS && (
                        <a
                            href={iosUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                        >
                            Também disponível na App Store
                        </a>
                    )}
                </div>

                {/* Back */}
                <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar à página inicial
                </button>
            </div>
        </div>
    );
}

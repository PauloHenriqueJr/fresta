import React, { useState, useMemo } from "react";
import { useMemoria } from "../context/MemoriaContext";
import { useAuth } from "@/state/auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isInAppBrowser, getInAppBrowserName, isIOS, isAndroid } from "@/lib/utils/webview-detection";
import { toast } from "sonner";

export default function Step8_AuthWall() {
    const { state } = useMemoria();
    const { signInWithEmail, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [marketingConsent, setMarketingConsent] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    // Detect WebView
    const isWebView = useMemo(() => isInAppBrowser(), []);
    const webViewAppName = useMemo(() => getInAppBrowserName(), []);
    const browserName = isIOS() ? "Safari" : isAndroid() ? "Chrome" : "navegador";

    // Save quiz data to localStorage
    const saveQuizData = () => {
        const quizData = {
            recipient: state.recipient,
            relationship: state.recipient,
            occasion: state.occasion,
            timestamp: Date.now(),
            source: "memoria_flow"
        };
        console.log("AuthWall: Salvando pendência de quiz:", quizData);
        localStorage.setItem("fresta_pending_quiz", JSON.stringify(quizData));

        if (marketingConsent) {
            localStorage.setItem("fresta_marketing_consent", "true");
        } else {
            localStorage.removeItem("fresta_marketing_consent");
        }
    };

    // Handle Google login (only for non-WebView)
    const handleGoogleLogin = async () => {
        setLoading(true);
        saveQuizData();

        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Erro no login:", error);
            setLoading(false);
        }
    };

    // Handle Email Magic Link (for WebView users)
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            toast.error("Digite um email válido");
            return;
        }

        setLoading(true);
        saveQuizData();

        try {
            const { error } = await signInWithEmail(email);

            if (error) {
                toast.error("Erro ao enviar link. Tente novamente.");
                console.error("Email login error:", error);
            } else {
                setEmailSent(true);
                toast.success("Link enviado! Verifique seu email.");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            toast.error("Erro ao enviar link. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // Email sent success screen
    if (emailSent) {
        return (
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-8 py-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center"
                >
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-2xl font-bold text-stone-900">
                        Link enviado! 📧
                    </h2>
                    <p className="text-stone-600">
                        Enviamos um link mágico para:
                    </p>
                    <p className="font-medium text-stone-900 bg-stone-100 px-4 py-2 rounded-lg">
                        {email}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left w-full"
                >
                    <p className="text-sm font-medium text-amber-800 mb-2">
                        📱 Próximos passos:
                    </p>
                    <ol className="text-sm text-amber-700 space-y-2 list-decimal list-inside">
                        <li>Abra seu email (Gmail, Outlook...)</li>
                        <li>Clique no link que enviamos</li>
                        <li>O link abrirá no {browserName}</li>
                        <li>Sua memória estará salva! ✨</li>
                    </ol>
                </motion.div>

                <button
                    onClick={() => setEmailSent(false)}
                    className="text-stone-500 text-sm hover:text-stone-700 transition-colors"
                >
                    Usar outro email
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-stone-50 rounded-2xl"
            >
                <div className="relative">
                    <Lock className="text-stone-400 relative z-10" size={32} strokeWidth={1.5} />
                    {loading && (
                        <div className="absolute inset-0 bg-stone-50/80 flex items-center justify-center z-20">
                            <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-serif text-stone-800 leading-relaxed">
                    Para guardar essa memória <br />
                    e continuar criando com calma, <br />
                    precisamos salvá-la.
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full space-y-6"
            >
                <div className="space-y-3">
                    {/* Google Login - Only shown when NOT in WebView */}
                    {!isWebView && (
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className={`w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-lg font-medium hover:bg-stone-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span>Conectando...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continuar com Google
                                </>
                            )}
                        </button>
                    )}

                    {/* Email Magic Link - Shown in WebView */}
                    {isWebView && (
                        <form onSubmit={handleEmailLogin} className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Seu melhor email"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all text-stone-800 placeholder:text-stone-400"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className={`w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-lg font-medium hover:bg-stone-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 ${loading || !email ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span>Enviando...</span>
                                ) : (
                                    <>
                                        <ArrowRight className="w-5 h-5" />
                                        Receber link por email
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-stone-500 text-center">
                                🔒 Enviaremos um link mágico que abre no {browserName}
                            </p>
                        </form>
                    )}
                </div>

                <div
                    className="flex items-center justify-center gap-3 cursor-pointer group select-none"
                    onClick={() => !loading && setMarketingConsent(!marketingConsent)}
                >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${marketingConsent ? 'bg-stone-800 border-stone-800' : 'border-stone-300 group-hover:border-stone-500'}`}>
                        {marketingConsent && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-stone-500 text-sm group-hover:text-stone-700 text-left leading-tight">
                        Quero receber lembretes e novidades do Fresta.
                    </span>
                </div>

                <p className="text-[10px] text-stone-400 max-w-xs mx-auto leading-relaxed">
                    Ao continuar, você concorda com nossos{' '}
                    <a href="/#/termos" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600 transition-colors">
                        Termos de Uso
                    </a>
                    {' '}e{' '}
                    <a href="/#/privacidade" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600 transition-colors">
                        Política de Privacidade
                    </a>.
                </p>
            </motion.div>
        </div>
    );
}

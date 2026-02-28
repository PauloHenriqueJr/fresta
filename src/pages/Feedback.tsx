import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MessageSquare,
    Star,
    Bug,
    CheckCircle2,
    Send,
    ArrowLeft,
    Heart,
    ThumbsUp,
    CloudLightning
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/state/auth/AuthProvider";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type FeedbackCategory = "suggestion" | "bug" | "praise" | "other";

export default function Feedback() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [category, setCategory] = useState<FeedbackCategory>("suggestion");
    const [comment, setComment] = useState("");
    const [email, setEmail] = useState(user?.email || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }

        if (!comment.trim()) {
            toast.error("Por favor, conte-nos um pouco mais sobre sua experiência.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("feedbacks").insert({
                user_id: user?.id || null,
                rating,
                category,
                comment,
                email: email || null,
                status: category === "bug" ? "pending_bug" : "new", // Status inicial
                metadata: {
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    platform: "web"
                }
            });

            if (error) throw error;

            setIsSuccess(true);
            toast.success("Feedback enviado com sucesso! Obrigado pela ajuda.");

            // Resetar após 3 segundos e voltar
            setTimeout(() => {
                navigate(-1);
            }, 4000);

        } catch (err: any) {
            console.error("Erro ao enviar feedback:", err);
            toast.error("Não foi possível enviar o feedback. Tente novamente mais tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { id: "suggestion" as const, label: "Sugestão", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
        { id: "bug" as const, label: "Erro/Bug", icon: Bug, color: "text-festive-red", bg: "bg-red-50" },
        { id: "praise" as const, label: "Elogio", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
        { id: "other" as const, label: "Outro", icon: CloudLightning, color: "text-amber-500", bg: "bg-amber-50" },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Voltar</span>
                </button>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="border-border/40 shadow-xl shadow-black/5 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-primary to-festive-red" />
                                <CardHeader className="space-y-1 pb-4">
                                    <CardTitle className="text-3xl font-black tracking-tight text-center">Sua opinião importa muito! 📣</CardTitle>
                                    <p className="text-muted-foreground text-center">
                                        Ajude-nos a tornar o Fresta o melhor lugar para criar antecipação.
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-8 pt-4">
                                    {/* Rating Section */}
                                    <div className="space-y-4">
                                        <Label className="text-base font-bold flex justify-center">O quanto você gosta do Fresta?</Label>
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                    className="transition-all duration-200 transform hover:scale-125"
                                                >
                                                    <Star
                                                        className={`w-10 h-10 ${(hoverRating || rating) >= star
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-muted/20"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-center text-xs text-muted-foreground font-medium italic">
                                            {rating === 1 && "Pode melhorar muito..."}
                                            {rating === 2 && "Achei mediano."}
                                            {rating === 3 && "Gostei, mas falta algo."}
                                            {rating === 4 && "Muito bom!"}
                                            {rating === 5 && "Sensacional! 🎉"}
                                        </p>
                                    </div>

                                    {/* Category Section */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold">O que você quer nos dizer?</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 ${category === cat.id
                                                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.02]"
                                                            : "border-border/40 hover:border-border hover:bg-muted/50"
                                                        }`}
                                                >
                                                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">{cat.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment Section */}
                                    <div className="space-y-2">
                                        <Label htmlFor="comment" className="text-sm font-bold">Conte os detalhes</Label>
                                        <Textarea
                                            id="comment"
                                            placeholder={
                                                category === "bug"
                                                    ? "Descreva o que aconteceu, onde e como podemos reproduzir o erro..."
                                                    : "O que você adorou ou o que poderíamos melhorar? Não seja tímido!"
                                            }
                                            className="min-h-[120px] resize-none focus-visible:ring-primary border-border/60"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>

                                    {/* Email Section */}
                                    {!user && (
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-bold">Seu e-mail (opcional)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="para que possamos te dar um retorno..."
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="focus-visible:ring-primary border-border/60"
                                            />
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="bg-muted/30 border-t border-border/40 p-6">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full h-12 text-base font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </div>
                                        ) : (
                                            <>
                                                Enviar Feedback <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 py-12"
                        >
                            <div className="w-24 h-24 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black tracking-tight">Obrigado! ❤️</h2>
                                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                    Sua contribuição é fundamental para o crescimento do Fresta.
                                    Estamos lendo tudo e trabalhando para melhorar sua experiência.
                                </p>
                            </div>
                            <div className="pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/")}
                                    className="rounded-full px-8 border-border/60"
                                >
                                    Voltar para o Início
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium italic animate-pulse">
                                Redirecionando automaticamente em alguns segundos...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center mt-12 text-muted-foreground/60 text-[10px] items-center flex justify-center gap-1">
                    Feito com <Heart className="w-3 h-3 text-festive-red fill-current" /> por StorySpark
                </p>
            </motion.div>
        </div>
    );
}

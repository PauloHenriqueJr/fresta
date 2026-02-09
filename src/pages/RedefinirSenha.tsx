import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/state/auth/AuthProvider";
import { Loader2, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    if (!p1 || !p2) return false;
    if (p1 !== p2) return false;
    if (p1.length < 8) return false;
    return true;
  }, [p1, p2]);

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: p1 });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso.");
      navigate("/portal", { replace: true });
    } catch (e: any) {
      console.error("RedefinirSenha error:", e);
      toast.error(e?.message || "Erro ao atualizar senha.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the recovery token was invalid/expired, Supabase won't create a session.
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-border/20 bg-card p-8 space-y-4">
          <h1 className="text-2xl font-black">Link inválido ou expirado</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Solicite novamente a redefinição de senha no login corporativo.
          </p>
          <button
            onClick={() => navigate("/login-rh", { replace: true })}
            className="w-full py-3 rounded-2xl bg-primary text-white font-black"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-border/20 bg-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">Redefinir Senha</h1>
          <button
            onClick={() => navigate("/login-rh")}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nova senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border/30 bg-background font-bold"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              disabled={saving}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Confirmar senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border/30 bg-background font-bold"
              placeholder="Repita a senha"
              autoComplete="new-password"
              disabled={saving}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSave();
              }}
            />
          </div>
          {p1 && p2 && p1 !== p2 && (
            <p className="text-xs font-bold text-red-500">As senhas não conferem.</p>
          )}
        </div>

        <button
          onClick={() => void handleSave()}
          disabled={!canSubmit || saving}
          className="w-full py-3 rounded-2xl bg-primary text-white font-black disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Salvar nova senha
        </button>
      </div>
    </div>
  );
}


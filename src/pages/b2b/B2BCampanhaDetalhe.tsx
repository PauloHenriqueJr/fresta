import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";

export default function B2BCampanhaDetalhe() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"draft" | "active" | "archived">("draft");

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const campaign = useMemo(() => (id ? db.getB2BCampaign(id) : null), [id]);

  useEffect(() => {
    if (campaign) setStatus(campaign.status);
  }, [campaign]);

  if (!campaign) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-card">
        <p className="font-bold text-foreground">Campanha não encontrada</p>
        <p className="text-sm text-muted-foreground mt-1">Ela não existe neste dispositivo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/b2b/campanhas")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <B2BPageHeader
            title={campaign.title}
            subtitle={`${campaign.theme.toUpperCase()} • ${campaign.duration} dias`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Views", value: campaign.stats.views },
          { label: "Aberturas", value: campaign.stats.opens },
          { label: "Leads", value: campaign.stats.leads },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-4 shadow-card">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-card">
        <h2 className="font-bold text-foreground">Status</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No modo offline, permissões são apenas UI (mock).
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {([
            { key: "draft", label: "Rascunho" },
            { key: "active", label: "Ativa" },
            { key: "archived", label: "Arquivada" },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setStatus(opt.key);
                db.updateB2BCampaign(campaign.id, { status: opt.key });
              }}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                status === opt.key ? "border-primary bg-secondary" : "border-border bg-background"
              }`}
            >
              <span className="font-bold text-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.button
        className="btn-festive"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/b2b/analytics")}
      >
        Ver analytics
      </motion.button>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Clock, Layout, MousePointer2, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import { cn } from "@/lib/utils";

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
      <div className="p-12 text-center bg-white dark:bg-white/5 rounded-3xl border border-border/10">
        <h2 className="text-xl font-bold text-[#0E220E] dark:text-white">Campanha não encontrada</h2>
        <p className="text-muted-foreground/60 dark:text-white/40 mt-2">Ela não existe neste dispositivo.</p>
        <button onClick={() => navigate("/b2b/campanhas")} className="mt-6 text-sm font-bold text-[#F6D045] underline">Voltar para a lista</button>
      </div>
    );
  }

  const statItems = [
    { label: "Visualizações", value: campaign.stats.views, icon: Eye, bg: 'bg-[#FFF8E8] dark:bg-[#1C1A0E]', text: 'text-[#F9A03F]' },
    { label: "Aberturas", value: campaign.stats.opens, icon: MousePointer2, bg: 'bg-[#E8F5E0] dark:bg-[#0E1A12]', text: 'text-[#2D7A5F]' },
    { label: "Conversão", value: campaign.stats.leads, icon: Layout, bg: 'bg-[#D4F4F0] dark:bg-[#0E1A1A]', text: 'text-[#4ECDC4]' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header with Back Button */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/b2b/campanhas")}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-border/10 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-[#0E220E] dark:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045] truncate">
              {campaign.title}
            </h1>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              status === 'active' ? "bg-[#E8F5E0] text-[#2D7A5F]" : "bg-muted text-muted-foreground"
            )}>
              {status}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
            {campaign.theme.toUpperCase()} • {campaign.duration} dias de jornada
          </p>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statItems.map((s, idx) => (
          <motion.div
            key={s.label}
            className={cn("rounded-2xl p-6 border border-border/5", s.bg)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/40 dark:bg-black/10 flex items-center justify-center">
                <s.icon className={cn("w-5 h-5", s.text)} />
              </div>
            </div>
            <p className="text-3xl font-black text-[#0E220E] dark:text-white">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0E220E]/40 dark:text-white/30 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Campaign Control Card */}
      <div className="rounded-2xl p-6 md:p-8 border border-border/10 bg-white dark:bg-white/5">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-[#F6D045]" />
          <h2 className="text-xl font-bold text-[#0E220E] dark:text-white">Gerenciar Visibilidade</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { key: "draft", label: "Rascunho", desc: "Apenas você vê" },
            { key: "active", label: "Ativa", desc: "Visível para todos" },
            { key: "archived", label: "Arquivada", desc: "Finalizada" },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setStatus(opt.key);
                db.updateB2BCampaign(campaign.id, { status: opt.key });
              }}
              className={cn(
                "p-5 rounded-2xl border-2 text-left transition-all",
                status === opt.key
                  ? "border-[#F6D045] bg-[#F6D045]/10"
                  : "border-border/5 dark:border-white/5 bg-[#F9F9F9] dark:bg-white/5 hover:border-[#F6D045]/20"
              )}
            >
              <p className={cn("font-bold text-lg", status === opt.key ? "text-[#0E220E] dark:text-[#F6D045]" : "text-[#0E220E]/60 dark:text-white/40")}>
                {opt.label}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest opacity-40 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          className="flex-1 px-8 py-5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl bg-[#F6D045] text-[#0E220E] flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/b2b/analytics")}
        >
          <BarChart3 className="w-5 h-5" />
          Análise Completa de Dados
        </motion.button>

        <button
          className="px-8 py-5 rounded-2xl font-bold border-2 border-border/10 bg-white dark:bg-white/5 text-[#0E220E] dark:text-white hover:bg-muted dark:hover:bg-white/10 transition-all"
        >
          Editar Setup
        </button>
      </div>
    </div>
  );
}

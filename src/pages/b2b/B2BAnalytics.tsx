import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";

export default function B2BAnalytics() {
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const org = useMemo(() => (profile ? db.getB2BOrgByOwner(profile.id) : null), [profile]);
  const campaigns = useMemo(() => (org ? db.listB2BCampaigns(org.id) : []), [org]);

  const totals = useMemo(() => {
    return campaigns.reduce(
      (acc, c) => {
        acc.views += c.stats.views;
        acc.opens += c.stats.opens;
        acc.leads += c.stats.leads;
        return acc;
      },
      { views: 0, opens: 0, leads: 0 }
    );
  }, [campaigns]);

  return (
    <div className="space-y-6">
      <B2BPageHeader title="Analytics" subtitle="Consolidado por organização (offline)" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {[{ label: "Views", value: totals.views }, { label: "Aberturas", value: totals.opens }, { label: "Leads", value: totals.leads }].map((s, idx) => (
          <motion.div
            key={s.label}
            className="bg-card rounded-2xl p-4 shadow-card lg:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-card">
        <h2 className="font-bold text-foreground">Campanhas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No modo offline, estes números são locais e não representam tráfego real.
        </p>

        <div className="mt-4 divide-y divide-border">
          {campaigns.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.status.toUpperCase()} • {c.theme.toUpperCase()}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div><span className="font-semibold text-foreground">{c.stats.views}</span> views</div>
                <div><span className="font-semibold text-foreground">{c.stats.leads}</span> leads</div>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="py-6 text-center">
              <p className="font-bold text-foreground">Sem dados ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Crie campanhas para ver analytics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

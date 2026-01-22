import { useMemo, useState } from "react";
import { db } from "@/lib/offline/db";
import type { PlanInterval, PlanStatus, PricingPlanEntity } from "@/lib/offline/types";
import { generateId } from "@/lib/offline/db";

export default function AdminPlans() {
  const [refresh, setRefresh] = useState(0);
  const plans = useMemo(() => {
    void refresh;
    return db.listPlans();
  }, [refresh]);

  const upsert = (plan: PricingPlanEntity) => {
    db.upsertPlan(plan);
    setRefresh((x) => x + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Planos</h1>
          <p className="text-sm text-muted-foreground">CRUD offline (mock) para você preparar a estrutura do SaaS.</p>
        </div>
        <button
          className="btn-festive py-3 px-5"
          onClick={() => {
            const now = new Date().toISOString();
            upsert({
              id: generateId(),
              name: "Novo plano",
              interval: "month",
              priceCents: 1990,
              status: "active",
              createdAt: now,
              updatedAt: now,
            });
          }}
        >
          + Novo plano
        </button>
      </div>

      <div className="bg-card rounded-3xl p-5 shadow-card space-y-3">
        {plans.map((p) => (
          <div key={p.id} className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center border border-border rounded-2xl p-3">
            <div className="lg:col-span-4">
              <label className="text-xs font-semibold text-muted-foreground">Nome</label>
              <input
                className="w-full mt-1 p-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:border-primary"
                value={p.name}
                onChange={(e) => upsert({ ...p, name: e.target.value })}
              />
            </div>

            <div className="lg:col-span-3">
              <label className="text-xs font-semibold text-muted-foreground">Preço (R$)</label>
              <input
                type="number"
                className="w-full mt-1 p-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:border-primary"
                value={(p.priceCents / 100).toFixed(2)}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  upsert({ ...p, priceCents: Math.round((Number.isFinite(v) ? v : 0) * 100) });
                }}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Intervalo</label>
              <select
                className="w-full mt-1 p-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:border-primary"
                value={p.interval}
                onChange={(e) => upsert({ ...p, interval: e.target.value as PlanInterval })}
              >
                <option value="month">Mensal</option>
                <option value="year">Anual</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="text-xs font-semibold text-muted-foreground">Status</label>
              <select
                className="w-full mt-1 p-3 bg-background border border-border rounded-2xl text-foreground focus:outline-none focus:border-primary"
                value={p.status}
                onChange={(e) => upsert({ ...p, status: e.target.value as PlanStatus })}
              >
                <option value="active">Ativo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

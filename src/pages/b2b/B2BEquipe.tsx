import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useAuth } from "@/state/auth/AuthProvider";
import { db } from "@/lib/offline/db";
import { useToast } from "@/hooks/use-toast";
import type { B2BRole } from "@/lib/offline/types";
import B2BPageHeader from "@/components/b2b/B2BPageHeader";

const roleOptions: { value: B2BRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "analyst", label: "Analyst" },
];

const avatarOptions = ["🧑‍💼", "🧑‍💻", "🧑‍🎨", "🧑‍🔬", "🧑‍🏫", "🧑‍🚀", "🦊", "🐼"]; 

export default function B2BEquipe() {
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!profile) return;
    db.ensureB2BOrg(profile.id, profile.email);
  }, [profile]);

  const org = useMemo(() => (profile ? db.getB2BOrgByOwner(profile.id) : null), [profile]);
  const members = useMemo(() => (org ? db.listB2BMembers(org.id) : []), [org]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<B2BRole>("editor");
  const [avatar, setAvatar] = useState(avatarOptions[0]);

  const canInvite = name.trim() && email.trim() && !!org;

  const invite = () => {
    if (!org || !canInvite) return;
    db.inviteB2BMember(org.id, { name: name.trim(), email: email.trim(), role, avatar });
    toast({ title: "Convite criado", description: "No modo offline, é apenas um estado na UI." });
    setName("");
    setEmail("");
    setRole("editor");
    setAvatar(avatarOptions[0]);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <B2BPageHeader title="Equipe" subtitle="Papéis e convites (UI mock)" />

      <div className="bg-card rounded-3xl p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-foreground">Convidar membro</h2>
            <p className="text-sm text-muted-foreground">Cria um convite local para o MVP offline.</p>
          </div>
          <button onClick={invite} disabled={!canInvite} className={`btn-festive py-3 px-4 ${!canInvite ? "opacity-50 cursor-not-allowed" : ""}`}>
            <Plus className="w-4 h-4 inline-block mr-2" />
            Convidar
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="w-full p-4 bg-background border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-4 bg-background border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as B2BRole)}
            className="w-full p-4 bg-background border-2 border-border rounded-2xl text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <div className="grid grid-cols-4 gap-2">
            {avatarOptions.slice(0, 4).map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`h-14 rounded-2xl border-2 flex items-center justify-center ${
                  avatar === a ? "border-primary bg-secondary" : "border-border bg-background"
                }`}
              >
                <span className="text-xl">{a}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-card">
        <h2 className="font-bold text-foreground">Membros</h2>
        <div className="mt-4 divide-y divide-border">
          {members.map((m, idx) => (
            <motion.div
              key={m.id}
              className="py-3 flex items-center justify-between gap-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{m.avatar}</span>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-foreground">{m.role.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{m.status === "active" ? "Ativo" : "Convidado"}</p>
              </div>
            </motion.div>
          ))}

          {members.length === 0 && (
            <div className="py-8 text-center">
              <p className="font-bold text-foreground">Sem membros ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Convide alguém para começar a colaborar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

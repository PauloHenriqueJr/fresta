import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, UserCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/state/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { B2BRepository } from "@/lib/data/B2BRepository";

type B2BRole = "owner" | "admin" | "editor" | "analyst";

const roleOptions: { value: B2BRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "analyst", label: "Analyst" },
];

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
];

const getInitials = (name: string) => {
  if (!name.trim()) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

export default function B2BEquipe() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!profile) return;
      setLoading(true);
      try {
        const ensured = await B2BRepository.ensureOrgForOwner({
          ownerId: profile.id,
          ownerEmail: (profile as any).email,
          ownerName: (profile as any).display_name,
        });
        setOrg(ensured);
        const mems = await B2BRepository.getMembers((ensured as any).id);
        setMembers((mems as any[]) || []);
      } catch (e) {
        console.error("B2BEquipe load error:", e);
        setOrg(null);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [profile]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<B2BRole>("editor");

  const canInvite = name.trim() && email.trim() && !!org;

  const invite = async () => {
    if (!org || !canInvite) return;
    const initials = getInitials(name);
    // Store initials/color marker instead of emoji. 
    // Ideally we'd change the DB schema, but for compatibility we'll store a special marker or just empty string 
    // and rely on name derived avatar in UI. 
    // Since 'avatar' field exists, let's store the initials there for now.
    try {
      await B2BRepository.inviteMember((org as any).id, {
        name: name.trim(),
        email: email.trim(),
        role,
        avatar: initials,
      });

      const mems = await B2BRepository.getMembers((org as any).id);
      setMembers((mems as any[]) || []);

      toast({ title: "Convite criado", description: "Membro adicionado à equipe." });
      setName("");
      setEmail("");
      setRole("editor");
    } catch (e: any) {
      console.error("inviteMember error:", e);
      toast({ title: "Erro ao convidar", description: e?.message || "Tente novamente.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F6D045]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
          Equipe
        </h1>
        <p className="mt-1 text-muted-foreground/60 dark:text-white/40">
          Gerencie membros e permissões da sua organização
        </p>
      </div>

      {/* Invite Card */}
      <div className="rounded-[2rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-solidroad-text dark:text-white">
              Convidar membro
            </h2>
            <p className="text-sm text-muted-foreground/60 dark:text-white/40 mt-1">
              Adicione pessoas para colaborar em suas campanhas
            </p>
          </div>
          <button
            onClick={invite}
            disabled={!canInvite}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-solidroad-accent text-solidroad-text shadow-md hover:shadow-lg disabled:shadow-none"
          >
            <UserPlus className="w-5 h-5 stroke-[2.5]" />
            Enviar Convite
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Nome Completo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-5 py-3 rounded-xl border border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white focus:outline-none focus:ring-2 focus:ring-solidroad-accent/20 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">E-mail Corporativo</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@empresa.com"
              className="w-full px-5 py-3 rounded-xl border border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white focus:outline-none focus:ring-2 focus:ring-solidroad-accent/20 transition-all font-medium"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 dark:text-white/30 ml-1">Nível de Acesso</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as B2BRole)}
                className="w-full px-5 py-3 rounded-xl border border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white focus:outline-none focus:ring-2 focus:ring-solidroad-accent/20 transition-all appearance-none font-medium"
              >
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value} className="dark:bg-[#0E220E]">{r.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="rounded-[2rem] p-8 md:p-10 border border-border/10 bg-white dark:bg-white/5">
        <h2 className="text-xl font-bold tracking-tight text-solidroad-text dark:text-white mb-6">
          Membros da Equipe ({members.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m, idx) => {
            const initials = m.avatar && m.avatar.length <= 3 ? m.avatar : getInitials(m.name);
            const bgColor = getAvatarColor(m.name);

            return (
              <motion.div
                key={m.id}
                className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-border/5 dark:border-white/5 bg-[#F9F9F9] dark:bg-white/5 hover:border-solidroad-accent/20 transition-all"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black tracking-wide", bgColor)}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0E220E] dark:text-white truncate text-lg leading-tight">
                      {m.name}
                    </p>
                    <p className="text-sm text-muted-foreground/60 dark:text-white/30 truncate">
                      {m.email}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                    m.status === "active"
                      ? "bg-[#E8F5E0] dark:bg-[#0E1A12] text-[#2D7A5F]"
                      : "bg-muted dark:bg-white/10 text-muted-foreground/50"
                  )}>
                    {m.role}
                  </span>
                  <p className="text-[10px] font-medium text-muted-foreground/40 mt-1 uppercase">
                    {m.status === "active" ? "Ativo" : "Pendente"}
                  </p>
                </div>
              </motion.div>
            )
          })}

          {members.length === 0 && (
            <div className="md:col-span-2 py-16 text-center rounded-xl border-2 border-dashed border-border/10">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
              <p className="font-bold text-[#0E220E] dark:text-white">Nenhum membro ainda</p>
              <p className="text-sm text-muted-foreground/60 dark:text-white/40 mt-1">Convide sua equipe para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

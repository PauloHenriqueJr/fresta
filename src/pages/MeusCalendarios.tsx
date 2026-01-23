import { motion } from "framer-motion";
import { ArrowLeft, Plus, Search, MoreVertical, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { useAuth } from "@/state/auth/AuthProvider";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import type { Tables } from "@/lib/supabase/types";
import EmptyState from "@/components/common/EmptyState";

type Calendar = Tables<'calendars'>;

const getStatusBadge = (status: Calendar["status"]) => {
  const styles = {
    ativo: "bg-primary text-primary-foreground",
    rascunho: "bg-accent text-accent-foreground",
    finalizado: "bg-muted text-muted-foreground",
  };
  const labels = {
    ativo: "ATIVO",
    rascunho: "RASCUNHO",
    finalizado: "FINALIZADO",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const getThemeBg = (themeId: string) => {
  const def = getThemeDefinition(BASE_THEMES, themeId as any);
  return def?.gradientClass ?? "bg-gradient-festive";
};

const getThemeEmoji = (themeId: string) => {
  const def = getThemeDefinition(BASE_THEMES, themeId as any);
  return def?.emoji ?? "✨";
};

const MeusCalendarios = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();

  console.log('MeusCalendarios: Render cycle. User:', user?.email, 'AuthLoading:', authLoading);

  const [query, setQuery] = useState("");
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendars = async (userId: string) => {
    console.log('MeusCalendarios: Starting fetchCalendars for', userId);
    setLoading(true);
    setError(null);

    try {
      const data = await CalendarsRepository.listByOwner(userId);
      console.log('MeusCalendarios: Fetch completed with', data?.length, 'results');
      setCalendars(data || []);
    } catch (err: any) {
      console.error('MeusCalendarios: Fetch failed', err);
      setError('A conexão com o banco de dados falhou. Tente atualizar a página.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o calendário "${title}"? esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await CalendarsRepository.delete(id);
      setCalendars(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting calendar:', err);
      alert('Erro ao excluir calendário. Tente novamente.');
    }
  };

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchCalendars(user.id);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user?.id, authLoading]);
  const filteredCalendars = calendars.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.title.toLowerCase().includes(q);
  });

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando calendários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Desktop Only */}
      <div className="hidden lg:block px-4 pt-12 max-w-[1600px] lg:mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-card to-background border border-border/50 p-12 shadow-2xl hover:shadow-primary/10 transition-all duration-500 group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-primary/10 transition-colors duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-festive-red/5 rounded-full blur-[80px] -ml-32 -mb-32 group-hover:bg-festive-red/10 transition-colors duration-700" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-xs font-black text-primary uppercase tracking-[0.2em] animate-pulse">
                  Snapshot do Dia
                </span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-foreground mb-4">
                Olá, {profile?.display_name || user?.email?.split('@')[0]}!
              </h2>
              <p className="text-xl text-muted-foreground/80 font-medium max-w-md leading-relaxed">
                Você tem <span className="text-foreground font-black">{calendars.length} calendários</span> ativos. Continue espalhando alegria com suas contagens regressivas.
              </p>

              <div className="flex items-center gap-4 mt-10">
                <button
                  onClick={() => navigate("/criar")}
                  className="px-8 py-4 rounded-2xl bg-gradient-festive text-white font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-lg"
                >
                  + Criar Novo Calendário
                </button>
                <button
                  onClick={() => user?.id && fetchCalendars(user.id)}
                  className="px-6 py-4 rounded-2xl bg-card border border-border/50 text-foreground font-bold hover:bg-muted transition-all flex items-center gap-3"
                >
                  <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-background/40 backdrop-blur-xl rounded-[2rem] p-8 border border-border/30 hover:border-primary/30 transition-colors group/card">
                <span className="text-3xl mb-4 block group-hover/card:scale-110 transition-transform">👁️</span>
                <span className="text-3xl font-black block text-foreground tracking-tighter">
                  {calendars.reduce((acc, curr) => acc + (curr.views || 0), 0).toLocaleString()}
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Total Visualizações</span>
              </div>
              <div className="bg-background/40 backdrop-blur-xl rounded-[2rem] p-8 border border-border/30 hover:border-primary/30 transition-colors group/card">
                <span className="text-3xl mb-4 block group-hover/card:scale-110 transition-transform">🔥</span>
                <span className="text-3xl font-black block text-foreground tracking-tighter">
                  {calendars.filter(c => c.status === 'ativo').length}
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Calendários Ativos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search & Actions Bar */}
      <div className="px-4 mt-16 mb-12 max-w-[1600px] lg:mx-auto relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card/30 p-6 rounded-[2rem] border border-border/50 backdrop-blur-md">
          <motion.div
            className="flex items-center gap-4 bg-muted/30 backdrop-blur-xl rounded-[1.5rem] px-6 py-4 border border-border/50 lg:w-[480px] group focus-within:border-primary/50 transition-all shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar por título do calendário..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-medium"
            />
          </motion.div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 mr-2">Filtros:</span>
            <button className="px-5 py-2.5 rounded-xl bg-card border border-border shadow-sm text-sm font-bold text-foreground hover:border-primary transition-all">Todos</button>
            <button className="px-5 py-2.5 rounded-xl bg-card border border-border shadow-sm text-sm font-bold text-muted-foreground hover:border-primary transition-all">Ativos</button>
            <button className="px-5 py-2.5 rounded-xl bg-card border border-border shadow-sm text-sm font-bold text-muted-foreground hover:border-primary transition-all">Rascunhos</button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 mb-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Calendar List */}
      <div className="px-4 pb-12 max-w-[1600px] lg:mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-8">
          {filteredCalendars.map((calendar, index) => {
            console.log('MeusCalendarios: Rendering card for', calendar.id, calendar.title);
            return (
              <motion.div
                key={calendar.id}
                className="group relative bg-card rounded-[2.5rem] p-8 shadow-card flex flex-col gap-6 cursor-pointer border border-border/30 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => navigate(`/calendario/${calendar.id}`)}
              >
                {/* Visual Flair background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                <div className="flex items-center justify-between gap-4">
                  {/* Thumbnail larger */}
                  <div
                    className={`w-20 h-20 rounded-[1.5rem] ${getThemeBg(
                      calendar.theme_id
                    )} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <span className="text-4xl animate-bounce-slow">
                      {getThemeEmoji(calendar.theme_id)}
                    </span>
                  </div>

                  {/* Top Actions */}
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(calendar.status)}
                    <button
                      className="w-10 h-10 rounded-xl hover:bg-festive-red/10 flex items-center justify-center transition-all group/delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(calendar.id, calendar.title);
                      }}
                    >
                      <MoreVertical className="w-5 h-5 text-muted-foreground group-hover/delete:text-festive-red" />
                    </button>
                  </div>
                </div>

                {/* Info expanded */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground tracking-tight line-clamp-2">
                    {calendar.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-primary font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {calendar.duration} PORTAS
                    </p>
                    <p className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                      📊 {(calendar.views ?? 0).toLocaleString()} visualizações
                    </p>
                  </div>
                </div>

                {/* Stats bar indicator */}
                <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '65%' }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Editado recent.</span>
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-card flex items-center justify-center text-[10px] font-black shadow-sm">
                    {profile?.avatar || 'PH'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredCalendars.length === 0 && !loading && (
          <EmptyState
            title="Ainda não há calendários por aqui"
            description="Crie sua primeira contagem regressiva para o Carnaval, festas ou surpresas agora mesmo!"
            buttonText="Criar Meu Primeiro Calendário"
            onClick={() => navigate("/criar")}
          />
        )}
      </div>
    </div>
  );
};

export default MeusCalendarios;

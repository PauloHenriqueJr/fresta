import { motion } from "framer-motion";
import { Search, Filter, Heart, Eye, TrendingUp, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/state/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import type { Tables } from "@/lib/supabase/types";

type Calendar = Tables<'calendars'>;

const getThemeGradient = (themeId: string) => {
  const def = getThemeDefinition(BASE_THEMES, themeId as any);
  return def?.gradientClass ?? "bg-gradient-festive";
};

const getThemeEmoji = (themeId: string) => {
  const def = getThemeDefinition(BASE_THEMES, themeId as any);
  return def?.emoji ?? "✨";
};

const Explorar = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [calendars, setCalendars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const data = await CalendarsRepository.listPublic();
        setCalendars(data);
      } catch (err) {
        console.error("Error fetching public calendars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublic();
  }, []);

  const filtered = calendars.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const featured = filtered.slice(0, 2);
  const recent = filtered.slice(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Discovery Hero - Desktop Only */}
      <div className="hidden lg:block px-6 pt-12 max-w-[1200px] mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-card via-background to-card border border-border/50 p-16 shadow-2xl group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Animated bokeh elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse duration-[10s]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-festive-yellow/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse duration-[8s]" />

          <div className="relative z-10 flex flex-col items-start gap-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary neon-glow">
                <Sparkles className="w-8 h-8" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-primary/60">Descubra a Magia</span>
            </div>

            <h1 className="text-6xl font-black tracking-tighter text-foreground max-w-2xl leading-[1.05]">
              Encontre o <span className="text-gradient-festive">calendário perfeito</span> para seu próximo evento.
            </h1>

            <p className="text-xl text-muted-foreground/80 font-medium max-w-xl leading-relaxed">
              Explore criações incríveis da comunidade Fresta e inspire-se para criar sua própria contagem regressiva personalizada.
            </p>

            <div className="flex items-center gap-4 w-full lg:max-w-xl mt-4">
              <div className="flex-1 flex items-center gap-4 bg-muted/40 backdrop-blur-xl rounded-3xl px-8 py-5 border border-border/50 group/search focus-within:border-primary/50 transition-all shadow-xl shadow-black/5">
                <Search className="w-6 h-6 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Busque por festivais, datas, temas..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                />
              </div>
              <button className="w-20 h-20 rounded-3xl bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-all">
                <Filter className="w-8 h-8 text-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header Section - Mobile/Standard */}
      <div className="px-6 pt-12 lg:pt-16 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Explorar</h1>
          <p className="text-muted-foreground font-medium">Descubra calendários incríveis</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 flex items-center gap-3 bg-muted/30 backdrop-blur-xl rounded-2xl px-6 py-4 border border-border/50 focus-within:border-primary/50 transition-all">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar calendários..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-medium"
            />
          </div>
          <button className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all shadow-sm">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {/* Featured Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black text-foreground">Em Destaque</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((calendar) => (
              <motion.div
                key={calendar.id}
                className="group cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/c/${calendar.id}`)}
              >
                <div className={`aspect-[16/9] rounded-[2.5rem] p-8 ${getThemeGradient(calendar.theme_id)} relative overflow-hidden flex flex-col justify-end shadow-xl transition-all duration-500`}>
                  <div className="absolute top-6 left-6 text-5xl drop-shadow-lg transform transition-transform group-hover:scale-110 duration-500">{getThemeEmoji(calendar.theme_id)}</div>
                  <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                    EM ALTA
                  </div>

                  <div className="relative z-10 transition-transform duration-500">
                    <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md">{calendar.title}</h3>
                    <p className="text-white/80 font-bold text-sm mt-1">por {calendar.profiles?.display_name || 'Usuário'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 px-2 text-muted-foreground font-bold text-sm">
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {calendar.views >= 1000 ? `${(calendar.views / 1000).toFixed(1)}k` : calendar.views}
                  </span>
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {calendar.likes || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Section */}
        <section>
          <h2 className="text-xl font-black text-foreground mb-6">Recentes</h2>
          <div className="grid grid-cols-1 gap-4">
            {recent.map((calendar) => (
              <motion.div
                key={calendar.id}
                className="bg-card/40 hover:bg-card/60 rounded-3xl p-5 border border-border/40 flex items-center gap-5 cursor-pointer transition-all hover:shadow-lg group"
                onClick={() => navigate(`/c/${calendar.id}`)}
              >
                <div className={`w-16 h-16 rounded-[1.25rem] ${getThemeGradient(calendar.theme_id)} flex items-center justify-center text-2xl shadow-inner transform transition-transform group-hover:scale-105`}>
                  {getThemeEmoji(calendar.theme_id)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-foreground truncate">{calendar.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium">por {calendar.profiles?.display_name || 'Usuário'}</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-muted-foreground font-bold text-[13px] pr-2">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {calendar.views >= 1000 ? `${(calendar.views / 1000).toFixed(1)}k` : calendar.views}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    {calendar.likes || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-card/20 rounded-[3rem] border border-dashed border-border/50">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Nenhum calendário encontrado.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Explorar;

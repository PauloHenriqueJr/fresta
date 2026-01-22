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
  const [calendars, setCalendars] = useState<Calendar[]>([]);
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

  const featured = filtered.slice(0, 3);
  const recent = filtered.slice(3);

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
      <div className="hidden lg:block px-4 pt-12 max-w-[1600px] lg:mx-auto">
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

      {/* Header - Mobile Only */}
      <motion.header
        className="px-4 py-4 lg:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-extrabold text-foreground">Explorar</h1>
        </div>
      </motion.header>


      {/* Featured Section */}
      {featured.length > 0 && (
        <motion.section
          className="mb-8 max-w-[1600px] lg:mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-4 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Em Destaque</h2>
          </div>
          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {featured.map((calendar) => (
              <motion.div
                key={calendar.id}
                className="flex-shrink-0 w-80 lg:w-full group"
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/c/${calendar.id}`)}
              >
                <div
                  className={`h-64 rounded-[2.5rem] bg-gradient-to-br ${getThemeGradient(
                    calendar.theme_id
                  )} p-8 flex flex-col justify-between cursor-pointer shadow-xl relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-5xl animate-bounce-slow drop-shadow-lg">{getThemeEmoji(calendar.theme_id)}</span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                      Trending
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-md">
                      {calendar.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/80 font-bold text-sm">
                      <span className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full">
                        <Eye className="w-4 h-4" />
                        {(calendar.views ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recent Section */}
      <motion.section
        className="px-4 max-w-[1600px] lg:mx-auto lg:pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-bold text-foreground mb-4">Recentes</h2>
        {recent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.map((calendar, index) => (
              <motion.div
                key={calendar.id}
                className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 cursor-pointer hover:shadow-festive transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => navigate(`/c/${calendar.id}`)}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getThemeGradient(
                    calendar.theme_id
                  )} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-xl">{getThemeEmoji(calendar.theme_id)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">
                    {calendar.title}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {calendar.views ?? 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nenhum calendário público encontrado.</p>
          </div>
        ) : null}
      </motion.section>

      {/* Bottom Navigation - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border py-4 px-4 lg:hidden">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => navigate("/explorar")}
            className="flex flex-col items-center gap-1 text-primary"
          >
            <span className="text-2xl">🔍</span>
            <span className="text-xs font-medium">Explorar</span>
          </button>
          <motion.button
            className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg"
            onClick={() => navigate("/criar")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Criar Novo
          </motion.button>
          <button
            onClick={() => navigate("/meus-calendarios")}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <span className="text-2xl">📅</span>
            <span className="text-xs">Meus</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explorar;

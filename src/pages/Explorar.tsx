import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import { Search, Filter, Heart, Eye, TrendingUp, Loader2, Sparkles, ArrowRight, Globe, DoorOpen } from "lucide-react";
import { PremiumIcon } from "@/components/PremiumIcon";
import { useAuth } from "@/state/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

// Import mascots
import mascotNatal from "@/assets/mascot-natal.jpg";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.png";
import mascotNamoro from "@/assets/mascot-namoro.jpg";

const mascotByKey: Record<string, string> = {
  natal: mascotNatal,
  carnaval: mascotCarnaval,
  saojoao: mascotSaoJoao,
  namoro: mascotNamoro,
};

type Calendar = Tables<'calendars'>;

// Solidroad-style pastel colors for cards
const CARD_COLORS = [
  'bg-[#FFF8E8]', // beige
  'bg-[#D4F4F0]', // turquoise
  'bg-[#E8F5E0]', // green
  'bg-[#FFE5EC]', // pink
  'bg-[#E8E4F5]', // lavender
  'bg-[#FFF0E5]', // peach
];

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

  const featured = filtered.slice(0, 3);
  const recent = filtered.slice(3);

  const officialTemplates = BASE_THEMES.filter(t =>
    ["natal", "carnaval", "saojoao", "namoro"].includes(t.id)
  );

  const demoById: Record<string, string> = {
    carnaval: "/calendario/carnaval",
    saojoao: "/calendario/saojoao",
    natal: "/calendario/natal",
    reveillon: "/calendario/reveillon",
    pascoa: "/calendario/pascoa",
    independencia: "/calendario/independencia",
    namoro: "/calendario/namoro",
    casamento: "/calendario/casamento",
  };

  if (loading) {
    return <Loader text="Explorando frestas..." />;
  }

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-300">
      {/* Hero Section - Solidroad Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#2D7A5F]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 400">
            <defs>
              <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-16 right-[10%] w-40 h-40 bg-[#F9A03F]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-[15%] w-32 h-32 bg-[#4ECDC4]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 lg:py-20">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Globe className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Comunidade Fresta</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Descubra calendários
              <br />
              <span className="text-[#FFD166]">incríveis</span>
            </h1>

            <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto">
              Explore criações da comunidade e inspire-se para criar
              sua própria contagem regressiva.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Bar - Floating White */}
      <div className="container mx-auto px-6 -mt-6 relative z-20">
        <motion.div
          className="bg-card rounded-2xl shadow-xl p-4 flex items-center gap-4 border border-border/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Buscar calendários por tema, título..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-medium text-lg lg:text-xl px-2"
            />
          </div>
          <button className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/60 hover:bg-solidroad-accent/10 hover:text-solidroad-accent transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 pt-12">
        {/* Official Templates Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-solidroad-accent" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Destaques da Comunidade</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {officialTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
                onClick={() => navigate(demoById[template.id] ? `${demoById[template.id]}?template=true` : `/criar?theme=${template.id}`)}
                className="group relative h-48 bg-card rounded-[2.5rem] border border-border/10 cursor-pointer overflow-hidden transition-all duration-500"
              >
                {/* Decorative Background Mascot - Floating and Cutout style */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:opacity-40 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                  <img
                    src={mascotByKey[template.id]}
                    alt=""
                    className="w-full h-full object-contain filter grayscale invert brightness-125 dark:brightness-100 contrast-125"
                    style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)' }}
                  />
                </div>

                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-lg",
                      template.id === 'namoro' ? 'bg-gradient-romance' : template.gradientClass
                    )}>
                      <PremiumIcon name={template.iconName} className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-xl text-foreground group-hover:text-solidroad-accent transition-colors leading-tight">{template.name}</h3>
                    <p className="text-[10px] font-bold text-solidroad-accent/70 uppercase tracking-widest">
                      Por Equipe Fresta
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {Math.floor(Math.random() * 500) + 500}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {Math.floor(Math.random() * 50) + 10}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-solidroad-accent uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      VER EXEMPLO
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-solidroad-accent/0 to-solidroad-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>
        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-solidroad-accent" />
              <h2 className="text-xl font-black text-foreground tracking-tight">Em Destaque</h2>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
              {featured.map((calendar, index) => (
                <motion.div
                  key={calendar.id}
                  className={cn(
                    "group relative rounded-[2.5rem] p-8 min-h-[300px] border border-border/10 overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300",
                    CARD_COLORS[index % CARD_COLORS.length],
                    "dark:!bg-card dark:hover:border-solidroad-accent/20"
                  )}
                  onClick={() => navigate(`/c/${calendar.id}?template=true`)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  {/* Arrow icon */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-white shadow-sm" />
                  </div>

                  {/* Em Alta badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-[#F9A03F] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Em Alta
                    </span>
                  </div>

                  {/* Theme Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center mb-6 mt-8 shadow-sm">
                    <PremiumIcon name={calendar.theme_id ? getThemeDefinition(BASE_THEMES, calendar.theme_id)?.iconName || "Sparkles" : "Sparkles"} className="w-8 h-8 text-solidroad-accent" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#1A3E3A] dark:text-foreground leading-tight line-clamp-2">
                      {calendar.title}
                    </h3>
                    <p className="text-[#5A7470] dark:text-muted-foreground/60 text-sm font-bold uppercase tracking-wider">
                      por {calendar.profiles?.display_name || 'Usuário'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-6 left-8 right-8 flex items-center gap-4 text-[#5A7470] dark:text-muted-foreground/60 text-sm font-black">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full">
                      <Eye className="w-4 h-4" />
                      {calendar.views >= 1000 ? `${(calendar.views / 1000).toFixed(1)}k` : calendar.views}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full">
                      <Heart className="w-4 h-4" />
                      {calendar.likes || 0}
                    </span>
                  </div>

                  {/* Hover border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F9A03F] to-[#4ECDC4] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* All Calendars Section */}
        <section>
          <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-solidroad-accent" />
            Todos os Calendários
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-[2.5rem] border border-border/10 shadow-xl">
              <Sparkles className="w-16 h-16 text-solidroad-accent/20 mx-auto mb-4" />
              <p className="text-foreground font-black text-xl mb-2">
                Ainda não há calendários por aqui...
              </p>
              <p className="text-muted-foreground/60 font-medium mb-8 max-w-sm mx-auto">
                {query ? `Não encontramos nada para "${query}".` : "Seja o primeiro a compartilhar sua contagem regressiva com a comunidade!"}
              </p>
              <button
                onClick={() => navigate("/criar")}
                className="px-8 py-3 rounded-2xl bg-solidroad-accent text-solidroad-text font-black shadow-glow-accent hover:scale-105 transition-all"
              >
                Criar Meu Calendário
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }}
            >
              {recent.map((calendar, index) => (
                <motion.div
                  key={calendar.id}
                  className="group bg-card rounded-[2rem] p-5 border border-border/10 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 flex items-center gap-5"
                  onClick={() => navigate(`/c/${calendar.id}`)}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  {/* Theme Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${CARD_COLORS[(index + 3) % CARD_COLORS.length]}`}>
                    <PremiumIcon name={getThemeDefinition(BASE_THEMES, calendar.theme_id)?.iconName || "Sparkles"} className="w-6 h-6 text-solidroad-accent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-foreground truncate group-hover:text-solidroad-accent transition-colors">{calendar.title}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">por {calendar.profiles?.display_name || 'Usuário'}</p>
                  </div>

                  {/* Arrow */}
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-solidroad-accent" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Explorar;

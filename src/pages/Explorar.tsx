import { motion } from "framer-motion";
import { Search, Filter, Heart, Eye, TrendingUp, Loader2, Sparkles, ArrowRight, Globe } from "lucide-react";
import { PremiumIcon } from "@/components/PremiumIcon";
import { useAuth } from "@/state/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { BASE_THEMES, getThemeDefinition } from "@/lib/offline/themes";
import type { Tables } from "@/lib/supabase/types";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D7A5F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F5] pb-24">
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
          className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#5A7470]" />
            <input
              type="text"
              placeholder="Buscar calendários por tema, título..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-[#1A3E3A] placeholder:text-[#9CA3AF] focus:outline-none font-medium"
            />
          </div>
          <button className="w-12 h-12 rounded-xl bg-[#F8F9F5] flex items-center justify-center text-[#5A7470] hover:bg-[#E8F5E0] transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 pt-12">
        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#F9A03F]" />
              <h2 className="text-lg font-bold text-[#1A3E3A]">Em Destaque</h2>
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
                  className={`group relative rounded-3xl p-8 min-h-[280px] border border-[rgba(0,0,0,0.06)] overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 ${CARD_COLORS[index % CARD_COLORS.length]}`}
                  onClick={() => navigate(`/c/${calendar.id}`)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  {/* Arrow icon */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-[#2D7A5F]" />
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
                    <h3 className="text-xl font-bold text-[#1A3E3A] leading-tight line-clamp-2">
                      {calendar.title}
                    </h3>
                    <p className="text-[#5A7470] text-sm">
                      por {calendar.profiles?.display_name || 'Usuário'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-6 left-8 right-8 flex items-center gap-4 text-[#5A7470] text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      {calendar.views >= 1000 ? `${(calendar.views / 1000).toFixed(1)}k` : calendar.views}
                    </span>
                    <span className="flex items-center gap-1.5">
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
          <h2 className="text-lg font-bold text-[#1A3E3A] mb-6">Todos os Calendários</h2>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(0,0,0,0.06)]">
              <Sparkles className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-[#5A7470] font-medium">
                {query ? `Nenhum resultado para "${query}"` : "Nenhum calendário público disponível."}
              </p>
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
                  className="group bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] cursor-pointer transition-all duration-300 flex items-center gap-5"
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
                    <h3 className="text-base font-bold text-[#1A3E3A] truncate">{calendar.title}</h3>
                    <p className="text-sm text-[#5A7470]">por {calendar.profiles?.display_name || 'Usuário'}</p>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-8 rounded-lg bg-[#F8F9F5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-[#2D7A5F]" />
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

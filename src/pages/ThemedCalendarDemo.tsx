import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CalendarGrid from "@/components/calendar/CalendarGrid";
import FloatingDecorations from "@/components/calendar/FloatingDecorations";
import ProgressBar from "@/components/calendar/ProgressBar";
import ShareButton from "@/components/calendar/ShareButton";
import TipCard from "@/components/calendar/TipCard";
import { BASE_THEMES } from "@/lib/offline/themes";
import type { ThemeDefinition, ThemeId } from "@/lib/offline/types";

import heroMascot from "@/assets/hero-mascot.png";
import mascotCarnaval from "@/assets/mascot-carnaval.jpg";
import mascotSaoJoao from "@/assets/mascot-saojoao.jpg";
import mascotPeeking from "@/assets/mascot-peeking.png";
import mascotNatal from "@/assets/mascot-natal.jpg";
import mascotReveillon from "@/assets/mascot-reveillon.jpg";
import mascotPascoa from "@/assets/mascot-pascoa.jpg";
import mascotIndependencia from "@/assets/mascot-independencia.jpg";
import mascotNamoro from "@/assets/mascot-namoro.jpg";
import mascotCasamento from "@/assets/mascot-casamento.jpg";
import mascotDiaDasCriancas from "@/assets/mascot-diadascriancas.jpg";
import mascotDiaDasMaes from "@/assets/mascot-diadasmaes.jpg";
import mascotDiaDosPais from "@/assets/mascot-diadospais.jpg";
import mascotViagem from "@/assets/mascot-viagem.jpg";
import mascotMetas from "@/assets/mascot-metas.jpg";
import mascotEstudos from "@/assets/mascot-estudo.jpg";
import mascotAniversario from "@/assets/mascot-aniversario.jpg";
import mascotNoivado from "@/assets/mascot-noivado.jpg";
import mascotBodas from "@/assets/mascot-bodas.jpg";

const imageByKey: Record<ThemeDefinition["imageKey"], string> = {
  noivado: mascotNoivado,
  bodas: mascotBodas,
  peeking: mascotPeeking,
  carnaval: mascotCarnaval,
  saojoao: mascotSaoJoao,
  natal: mascotNatal,
  reveillon: mascotReveillon,
  pascoa: mascotPascoa,
  independencia: mascotIndependencia,
  namoro: mascotNamoro,
  casamento: mascotCasamento,
  diadascriancas: mascotDiaDasCriancas,
  diadasmaes: mascotDiaDasMaes,
  diadospais: mascotDiaDosPais,
  viagem: mascotViagem,
  metas: mascotMetas,
  estudos: mascotEstudos,
  aniversario: mascotAniversario,
};

const sampleCalendarDays = Array.from({ length: 24 }, (_, i) => {
  const day = i + 1;
  if (day <= 6) return { day, status: "opened" as const, hasSpecialContent: day === 2 };
  if (day === 7) return { day, status: "available" as const, hasSpecialContent: true };
  const daysUntil = day - 7;
  return { day, status: "locked" as const, timeLeft: daysUntil === 1 ? "14h" : `${daysUntil}D` };
});

type DemoKey = Exclude<ThemeId, "carnaval" | "saojoao"> | "carnaval" | "saojoao";

const tipCopyByTheme: Partial<Record<DemoKey, { title: string; message: string }>> = {
  natal: {
    title: "Dica do Noel",
    message: "Escolha um dia pra uma surpresa grande e deixe pistas nos dias anteriores.",
  },
  reveillon: {
    title: "Dica do Ano Novo",
    message: "Use os primeiros dias para memórias e o último para o convite/contagem regressiva.",
  },
  pascoa: {
    title: "Dica da Páscoa",
    message: "Intercale mensagens curtas com fotos e um ‘vale chocolate’ no dia final.",
  },
  independencia: {
    title: "Dica do Brasil",
    message: "Faça cada dia destacar uma história/lembrança — termina com um grande ‘Viva!’",
  },
  namoro: {
    title: "Dica do Coração",
    message: "Crie uma escalada de carinho + pistas… e no último dia vem o pedido.",
  },
  casamento: {
    title: "Dica do Casamento",
    message: "Misture promessas, memórias e planejamento — e deixe o ‘sim’ para o final.",
  },
};

export default function ThemedCalendarDemo({ themeId }: { themeId: DemoKey }) {
  const navigate = useNavigate();
  const [openedDay, setOpenedDay] = useState<number | null>(null);

  const theme = useMemo(() => BASE_THEMES.find((t) => t.id === themeId) ?? null, [themeId]);

  if (!theme) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="card-festive max-w-md w-full text-center">
          <h1 className="text-xl font-extrabold text-foreground">Tema não encontrado</h1>
          <p className="text-sm text-muted-foreground mt-2">Volte e escolha outro tema.</p>
          <button
            className="mt-4 btn-festive"
            onClick={() => navigate("/escolher-tema")}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const tip = tipCopyByTheme[themeId] ?? {
    title: "Dica do dia",
    message: "Complete as portas com pequenas pistas e finalize com a surpresa principal.",
  };

  const floatingTheme = themeId as Parameters<typeof FloatingDecorations>[0]["theme"];
  const uiTheme: Parameters<typeof ProgressBar>[0]["theme"] =
    themeId === "carnaval" ? "carnaval" : themeId === "saojoao" ? "saojoao" : "default";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingDecorations theme={floatingTheme} />

      <motion.header
        className="px-4 py-3 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/meus-calendarios")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-festive transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <span className="badge-festive bg-secondary text-secondary-foreground text-xs">
            {theme.name.toUpperCase()}
          </span>

          <div className="w-10" />
        </div>

        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl ${theme.gradientClass} overflow-hidden`}>
            <img
              src={imageByKey[theme.imageKey]}
              alt={`Mascote do tema ${theme.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
              {theme.name} <span aria-hidden>{theme.emoji}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {theme.description ?? "Uma surpresa por dia"}
            </p>
          </div>
        </div>
      </motion.header>

      <motion.section
        className="px-4 py-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ProgressBar progress={35} label="35% do caminho" daysLeft={10} theme={uiTheme} />
      </motion.section>

      <section className="px-4 relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="text-lg">📅</span>
          <h2 className="text-lg font-bold text-foreground">Calendário</h2>
        </motion.div>

        <CalendarGrid
          title={theme.name}
          month="DEMO"
          days={sampleCalendarDays}
          onDayClick={(d) => setOpenedDay(d)}
          theme={uiTheme}
        />
      </section>

      <section className="px-4 mt-6 relative z-10">
        <TipCard title={tip.title} message={tip.message} theme={uiTheme} />
      </section>

      <ShareButton
        label={openedDay ? `Compartilhar dia ${openedDay}` : "Compartilhar"}
        onClick={() => {
          // offline/mock
          console.log("share", { themeId, openedDay });
        }}
        theme={uiTheme}
      />

      <div className="h-28" />
    </div>
  );
}

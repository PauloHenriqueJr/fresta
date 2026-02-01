import { UniversalTemplate } from "@/components/themes/UniversalTemplate";
import { getThemeConfig } from "@/lib/themes/registry";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/lib/supabase/types";

// Demo data for theme preview - matching Supabase CalendarDay type
const demoDays: Tables<'calendar_days'>[] = [
  { id: "demo-1", calendar_id: "demo", day: 1, content_type: "text", message: "Que este ano novo traga muitas conquistas!", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-2", calendar_id: "demo", day: 2, content_type: "text", message: "Celebre cada momento como se fosse único.", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-3", calendar_id: "demo", day: 3, content_type: "text", message: "Novos sonhos, novas metas, novo ano!", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-4", calendar_id: "demo", day: 4, content_type: null, message: "A contagem regressiva começou...", url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-5", calendar_id: "demo", day: 5, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-6", calendar_id: "demo", day: 6, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-7", calendar_id: "demo", day: 7, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Demo calendar data
const demoCalendar: any = {
  id: "demo",
  owner_id: "demo-user",
  title: "Contagem para o Novo Ano",
  theme_id: "reveillon",
  duration: 7,
  status: "ativo",
  privacy: "public",
  password: null,
  start_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  views: 42,
  likes: 10,
  shares: 5,
  is_premium: true,
  header_message: "Cada janela é um passo rumo a um ano incrível",
  footer_message: "Que o próximo ano traga ainda mais momentos especiais! 🥂✨",
  capsule_title: "Contagem Regressiva",
  capsule_message: null,
  locked_title: null,
  locked_message: null,
  keep_active: false,
  expires_at: null,
  addons: null,
};

export default function CalendarioReveillon() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const themeConfig = getThemeConfig("reveillon");

  const handleDayClick = (day: number) => {
    console.log("Opening day:", day);
    toast({
      title: `Porta ${day} aberta!`,
      description: "Uma nova surpresa do ano novo foi revelada!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link copiado!",
      description: "O link do calendário foi copiado para a área de transferência.",
    });
  };

  return (
    <UniversalTemplate
      config={themeConfig}
      calendar={demoCalendar}
      days={demoDays}
      openedDays={[1, 2, 3]}
      isEditor={false}
      isEditorContext={false}
      onNavigateBack={() => navigate("/explorar")}
      onShare={handleShare}
      onDayClick={handleDayClick}
      onLockedClick={(day) => console.log("Locked day:", day)}
      showWatermark={false}
    />
  );
}

import { UniversalTemplate } from "@/components/themes/UniversalTemplate";
import { getThemeConfig } from "@/lib/themes/registry";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/lib/supabase/types";

// Demo data for theme preview - matching Supabase CalendarDay type
const demoDays: Tables<'calendar_days'>[] = [
  { id: "demo-1", calendar_id: "demo", day: 1, content_type: "text", message: "O Natal é a época do ano em que abrimos nosso coração! 🎄", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-2", calendar_id: "demo", day: 2, content_type: "text", message: "Que a magia do Natal ilumine seus dias! ✨", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-3", calendar_id: "demo", day: 3, content_type: "text", message: "Família reunida é o melhor presente! 🎁", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-4", calendar_id: "demo", day: 4, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-5", calendar_id: "demo", day: 5, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-6", calendar_id: "demo", day: 6, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-7", calendar_id: "demo", day: 7, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Demo calendar data
const demoCalendar: any = {
  id: "demo",
  owner_id: "demo-user",
  title: "Natal Encantado",
  theme_id: "natal",
  duration: 7,
  status: "ativo",
  privacy: "public",
  password: null,
  start_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  views: 128,
  likes: 25,
  shares: 18,
  is_premium: true,
  header_message: "A magia do Natal em cada surpresa",
  footer_message: "Que o Espírito de Natal aqueça seu coração! 🎄✨",
  capsule_title: "Natal Mágico",
  capsule_message: null,
  locked_title: null,
  locked_message: null,
  keep_active: false,
  expires_at: null,
  addons: null,
};

export default function CalendarioNatal() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const themeConfig = getThemeConfig("natal");

  const handleDayClick = (day: number) => {
    console.log("Opening day:", day);
    toast({
      title: `Porta ${day} aberta!`,
      description: "Uma nova surpresa natalina foi revelada!",
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
      isDemoMode={true}
    />
  );
}

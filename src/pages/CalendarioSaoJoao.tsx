import { UniversalTemplate } from "@/components/themes/UniversalTemplate";
import { getThemeConfig } from "@/lib/themes/registry";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/lib/supabase/types";

// Demo data for theme preview - matching Supabase CalendarDay type
const demoDays: Tables<'calendar_days'>[] = [
  { id: "demo-1", calendar_id: "demo", day: 1, content_type: "text", message: "O arraiá começou! Prepare o chapéu de palha! 🔥🌽", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-2", calendar_id: "demo", day: 2, content_type: "text", message: "Nada melhor que um forró e quentão! ☕🔥", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-3", calendar_id: "demo", day: 3, content_type: "text", message: "A fogueira tá queimando e a alegria tá bombando! ✨", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-4", calendar_id: "demo", day: 4, content_type: "text", message: "Viva São João! Viva a alegria da roça! 🌾", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-5", calendar_id: "demo", day: 5, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-6", calendar_id: "demo", day: 6, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-7", calendar_id: "demo", day: 7, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Demo calendar data
const demoCalendar: any = {
  id: "demo",
  owner_id: "demo-user",
  title: "Arraiá do Calendário 🔥",
  theme_id: "saojoao",
  duration: 7,
  status: "ativo",
  privacy: "public",
  password: null,
  start_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  views: 212,
  likes: 45,
  shares: 32,
  is_premium: true,
  header_message: "Sua contagem para a fogueira",
  footer_message: "O arraial acaba, mas o amor fica! 🌽🔥",
  capsule_title: "Arraiá do Fresta",
  capsule_message: null,
  locked_title: null,
  locked_message: null,
  keep_active: false,
  expires_at: null,
  addons: null,
};

export default function CalendarioSaoJoao() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const themeConfig = getThemeConfig("saojoao");

  const handleDayClick = (day: number) => {
    console.log("Opening day:", day);
    toast({
      title: `Janela ${day} aberta!`,
      description: "Uma surpresa junina foi revelada no arraiá!",
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
      openedDays={[1, 2, 3, 4]}
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

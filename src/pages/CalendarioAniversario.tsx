import { UniversalTemplate } from "@/components/themes/UniversalTemplate";
import { getThemeConfig } from "@/lib/themes/registry";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/lib/supabase/types";

// Demo data for theme preview - matching Supabase CalendarDay type
const demoDays: Tables<'calendar_days'>[] = [
    { id: "demo-1", calendar_id: "demo", day: 1, content_type: "text", message: "Um ano de alegrias e conquistas começou! 🎂", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-2", calendar_id: "demo", day: 2, content_type: "text", message: "Que cada dia do seu novo ciclo seja especial! ✨", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-3", calendar_id: "demo", day: 3, content_type: "text", message: "Você merece o melhor hoje e sempre! 🎁", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-4", calendar_id: "demo", day: 4, content_type: "text", message: "Celebre cada momento do seu dia! 🥂", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-5", calendar_id: "demo", day: 5, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-6", calendar_id: "demo", day: 6, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-7", calendar_id: "demo", day: 7, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Demo calendar data
const demoCalendar: any = {
    id: "demo",
    owner_id: "demo-user",
    title: "Meu Aniversário Especial 🎂",
    theme_id: "aniversario",
    duration: 7,
    status: "ativo",
    privacy: "public",
    password: null,
    start_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 89,
    likes: 12,
    shares: 8,
    is_premium: true,
    header_message: "Cada surpresa um brinde a você!",
    footer_message: "Parabéns por mais um ano maravilhoso! 🎈🥳",
    capsule_title: "Celebrando Você",
    capsule_message: null,
    locked_title: null,
    locked_message: null,
    keep_active: false,
    expires_at: null,
    addons: null,
};

export default function CalendarioAniversario() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const themeConfig = getThemeConfig("aniversario");

    const handleDayClick = (day: number) => {
        console.log("Opening day:", day);
        toast({
            title: `Surpresa do Dia ${day} revelada!`,
            description: "Um brinde especial por mais um ano de vida!",
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
            isDemoMode={true}
        />
    );
}

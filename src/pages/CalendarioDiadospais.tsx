import { UniversalTemplate } from "@/components/themes/UniversalTemplate";
import { getThemeConfig } from "@/lib/themes/registry";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/lib/supabase/types";

// Demo data for theme preview
const demoDays: Tables<'calendar_days'>[] = [
    { id: "demo-1", calendar_id: "demo", day: 1, content_type: "text", message: "Pai, você é meu herói e minha inspiração 👔", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-2", calendar_id: "demo", day: 2, content_type: "text", message: "Obrigado por sempre acreditar em mim 💪", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-3", calendar_id: "demo", day: 3, content_type: "text", message: "Suas palavras me guiam todos os dias 🌟", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-4", calendar_id: "demo", day: 4, content_type: "text", message: "Você é o melhor pai do mundo! 🏆", url: null, label: null, opened_count: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-5", calendar_id: "demo", day: 5, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-6", calendar_id: "demo", day: 6, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "demo-7", calendar_id: "demo", day: 7, content_type: null, message: null, url: null, label: null, opened_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Demo calendar data
const demoCalendar: any = {
    id: "demo",
    owner_id: "demo-user",
    title: "Para o Melhor Pai 👔",
    theme_id: "diadospais",
    duration: 7,
    status: "ativo",
    privacy: "public",
    password: null,
    start_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 189,
    likes: 34,
    shares: 21,
    is_premium: false,
    header_message: "Para o melhor pai, uma surpresa por dia!",
    footer_message: "Obrigado por ser meu herói! 💙",
    capsule_title: "Amor de Filho(a)",
    capsule_message: null,
    locked_title: null,
    locked_message: null,
    keep_active: false,
    expires_at: null,
    addons: null,
};

export default function CalendarioDiadospais() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const themeConfig = getThemeConfig("diadospais");

    const handleDayClick = (day: number) => {
        console.log("Opening day:", day);
        toast({
            title: `Surpresa ${day} revelada!`,
            description: "Uma mensagem especial para o paizão!",
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

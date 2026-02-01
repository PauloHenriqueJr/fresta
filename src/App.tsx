import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { DoorOpen } from "lucide-react";
import Loader from "@/components/common/Loader";
import LandingPage from "./pages/LandingPage";
import LandingPageBrand from "./pages/LandingPageBrand";
import Contato from "./pages/Contato";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import CalendarView from "./pages/CalendarView";
import Onboarding from "./pages/Onboarding";
import MeusCalendarios from "./pages/MeusCalendarios";
import Configuracoes from "./pages/Configuracoes";
import Plus from "./pages/Plus";
import EditarDia from "./pages/EditarDia";
import CalendarioSaoJoao from "./pages/CalendarioSaoJoao";
import CalendarioCarnaval from "./pages/CalendarioCarnaval";
import CalendarioNatal from "./pages/CalendarioNatal";
import CalendarioReveillon from "./pages/CalendarioReveillon";
import CalendarioPascoa from "./pages/CalendarioPascoa";
import CalendarioIndependencia from "./pages/CalendarioIndependencia";
import CalendarioNamoro from "./pages/CalendarioNamoro";
import CalendarioCasamento from "./pages/CalendarioCasamento";
import CalendarioAniversario from "./pages/CalendarioAniversario";
import CriarCalendario from "./pages/CriarCalendario";
import EscolherTema from "./pages/EscolherTema";
import VisualizarCalendario from "./pages/VisualizarCalendario";
import Perfil from "./pages/Perfil";
import Estatisticas from "./pages/Estatisticas";
import Ajuda from "./pages/Ajuda";
import ContaConfiguracoes from "./pages/ContaConfiguracoes";
import Explorar from "./pages/Explorar";
import NotFound from "./pages/NotFound";
import Entrar from "./pages/Entrar";
import CalendarioDetalhe from "./pages/CalendarioDetalhe";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Upsell from "./pages/Upsell";
import QuizLanding from "./pages/QuizLanding";
import MemoriaPage from "./pages/memoria";
import CheckoutQuiz from "./pages/CheckoutQuiz";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import B2BLayout from "@/layouts/B2BLayout";
import B2CLayout from "@/layouts/B2CLayout";
import B2BDashboard from "@/pages/b2b/B2BDashboard";
import B2BCampanhas from "@/pages/b2b/B2BCampanhas";
import B2BCriarCampanha from "@/pages/b2b/B2BCriarCampanha";
import B2BCampanhaDetalhe from "@/pages/b2b/B2BCampanhaDetalhe";
import B2BAnalytics from "@/pages/b2b/B2BAnalytics";
import B2BBranding from "@/pages/b2b/B2BBranding";
import B2BEquipe from "@/pages/b2b/B2BEquipe";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminThemes from "@/pages/admin/AdminThemes";
import AdminPlans from "@/pages/admin/AdminPlans";
import AdminUsers from "@/pages/admin/AdminUsers";
import FinancialDashboard from "@/pages/admin/bi/FinancialDashboard";
import SalesRegistry from "@/pages/admin/bi/SalesRegistry";
import B2CCustomers from "@/pages/admin/customers/B2CCustomers";
import B2BClients from "@/pages/admin/customers/B2BClients";
import PlanManager from "@/pages/admin/settings/PlanManager";
import SEOMetadata from "./pages/admin/technical/SEOMetadata";
import AuditLogs from "@/pages/admin/bi/AuditLogs";
import Feedbacks from "@/pages/admin/customers/Feedbacks";
import CouponManager from "@/pages/admin/settings/CouponManager";
import SystemHealth from "@/pages/admin/technical/SystemHealth";
import BackupManager from "@/pages/admin/technical/BackupManager";
import TransactionalEmails from "@/pages/admin/technical/TransactionalEmails";
import AdminContacts from "@/pages/admin/customers/AdminContacts";
import ExecutiveReport from "@/pages/b2b/ExecutiveReport";
import CorporateEditor from "@/pages/b2b/CorporateEditor";
import PrivacySettings from "@/pages/b2b/PrivacySettings";
import BulkInvite from "@/pages/b2b/BulkInvite";
import Gateway from "@/pages/Gateway";
import LoginRH from "@/pages/LoginRH";
import LoginEmployee from "@/pages/LoginEmployee";
import { GlobalSettingsProvider } from "@/state/GlobalSettingsContext";
import { useEffect, useState } from "react";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { format } from "date-fns";
import { toast } from "sonner";

const queryClient = new QueryClient();

// O componente Loader agora é importado de @/components/common/Loader

// Corrigir o problema de tokens do Supabase no HashRouter
const AuthHandler = () => {
  const navigate = useNavigate();
  const { session, isLoading, profile } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;

    // 0. Correção de Rota (Path -> Hash): Se acessar /c/ID diretamente
    if (pathname.startsWith('/c/')) {
      const targetHash = `#${pathname}${hash || ''}`;
      console.log(`App: Redirecionando de path para hash: ${targetHash}`);
      window.location.replace(`${window.location.origin}/${targetHash}`);
      return;
    }

    // 1. Redirecionamento Pós-Login: Se a sessão já foi estabelecida e ainda temos o token na URL
    if (hash && (hash.includes("access_token=") || hash.includes("error_description="))) {
      if (session) {
        // Ignorar se for link público
        if (hash.includes("#/c/") || window.location.pathname.startsWith('/c/')) return;

        // Se houver quiz pendente, o QuizProcessor vai gerenciar o redirecionamento
        if (localStorage.getItem("fresta_pending_quiz")) {
          console.log("App: Quiz pendente detectado, suspendendo redirecionamento de AuthHandler");
          return;
        }

        // Aguardar o carregamento do perfil para decidir o redirecionamento
        if (!profile) return;

        // Decidir para onde ir baseado no onboarding
        const hasSeenOnboarding = profile.onboarding_completed || localStorage.getItem("hasSeenOnboarding") === "true";

        if (!hasSeenOnboarding) {
          console.log("App: Novo usuário detectado, indo para onboarding");
          navigate("/onboarding", { replace: true });
        } else {
          console.log("App: Navegando para o painel principal");
          navigate("/meus-calendarios", { replace: true });
        }
      } else if (!hash.startsWith("#/")) {
        // Normalização preventiva para o HashRouter se ainda não tivermos sessão
        console.log("App: Fragmento de auth detectado, aguardando sessão...");
      }
    }
  }, [session, isLoading, profile, navigate]);

  return null;
};

/**
 * QuizProcessor: Detecta calendários criados via quiz que aguardavam login
 * e processa a criação final assim que o usuário estiver autenticado.
 */
const QuizProcessor = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const processPendingQuiz = async () => {
      if (!user) return;

      const savedData = localStorage.getItem("fresta_pending_quiz");
      if (!savedData) return;

      try {
        const parsed = JSON.parse(savedData);
        // Evitar processar dados muito antigos (mais de 1 hora)
        if (Date.now() - parsed.timestamp < 3600000) {
          setCreating(true);
          console.log("App: Criando calendário pendente do quiz...");

          const calendar = await CalendarsRepository.create({
            ownerId: user.id,
            themeId: parsed.theme || 'surpresa',
            title: parsed.recipient === 'namorado' ? "Nosso Amor" :
              parsed.occasion === 'natal' ? "Feliz Natal" : "Um Presente Especial",
            duration: 7,
            startDate: format(new Date(), "yyyy-MM-dd"),
            privacy: 'private',
            status: 'ativo',
            isPremium: false
          });

          localStorage.removeItem("fresta_pending_quiz");
          toast.success("Seu presente foi criado!");

          // Redireciona para o caminho correto /c/:id (evita 404)
          navigate(`/meus-calendarios?from=quiz`, { replace: true });
        } else {
          localStorage.removeItem("fresta_pending_quiz");
        }
      } catch (e) {
        console.error("App: Erro ao processar presente pendente:", e);
        localStorage.removeItem("fresta_pending_quiz");
      } finally {
        setCreating(false);
      }
    };

    if (!authLoading && user) {
      processPendingQuiz();
    }
  }, [user, authLoading, navigate]);

  // Se estiver criando ou se houver quiz pendente aguardando processamento, 
  // mostramos o loader em tela cheia para evitar renderizar a landing page por baixo.
  const hasPending = !!localStorage.getItem("fresta_pending_quiz");

  if (creating || (!!user && hasPending)) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center">
        <Loader text="Gerando seu presente agora..." />
      </div>
    );
  }

  return null;
};

const AppContent = () => {
  const { isLoading, session } = useAuth();
  const hash = window.location.hash;
  const isAuthenticating = hash.includes("access_token=") || hash.includes("error_description=");

  // Se estiver carregando auth inicial OU se tivermos um fragmento de token mas o Supabase ainda não emitiu a sessão,
  // mostramos o Loader para evitar que o HashRouter interprete o token como uma rota inexistente (404).
  if (isLoading) {
    return <Loader text="Sua porta está abrindo..." />;
  }

  return (
    <HashRouter>
      <AuthHandler />
      <QuizProcessor />
      <Routes>
        <Route path="/" element={<LandingPageBrand />} />
        <Route path="/landing-legacy" element={<LandingPage />} />
        <Route path="/portal" element={<Gateway />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/login-rh" element={<LoginRH />} />
        <Route path="/login-colaborador" element={<LoginEmployee />} />
        <Route path="/quiz" element={<QuizLanding />} />
        <Route path="/memoria" element={<MemoriaPage />} />

        {/* B2B */}
        <Route
          path="/b2b"
          element={
            <ProtectedRoute allowedRoles={["rh", "admin"]}>
              <B2BLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<B2BDashboard />} />
          <Route path="relatorio" element={<ExecutiveReport />} />
          <Route path="campanhas" element={<B2BCampanhas />} />
          <Route path="campanhas/nova" element={<B2BCriarCampanha />} />
          <Route path="campanhas/:id" element={<B2BCampanhaDetalhe />} />
          <Route path="editor" element={<CorporateEditor />} />
          <Route path="privacidade" element={<PrivacySettings />} />
          <Route path="convites" element={<BulkInvite />} />
          <Route path="analytics" element={<B2BAnalytics />} />
          <Route path="branding" element={<B2BBranding />} />
          <Route path="equipe" element={<B2BEquipe />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="configuracoes" element={<ContaConfiguracoes />} />
        </Route>

        {/* Admin (Protegido por role admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="financeiro" element={<FinancialDashboard />} />
          <Route path="vendas" element={<SalesRegistry />} />
          <Route path="temas" element={<AdminThemes />} />
          <Route path="planos" element={<PlanManager />} />
          <Route path="usuarios" element={<B2CCustomers />} />
          <Route path="b2b-clientes" element={<B2BClients />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="contatos" element={<AdminContacts />} />
          <Route path="cupons" element={<CouponManager />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="seo" element={<SEOMetadata />} />
          <Route path="health" element={<SystemHealth />} />
          <Route path="backups" element={<BackupManager />} />
          <Route path="emails" element={<TransactionalEmails />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="configuracoes" element={<ContaConfiguracoes />} />
        </Route>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />

        {/* Checkout Público (Vindo do Quiz/Ads) - Lida com auth internamente */}
        <Route path="/checkout" element={<CheckoutQuiz />} />
        {/* Checkout Interno - Precisa de ID (Venda de plano para calendário existente) */}
        <Route path="/checkout/:calendarId" element={<Checkout />} />

        {/* B2C (app shell apenas no desktop; mobile/tablet inalterado) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <B2CLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/meus-calendarios" element={<MeusCalendarios />} />
          <Route path="/criar" element={<CriarCalendario />} />
          <Route path="/calendario/:id" element={<CalendarioDetalhe />} />
          <Route path="/calendario/:id/configuracoes" element={<Configuracoes />} />
          <Route path="/calendario/:id/estatisticas" element={<Estatisticas />} />
          <Route path="/editar-dia/:calendarId/:dia" element={<EditarDia />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/conta/configuracoes" element={<ContaConfiguracoes />} />
          <Route path="/plus" element={<Plus />} />
          {/* Checkout Autenticado (Legado/Upgrade) */}
          <Route path="/checkout/:calendarId" element={<Checkout />} />
          <Route path="/checkout/upsell" element={<Upsell />} />
          <Route path="/checkout/sucesso" element={<PaymentSuccess />} />
          <Route path="/ajuda" element={<Ajuda />} />
          <Route path="/explorar" element={<Explorar />} />
        </Route>

        {/* legacy/demo routes */}
        <Route path="/calendario" element={<CalendarView />} />
        <Route path="/calendario/saojoao" element={<CalendarioSaoJoao />} />
        <Route path="/calendario/carnaval" element={<CalendarioCarnaval />} />
        <Route path="/calendario/natal" element={<CalendarioNatal />} />
        <Route path="/calendario/reveillon" element={<CalendarioReveillon />} />
        <Route path="/calendario/pascoa" element={<CalendarioPascoa />} />
        <Route path="/calendario/independencia" element={<CalendarioIndependencia />} />
        <Route path="/calendario/namoro" element={<CalendarioNamoro />} />
        <Route path="/calendario/casamento" element={<CalendarioCasamento />} />
        <Route path="/calendario/aniversario" element={<CalendarioAniversario />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        {/* /editar-dia/:calendarId/:dia agora está dentro do B2CLayout */}
        <Route path="/editar-dia/:dia" element={<EditarDia />} />
        <Route path="/escolher-tema" element={<EscolherTema />} />
        <Route path="/c/:id" element={<VisualizarCalendario />} />
        {/* /perfil agora está dentro do B2CLayout */}
        <Route
          path="/estatisticas"
          element={
            <ProtectedRoute>
              <Estatisticas />
            </ProtectedRoute>
          }
        />
        {/* /conta/configuracoes agora está dentro do B2CLayout */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalSettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </GlobalSettingsProvider>
  </QueryClientProvider>
);

export default App;

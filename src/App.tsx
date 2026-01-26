import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import LandingPage from "./pages/LandingPage";
import LandingPageBrand from "./pages/LandingPageBrand";
import Contato from "./pages/Contato";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import CalendarView from "./pages/CalendarView";
import Onboarding from "./pages/Onboarding";
import MeusCalendarios from "./pages/MeusCalendarios";
import Configuracoes from "./pages/Configuracoes";
import Premium from "./pages/Premium";
import EditarDia from "./pages/EditarDia";
import CalendarioSaoJoao from "./pages/CalendarioSaoJoao";
import CalendarioCarnaval from "./pages/CalendarioCarnaval";
import CalendarioNatal from "./pages/CalendarioNatal";
import CalendarioReveillon from "./pages/CalendarioReveillon";
import CalendarioPascoa from "./pages/CalendarioPascoa";
import CalendarioIndependencia from "./pages/CalendarioIndependencia";
import CalendarioNamoro from "./pages/CalendarioNamoro";
import CalendarioCasamento from "./pages/CalendarioCasamento";
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
import ExecutiveReport from "@/pages/b2b/ExecutiveReport";
import CorporateEditor from "@/pages/b2b/CorporateEditor";
import PrivacySettings from "@/pages/b2b/PrivacySettings";
import BulkInvite from "@/pages/b2b/BulkInvite";
import Gateway from "@/pages/Gateway";
import LoginRH from "@/pages/LoginRH";
import LoginEmployee from "@/pages/LoginEmployee";
import { GlobalSettingsProvider } from "@/state/GlobalSettingsContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const Loader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
    <div className="w-16 h-16 rounded-2xl bg-gradient-festive animate-pulse flex items-center justify-center mb-4">
      <span className="text-2xl">🚪</span>
    </div>
    <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-primary animate-pulse" />
    </div>
    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 animate-pulse">
      Fresta está vindo...
    </p>
  </div>
);

// Corrigir o problema de tokens do Supabase no HashRouter
const AuthHandler = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;

    // 0. Correção de Rota (Path -> Hash): Se acessar /c/ID diretamente
    if (pathname.startsWith('/c/')) {
      console.log("App: Convertendo rota de path para hash");
      window.location.href = `${window.location.origin}/#${pathname}${hash}`;
      return;
    }

    // 1. Redirecionamento Pós-Login: Se a sessão já foi estabelecida e ainda temos o token na URL
    if (hash && (hash.includes("access_token=") || hash.includes("error_description="))) {
      if (session) {
        // Ignorar se for link público
        if (hash.includes("#/c/") || window.location.pathname.startsWith('/c/')) return;

        // Limpar o fragmento de autenticação agora que temos a sessão
        // Isso evita loops de normalização
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

        if (!hasSeenOnboarding) {
          console.log("App: Novo usuário detectado, indo para onboarding");
          navigate("/onboarding", { replace: true });
        } else {
          console.log("App: Navegando para o painel principal");
          navigate("/meus-calendarios", { replace: true });
        }
      } else if (!hash.startsWith("#/")) {
        // Normalização preventiva para o HashRouter se ainda não tivermos sessão
        // Mas o AppContent deve estar mostrando o Loader agora
        console.log("App: Fragmento de auth detectado, aguardando sessão...");
      }
    }
  }, [session, isLoading, navigate]);

  return null;
};

const AppContent = () => {
  const { isLoading, session } = useAuth();
  const hash = window.location.hash;
  const isAuthenticating = hash.includes("access_token=") || hash.includes("error_description=");

  // Se estiver carregando auth inicial OU se tivermos um fragmento de token mas o Supabase ainda não emitiu a sessão,
  // mostramos o Loader para evitar que o HashRouter interprete o token como uma rota inexistente (404).
  if (isLoading || (isAuthenticating && !session)) {
    return <Loader />;
  }

  return (
    <HashRouter>
      <AuthHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-brand" element={<LandingPageBrand />} />
        <Route path="/portal" element={<Gateway />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/login-rh" element={<LoginRH />} />
        <Route path="/login-colaborador" element={<LoginEmployee />} />

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
          <Route path="/premium" element={<Premium />} />
          <Route path="/checkout/:planId" element={<Checkout />} />
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

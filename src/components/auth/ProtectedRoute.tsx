import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * Componente de proteção de rotas com comportamento fail-closed.
 * Se houver qualquer dúvida sobre autorização, NEGA o acesso.
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // FAIL-CLOSED: Calcula autorização de forma segura
  // Se não tiver role ou role não está na lista, nega
  const isAuthorized = useMemo(() => {
    // Se não exige roles específicas, só precisa estar autenticado
    if (!allowedRoles || allowedRoles.length === 0) {
      return isAuthenticated;
    }

    // FAIL-CLOSED: Se exige roles mas não temos role, NEGA
    if (!role) {
      return false;
    }

    // Verifica se role está na lista de permitidas
    return allowedRoles.includes(role);
  }, [isAuthenticated, allowedRoles, role]);

  useEffect(() => {
    // Não fazer nada enquanto carrega
    if (isLoading) return;

    // Não autenticado -> Login
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/entrar?redirect=${redirect}`, { replace: true });
      return;
    }

    // Autenticado mas não autorizado -> Portal com log de segurança
    if (!isAuthorized) {
      const securityEvent = {
        type: 'ACCESS_DENIED',
        timestamp: new Date().toISOString(),
        user: user?.email || 'unknown',
        userRole: role || 'none',
        requiredRoles: allowedRoles?.join(',') || 'authenticated',
        attemptedRoute: location.pathname,
      };

      // Log para console (em produção, enviar para serviço de auditoria)
      console.warn('[SEGURANÇA] Acesso negado:', securityEvent);

      toast.error("Acesso Negado", {
        description: "Você não tem permissão para acessar esta área."
      });

      navigate("/portal", { replace: true });
    }
  }, [isAuthenticated, isLoading, isAuthorized, role, allowedRoles, user, location.pathname, location.search, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
            Verificando Credenciais...
          </p>
        </div>
      </div>
    );
  }

  // FAIL-CLOSED: Se não está autenticado ou não está autorizado, não renderiza nada
  // O useEffect acima cuida do redirecionamento
  if (!isAuthenticated || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-destructive"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
            Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

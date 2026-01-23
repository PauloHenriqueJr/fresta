import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const redirect = encodeURIComponent(location.pathname + location.search);
        navigate(`/entrar?redirect=${redirect}`, { replace: true });
        return;
      }

      if (allowedRoles && role && !allowedRoles.includes(role)) {
        console.warn(`Acesso negado: Rota exige ${allowedRoles.join('/')}, usuário tem ${role}`);
        toast.error("Acesso Negado", {
          description: "Você não tem permissão para acessar esta área."
        });
        navigate("/portal", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, role, allowedRoles, location.pathname, location.search, navigate]);

  if (isLoading || !isAuthenticated || (allowedRoles && role && !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Verificando Credenciais...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

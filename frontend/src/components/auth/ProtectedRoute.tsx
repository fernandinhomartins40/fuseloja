import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { AccessDenied } from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  fallbackPath = '/'
}) => {
  const { user, isAuthenticated } = useUser();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // If admin access is required
  if (requireAdmin) {
    // Not authenticated - redirect to home
    if (!isAuthenticated) {
      return <Navigate to={fallbackPath} replace />;
    }
    
    // Authenticated but not admin - show access denied
    if (user?.role !== 'admin') {
      return (
        <AccessDenied
          title="Acesso ao Painel Administrativo Negado"
          message="Apenas usuários com permissão de administrador podem acessar o painel do lojista."
          showHomeButton={true}
          showProfileButton={true}
        />
      );
    }
  }

  // Admin or authenticated user - render children
  return <>{children}</>;
};
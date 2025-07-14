import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
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
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated } = useUser();
  const { apiUser, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Get user role from either source
  const userRole = apiUser?.role || user?.role;

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If admin access is required
  if (requireAdmin) {
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Authenticated but not admin - show access denied
    if (userRole !== 'admin') {
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

  // All checks passed - render children
  return <>{children}</>;
};
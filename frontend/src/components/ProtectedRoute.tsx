import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'any';
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'any',
  allowedRoles = []
}) => {
  const { user, apiUser, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('🔒 ProtectedRoute: User not authenticated, redirecting to login');
    console.log('🔒 Current location:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole !== 'any') {
    const userRole = apiUser?.role || 'user';
    
    // Check specific required role
    if (requiredRole === 'admin' && userRole !== 'admin') {
      console.log('🚫 ProtectedRoute: User is not admin, redirecting to unauthorized');
      console.log('🚫 Required role:', requiredRole, 'User role:', userRole);
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Check allowed roles list
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      console.log('🚫 ProtectedRoute: User role not in allowed roles, redirecting to unauthorized');
      console.log('🚫 Allowed roles:', allowedRoles, 'User role:', userRole);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

// Component for admin-only routes
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, isAuthenticated } = useAuth();
  
  // DO NOT auto-login in production - this was causing the CORS error
  // Remove any development auto-login code
  
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
};

// Component for user-only routes (excluding admin)
export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['user', 'admin']}>
      {children}
    </ProtectedRoute>
  );
};

// Component for public routes (accessible to authenticated users)
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="any">
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute; 
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, UserRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

// Import pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AdminDashboard from '@/pages/AdminDashboard';
import UserDashboard from '@/pages/UserDashboard';
import Unauthorized from '@/pages/Unauthorized';

// Dashboard router component that redirects based on user role
const DashboardRouter: React.FC = () => {
  const { apiUser } = useAuth();
  
  if (!apiUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to appropriate dashboard based on user role
  if (apiUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/user" replace />;
  }
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/user',
    element: (
      <UserRoute>
        <UserDashboard />
      </UserRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router; 
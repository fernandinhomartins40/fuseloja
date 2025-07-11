import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

// Import public pages
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import FAQ from '@/pages/FAQ';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import NotFound from '@/pages/NotFound';

// Import auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Unauthorized from '@/pages/Unauthorized';

// Import admin pages
import AdminDashboard from '@/pages/AdminDashboard';

// Import user pages (optional - for user profiles)
import UserDashboard from '@/pages/UserDashboard';

// Admin dashboard router that redirects to admin panel
const AdminDashboardRouter: React.FC = () => {
  const { apiUser } = useAuth();
  
  if (!apiUser || apiUser.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <AdminDashboard />;
};

export const router = createBrowserRouter([
  // Public routes - NO AUTHENTICATION REQUIRED
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/sobre',
    element: <AboutUs />,
  },
  {
    path: '/contato',
    element: <Contact />,
  },
  {
    path: '/privacidade',
    element: <PrivacyPolicy />,
  },
  {
    path: '/termos',
    element: <TermsOfService />,
  },
  {
    path: '/faq',
    element: <FAQ />,
  },
  {
    path: '/produto/:id',
    element: <ProductDetail />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  
  // Auth routes - public but redirect if already logged in
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  
  // User profile routes - requires user authentication
  {
    path: '/perfil',
    element: <UserDashboard />,
  },
  
  // ADMIN ROUTES - PROTECTED BY AUTHENTICATION
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboardRouter />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  
  // Catch all routes
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router; 
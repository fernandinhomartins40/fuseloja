import { createBrowserRouter } from 'react-router-dom';

// Layout Components
import { Header } from '@/components/layout/Header';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Public Pages
import Index from '@/pages/Index';
import ProductDetail from '@/pages/ProductDetail';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';
import Checkout from '@/pages/Checkout';

// User Pages
import Profile from '@/pages/user/Profile';
import Login from '@/pages/Login';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import Categories from '@/pages/admin/Categories';
import Orders from '@/pages/admin/Orders';
import Deliveries from '@/pages/admin/Deliveries';
import Reports from '@/pages/admin/Reports';
import Settings from '@/pages/admin/Settings';

// Layout wrapper for public pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export const router = createBrowserRouter([
  // Public Routes - No authentication required
  {
    path: '/',
    element: <PublicLayout><Index /></PublicLayout>,
  },
  {
    path: '/produto/:id',
    element: <PublicLayout><ProductDetail /></PublicLayout>,
  },
  {
    path: '/sobre',
    element: <PublicLayout><AboutUs /></PublicLayout>,
  },
  {
    path: '/contato',
    element: <PublicLayout><Contact /></PublicLayout>,
  },
  {
    path: '/faq',
    element: <PublicLayout><FAQ /></PublicLayout>,
  },
  {
    path: '/privacidade',
    element: <PublicLayout><PrivacyPolicy /></PublicLayout>,
  },
  {
    path: '/termos',
    element: <PublicLayout><TermsOfService /></PublicLayout>,
  },
  {
    path: '/checkout',
    element: <PublicLayout><Checkout /></PublicLayout>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  
  // User Protected Routes - Requires authentication
  {
    path: '/perfil',
    element: (
      <ProtectedRoute requireAuth={true}>
        <PublicLayout><Profile /></PublicLayout>
      </ProtectedRoute>
    ),
  },
  
  // Admin Protected Routes - Requires admin role
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'produtos',
        element: <Products />,
      },
      {
        path: 'categorias',
        element: <Categories />,
      },
      {
        path: 'pedidos',
        element: <Orders />,
      },
      {
        path: 'entregas',
        element: <Deliveries />,
      },
      {
        path: 'relatorios',
        element: <Reports />,
      },
      {
        path: 'configuracoes',
        element: <Settings />,
      },
    ],
  },
  
  // 404 Page
  {
    path: '*',
    element: <PublicLayout><NotFound /></PublicLayout>,
  },
]);
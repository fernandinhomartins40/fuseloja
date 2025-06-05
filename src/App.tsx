import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Deliveries from "./pages/admin/Deliveries";
import Reports from "./pages/admin/Reports";
import Categories from "./pages/admin/Categories";
import Settings from "./pages/admin/Settings";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/user/Profile";
import Checkout from "./pages/Checkout";

// Create query client outside of component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Import the admin panel styles
import './styles/admin-panel.css';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/sobre" element={<AboutUs />} />
    <Route path="/contato" element={<Contact />} />
    <Route path="/produto/:id" element={<ProductDetail />} />
    <Route path="/perfil" element={<Profile />} />
    <Route path="/checkout" element={<Checkout />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="deliveries" element={<Deliveries />} />
      <Route path="reports" element={<Reports />} />
      <Route path="categories" element={<Categories />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <OrderProvider>
            <SettingsProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <AppRoutes />
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </BrowserRouter>
            </SettingsProvider>
          </OrderProvider>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;

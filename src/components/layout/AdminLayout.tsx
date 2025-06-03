
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { LayoutDashboard, Package2, Truck, ShoppingCart, BarChart, LogOut, Tags, Settings, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import UserCard from '@/components/admin/UserCard';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout, login, isAuthenticated } = useUser();
  
  // Auto-login for admin access during development
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Auto-logging in admin user for development...');
      login("joao.silva@example.com", "password");
    }
  }, [isAuthenticated, login]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Sessão finalizada",
      description: "Você foi desconectado com sucesso."
    });
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <Sidebar className="border-r-0 shadow-xl bg-gradient-to-b from-white via-blue-50/20 to-purple-50/10 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 bg-gradient-to-r from-white to-blue-50/30 shadow-sm">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                  ShopMaster
                </h2>
                <p className="text-xs text-slate-500 font-medium">Painel Administrativo</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-gradient-to-b from-white/80 to-blue-50/40 backdrop-blur-sm">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-700 font-bold text-sm tracking-wide uppercase">
                Gerenciamento
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard" className="hover:bg-gradient-to-r hover:from-blue-100/80 hover:to-purple-100/50 hover:text-blue-700 transition-all duration-300 rounded-lg group">
                      <a href="/admin" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <LayoutDashboard className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Produtos" className="hover:bg-gradient-to-r hover:from-purple-100/80 hover:to-pink-100/50 hover:text-purple-700 transition-all duration-300 rounded-lg group">
                      <a href="/admin/products" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Package2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">Produtos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Categorias" className="hover:bg-gradient-to-r hover:from-pink-100/80 hover:to-rose-100/50 hover:text-pink-700 transition-all duration-300 rounded-lg group">
                      <a href="/admin/categories" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Tags className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">Categorias</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pedidos" className="hover:bg-gradient-to-r hover:from-emerald-100/80 hover:to-green-100/50 hover:text-emerald-700 transition-all duration-300 rounded-lg group">
                      <a href="/admin/orders" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">Pedidos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Entregas" className="hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-amber-100/50 hover:text-orange-700 transition-all duration-300 rounded-lg group">
                      <a href="/admin/deliveries" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">Entregas</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Relatórios" className="hover:bg-gradient-to-r hover:from-indigo-100/80 hover:to-blue-100/50 hover:text-indigo-700 transition-all duration-300 rounded-lg group">
                      <a href="/admin/reports" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <BarChart className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">Relatórios</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Configurações" className="hover:bg-gradient-to-r hover:from-slate-100/80 hover:to-gray-100/50 hover:text-slate-700 transition-all duration-300 rounded-lg group">
                      <a href="/admin/settings" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Settings className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">Configurações</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-slate-200/60 bg-gradient-to-r from-white to-blue-50/30 p-4">
            <UserCard />
            <Button 
              variant="outline" 
              className="w-full flex gap-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 transform hover:scale-105 border-slate-200 font-semibold" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
          <div className="flex items-center gap-2 p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
            <SidebarTrigger className="hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors duration-300 rounded-lg" />
            <div className="w-px h-6 bg-gradient-to-b from-slate-300 to-slate-400 mx-2" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;


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
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar className="border-r bg-white">
          <SidebarHeader className="border-b bg-white">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  ShopMaster
                </h2>
                <p className="text-xs text-gray-600 font-normal">Painel Administrativo</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-700 font-medium text-sm">
                Gerenciamento
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard" className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                      <a href="/admin" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Produtos" className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                      <a href="/admin/products" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Produtos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Categorias" className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                      <a href="/admin/categories" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Tags className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Categorias</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pedidos" className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                      <a href="/admin/orders" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Pedidos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Entregas" className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                      <a href="/admin/deliveries" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Entregas</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Relatórios" className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                      <a href="/admin/reports" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Relatórios</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Configurações" className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                      <a href="/admin/settings" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Configurações</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t bg-white p-4">
            <UserCard />
            <Button 
              variant="outline" 
              className="w-full flex gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors font-medium" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-gray-50">
          <div className="flex items-center gap-2 p-4 bg-white border-b shadow-sm">
            <SidebarTrigger className="hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors" />
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <h1 className="text-lg font-semibold text-gray-900">
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


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
      <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-0 bg-gradient-to-b from-white to-slate-50 shadow-xl">
          <SidebarHeader className="border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-3xl">
            <div className="flex items-center gap-3 px-6 py-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  ShopMaster
                </h2>
                <p className="text-xs text-indigo-100 font-medium">Painel Administrativo</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-transparent px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-700 font-bold text-sm mb-3 px-3">
                Gerenciamento
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard" className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-slate-700 hover:text-indigo-600 transition-all duration-300 rounded-2xl py-3 group">
                      <a href="/admin" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300">
                          <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-semibold">Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Produtos" className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-slate-700 hover:text-emerald-600 transition-all duration-300 rounded-2xl py-3 group">
                      <a href="/admin/products" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                          <Package2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="font-semibold">Produtos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Categorias" className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 text-slate-700 hover:text-amber-600 transition-all duration-300 rounded-2xl py-3 group">
                      <a href="/admin/categories" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-300">
                          <Tags className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="font-semibold">Categorias</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pedidos" className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-2xl py-3 group">
                      <a href="/admin/orders" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300">
                          <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-semibold">Pedidos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Entregas" className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 text-slate-700 hover:text-violet-600 transition-all duration-300 rounded-2xl py-3 group">
                      <a href="/admin/deliveries" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-violet-200 group-hover:to-purple-200 transition-all duration-300">
                          <Truck className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="font-semibold">Entregas</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Relatórios" className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 text-slate-700 hover:text-rose-600 transition-all duration-300 rounded-2xl py-3 group">
                      <a href="/admin/reports" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:from-rose-200 group-hover:to-pink-200 transition-all duration-300">
                          <BarChart className="w-5 h-5 text-rose-600" />
                        </div>
                        <span className="font-semibold">Relatórios</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Configurações" className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 text-slate-700 hover:text-slate-600 transition-all duration-300 rounded-2xl py-3 group">
                      <a href="/admin/settings" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl flex items-center justify-center group-hover:from-slate-200 group-hover:to-gray-200 transition-all duration-300">
                          <Settings className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="font-semibold">Configurações</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-0 bg-transparent p-4 space-y-3">
            <UserCard />
            <Button 
              variant="outline" 
              className="w-full flex gap-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 hover:border-red-300 transition-all duration-300 font-semibold rounded-2xl py-3 border-2" 
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <div className="flex items-center gap-4 p-6 bg-white bg-opacity-80 backdrop-blur-md border-0 shadow-lg rounded-br-3xl">
            <SidebarTrigger className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-slate-700 hover:text-indigo-600 transition-all duration-300 rounded-xl p-2" />
            <div className="w-px h-6 bg-gradient-to-b from-slate-300 to-transparent mx-2" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
          </div>
          <div className="p-8">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

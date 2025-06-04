
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
      <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <Sidebar className="border-0 bg-gradient-to-b from-white via-slate-50 to-blue-50 shadow-2xl">
          <SidebarHeader className="border-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-br-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="flex items-center gap-4 px-8 py-8 relative z-10">
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-xl">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  ShopMaster
                </h2>
                <p className="text-sm text-indigo-100 font-bold">Painel Administrativo</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-transparent px-4 py-6">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-700 font-black text-sm mb-4 px-4">
                Gerenciamento
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-3">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard" className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-slate-700 hover:text-indigo-600 transition-all duration-300 rounded-3xl py-4 group">
                      <a href="/admin" className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="font-black text-base">Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Produtos" className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-slate-700 hover:text-emerald-600 transition-all duration-300 rounded-3xl py-4 group">
                      <a href="/admin/products" className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-teal-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <Package2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="font-black text-base">Produtos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Categorias" className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 text-slate-700 hover:text-amber-600 transition-all duration-300 rounded-3xl py-4 group">
                      <a href="/admin/categories" className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <Tags className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="font-black text-base">Categorias</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pedidos" className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-3xl py-4 group">
                      <a href="/admin/orders" className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-black text-base">Pedidos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Entregas" className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 text-slate-700 hover:text-violet-600 transition-all duration-300 rounded-3xl py-4 group">
                      <a href="/admin/deliveries" className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:from-violet-200 group-hover:to-purple-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <Truck className="w-6 h-6 text-violet-600" />
                        </div>
                        <span className="font-black text-base">Entregas</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Relatórios" className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 text-slate-700 hover:text-rose-600 transition-all duration-300 rounded-3xl py-4 group">
                      <a href="/admin/reports" className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-200 rounded-2xl flex items-center justify-center group-hover:from-rose-200 group-hover:to-pink-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <BarChart className="w-6 h-6 text-rose-600" />
                        </div>
                        <span className="font-black text-base">Relatórios</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Configurações" className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 text-slate-700 hover:text-slate-600 transition-all duration-300 rounded-3xl py-4 group">
                      <a href="/admin/settings" className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:from-slate-200 group-hover:to-gray-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <Settings className="w-6 h-6 text-slate-600" />
                        </div>
                        <span className="font-black text-base">Configurações</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-0 bg-transparent p-6 space-y-4">
            <UserCard />
            <Button 
              variant="outline" 
              className="w-full flex gap-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 hover:border-red-300 transition-all duration-300 font-black rounded-3xl py-4 border-2 text-base shadow-lg hover:shadow-xl hover:scale-105" 
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6" />
              <span>Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <div className="flex items-center gap-6 p-8 bg-white bg-opacity-90 backdrop-blur-xl border-0 shadow-2xl rounded-br-3xl">
            <SidebarTrigger className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-slate-700 hover:text-indigo-600 transition-all duration-300 rounded-2xl p-3 shadow-lg hover:shadow-xl hover:scale-110" />
            <div className="w-px h-8 bg-gradient-to-b from-slate-300 via-indigo-300 to-purple-300 mx-3" />
            <h1 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
          </div>
          <div className="p-10">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

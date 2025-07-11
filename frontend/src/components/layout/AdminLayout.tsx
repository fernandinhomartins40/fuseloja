
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
import { LayoutDashboard, Package2, Truck, ShoppingCart, BarChart, LogOut, Tags, Settings, Store, TrendingUp, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import UserCard from '@/components/admin/UserCard';
import { cn } from '@/lib/utils';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, login, isAuthenticated } = useUser();
  
  // AdminLayout should not auto-login - this is handled by ProtectedRoute

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      group: 'Principal',
      items: [
        {
          path: '/admin',
          label: 'Dashboard',
          icon: LayoutDashboard,
          color: 'blue',
          description: 'Visão geral do negócio'
        }
      ]
    },
    {
      group: 'Catálogo',
      items: [
        {
          path: '/admin/products',
          label: 'Produtos',
          icon: Package2,
          color: 'green',
          description: 'Gerenciar produtos'
        },
        {
          path: '/admin/categories',
          label: 'Categorias',
          icon: Tags,
          color: 'yellow',
          description: 'Organizar categorias'
        }
      ]
    },
    {
      group: 'Vendas',
      items: [
        {
          path: '/admin/orders',
          label: 'Pedidos',
          icon: ShoppingCart,
          color: 'purple',
          description: 'Gerenciar pedidos'
        },
        {
          path: '/admin/deliveries',
          label: 'Entregas',
          icon: Truck,
          color: 'indigo',
          description: 'Acompanhar entregas'
        }
      ]
    },
    {
      group: 'Análises',
      items: [
        {
          path: '/admin/reports',
          label: 'Relatórios',
          icon: BarChart,
          color: 'pink',
          description: 'Relatórios e métricas'
        }
      ]
    },
    {
      group: 'Sistema',
      items: [
        {
          path: '/admin/settings',
          label: 'Configurações',
          icon: Settings,
          color: 'gray',
          description: 'Configurações da loja'
        }
      ]
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700',
      green: isActive ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 group-hover:bg-green-100 group-hover:text-green-700',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 group-hover:text-yellow-700',
      purple: isActive ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100 group-hover:text-purple-700',
      indigo: isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-700',
      pink: isActive ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600 group-hover:bg-pink-100 group-hover:text-pink-700',
      gray: isActive ? 'bg-gray-500 text-white' : 'bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-700'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };
  
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
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  ShopMaster
                </h2>
                <p className="text-sm text-gray-600">Painel Administrativo</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-white px-3 py-6">
            <div className="space-y-8">
              {menuItems.map((group) => (
                <SidebarGroup key={group.group}>
                  <SidebarGroupLabel className="text-gray-600 font-semibold text-xs uppercase tracking-wide mb-4 px-4">
                    {group.group}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-2">
                      {group.items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = isActiveRoute(item.path);
                        return (
                          <SidebarMenuItem key={item.path}>
                            <SidebarMenuButton 
                              asChild 
                              tooltip={item.description}
                              className={cn(
                                "relative w-full h-auto p-0 border border-transparent transition-all duration-200 rounded-xl overflow-hidden group",
                                "hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:border-blue-200/50 hover:shadow-sm",
                                isActive && "bg-gradient-to-r from-blue-50 to-blue-100/30 border-blue-200/60 shadow-sm"
                              )}
                            >
                              <a href={item.path} className="flex items-center gap-4 relative w-full px-4 py-3">
                                {isActive && (
                                  <div className="absolute -left-0.5 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-blue-500 rounded-r-full" />
                                )}
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm",
                                  getColorClasses(item.color, isActive)
                                )}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className={cn(
                                    "font-semibold text-sm block truncate transition-colors duration-200",
                                    isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                                  )}>
                                    {item.label}
                                  </span>
                                  <span className={cn(
                                    "text-xs block truncate transition-colors duration-200 mt-0.5",
                                    isActive ? "text-gray-600" : "text-gray-500 group-hover:text-gray-600"
                                  )}>
                                    {item.description}
                                  </span>
                                </div>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </div>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200 bg-white p-4 space-y-4">
            <UserCard />
            <Button 
              variant="outline" 
              className="w-full flex gap-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors duration-200 rounded-xl py-3 px-4 font-medium" 
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <div className="flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 lg:p-6 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <SidebarTrigger className="hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-lg p-2 flex-shrink-0" />
              <div className="w-px h-4 sm:h-6 bg-gray-300 hidden sm:block" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  Painel Administrativo
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">
                  Gerencie sua loja de forma eficiente
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className="bg-green-100 text-green-800 text-xs hidden sm:flex">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Online
              </Badge>
              <div className="w-2 h-2 bg-green-500 rounded-full sm:hidden" />
            </div>
          </div>
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

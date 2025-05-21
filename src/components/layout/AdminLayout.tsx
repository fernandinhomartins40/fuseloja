
import React from 'react';
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
import { LayoutDashboard, Package2, Truck, ShoppingCart, BarChart, LogOut, Tags, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast({
      title: "Sessão finalizada",
      description: "Você foi desconectado com sucesso."
    });
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2">
              <h2 className="text-xl font-bold">Painel do Lojista</h2>
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard">
                      <a href="/admin">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Produtos">
                      <a href="/admin/products">
                        <Package2 />
                        <span>Produtos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Categorias">
                      <a href="/admin/categories">
                        <Tags />
                        <span>Categorias</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pedidos">
                      <a href="/admin/orders">
                        <ShoppingCart />
                        <span>Pedidos</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Entregas">
                      <a href="/admin/deliveries">
                        <Truck />
                        <span>Entregas</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Relatórios">
                      <a href="/admin/reports">
                        <BarChart />
                        <span>Relatórios</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Configurações">
                      <a href="/admin/settings">
                        <Settings />
                        <span>Configurações</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button 
              variant="outline" 
              className="w-full flex gap-2" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;


import React, { useState } from 'react';
import { TrendingUp, ShoppingCart, Package, Truck, Plus, Search, Users, BarChart3 } from 'lucide-react';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { ChartCard } from '@/components/admin/dashboard/ChartCard';
import { ModernTable } from '@/components/admin/dashboard/ModernTable';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const stats = [
  {
    title: "Total de Vendas",
    value: "R$ 15.231,89",
    description: "Vendas no mês atual",
    icon: TrendingUp,
    trend: 'up' as const,
    trendValue: '+20%'
  },
  {
    title: "Pedidos",
    value: "124",
    description: "Pedidos este mês",
    icon: ShoppingCart,
    trend: 'up' as const,
    trendValue: '+12%'
  },
  {
    title: "Produtos",
    value: "1.342",
    description: "Total no catálogo",
    icon: Package,
    trend: 'neutral' as const,
    trendValue: '12 baixo estoque'
  },
  {
    title: "Entregas",
    value: "87",
    description: "Entregas realizadas",
    icon: Truck,
    trend: 'up' as const,
    trendValue: '+8%'
  },
];

const recentOrdersColumns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'customer', label: 'Cliente' },
  { key: 'date', label: 'Data', width: '120px' },
  { key: 'status', label: 'Status', width: '140px', align: 'center' as const },
  { key: 'total', label: 'Total', width: '100px', align: 'right' as const },
];

const recentOrders = [
  { id: "#4832", customer: "Ana Silva", date: "12/05/2025", status: "Entregue", total: "R$ 256,00" },
  { id: "#4831", customer: "Carlos Mendes", date: "12/05/2025", status: "Em processamento", total: "R$ 129,90" },
  { id: "#4830", customer: "Beatriz Lima", date: "11/05/2025", status: "Enviado", total: "R$ 345,50" },
  { id: "#4829", customer: "Diego Santos", date: "11/05/2025", status: "Aguardando pagamento", total: "R$ 78,90" },
  { id: "#4828", customer: "Juliana Costa", date: "10/05/2025", status: "Entregue", total: "R$ 199,00" },
];

const lowStockColumns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Produto' },
  { key: 'stock', label: 'Atual', width: '80px', align: 'center' as const },
  { key: 'minStock', label: 'Mínimo', width: '80px', align: 'center' as const },
  { key: 'status', label: 'Status', width: '80px', align: 'center' as const },
];

const lowStockProducts = [
  { id: "P345", name: "Smartwatch Premium", stock: 3, minStock: 5, status: "error" },
  { id: "P212", name: "Caixa de Som Bluetooth Portátil", stock: 2, minStock: 10, status: "error" },
  { id: "P187", name: "Mouse Sem Fio Ergonômico", stock: 4, minStock: 8, status: "warning" },
  { id: "P156", name: "Carregador Sem Fio Rápido", stock: 6, minStock: 10, status: "warning" },
];

const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 6000 },
  { name: 'Abr', value: 8000 },
  { name: 'Mai', value: 5000 },
  { name: 'Jun', value: 7000 },
];

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  count: string;
  countLabel: string;
  hasNotification?: boolean;
  notificationCount?: number;
  action: () => void;
}

const Dashboard: React.FC = () => {
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const handleActionClick = (action: () => void, index: number) => {
    setLoadingAction(index);
    // Simula um pequeno delay para melhor UX
    setTimeout(() => {
      action();
      setLoadingAction(null);
    }, 800);
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Cadastrar Produto',
      description: 'Adicionar novo produto ao catálogo',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      count: '1.342',
      countLabel: 'produtos ativos',
      action: () => window.location.href = '/admin/products?action=new'
    },
    {
      title: 'Consultar Pedidos',
      description: 'Ver pedidos e atualizar status',
      icon: Search,
      color: 'bg-green-500 hover:bg-green-600',
      count: '24',
      countLabel: 'pedidos hoje',
      hasNotification: true,
      notificationCount: 3,
      action: () => window.location.href = '/admin/orders'
    },
    {
      title: 'Gerenciar Categorias',
      description: 'Organizar categorias de produtos',
      icon: Package,
      color: 'bg-purple-500 hover:bg-purple-600',
      count: '15',
      countLabel: 'categorias ativas',
      action: () => window.location.href = '/admin/categories'
    },
    {
      title: 'Ver Relatórios',
      description: 'Análises e métricas detalhadas',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600',
      count: 'R$ 15.2k',
      countLabel: 'vendas hoje',
      action: () => window.location.href = '/admin/reports'
    }
  ];

  return (
    <AdminPageLayout
      title="Dashboard"
      description="Visão geral completa do desempenho da sua loja"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Dashboard' }
      ]}
      badge={{
        text: 'Tempo Real',
        variant: 'default'
      }}
      action={{
        label: 'Ver Produtos',
        icon: <Package className="h-4 w-4" />,
        onClick: () => window.location.href = '/admin/products'
      }}
    >
      {/* Quick Actions */}
      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Ações Rápidas</h2>
          <p className="text-sm text-gray-600">Acesse rapidamente as principais funcionalidades da sua loja</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card 
                      className={`border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                        loadingAction === index ? 'opacity-75 pointer-events-none' : ''
                      }`}
                      onClick={() => handleActionClick(action.action, index)}
                    >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-4 sm:p-6 relative z-10">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${action.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                        {loadingAction === index ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        )}
                      </div>
                      {action.hasNotification && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                          {action.notificationCount}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-gray-800 transition-colors leading-tight">
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors">
                        {action.description}
                      </p>
                      <div className="bg-gray-50 group-hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors duration-300">
                        <div className="text-lg sm:text-xl font-bold text-gray-900">{action.count}</div>
                        <div className="text-xs text-gray-500">{action.countLabel}</div>
                      </div>
                    </div>
                    <div className="w-full pt-2">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden group-hover:bg-gray-300 transition-colors duration-300">
                        <div className={`h-full ${action.color.split(' ')[0]} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out`} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clique para {action.title.toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </section>

      {/* Stats Grid */}
      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Métricas Principais</h2>
          <p className="text-sm text-gray-600">Acompanhe os principais indicadores do seu negócio</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Charts Row */}
      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Análise de Vendas</h2>
          <p className="text-sm text-gray-600">Visualize o desempenho das vendas e pedidos</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <ChartCard 
              title="Vendas nos Últimos 6 Meses" 
              data={[
                { name: 'Jan', value: 4000 },
                { name: 'Fev', value: 3000 },
                { name: 'Mar', value: 6000 },
                { name: 'Abr', value: 8000 },
                { name: 'Mai', value: 5000 },
                { name: 'Jun', value: 7000 },
              ]}
              height={300}
              type="area"
            />
          </div>
          <div className="lg:col-span-1">
            <ChartCard 
              title="Pedidos por Dia" 
              data={[
                { name: 'Seg', value: 12 },
                { name: 'Ter', value: 19 },
                { name: 'Qua', value: 15 },
                { name: 'Qui', value: 22 },
                { name: 'Sex', value: 18 },
                { name: 'Sáb', value: 8 },
                { name: 'Dom', value: 5 },
              ]}
              height={300}
              type="line"
            />
          </div>
        </div>
      </section>

      {/* Tables Row */}
      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Atividades Recentes</h2>
          <p className="text-sm text-gray-600">Pedidos recentes e produtos com estoque baixo</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <ModernTable
            title="Pedidos Recentes"
            columns={[
              { key: 'id', label: 'ID', width: '80px' },
              { key: 'customer', label: 'Cliente' },
              { key: 'date', label: 'Data', width: '120px' },
              { key: 'status', label: 'Status', width: '140px', align: 'center' as const },
              { key: 'total', label: 'Total', width: '100px', align: 'right' as const },
            ]}
            data={[
              { id: "#4832", customer: "Ana Silva", date: "12/05/2025", status: "Entregue", total: "R$ 256,00" },
              { id: "#4831", customer: "Carlos Mendes", date: "12/05/2025", status: "Em processamento", total: "R$ 129,90" },
              { id: "#4830", customer: "Beatriz Lima", date: "11/05/2025", status: "Enviado", total: "R$ 345,50" },
              { id: "#4829", customer: "Diego Santos", date: "11/05/2025", status: "Aguardando pagamento", total: "R$ 78,90" },
              { id: "#4828", customer: "Juliana Costa", date: "10/05/2025", status: "Entregue", total: "R$ 199,00" },
            ]}
          />
          
          <ModernTable
            title="Produtos com Estoque Baixo"
            columns={[
              { key: 'id', label: 'ID', width: '80px' },
              { key: 'name', label: 'Produto' },
              { key: 'stock', label: 'Atual', width: '80px', align: 'center' as const },
              { key: 'minStock', label: 'Mínimo', width: '80px', align: 'center' as const },
              { 
                key: 'status', 
                label: 'Status', 
                width: '120px', 
                align: 'center' as const,
                render: (value: string) => (
                  <StatusBadge 
                    status={value as 'error' | 'warning'} 
                    text={value === 'error' ? 'Crítico' : 'Baixo'}
                  />
                )
              },
            ]}
            data={lowStockProducts}
          />
        </div>
      </section>
    </AdminPageLayout>
  );
};

export default Dashboard;


import React from 'react';
import { TrendingUp, ShoppingCart, Package, Truck, Plus } from 'lucide-react';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { ChartCard } from '@/components/admin/dashboard/ChartCard';
import { ModernTable } from '@/components/admin/dashboard/ModernTable';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';

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

const Dashboard: React.FC = () => {
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
        label: 'Novo Produto',
        icon: <Plus className="h-4 w-4" />,
        onClick: () => console.log('Novo produto')
      }}
    >
      
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


import React from 'react';
import { TrendingUp, ShoppingCart, Package, Truck, Plus } from 'lucide-react';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { ChartCard } from '@/components/admin/dashboard/ChartCard';
import { ModernTable } from '@/components/admin/dashboard/ModernTable';
import { PageHeader } from '@/components/admin/layout/PageHeader';

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
  { id: "P345", name: "Smartwatch Premium", stock: 3, minStock: 5, status: "🔴" },
  { id: "P212", name: "Caixa de Som Bluetooth Portátil", stock: 2, minStock: 10, status: "🔴" },
  { id: "P187", name: "Mouse Sem Fio Ergonômico", stock: 4, minStock: 8, status: "🔴" },
  { id: "P156", name: "Carregador Sem Fio Rápido", stock: 6, minStock: 10, status: "🔴" },
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
    <div className="space-y-8 p-1">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua loja"
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Dashboard' }
        ]}
        action={{
          label: 'Novo Produto',
          icon: Plus,
          onClick: () => console.log('Novo produto')
        }}
      />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Vendas nos Últimos 6 Meses" 
            data={salesData}
            height={350}
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
            height={350}
          />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModernTable
          title="Pedidos Recentes"
          columns={recentOrdersColumns}
          data={recentOrders}
        />
        
        <ModernTable
          title="Produtos com Estoque Baixo"
          columns={lowStockColumns}
          data={lowStockProducts}
        />
      </div>
    </div>
  );
};

export default Dashboard;

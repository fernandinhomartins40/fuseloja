
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TabsContent } from '@/components/ui/tabs';
import { BarChart, LineChart, Package, ShoppingCart, TrendingUp, Truck } from 'lucide-react';

// Sample data for dashboard
const stats = [
  {
    title: "Total de Vendas",
    value: "R$ 15.231,89",
    description: "+20% em relação ao mês passado",
    icon: TrendingUp,
    color: "text-green-500"
  },
  {
    title: "Pedidos",
    value: "124",
    description: "23 aguardando despacho",
    icon: ShoppingCart,
    color: "text-blue-500"
  },
  {
    title: "Produtos",
    value: "1.342",
    description: "12 com estoque baixo",
    icon: Package,
    color: "text-amber-500"
  },
  {
    title: "Entregas",
    value: "87",
    description: "14 em trânsito",
    icon: Truck,
    color: "text-purple-500"
  },
];

const recentOrders = [
  { id: "#4832", customer: "Ana Silva", date: "12/05/2025", status: "Entregue", total: "R$ 256,00" },
  { id: "#4831", customer: "Carlos Mendes", date: "12/05/2025", status: "Em processamento", total: "R$ 129,90" },
  { id: "#4830", customer: "Beatriz Lima", date: "11/05/2025", status: "Enviado", total: "R$ 345,50" },
  { id: "#4829", customer: "Diego Santos", date: "11/05/2025", status: "Aguardando pagamento", total: "R$ 78,90" },
  { id: "#4828", customer: "Juliana Costa", date: "10/05/2025", status: "Entregue", total: "R$ 199,00" },
];

const lowStockProducts = [
  { id: "P345", name: "Smartwatch Premium", stock: 3, minStock: 5 },
  { id: "P212", name: "Caixa de Som Bluetooth Portátil", stock: 2, minStock: 10 },
  { id: "P187", name: "Mouse Sem Fio Ergonômico", stock: 4, minStock: 8 },
  { id: "P156", name: "Carregador Sem Fio Rápido", stock: 6, minStock: 10 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" description="Visão geral da sua loja" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Os últimos 5 pedidos recebidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">ID</th>
                    <th className="text-left py-2 px-2 font-medium">Cliente</th>
                    <th className="text-left py-2 px-2 font-medium">Data</th>
                    <th className="text-left py-2 px-2 font-medium">Status</th>
                    <th className="text-right py-2 px-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-2">{order.id}</td>
                      <td className="py-2 px-2">{order.customer}</td>
                      <td className="py-2 px-2">{order.date}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === "Entregue" ? "bg-green-100 text-green-800" :
                          order.status === "Enviado" ? "bg-blue-100 text-blue-800" :
                          order.status === "Em processamento" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-right py-2 px-2">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
            <CardDescription>Produtos que precisam de reposição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">ID</th>
                    <th className="text-left py-2 px-2 font-medium">Produto</th>
                    <th className="text-center py-2 px-2 font-medium">Atual</th>
                    <th className="text-center py-2 px-2 font-medium">Mínimo</th>
                    <th className="text-center py-2 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-2">{product.id}</td>
                      <td className="py-2 px-2">{product.name}</td>
                      <td className="py-2 px-2 text-center">{product.stock}</td>
                      <td className="py-2 px-2 text-center">{product.minStock}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas nos Últimos 30 Dias</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <LineChart className="h-16 w-16 mb-2" />
              <p>Gráfico de vendas seria exibido aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, LineChart, PieChart } from 'lucide-react';

// Sample data for reports
const topProducts = [
  { id: 1, name: "Smartwatch Premium", sales: 42, revenue: 25189.58 },
  { id: 2, name: "Fone de Ouvido Bluetooth", sales: 38, revenue: 9499.62 },
  { id: 3, name: "Mouse Sem Fio Ergonômico", sales: 35, revenue: 3149.65 },
  { id: 4, name: "Caixa de Som Bluetooth Portátil", sales: 31, revenue: 4649.69 },
  { id: 5, name: "Carregador Sem Fio Rápido", sales: 27, revenue: 3509.73 }
];

const monthlySales = [
  { month: 'Janeiro', sales: 12500 },
  { month: 'Fevereiro', sales: 15200 },
  { month: 'Março', sales: 18100 },
  { month: 'Abril', sales: 16700 },
  { month: 'Maio', sales: 19300 },
];

const categorySales = [
  { category: 'Eletrônicos', sales: 35700, percentage: 42 },
  { category: 'Audio', sales: 22300, percentage: 26 },
  { category: 'Acessórios', sales: 16800, percentage: 20 },
  { category: 'Gadgets', sales: 10200, percentage: 12 },
];

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('ultimo_mes');

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Relatórios e Análises" 
        description="Visualize o desempenho da sua loja"
      />

      <div className="flex justify-between items-center">
        <Tabs defaultValue="sales" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="sales">
                <BarChart className="h-4 w-4 mr-2" />
                Vendas
              </TabsTrigger>
              <TabsTrigger value="products">
                <LineChart className="h-4 w-4 mr-2" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="categories">
                <PieChart className="h-4 w-4 mr-2" />
                Categorias
              </TabsTrigger>
            </TabsList>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="ultimo_mes">Último Mês</SelectItem>
                <SelectItem value="tres_meses">Últimos 3 Meses</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 81.800,00</div>
                  <p className="text-xs text-green-600 font-medium mt-1">↑ 12% em relação ao período anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Número de Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">173</div>
                  <p className="text-xs text-green-600 font-medium mt-1">↑ 8% em relação ao período anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Valor Médio do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 472,83</div>
                  <p className="text-xs text-green-600 font-medium mt-1">↑ 3.5% em relação ao período anterior</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Vendas Mensais</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mb-2" />
                  <p>Gráfico de vendas mensais seria exibido aqui</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Vendas</TableHead>
                        <TableHead className="text-right">Receita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">{product.sales} unid.</TableCell>
                          <TableCell className="text-right">R$ {product.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Vendas por Produto</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-2" />
                  <p>Gráfico de tendência de produtos seria exibido aqui</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Categoria</TableHead>
                          <TableHead className="text-right">Vendas</TableHead>
                          <TableHead className="text-right">Percentual</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categorySales.map((category, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{category.category}</TableCell>
                            <TableCell className="text-right">R$ {category.sales.toLocaleString('pt-BR')}</TableCell>
                            <TableCell className="text-right">{category.percentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <PieChart className="h-16 w-16 mb-2" />
                    <p>Gráfico de distribuição de categorias seria exibido aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;

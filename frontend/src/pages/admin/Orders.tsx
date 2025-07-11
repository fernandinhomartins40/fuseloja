import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import OrderDetails from '@/components/admin/OrderDetails';
import { useOrders, Order, OrderStatus } from '@/contexts/OrderContext';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { SearchFilter, FilterOption } from '@/components/admin/ui/SearchFilter';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { toast } from '@/hooks/use-toast';

const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter configuration for orders
  const filterConfig: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'multiselect',
      options: [
        { value: 'pending', label: 'Aguardando Pagamento' },
        { value: 'processing', label: 'Em Processamento' },
        { value: 'shipped', label: 'Enviado' },
        { value: 'delivered', label: 'Entregue' },
        { value: 'cancelled', label: 'Cancelado' }
      ],
      placeholder: 'Todos os status'
    },
    {
      key: 'total_min',
      label: 'Valor mínimo',
      type: 'number',
      placeholder: 'R$ 0,00'
    },
    {
      key: 'total_max',
      label: 'Valor máximo',
      type: 'number',
      placeholder: 'R$ 999.999,99'
    },
    {
      key: 'date_range',
      label: 'Período',
      type: 'daterange',
      placeholder: 'Selecionar período'
    },
    {
      key: 'payment_method',
      label: 'Método de Pagamento',
      type: 'select',
      options: [
        { value: 'credit_card', label: 'Cartão de Crédito' },
        { value: 'debit_card', label: 'Cartão de Débito' },
        { value: 'pix', label: 'PIX' },
        { value: 'boleto', label: 'Boleto' }
      ],
      placeholder: 'Todos os métodos'
    }
  ];

  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    clearFilters,
    filteredData: filteredOrders
  } = useSearchFilter(orders, {
    filterConfig,
    initialSearch: ''
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    toast({
      title: "Status atualizado",
      description: `O pedido ${orderId} foi atualizado para ${getStatusLabel(newStatus)}.`
    });
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return 'Aguardando Pagamento';
      case 'processing': return 'Em Processamento';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'canceled': return 'Cancelado';
    }
  };

  const getStatusType = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'processing';
      case 'delivered': return 'success';
      case 'canceled': return 'error';
      default: return 'info';
    }
  };

  return (
    <AdminPageLayout
      title="Pedidos"
      description="Gerencie todos os pedidos da sua loja e acompanhe o status de cada um"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Vendas', href: '/admin' },
        { label: 'Pedidos' }
      ]}
      badge={{
        text: `${filteredOrders.length} de ${orders.length} pedidos`,
        variant: 'secondary'
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Buscar por cliente, número do pedido ou email..."
          filters={filterConfig}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          onClearFilters={clearFilters}
          showFilterCount={true}
        />

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={getStatusType(order.status) as any}
                            text={getStatusLabel(order.status)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        {orders.length === 0 ? "Nenhum pedido foi criado ainda" : "Nenhum pedido encontrado"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Detalhes do Pedido {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <OrderDetails
                order={selectedOrder}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default Orders;
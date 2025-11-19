import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { VirtualizedTable } from '@/components/admin/ui/VirtualizedTable';
import { FilterOption } from '@/components/admin/ui/SearchFilter';
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

  // Column definitions for orders table
  const columns = [
    {
      key: 'id' as keyof Order,
      label: 'Pedido',
      width: '120px',
      sortable: true
    },
    {
      key: 'customer' as keyof Order,
      label: 'Cliente',
      width: '200px',
      sortable: true,
      render: (customer: any) => customer?.name || 'N/A'
    },
    {
      key: 'date' as keyof Order,
      label: 'Data',
      width: '120px',
      sortable: true,
      render: (date: string | Date) => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('pt-BR');
      }
    },
    {
      key: 'total' as keyof Order,
      label: 'Total',
      width: '120px',
      align: 'right' as const,
      sortable: true,
      render: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    {
      key: 'status' as keyof Order,
      label: 'Status',
      width: '150px',
      sortable: true,
      render: (status: OrderStatus) => (
        <StatusBadge 
          status={getStatusType(status) as any}
          text={getStatusLabel(status)}
        />
      )
    },
    {
      key: 'actions' as keyof Order,
      label: 'Ações',
      width: '120px',
      align: 'center' as const,
      render: (_value: any, order: Order) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleViewOrder(order);
          }}
          className="h-8"
        >
          <Eye className="h-4 w-4 mr-1" />
          Detalhes
        </Button>
      )
    }
  ];

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
        text: `${orders.length} pedidos`,
        variant: 'secondary'
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        <VirtualizedTable
          data={orders}
          columns={columns}
          itemHeight={80}
          containerHeight={600}
          searchFields={['id', 'customer_name', 'customer_email', 'customer_phone']}
          filterConfig={filterConfig}
          searchPlaceholder="Buscar por cliente, número do pedido ou email..."
          onRowClick={(order) => {
            handleViewOrder(order);
          }}
          emptyMessage={orders.length === 0 ? "Nenhum pedido foi criado ainda" : "Nenhum pedido encontrado"}
        />

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

import React from 'react';
import { Order } from '@/pages/admin/Orders';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled') => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onUpdateStatus }) => {
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'Aguardando Pagamento';
      case 'processing': return 'Em Processamento';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="font-medium text-lg">Pedido {order.id}</h3>
          <p className="text-muted-foreground text-sm">Realizado em {order.date}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Status atual</span>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Atualizar status</span>
            <Select 
              value={order.status} 
              onValueChange={(value) => onUpdateStatus(order.id, value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Aguardando Pagamento</SelectItem>
                <SelectItem value="processing">Em Processamento</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Informações do Cliente</h4>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
              <p className="text-muted-foreground">{order.customer.address}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Informações do Pagamento</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Método:</span> {order.paymentMethod}</p>
              <p><span className="text-muted-foreground">Forma de envio:</span> {order.shippingMethod}</p>
              <p><span className="text-muted-foreground">Total do pedido:</span> R$ {order.total.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Itens do Pedido</h4>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {item.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <span className="font-medium">Total</span>
          <span className="font-bold text-lg">R$ {order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

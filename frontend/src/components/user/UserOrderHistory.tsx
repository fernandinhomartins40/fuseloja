
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUser } from '@/contexts/UserContext';

export const UserOrderHistory: React.FC = () => {
  const { user } = useUser();
  const orders = user?.orders || [];

  // Map order status to appropriate badge variant and label
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
      pending: { variant: "outline", label: "Pendente" },
      processing: { variant: "secondary", label: "Processando" },
      shipped: { variant: "default", label: "Enviado" },
      delivered: { variant: "default", label: "Entregue" },
      canceled: { variant: "destructive", label: "Cancelado" },
    };

    const config = statusMap[status] || { variant: "outline", label: "Desconhecido" };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Format price in BRL
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Você ainda não realizou nenhum pedido</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Meus Pedidos</h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        {orders.map((order) => (
          <AccordionItem key={order.id} value={order.id} className="border rounded-md">
            <Card>
              <CardContent className="p-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">Pedido #{order.id}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(order.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      {getStatusBadge(order.status)}
                      <span className="font-medium">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                  <div className="p-4 space-y-4">
                    <h3 className="text-sm font-medium">Itens do Pedido</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{item.quantity} {item.quantity > 1 ? 'unidades' : 'unidade'}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </CardContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

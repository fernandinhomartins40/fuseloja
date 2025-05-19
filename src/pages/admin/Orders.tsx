
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
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
import { Input } from '@/components/ui/input';
import { Search, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import OrderDetails from '@/components/admin/OrderDetails';
import { toast } from '@/hooks/use-toast';

// Sample order data
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

type OrderItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  shippingMethod: string;
};

const initialOrders: Order[] = [
  {
    id: "#4832",
    customer: {
      name: "Ana Silva",
      email: "ana.silva@example.com",
      phone: "(11) 98765-4321",
      address: "Rua das Flores, 123 - São Paulo, SP"
    },
    items: [
      {
        id: "p001",
        title: "Smartwatch Premium",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
        quantity: 1
      }
    ],
    total: 599.99,
    status: "delivered",
    date: "12/05/2025",
    paymentMethod: "Cartão de Crédito",
    shippingMethod: "Entrega Expressa"
  },
  {
    id: "#4831",
    customer: {
      name: "Carlos Mendes",
      email: "carlos.mendes@example.com",
      phone: "(21) 99876-5432",
      address: "Av. Principal, 456 - Rio de Janeiro, RJ"
    },
    items: [
      {
        id: "p002",
        title: "Caixa de Som Bluetooth Portátil",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1558089966-a11f54853d0b?q=80&auto=format&fit=crop",
        quantity: 1
      }
    ],
    total: 149.99,
    status: "processing",
    date: "12/05/2025",
    paymentMethod: "Boleto Bancário",
    shippingMethod: "Entrega Padrão"
  },
  {
    id: "#4830",
    customer: {
      name: "Beatriz Lima",
      email: "beatriz.lima@example.com",
      phone: "(31) 98765-1234",
      address: "Rua dos Ipês, 789 - Belo Horizonte, MG"
    },
    items: [
      {
        id: "p003",
        title: "Mouse Sem Fio Ergonômico",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&auto=format&fit=crop",
        quantity: 1
      },
      {
        id: "p004",
        title: "Carregador Sem Fio Rápido",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1608569212221-856278461677?q=80&auto=format&fit=crop",
        quantity: 2
      }
    ],
    total: 349.97,
    status: "shipped",
    date: "11/05/2025",
    paymentMethod: "Cartão de Crédito",
    shippingMethod: "Entrega Expressa"
  },
  {
    id: "#4829",
    customer: {
      name: "Diego Santos",
      email: "diego.santos@example.com",
      phone: "(41) 99876-4321",
      address: "Av. das Araucárias, 1010 - Curitiba, PR"
    },
    items: [
      {
        id: "p005",
        title: "Fone de Ouvido Bluetooth",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&auto=format&fit=crop",
        quantity: 1
      }
    ],
    total: 249.99,
    status: "pending",
    date: "11/05/2025",
    paymentMethod: "Pix",
    shippingMethod: "Retirada na Loja"
  },
  {
    id: "#4828",
    customer: {
      name: "Juliana Costa",
      email: "juliana.costa@example.com",
      phone: "(51) 98765-5678",
      address: "Rua das Palmeiras, 202 - Porto Alegre, RS"
    },
    items: [
      {
        id: "p001",
        title: "Smartwatch Premium",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
        quantity: 1
      }
    ],
    total: 599.99,
    status: "delivered",
    date: "10/05/2025",
    paymentMethod: "Cartão de Débito",
    shippingMethod: "Entrega Padrão"
  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
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

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Gerenciamento de Pedidos" 
        description="Visualize e atualize o status dos pedidos"
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou número do pedido"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Aguardando Pagamento</SelectItem>
                <SelectItem value="processing">Em Processamento</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
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
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrder?.id}</DialogTitle>
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
  );
};

export default Orders;

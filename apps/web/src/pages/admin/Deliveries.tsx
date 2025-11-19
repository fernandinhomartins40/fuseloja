
import React, { useState } from 'react';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
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
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Truck, MapPin, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

// Sample delivery data
type DeliveryStatus = 'preparing' | 'in_transit' | 'delivered' | 'returned';

type Delivery = {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  status: DeliveryStatus;
  trackingCode?: string;
  shippingDate?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  carrier: string;
};

const initialDeliveries: Delivery[] = [
  {
    id: "d001",
    orderId: "#4832",
    customer: "Ana Silva",
    address: "Rua das Flores, 123 - São Paulo, SP",
    status: "delivered",
    trackingCode: "BR1234567890",
    shippingDate: "12/05/2025",
    estimatedDelivery: "14/05/2025",
    deliveredDate: "13/05/2025",
    carrier: "Correios"
  },
  {
    id: "d002",
    orderId: "#4831",
    customer: "Carlos Mendes",
    address: "Av. Principal, 456 - Rio de Janeiro, RJ",
    status: "preparing",
    carrier: "Transportadora XYZ"
  },
  {
    id: "d003",
    orderId: "#4830",
    customer: "Beatriz Lima",
    address: "Rua dos Ipês, 789 - Belo Horizonte, MG",
    status: "in_transit",
    trackingCode: "BR0987654321",
    shippingDate: "11/05/2025",
    estimatedDelivery: "15/05/2025",
    carrier: "Jadlog"
  },
  {
    id: "d004",
    orderId: "#4829",
    customer: "Diego Santos",
    address: "Av. das Araucárias, 1010 - Curitiba, PR",
    status: "preparing",
    carrier: "Correios"
  },
  {
    id: "d005",
    orderId: "#4828",
    customer: "Juliana Costa",
    address: "Rua das Palmeiras, 202 - Porto Alegre, RS",
    status: "delivered",
    trackingCode: "BR5678901234",
    shippingDate: "10/05/2025",
    estimatedDelivery: "13/05/2025",
    deliveredDate: "12/05/2025",
    carrier: "Transportadora XYZ"
  }
];

const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (delivery.trackingCode && delivery.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateDelivery = (deliveryId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      setSelectedDelivery(delivery);
      setTrackingCode(delivery.trackingCode || '');
      setIsDialogOpen(true);
    }
  };

  const handleSaveTracking = () => {
    if (selectedDelivery) {
      const updatedDeliveries = deliveries.map(delivery => 
        delivery.id === selectedDelivery.id 
          ? { 
              ...delivery, 
              trackingCode: trackingCode,
              status: delivery.status === 'preparing' ? 'in_transit' : delivery.status,
              shippingDate: delivery.shippingDate || new Date().toLocaleDateString('pt-BR')
            } 
          : delivery
      );
      setDeliveries(updatedDeliveries);
      setIsDialogOpen(false);
      toast({
        title: "Rastreamento atualizado",
        description: `O código de rastreio foi atualizado com sucesso.`
      });
    }
  };

  const handleUpdateStatus = (deliveryId: string, newStatus: DeliveryStatus) => {
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        const updates: Partial<Delivery> = { status: newStatus };
        
        // Add additional data based on the status
        if (newStatus === 'in_transit' && !delivery.shippingDate) {
          updates.shippingDate = new Date().toLocaleDateString('pt-BR');
        } else if (newStatus === 'delivered') {
          updates.deliveredDate = new Date().toLocaleDateString('pt-BR');
        }
        
        return { ...delivery, ...updates };
      }
      return delivery;
    });
    
    setDeliveries(updatedDeliveries);
    toast({
      title: "Status atualizado",
      description: `O status da entrega foi atualizado para ${getStatusLabel(newStatus)}.`
    });
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch(status) {
      case 'preparing': return 'Preparando';
      case 'in_transit': return 'Em Trânsito';
      case 'delivered': return 'Entregue';
      case 'returned': return 'Devolvido';
    }
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch(status) {
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <AdminPageLayout
      title="Entregas"
      description="Acompanhe e gerencie todas as entregas da sua loja"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Vendas', href: '/admin' },
        { label: 'Entregas' }
      ]}
      badge={{
        text: `${filteredDeliveries.length} entregas`,
        variant: 'secondary'
      }}
    >
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, pedido ou código de rastreio"
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
                <SelectItem value="preparing">Preparando</SelectItem>
                <SelectItem value="in_transit">Em Trânsito</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="returned">Devolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Transportadora</TableHead>
                  <TableHead>Rastreio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.orderId}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{delivery.customer}</span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> 
                            {delivery.address.length > 25 
                              ? delivery.address.substring(0, 25) + '...' 
                              : delivery.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{delivery.carrier}</TableCell>
                      <TableCell>
                        {delivery.trackingCode || (
                          <span className="text-muted-foreground text-sm">Não informado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                          {getStatusLabel(delivery.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateDelivery(delivery.id)}
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Rastreio
                          </Button>
                          <Select 
                            value={delivery.status} 
                            onValueChange={(value) => handleUpdateStatus(delivery.id, value as DeliveryStatus)}
                          >
                            <SelectTrigger className="w-[140px] h-9">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="preparing">Preparando</SelectItem>
                              <SelectItem value="in_transit">Em Trânsito</SelectItem>
                              <SelectItem value="delivered">Entregue</SelectItem>
                              <SelectItem value="returned">Devolvido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Nenhuma entrega encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Atualizar Rastreamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pedido</p>
              <p className="font-medium">{selectedDelivery?.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cliente</p>
              <p className="font-medium">{selectedDelivery?.customer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transportadora</p>
              <p className="font-medium">{selectedDelivery?.carrier}</p>
            </div>
            <div className="space-y-1">
              <label htmlFor="tracking-code" className="text-sm font-medium">
                Código de Rastreio
              </label>
              <Input
                id="tracking-code"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Informe o código de rastreio"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTracking} disabled={!trackingCode}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default Deliveries;

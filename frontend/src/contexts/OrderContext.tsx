
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/contexts/CartContext';
import { User } from '@/types/user';
import { toast } from '@/components/ui/sonner';
import apiClient from '@/services/api';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  payment_method: string;
  shipping_method: string;
  created_at: string;
  updated_at: string;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (
    customer: { name: string; phone: string; email?: string },
    items: CartItem[],
    total: number
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  fetchOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch orders from API on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ orders: Order[] }>('/orders');
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Fallback to localStorage for offline capability
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (parseError) {
          console.error('Failed to parse orders from localStorage:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (
    customer: { name: string; phone: string; email?: string },
    items: CartItem[],
    total: number
  ): Promise<Order> => {
    try {
      setIsLoading(true);
      
      const orderData = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || '',
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          imageUrl: item.image,
          quantity: item.quantity
        })),
        total,
        payment_method: 'WhatsApp',
        shipping_method: 'A definir'
      };

      const response = await apiClient.post<{ order: Order }>('/orders', orderData);
      const newOrder = response.data?.order;
      
      if (!newOrder) {
        throw new Error('Order creation failed - no order returned');
      }

      // Update local state
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      // Save to localStorage as backup
      localStorage.setItem('orders', JSON.stringify([newOrder, ...orders]));
      
      // Show notification for new order
      toast.success(`Novo pedido criado: #${newOrder.id}`);
      
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setIsLoading(true);
      
      await apiClient.patch(`/orders/${orderId}`, { status });
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      toast.success('Status do pedido atualizado com sucesso!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Erro ao atualizar status do pedido.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      isLoading,
      createOrder,
      updateOrderStatus,
      getOrderById,
      fetchOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

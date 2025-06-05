
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/contexts/CartContext';
import { User } from '@/types/user';
import { toast } from '@/components/ui/sonner';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: Date;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (
    customer: { name: string; phone: string; email?: string },
    items: CartItem[],
    total: number
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Convert date strings back to Date objects
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }));
        setOrders(ordersWithDates);
      } catch (error) {
        console.error('Failed to parse orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (
    customer: { name: string; phone: string; email?: string },
    items: CartItem[],
    total: number
  ): Order => {
    const now = new Date();
    const orderId = `#${Date.now()}`;
    
    const newOrder: Order = {
      id: orderId,
      customer: {
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone,
        address: '' // Will be empty for WhatsApp orders
      },
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      total,
      status: 'pending',
      date: now.toLocaleDateString('pt-BR'),
      paymentMethod: 'WhatsApp',
      shippingMethod: 'A definir',
      createdAt: now
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    // Show notification for new order
    toast.success(`Novo pedido criado: ${orderId}`);
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById
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

import apiClient from './api';
import { CartItem } from '@/contexts/CartContext';

// Interface para a resposta da criação de usuário provisório
interface ProvisionalUserResponse {
  customer: any; // Defina tipos mais específicos se necessário
  user: any;
  provisionalCredentials: {
    email: string;
    password: string;
  };
}

// Interface para a resposta da criação de pedido
interface OrderResponse {
  order: any; // Defina tipos mais específicos se necessário
}

class ECommerceService {
  /**
   * Cria um cliente e um usuário provisório no backend.
   * Se o cliente já existir pelo telefone, ele será retornado.
   */
  async createProvisionalCustomer(name: string, phone: string): Promise<ProvisionalUserResponse> {
    const response = await apiClient.post<ProvisionalUserResponse>('/customers/provisional', { name, phone });
    return response.data;
  }

  /**
   * Cria um novo pedido no sistema.
   */
  async createOrder(
    customerName: string,
    customerPhone: string,
    customerEmail: string | undefined,
    items: CartItem[],
    total: number
  ): Promise<OrderResponse> {
    const orderData = {
      customerName,
      customerPhone,
      customerEmail,
      items,
      total,
    };
    const response = await apiClient.post<OrderResponse>('/orders', orderData);
    return response.data;
  }
}

export const eCommerceService = new ECommerceService(); 
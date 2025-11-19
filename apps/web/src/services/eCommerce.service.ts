import apiClient from './api';
import { CartItem } from '@/contexts/CartContext';
import { Category } from '@fuseloja/types';

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

  /**
   * Busca todas as categorias.
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<{ categories: Category[] }>('/categories');
    return response.data.categories;
  }

  /**
   * Cria uma nova categoria.
   */
  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const response = await apiClient.post<{ category: Category }>('/categories', categoryData);
    return response.data.category;
  }

  /**
   * Atualiza uma categoria existente.
   */
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const response = await apiClient.put<{ category: Category }>(`/categories/${id}`, categoryData);
    return response.data.category;
  }

  /**
   * Exclui uma categoria.
   */
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }
}

export const eCommerceService = new ECommerceService(); 
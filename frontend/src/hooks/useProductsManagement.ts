
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';
import apiClient from '@/services/api';
import { toast } from 'sonner';
import { useState } from 'react';

// Interfaces para as respostas da API
interface ProductsApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

interface SingleProductApiResponse {
  product: Product;
}

// Funções de fetch da API
const fetchProducts = async (): Promise<ProductsApiResponse> => {
  const response = await apiClient.get<ProductsApiResponse>('/products');
  return response.data;
};

const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const response = await apiClient.post<SingleProductApiResponse>('/products', product);
  return response.data.product;
};

const updateProduct = async (product: Product): Promise<Product> => {
  const response = await apiClient.put<SingleProductApiResponse>(`/products/${product.id}`, product);
  return response.data.product;
};

const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(`/products/${productId}`);
};


export const useProductsManagement = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Query para buscar produtos
  const { data: productsData, isLoading, isError } = useQuery<ProductsApiResponse, Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Mutação para criar produto
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error(`Falha ao criar produto: ${error.message}`);
    }
  });

  // Mutação para atualizar produto
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsFormOpen(false);
      setEditingProduct(null);
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar produto: ${error.message}`);
    }
  });

  // Mutação para deletar produto
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Produto desativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast.error(`Falha ao desativar produto: ${error.message}`);
    }
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleNewProductClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const products = productsData?.products || [];

  return {
    products,
    isLoading,
    isError,
    editingProduct,
    isFormOpen,
    setIsFormOpen,
    handleDeleteProduct: (id: string) => {
      if (window.confirm('Tem certeza que deseja desativar este produto?')) {
        deleteMutation.mutate(id);
      }
    },
    handleEditProduct,
    handleNewProductClick,
    // A função de save agora diferencia entre criar e atualizar
    handleSaveProduct: (product: Product | Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      if ('id' in product) {
        updateMutation.mutate(product as Product);
      } else {
        createMutation.mutate(product);
      }
    },
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};

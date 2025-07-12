
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
  // A resposta da API vem em response.data (ApiResponse wrapper)
  return response.data || { products: [], total: 0, page: 1, limit: 10 };
};

const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const response = await apiClient.post<SingleProductApiResponse>('/products', product);
  return response.data?.product || product as Product;
};

const updateProduct = async (product: Product): Promise<Product> => {
  const response = await apiClient.put<SingleProductApiResponse>(`/products/${product.id}`, product);
  return response.data?.product || product;
};

const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(`/products/${productId}`);
};


export const useProductsManagement = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Query para buscar produtos
  const { data: productsData, isLoading, isError, error } = useQuery<ProductsApiResponse, Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 3,
    retryDelay: 1000,
  });

  // Debug logging
  console.log('Products Query Debug:', {
    productsData,
    isLoading,
    isError,
    error: error?.message,
    products: productsData?.products?.length || 0
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

  // Dados de fallback para desenvolvimento
  const fallbackProducts: Product[] = [
    {
      id: 'fallback-1',
      title: 'Produto de Exemplo 1',
      price: 99.90,
      originalPrice: 149.90,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category: 'electronics',
      stock: 10,
      tag: 'promocao',
      shortDescription: 'Produto de exemplo para demonstração',
      description: 'Este é um produto de exemplo usado para testar a funcionalidade da loja.',
      specifications: [
        { name: 'Cor', value: 'Preto' },
        { name: 'Material', value: 'Metal' }
      ]
    },
    {
      id: 'fallback-2',
      title: 'Produto de Exemplo 2',
      price: 199.90,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'fashion',
      stock: 5,
      tag: 'novo',
      shortDescription: 'Outro produto de exemplo',
      description: 'Este é outro produto de exemplo para demonstração.',
      specifications: [
        { name: 'Tamanho', value: 'M' },
        { name: 'Material', value: 'Algodão' }
      ]
    }
  ];

  // Use API data if available, otherwise fall back to example data
  const products = productsData?.products?.length > 0 ? productsData.products : fallbackProducts;

  // Funções específicas para adicionar e atualizar
  const handleAddProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    createMutation.mutate(product);
  };

  const handleUpdateProduct = (product: Product) => {
    updateMutation.mutate(product);
  };

  return {
    products,
    isLoading,
    isError,
    error: error?.message,
    apiDataAvailable: (productsData?.products?.length || 0) > 0,
    totalProducts: products.length,
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
    handleAddProduct,
    handleUpdateProduct,
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

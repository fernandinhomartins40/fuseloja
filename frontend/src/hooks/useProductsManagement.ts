
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';
import apiClient from '@/services/api';
import { toast } from 'sonner';

// Interfaces para tipos de resposta da API
interface ProductsApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

interface SingleProductApiResponse {
  product: Product;
}

// Função para mapear produto do backend para frontend
const mapProductFromBackend = (backendProduct: any): Product => {
  return {
    id: backendProduct.id?.toString() || '',
    title: backendProduct.title || '',
    shortDescription: backendProduct.short_description || '',
    description: backendProduct.description || '',
    price: parseFloat(backendProduct.price) || 0,
    originalPrice: backendProduct.original_price ? parseFloat(backendProduct.original_price) : undefined,
    sku: backendProduct.sku || '',
    stock: parseInt(backendProduct.stock) || 0,
    imageUrl: backendProduct.image_url || '',
    category: backendProduct.category_name || backendProduct.category || '',
    tag: backendProduct.tag || undefined,
    createdAt: backendProduct.created_at ? new Date(backendProduct.created_at) : undefined,
    updatedAt: backendProduct.updated_at ? new Date(backendProduct.updated_at) : undefined,
    images: backendProduct.images || (backendProduct.image_url ? [backendProduct.image_url] : []),
    specifications: backendProduct.specifications || []
  };
};

// Função para mapear produto do frontend para backend
const mapProductToBackend = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> => {
  // Buscar categoria por nome para obter o ID
  let categoryId;
  try {
    const categoriesResponse = await apiClient.get('/categories');
    const categories = categoriesResponse.data.categories;
    const category = categories.find((cat: any) => cat.name === product.category);
    categoryId = category?.id;
    
    if (!categoryId) {
      throw new Error(`Categoria '${product.category}' não encontrada`);
    }
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    throw new Error('Erro ao validar categoria');
  }

  return {
    title: product.title,
    short_description: product.shortDescription,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice,
    sku: product.sku,
    stock: product.stock,
    category_id: categoryId,
    tag: product.tag,
    image_url: product.imageUrl
  };
};

// Função para buscar produtos da API
const fetchProducts = async (): Promise<ProductsApiResponse> => {
  try {
    console.log('🔍 Buscando produtos da API...');
    const response = await apiClient.get<ProductsApiResponse>('/products?limit=1000&page=1');
    const data = response.data;
    
    if (!data || !data.products) {
      throw new Error('Formato de resposta inválido da API');
    }

    // Mapear produtos do backend para frontend
    const mappedProducts = data.products.map(mapProductFromBackend);
    
    console.log(`✅ ${mappedProducts.length} produtos carregados da API`);
    
    return {
      products: mappedProducts,
      total: data.total || mappedProducts.length,
      page: data.page || 1,
      limit: data.limit || 1000
    };
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    throw error; // Não fazer fallback - deixar o erro ser tratado pelo React Query
  }
};

const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const backendData = await mapProductToBackend(product);
  console.log('📤 Enviando produto para backend:', backendData);
  
  // Validar dados obrigatórios
  if (!backendData.title || !backendData.price || backendData.stock < 0 || !backendData.category_id) {
    throw new Error('Dados obrigatórios faltando: título, preço, estoque e categoria são necessários');
  }
  
  const response = await apiClient.post<SingleProductApiResponse>('/products', backendData);
  return mapProductFromBackend(response.data?.product) || product as Product;
};

const updateProduct = async (product: Product): Promise<Product> => {
  const backendData = await mapProductToBackend(product);
  console.log('📤 Atualizando produto no backend:', backendData);
  
  const response = await apiClient.put<SingleProductApiResponse>(`/products/${product.id}`, backendData);
  return mapProductFromBackend(response.data?.product) || product;
};

const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

export const useProductsManagement = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Query para buscar produtos - sem fallback para dados de exemplo
  const { data: productsData, isLoading, isError, error } = useQuery<ProductsApiResponse, Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 2,
    retryDelay: 2000,
    staleTime: 1000 * 60 * 5, // 5 minutos
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
      queryClient.invalidateQueries({ queryKey: ['best-sellers'] });
      queryClient.invalidateQueries({ queryKey: ['promotion-products'] });
      queryClient.invalidateQueries({ queryKey: ['new-arrivals'] });
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
      queryClient.invalidateQueries({ queryKey: ['best-sellers'] });
      queryClient.invalidateQueries({ queryKey: ['promotion-products'] });
      queryClient.invalidateQueries({ queryKey: ['new-arrivals'] });
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
      toast.success("Produto removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['best-sellers'] });
      queryClient.invalidateQueries({ queryKey: ['promotion-products'] });
      queryClient.invalidateQueries({ queryKey: ['new-arrivals'] });
    },
    onError: (error) => {
      toast.error(`Falha ao remover produto: ${error.message}`);
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

  // Sempre usar dados da API - sem fallback
  const products = productsData?.products || [];

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
    totalProducts: products.length,
    editingProduct,
    isFormOpen,
    setIsFormOpen,
    handleDeleteProduct: (id: string) => {
      if (window.confirm('Tem certeza que deseja remover este produto?')) {
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

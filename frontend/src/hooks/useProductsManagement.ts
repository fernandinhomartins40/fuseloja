
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';
import apiClient from '@/services/api';
import { toast } from 'sonner';
import { useState } from 'react';

// Interface para categoria
interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
  icon: string;
  color: string;
}

// Interface para as respostas da API de categorias
interface CategoriesApiResponse {
  categories: Category[];
}

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

// Função para buscar categorias
const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<CategoriesApiResponse>('/categories');
    return response.data?.categories || [];
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    return [];
  }
};

// Função para mapear produto do frontend para backend
const mapProductToBackend = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const categories = await fetchCategories();
  const category = categories.find(cat => cat.name === product.category);
  
  return {
    title: product.title,
    description: product.description || '',
    price: product.price,
    original_price: product.originalPrice || null,
    sku: product.sku || '',
    stock: product.stock,
    category_id: category?.id || 1, // fallback para primeira categoria
    tag: product.tag || '',
    image_url: product.imageUrl || ''
  };
};

// Função para mapear produto do backend para frontend
const mapProductFromBackend = (backendProduct: any): Product => {
  return {
    id: backendProduct.id,
    title: backendProduct.title,
    shortDescription: backendProduct.short_description,
    description: backendProduct.description,
    price: parseFloat(backendProduct.price),
    originalPrice: backendProduct.original_price ? parseFloat(backendProduct.original_price) : undefined,
    sku: backendProduct.sku,
    stock: backendProduct.stock,
    imageUrl: backendProduct.image_url,
    category: backendProduct.category_name || backendProduct.category,
    tag: backendProduct.tag,
    createdAt: backendProduct.created_at,
    updatedAt: backendProduct.updated_at,
    images: backendProduct.images || [backendProduct.image_url].filter(Boolean),
    specifications: backendProduct.specifications || []
  };
};

// Funções de fetch da API - versão robusta
const fetchProducts = async (): Promise<ProductsApiResponse> => {
  try {
    // Primeira tentativa com limite alto
    const response = await apiClient.get<ProductsApiResponse>('/products?limit=1000&page=1');
    const data = response.data || { products: [], total: 0, page: 1, limit: 1000 };
    
    // Se retornou poucos produtos, tenta buscar mais páginas
    if (data.products && data.products.length < 50 && data.total > data.products.length) {
      console.log('🔄 Poucos produtos retornados, buscando mais páginas...');
      
      // Busca múltiplas páginas para garantir que temos todos os produtos
      const allProducts: Product[] = [...data.products];
      let page = 2;
      let hasMore = true;
      
      while (hasMore && page <= 10) { // máximo 10 páginas para evitar loop infinito
        try {
          const pageResponse = await apiClient.get<ProductsApiResponse>(`/products?limit=1000&page=${page}`);
          const pageData = pageResponse.data;
          
          if (pageData?.products && pageData.products.length > 0) {
            allProducts.push(...pageData.products);
            page++;
          } else {
            hasMore = false;
          }
        } catch (pageError) {
          console.warn(`Erro ao buscar página ${page}:`, pageError);
          hasMore = false;
        }
      }
      
      console.log(`✅ Total de produtos carregados: ${allProducts.length}`);
      
      return {
        products: allProducts,
        total: allProducts.length,
        page: 1,
        limit: allProducts.length
      };
    }
    
    // Mapear produtos do backend para frontend
    const mappedData = {
      ...data,
      products: data.products.map(mapProductFromBackend)
    };
    
    return mappedData;
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    return { products: [], total: 0, page: 1, limit: 1000 };
  }
};

const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const backendData = await mapProductToBackend(product);
  console.log('📤 Enviando produto para backend:', backendData);
  
  const response = await apiClient.post<SingleProductApiResponse>('/products', backendData);
  return mapProductFromBackend(response.data?.product) || product as Product;
};

const updateProduct = async (product: Product): Promise<Product> => {
  const backendData = await mapProductToBackend(product);
  console.log('📤 Atualizando produto no backend:', backendData);
  
  const response = await apiClient.put<SingleProductApiResponse>(`/products/${product.id}`, backendData);
  return mapProductFromBackend(response.data?.product) || product;
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

  // Always use API data - if no data available, show empty state
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
    apiDataAvailable: true, // Always expect API data
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

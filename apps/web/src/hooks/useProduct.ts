
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { Product } from '@/types/product';

// Define a interface para a resposta da API que contém um único produto
interface ProductApiResponse {
  product: Product;
}

const fetchProductById = async (productId: string): Promise<Product> => {
  const response = await apiClient.get<ProductApiResponse>(`/products/${productId}`);
  // A API retorna um objeto { product: ... }, então extraímos o produto
  return response.data.product;
};

export const useProduct = (productId: string | undefined) => {
  const { 
    data: product, 
    isLoading, 
    error,
    isError
  } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => {
      if (!productId) {
        throw new Error("ID do produto não fornecido");
      }
      return fetchProductById(productId);
    },
    enabled: !!productId, // A query só será executada se productId não for undefined
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  return { 
    product, 
    isLoading, 
    error: isError ? error?.message || 'Ocorreu um erro' : null 
  };
};

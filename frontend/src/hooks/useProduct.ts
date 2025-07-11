
import { useState, useEffect } from 'react';
import { Product, initialProducts } from '@/types/product';

export const useProduct = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("ID do produto não fornecido");
      setIsLoading(false);
      return;
    }

    // Simulating API call to get product details
    // In a real application, this would be an API request
    const fetchProduct = () => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          const foundProduct = initialProducts.find(p => p.id === productId);
          
          if (foundProduct) {
            setProduct(foundProduct);
            setError(null);
          } else {
            setProduct(null);
            setError("Produto não encontrado");
          }
        } catch (err) {
          setProduct(null);
          setError("Erro ao buscar detalhes do produto");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 500); // Simulate network delay
    };

    fetchProduct();
  }, [productId]);

  return { product, isLoading, error };
};

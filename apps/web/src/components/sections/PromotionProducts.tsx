import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { Product } from '@/types/product';
import { HorizontalProductCard } from '../ui/HorizontalProductCard';

const fetchPromotionProducts = async (): Promise<Product[]> => {
  // Busca até 10 produtos com a tag 'promocao'
  const response = await apiClient.get<{ products: Product[] }>(`/products?tag=promocao&limit=10`);
  return response.data.products;
};

export const PromotionProducts: React.FC = () => {
  const { data: products, isLoading, isError } = useQuery<Product[], Error>({
    queryKey: ['promotionProducts'],
    queryFn: fetchPromotionProducts,
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });

  if (isLoading || isError || !products || products.length < 2) {
    // Retorna nulo se não houver produtos suficientes para a animação
    return null;
  }

  return (
    <section className="py-6 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden group">
          <div className="flex gap-4 animate-scroll group-hover:[animation-play-state:paused]">
            {/* Renderiza a lista de produtos duas vezes para o efeito de loop contínuo */}
            {[...products, ...products].map((product, index) => (
              <HorizontalProductCard 
                key={`${product.id}-${index}`} 
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
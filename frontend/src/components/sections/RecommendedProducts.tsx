import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';
import { TagType } from '@/components/ui/ProductTag';

const fetchRecommendedProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<{ products: Product[] }>(`/products?tag=promocao&limit=4`);
  return response.data.products;
};

// Helper para converter a tag string da API para o tipo esperado pelo ProductCard
const convertToTagType = (tag?: string): TagType | undefined => {
  if (!tag) return undefined;
  const validTags: TagType[] = ['promocao', 'exclusivo', 'novo', 'novidade', 'ultima-unidade', 'pre-venda'];
  if (validTags.includes(tag as TagType)) {
    return tag as TagType;
  }
  return undefined;
};

export const RecommendedProducts: React.FC = () => {
  const { data: products, isLoading, isError } = useQuery<Product[], Error>({
    queryKey: ['recommendedProducts'],
    queryFn: fetchRecommendedProducts,
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });

  if (isLoading || isError || !products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Recomendado para Você</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.imageUrl}
              tag={convertToTagType(product.tag)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { Product } from '@/types/product';
import { ProductCard } from '../ui/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const fetchNewArrivals = async (): Promise<Product[]> => {
  const response = await apiClient.get<{ products: Product[] }>(`/products?tag=novo&limit=8`);
  return response.data.products;
};

export const NewArrivals: React.FC = () => {
  const { data: products, isLoading, isError } = useQuery<Product[], Error>({
    queryKey: ['newArrivals'],
    queryFn: fetchNewArrivals,
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });

  if (isLoading || isError || !products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Novidades
          </h2>
          <button className="text-sm font-medium px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            Ver todas as novidades
          </button>
        </div>
        
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => {
              // Filter out 'no-tag' as it's not a valid TagType for ProductCard
              const validTag = product.tag && product.tag !== 'no-tag' ? product.tag : undefined;
              
              return (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.imageUrl}
                    tag={validTag as any}
                    id={product.id}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
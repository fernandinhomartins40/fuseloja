import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../ui/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TrendingUp, Star, Award } from 'lucide-react';
import apiClient from '@/services/api';
import { Product } from '@/types/product';

// API function to fetch best selling products
const fetchBestSellers = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/products/best-sellers');
    return response.data.products;
  } catch (error) {
    // Fallback to random products if best-sellers endpoint doesn't exist
    console.log('Best sellers endpoint not available, fetching random products');
    const response = await apiClient.get('/products?limit=12');
    const allProducts = response.data.products;
    
    // Shuffle array and return random selection
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }
};

export const BestSellers: React.FC = () => {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando mais vendidos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 mb-6">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Produtos em Destaque</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Mais Vendidos
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubra os produtos favoritos dos nossos clientes - selecionados com base nas vendas e avaliações
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group bg-card/95 backdrop-blur-sm border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-[520px] flex flex-col relative">
                    {/* Best seller badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        #{index + 1} Vendido
                      </div>
                    </div>

                    <div className="relative overflow-hidden">
                      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 relative">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Price badge for discounted items */}
                        {product.originalPrice && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 transition-colors text-orange-700">
                        {product.title}
                      </h3>
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-baseline gap-2">
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                        <div className="text-xl font-bold text-orange-600">
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          6x de R$ {(product.price / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98] mt-auto border border-orange-400">
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation with orange theme */}
            <CarouselPrevious 
              className="left-4 border bg-white/90 backdrop-blur-sm hover:bg-white"
              style={{ 
                borderColor: '#f97316',
                color: '#f97316'
              }}
            />
            <CarouselNext 
              className="right-4 border bg-white/90 backdrop-blur-sm hover:bg-white"
              style={{ 
                borderColor: '#f97316',
                color: '#f97316'
              }}
            />
          </Carousel>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:shadow-xl border border-orange-400 group">
            <Award className="w-5 h-5" />
            Ver Todos os Mais Vendidos
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
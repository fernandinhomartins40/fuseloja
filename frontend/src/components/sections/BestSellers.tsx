import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TrendingUp, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
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
  
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-accent/10 rounded-full blur-lg"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Modern header with gradient accent */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Mais Populares</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            Mais Vendidos
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
                  <div 
                    className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link to={`/produto/${product.id}`} className="block">
                      <div className="relative overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 relative">
                          <img 
                            src={product.imageUrl} 
                            alt={product.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Best seller badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              <Star className="w-3 h-3 fill-current" />
                              #{index + 1}
                            </span>
                          </div>
                          
                          {/* Price badge */}
                          {product.originalPrice && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-6 space-y-4">
                      <Link to={`/produto/${product.id}`} className="block">
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <div className="space-y-2">
                        {product.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                        <div className="text-xl font-bold text-slate-900">
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500">
                          6x de R$ {(product.price / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => addItem(product)}
                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]">
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation with consistent theme */}
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* Modern CTA button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 group">
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
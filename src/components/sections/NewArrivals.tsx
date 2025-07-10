import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Mock data for new arrivals
const newArrivals = [
  {
    id: "n001",
    title: "iPhone 15 Pro Max 256GB",
    price: 8999.99,
    originalPrice: 9999.99,
    image: "https://images.unsplash.com/photo-1592910147797-0b8c482cf989?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n002", 
    title: "MacBook Air M3 13\" 512GB",
    price: 12999.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n003",
    title: "AirPods Pro 3ª Geração",
    price: 1899.99,
    originalPrice: 2199.99,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n004",
    title: "Samsung Galaxy S24 Ultra",
    price: 7499.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n005",
    title: "PlayStation 5 Slim Digital",
    price: 3999.99,
    originalPrice: 4499.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n006",
    title: "Nintendo Switch OLED",
    price: 2799.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  }
];

export const NewArrivals: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-accent/10 rounded-full blur-lg"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Modern header with gradient accent */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Lançamentos
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            Novidades
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Descubra os produtos mais recentes que acabaram de chegar em nossa loja
          </p>
        </div>
        
        {/* Modern grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newArrivals.map((product, index) => (
            <div 
              key={product.id} 
              className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Modern tag */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      NOVO
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
              
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500">
                    6x de R$ {(product.price / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]">
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Modern CTA button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25">
            Ver Todas as Novidades
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
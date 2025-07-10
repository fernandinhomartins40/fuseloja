import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { iconComponents, IconName } from '@/utils/categoryIcons';
import { TagType } from '../ui/ProductTag';
import { getContrastTextColor } from '@/types/category';

interface Product {
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: TagType;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
  icon: IconName;
  color: string;
}

// Sample category data with products, icons, and colors
const categories: Category[] = [
  {
    id: "electronics",
    name: "Eletrônicos",
    icon: "Smartphone",
    color: "#D3E4FD",
    products: [
      {
        title: "Smartphone Ultra Plus 512GB",
        price: 4999.99,
        originalPrice: 5499.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&auto=format&fit=crop",
        tag: 'exclusivo' as TagType
      },
      {
        title: "Notebook Ultrafino 15\"",
        price: 3699.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&auto=format&fit=crop"
      },
      {
        title: "Smartwatch Premium",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
        tag: 'exclusivo' as TagType
      },
      {
        title: "Tablet Ultra Slim 10.5\"",
        price: 899.99,
        originalPrice: 1099.99,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&auto=format&fit=crop",
        tag: 'novidade' as TagType
      },
      {
        title: "Fone Bluetooth Premium",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&auto=format&fit=crop",
        tag: 'promocao' as TagType
      }
    ]
  },
  {
    id: "fashion",
    name: "Moda",
    icon: "Shirt",
    color: "#FFDEE2",
    products: [
      {
        title: "Tênis Esportivo Premium",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop"
      },
      {
        title: "Relógio Clássico Dourado",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&auto=format&fit=crop"
      },
      {
        title: "Mochila Impermeável Sport",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop"
      },
      {
        title: "Óculos de Sol Premium",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&auto=format&fit=crop",
        tag: 'exclusivo' as TagType
      },
      {
        title: "Jaqueta de Couro",
        price: 499.99,
        originalPrice: 699.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&auto=format&fit=crop",
        tag: 'promocao' as TagType
      }
    ]
  },
  {
    id: "home",
    name: "Casa & Decoração",
    icon: "Home",
    color: "#F2FCE2",
    products: [
      {
        title: "Cafeteira Espresso Automática",
        price: 399.99,
        originalPrice: 599.99,
        image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&auto=format&fit=crop",
        tag: 'ultima-unidade' as TagType
      },
      {
        title: "Panela Elétrica Multifuncional",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&auto=format&fit=crop",
        tag: 'novidade' as TagType
      },
      {
        title: "Cadeira Ergonômica Office",
        price: 749.99,
        originalPrice: 899.99,
        image: "https://images.unsplash.com/photo-1586158291800-2665f07bba79?q=80&auto=format&fit=crop"
      },
      {
        title: "Relógio de Parede Moderno",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&auto=format&fit=crop",
        tag: 'promocao' as TagType
      },
      {
        title: "Luminária LED Inteligente",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&auto=format&fit=crop",
        tag: 'novidade' as TagType
      }
    ]
  },
  {
    id: "sports",
    name: "Esportes",
    icon: "Dumbbell",
    color: "#FFCDD2",
    products: [
      {
        title: "Halteres Ajustáveis 20kg",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&auto=format&fit=crop",
        tag: 'promocao' as TagType
      },
      {
        title: "Esteira Ergométrica Dobrável",
        price: 1299.99,
        originalPrice: 1599.99,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&auto=format&fit=crop"
      },
      {
        title: "Bicicleta Ergométrica",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&auto=format&fit=crop",
        tag: 'novidade' as TagType
      },
      {
        title: "Kit Elásticos Exercício",
        price: 49.99,
        originalPrice: 79.99,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&auto=format&fit=crop",
        tag: 'promocao' as TagType
      }
    ]
  }
];

export const DynamicCategoryCarousels: React.FC = () => {
  return (
    <div className="space-y-16">
      {categories.map((category, categoryIndex) => {
        const IconComponent = iconComponents[category.icon];
        const textColor = getContrastTextColor(category.color);
        
        return (
          <section 
            key={category.id} 
            className="py-16 relative overflow-hidden bg-white"
          >
            {/* Background decorative elements */}
            <div 
              className="absolute top-10 right-20 w-32 h-32 rounded-full blur-xl opacity-20"
              style={{ backgroundColor: category.color }}
            />
            <div 
              className="absolute bottom-20 left-10 w-24 h-24 rounded-full blur-lg opacity-15"
              style={{ backgroundColor: category.color }}
            />
            
            <div className="container mx-auto px-4 relative">
              {/* Modern header with category styling */}
              <div className="text-center mb-12">
                <div 
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-4 border"
                  style={{
                    backgroundColor: `${category.color}10`,
                    borderColor: `${category.color}80`,
                    color: `${category.color}dd`
                  }}
                >
                  <IconComponent size={20} style={{ color: `${category.color}dd` }} />
                  <span style={{ color: `${category.color}dd` }}>{category.name}</span>
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: `${category.color}dd` }}
                  />
                </div>
                <h2 className="text-4xl font-bold mb-4" style={{ color: category.color }}>
                  {category.name}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Descubra os melhores produtos da categoria {category.name.toLowerCase()}
                </p>
              </div>
              
              {/* Carousel with category-themed styling */}
              <div className="relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {category.products.map((product, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div 
                          className="group bg-card/95 backdrop-blur-sm border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                          style={{ 
                            borderColor: category.color,
                            boxShadow: `0 4px 6px -1px ${category.color}40`,
                            '--category-color': category.color
                          } as React.CSSProperties}
                        >
                          <div className="relative overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 relative">
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Category-themed tag */}
                              {product.tag && (
                                <div className="absolute top-4 left-4">
                                  <span 
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{ 
                                      backgroundColor: category.color,
                                      color: getContrastTextColor(category.color)
                                    }}
                                  >
                                    <span 
                                      className="w-1.5 h-1.5 rounded-full" 
                                      style={{ backgroundColor: getContrastTextColor(category.color) }}
                                    />
                                    {product.tag.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              
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
                            <h3 
                              className="font-semibold text-foreground text-sm leading-tight line-clamp-2 transition-colors"
                              style={{
                                '--hover-color': category.color
                              } as React.CSSProperties}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = category.color;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '';
                              }}
                            >
                              {product.title}
                            </h3>
                            
                            <div className="space-y-2">
                              <div className="flex items-baseline gap-2">
                                {product.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                )}
                              </div>
                              <div className="text-xl font-bold" style={{ color: category.color }}>
                                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                6x de R$ {(product.price / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                              </div>
                            </div>
                            
                            <button 
                              className="w-full text-white py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                              style={{
                                background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                                boxShadow: `0 4px 14px 0 ${category.color}25`
                              }}
                            >
                              Adicionar ao Carrinho
                            </button>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Category-themed carousel navigation */}
                  <CarouselPrevious 
                    className="left-4 border-2 bg-white/90 backdrop-blur-sm hover:bg-white"
                    style={{ 
                      borderColor: category.color,
                      color: category.color
                    }}
                  />
                  <CarouselNext 
                    className="right-4 border-2 bg-white/90 backdrop-blur-sm hover:bg-white"
                    style={{ 
                      borderColor: category.color,
                      color: category.color
                    }}
                  />
                </Carousel>
              </div>
              
              {/* Category-themed CTA button */}
              <div className="text-center mt-12">
                <button 
                  className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)`,
                    boxShadow: `0 10px 25px -5px ${category.color}40`
                  }}
                >
                  Ver Todos em {category.name}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
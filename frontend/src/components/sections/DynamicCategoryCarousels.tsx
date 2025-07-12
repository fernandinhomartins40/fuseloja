import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../ui/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { iconComponents, IconName } from '@/utils/categoryIcons';
import apiClient from '@/services/api';
import { Product } from '@/types/product';
import { getContrastTextColor } from '@/types/category';

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  icon: IconName;
  color: string;
  icon_color?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoryWithProducts extends Category {
  products: Product[];
}

// API functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data.categories;
};


const CategoryCarousel: React.FC<{ category: CategoryWithProducts }> = ({ category }) => {
  // Use category data directly from database
  const IconComponent = iconComponents[category.icon] || iconComponents['Package'];
  const textColor = getContrastTextColor(category.color);
  const iconColor = category.icon_color || '#FFFFFF';
  
  // Debug log para verificar se as cores estão sendo aplicadas
  console.log(`Category ${category.name}:`, {
    backgroundColor: category.color,
    iconColor: iconColor,
    hasIconColor: !!category.icon_color
  });
  
  if (category.products.length === 0) {
    return null; // Don't render empty categories
  }

  return (
    <section 
      key={category.id} 
      className="py-12 relative overflow-hidden bg-white"
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
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-4 border-2"
            style={{
              backgroundColor: category.color,
              borderColor: iconColor,
              color: iconColor
            }}
          >
            <IconComponent size={20} style={{ color: iconColor }} />
            <span style={{ color: iconColor }}>{category.name}</span>
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: iconColor }}
            />
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: iconColor }}>
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
                    className="group bg-card/95 backdrop-blur-sm border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-[520px] flex flex-col"
                    style={{ 
                      borderColor: iconColor,
                      boxShadow: `0 4px 6px -1px ${iconColor}40`,
                      '--icon-color': iconColor
                    } as React.CSSProperties}
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 relative">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Category-themed tag */}
                        {product.tag && (
                          <div className="absolute top-4 left-4">
                            <span 
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border"
                              style={{ 
                                backgroundColor: `${iconColor}20`,
                                borderColor: iconColor,
                                color: iconColor
                              }}
                            >
                              <span 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: iconColor }}
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
                    
                      <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <h3 
                        className="font-semibold text-sm leading-tight line-clamp-2 transition-colors"
                        style={{
                          color: iconColor
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = `${iconColor}dd`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = iconColor;
                        }}
                      >
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
                        <div className="text-xl font-bold" style={{ color: iconColor }}>
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          6x de R$ {(product.price / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </div>
                      </div>
                      
                      <button 
                        className="w-full text-white py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98] mt-auto border"
                        style={{
                          background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
                          borderColor: iconColor,
                          boxShadow: `0 4px 14px 0 ${iconColor}40`
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
                borderColor: iconColor,
                color: iconColor
              }}
            />
            <CarouselNext 
              className="right-4 border-2 bg-white/90 backdrop-blur-sm hover:bg-white"
              style={{ 
                borderColor: iconColor,
                color: iconColor
              }}
            />
          </Carousel>
        </div>
        
        {/* Category-themed CTA button */}
        <div className="text-center mt-12">
          <button 
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:shadow-xl border group"
            style={{
              background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
              borderColor: iconColor,
              boxShadow: `0 10px 25px -5px ${iconColor}50`
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
};

const DynamicCategoryCarousels: React.FC = () => {
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch all products and group by category instead of using dynamic hooks
  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['all-products-for-categories'],
    queryFn: async () => {
      const response = await apiClient.get('/products?limit=100');
      return response.data.products;
    },
  });

  if (categoriesLoading || productsLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando categorias...</p>
          </div>
        </div>
      </div>
    );
  }

  // Group products by category
  const productsByCategory = allProducts.reduce((acc, product) => {
    const categoryName = product.category || 'Sem categoria';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Combine categories with their products
  const categoriesWithProducts: CategoryWithProducts[] = categories
    .map(category => ({
      ...category,
      products: (productsByCategory[category.name] || []).slice(0, 6), // Limit to 6 products per category
    }))
    .filter(category => category.products.length > 0); // Only show categories with products

  if (categoriesWithProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore por Categoria</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que você procura navegando por nossas categorias
          </p>
        </div>
        
        {categoriesWithProducts.map((category) => (
          <CategoryCarousel key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default DynamicCategoryCarousels;
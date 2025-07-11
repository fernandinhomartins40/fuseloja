import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../ui/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { iconComponents, IconName } from '@/utils/categoryIcons';
import { getContrastTextColor } from '@/types/category';
import apiClient from '@/services/api';
import { Product } from '@/types/product';

interface Category {
  id: string;
  name: string;
  icon?: IconName;
  color?: string;
}

interface CategoryWithProducts extends Category {
  products: Product[];
}

// API functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data.categories;
};


// Category configuration with icons and colors
const categoryConfig: Record<string, { icon: IconName; color: string }> = {
  'Eletrônicos': { icon: 'Smartphone', color: '#3B82F6' },
  'Roupas': { icon: 'ShirtIcon', color: '#10B981' },
  'Moda': { icon: 'ShirtIcon', color: '#EC4899' },
  'Casa': { icon: 'Home', color: '#F59E0B' },
  'Casa & Decoração': { icon: 'Home', color: '#10B981' },
  'Esportes': { icon: 'Activity', color: '#EF4444' },
  'Livros': { icon: 'BookOpen', color: '#8B5CF6' },
  'Beleza': { icon: 'Sparkles', color: '#EC4899' },
  'Jardim': { icon: 'Flower', color: '#059669' },
  'Brinquedos': { icon: 'Gamepad2', color: '#F97316' },
  'Saúde': { icon: 'Heart', color: '#DC2626' },
  'Automotivo': { icon: 'Car', color: '#374151' },
};

const CategoryCarousel: React.FC<{ category: CategoryWithProducts }> = ({ category }) => {
  const config = categoryConfig[category.name] || { icon: 'Package', color: '#6B7280' };
  const IconComponent = iconComponents[config.icon];
  
  if (category.products.length === 0) {
    return null; // Don't render empty categories
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="p-2 rounded-lg text-white"
          style={{ backgroundColor: config.color }}
        >
          <IconComponent className="w-6 h-6" />
        </div>
        <h2 
          className="text-2xl font-bold"
          style={{ color: config.color }}
        >
          {category.name}
        </h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {category.products.map((product, index) => (
            <CarouselItem key={`${category.id}-${index}`} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <ProductCard
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.imageUrl}
                tag={product.tag}
                productId={product.id}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
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
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { iconComponents, IconName } from '@/utils/categoryIcons';
import apiClient from '@/services/api';

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  icon: IconName;
  color: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

// API function to fetch categories
const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data.categories;
};

export const CategoryIcons: React.FC = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories-icons'],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Categorias</h2>
            <p className="text-muted-foreground">Explore nossas categorias</p>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-2xl"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Categorias</h2>
          <p className="text-muted-foreground">Explore nossas categorias</p>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => {
            const IconComponent = iconComponents[category.icon] || iconComponents['Package'];
            
            return (
              <div
                key={category.id}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                style={{
                  background: `linear-gradient(135deg, ${category.color}15, ${category.color}25)`
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: category.color }}
                >
                  <IconComponent size={32} />
                </div>
                <span 
                  className="text-sm font-medium text-center leading-tight"
                  style={{ color: category.color }}
                >
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
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
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Categorias</h2>
          <p className="text-gray-600 text-lg">Explore nossas categorias de produtos</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category) => {
            const IconComponent = iconComponents[category.icon] || iconComponents['Package'];
            
            return (
              <div
                key={category.id}
                className="group cursor-pointer"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{ 
                      backgroundColor: category.color,
                      boxShadow: `0 10px 25px ${category.color}40`
                    }}
                  >
                    <IconComponent size={36} className="drop-shadow-sm" />
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundColor: 'white' }}
                    />
                  </div>
                  <h3 
                    className="text-sm font-semibold text-center leading-tight transition-colors duration-200"
                    style={{ color: category.color }}
                  >
                    {category.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
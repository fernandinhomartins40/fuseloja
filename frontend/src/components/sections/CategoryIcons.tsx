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
      <section className="py-8 px-4 bg-gradient-to-b from-slate-50 to-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div 
                  className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, #cccccc20, #cccccc10)`,
                    border: `1px solid #cccccc30`
                  }}
                >
                  <div 
                    className="transition-all duration-300 group-hover:scale-110" 
                    style={{ color: '#cccccc' }}
                  >
                    {/* Placeholder for icon */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: '#cccccc' }}
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300 text-center px-1">
                  Carregando...
                </span>
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
    <section className="py-8 px-4 bg-gradient-to-b from-slate-50 to-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconComponents[category.icon] || iconComponents['Package'];
            return (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div 
                  className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`,
                    border: `1px solid ${category.color}30`
                  }}
                >
                  <div 
                    className="transition-all duration-300 group-hover:scale-110" 
                    style={{ color: category.color }}
                  >
                    <IconComponent size={28} className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300 text-center px-1">
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
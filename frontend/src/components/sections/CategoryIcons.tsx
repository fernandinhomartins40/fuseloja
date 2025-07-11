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
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-lg"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
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
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.slice(0, 8).map((category) => {
            const IconComponent = iconComponents[category.icon] || iconComponents['Package'];
            
            return (
              <div
                key={category.id}
                className="group cursor-pointer"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-white transition-all duration-200 group-hover:scale-105"
                    style={{ 
                      backgroundColor: category.color,
                    }}
                  >
                    <IconComponent size={24} className="md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-xs md:text-sm text-center text-gray-700 group-hover:text-gray-900 transition-colors">
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
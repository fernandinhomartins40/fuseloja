
import React from 'react';
import { 
  Smartphone, 
  Headphones, 
  Shirt, 
  Utensils, 
  Home, 
  Book, 
  ShoppingBag, 
  Gift 
} from 'lucide-react';

// Define the category data structure
interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
}

export const CategoryIcons: React.FC = () => {
  // Define categories with their respective icons and colors
  const categories: Category[] = [
    { name: 'Eletrônicos', icon: <Smartphone size={32} />, color: '#3B82F6' },
    { name: 'Acessórios', icon: <Headphones size={32} />, color: '#F59E0B' },
    { name: 'Moda', icon: <Shirt size={32} />, color: '#EC4899' },
    { name: 'Cozinha', icon: <Utensils size={32} />, color: '#8B5CF6' },
    { name: 'Casa', icon: <Home size={32} />, color: '#10B981' },
    { name: 'Livros', icon: <Book size={32} />, color: '#6366F1' },
    { name: 'Calçados', icon: <ShoppingBag size={32} />, color: '#EF4444' },
    { name: 'Presentes', icon: <Gift size={32} />, color: '#DC2626' }
  ];

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-slate-50 to-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
          {categories.map((category, index) => (
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
                  {React.cloneElement(category.icon as React.ReactElement, { 
                    size: window.innerWidth >= 768 ? 28 : 24 
                  })}
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
          ))}
        </div>
      </div>
    </section>
  );
};

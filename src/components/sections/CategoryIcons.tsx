
import React from 'react';
import { 
  Smartphone, 
  Headphones, 
  Shirt, 
  Utensils, 
  Home, 
  Book, 
  Shoes, 
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
    { name: 'Eletrônicos', icon: <Smartphone size={32} />, color: '#9b87f5' },
    { name: 'Acessórios', icon: <Headphones size={32} />, color: '#F97316' },
    { name: 'Moda', icon: <Shirt size={32} />, color: '#0EA5E9' },
    { name: 'Cozinha', icon: <Utensils size={32} />, color: '#D946EF' },
    { name: 'Casa', icon: <Home size={32} />, color: '#7E69AB' },
    { name: 'Livros', icon: <Book size={32} />, color: '#8B5CF6' },
    { name: 'Calçados', icon: <Shoes size={32} />, color: '#F97316' },
    { name: 'Presentes', icon: <Gift size={32} />, color: '#D90429' }
  ];

  return (
    <section className="py-10 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-[#0B0909] mb-8 text-center">Categorias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <div className="text-[#0B0909]" style={{ color: category.color }}>
                  {category.icon}
                </div>
              </div>
              <span className="text-sm font-medium text-[#54595F] group-hover:text-[#D90429] transition-colors">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

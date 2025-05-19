
import React from 'react';
import { 
  Smartphone, 
  Headphones, 
  Tablet, 
  Music, 
  Watch, 
  Computer, 
  Camera, 
  Tag 
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
    { name: 'Smartphones', icon: <Smartphone size={32} />, color: '#9b87f5' },
    { name: 'Acessórios', icon: <Headphones size={32} />, color: '#F97316' },
    { name: 'Tablets', icon: <Tablet size={32} />, color: '#0EA5E9' },
    { name: 'Áudio', icon: <Music size={32} />, color: '#D946EF' },
    { name: 'Smartwatches', icon: <Watch size={32} />, color: '#7E69AB' },
    { name: 'Computadores', icon: <Computer size={32} />, color: '#8B5CF6' },
    { name: 'Câmeras', icon: <Camera size={32} />, color: '#F97316' },
    { name: 'Promoções', icon: <Tag size={32} />, color: '#D90429' }
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

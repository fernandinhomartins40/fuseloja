
import React from 'react';
import { Button } from "../ui/button";

const categories = [{
  title: "Eletrônicos",
  description: "Os melhores gadgets tecnológicos",
  image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&auto=format&fit=crop",
  light: true
}, {
  title: "Moda",
  description: "Tendências e estilos para todos",
  image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&auto=format&fit=crop"
}, {
  title: "Casa & Decoração",
  description: "Produtos para um lar moderno",
  image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&auto=format&fit=crop"
}];

export const CategoryGrid: React.FC = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Categorias em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl h-[350px] group">
            <div className="absolute inset-0">
              <img 
                src={category.image} 
                alt={category.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className={`text-2xl font-bold mb-2 ${category.light ? 'text-white' : 'text-white'}`}>
                {category.title}
              </h3>
              <p className={`mb-4 ${category.light ? 'text-gray-200' : 'text-gray-100'}`}>
                {category.description}
              </p>
              <Button 
                variant="outline" 
                className={`${category.light ? 'bg-white text-black hover:bg-gray-100' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                Ver Produtos
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

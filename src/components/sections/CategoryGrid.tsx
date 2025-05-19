
import React from 'react';

const categories = [
  {
    title: "Eletrônicos",
    description: "Os melhores gadgets tecnológicos",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&auto=format&fit=crop",
    light: true
  },
  {
    title: "Moda",
    description: "Tendências e estilos para todos",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&auto=format&fit=crop"
  },
  {
    title: "Casa & Decoração",
    description: "Produtos para um lar moderno",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&auto=format&fit=crop"
  }
];

export const CategoryGrid: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#EBEFF4] py-[60px] px-4">
      {categories.map((category, index) => (
        <div key={index} className="relative overflow-hidden rounded-[5px]">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover"
          />
          {!category.light && (
            <div className="absolute w-full h-full bg-[rgba(11,9,9,0.53)] left-0 top-0" />
          )}
          <div className={`absolute w-full ${category.light ? 'bg-[#F7F7F7]' : 'text-white'} p-[30px] left-0 bottom-0`}>
            <h3 className={`text-[23px] ${category.light ? 'text-[#55595C]' : 'text-white'} mb-2.5`}>
              {category.title}
            </h3>
            <p className={`text-base ${category.light ? 'text-[#55595C]' : 'text-white'} mb-[15px]`}>
              {category.description}
            </p>
            <button className="text-white cursor-pointer bg-[#D90429] px-5 py-2.5 rounded-[3px] border-[none] hover:bg-[#b8031f] transition-colors">
              Ver Produtos
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

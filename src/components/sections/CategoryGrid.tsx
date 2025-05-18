
import React from 'react';

const categories = [
  {
    title: "Linha iPhone",
    description: "Celular Apple com desconto exclusivo",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/e7065705ff9aea34f7dad0bc93eb0dc4e3b4fa4c",
    light: true
  },
  {
    title: "Linha Samsung",
    description: "Os melhores celulares da linha Galaxy",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/23d5d87fcd93e8839fab3952d1bd6bd70946c04e"
  },
  {
    title: "Linha Motorola",
    description: "Linha completa EDGE Motorola",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/93852e26c7f1b963ca275fa56bb4aa7c818bce7e"
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

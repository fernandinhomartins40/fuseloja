
import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';

// Sample recommended products data
const recommendedProducts = [
  {
    title: "Smartwatch Premium",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
    tag: 'exclusivo' as const
  },
  {
    title: "Caixa de Som Bluetooth Portátil",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1558089966-a11f54853d0b?q=80&auto=format&fit=crop",
    tag: 'promocao' as const
  },
  {
    title: "Mouse Sem Fio Ergonômico",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&auto=format&fit=crop"
  },
  {
    title: "Carregador Sem Fio Rápido",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1608569212221-856278461677?q=80&auto=format&fit=crop",
    tag: 'promocao' as const
  }
];

export const RecommendedProducts: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Recomendados Para Você"
          description="Produtos selecionados com base nos seus interesses"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map((product, index) => (
            <div key={index} className="w-full">
              <ProductCard key={index} {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

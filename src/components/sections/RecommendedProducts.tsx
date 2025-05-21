
import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { initialProducts } from '@/types/product';

// Use a subset of initialProducts for recommendations
const recommendedProducts = initialProducts.slice(0, 4).map(product => ({
  id: product.id,
  title: product.title,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.image,
  tag: product.tag
}));

export const RecommendedProducts: React.FC = () => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {recommendedProducts.map((product, index) => (
          <div key={index} className="w-full">
            <ProductCard key={index} {...product} id={product.id} />
          </div>
        ))}
      </div>
    </section>
  );
};

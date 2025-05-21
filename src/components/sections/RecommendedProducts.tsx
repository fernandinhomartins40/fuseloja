
import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { initialProducts } from '@/types/product';
import { TagType } from '../ui/ProductTag';

// Helper function to safely convert ProductTag to TagType
const convertToTagType = (tag?: string): TagType | undefined => {
  if (!tag) return undefined;
  
  switch (tag) {
    case 'promocao':
    case 'novidade': 
    case 'exclusivo':
    case 'ultima-unidade':
    case 'pre-venda':
    case 'novo':
      return tag as TagType;
    default:
      return undefined; // If tag is not compatible with TagType, return undefined
  }
};

// Use a subset of initialProducts for recommendations
const recommendedProducts = initialProducts.slice(0, 4).map(product => ({
  id: product.id,
  title: product.title,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.image,
  tag: product.tag ? convertToTagType(product.tag) : undefined
}));

export const RecommendedProducts: React.FC = () => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {recommendedProducts.map((product, index) => (
          <div key={index} className="w-full">
            <ProductCard 
              key={index} 
              id={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              tag={product.tag}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

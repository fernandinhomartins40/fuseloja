import React from 'react';
import { HorizontalProductCard } from '../ui/HorizontalProductCard';

// Sample promotion products data
const promotionProducts = [{
  id: "promo-1",
  title: "Headphone Bluetooth JBL",
  price: 199.99,
  originalPrice: 299.99,
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&auto=format&fit=crop",
  tag: 'promocao' as const,
  discountPercentage: 33
}, {
  id: "promo-2",
  title: "Cafeteira Espresso",
  price: 399.99,
  originalPrice: 599.99,
  image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&auto=format&fit=crop",
  tag: 'promocao' as const,
  discountPercentage: 33
}, {
  id: "promo-3",
  title: "Smart TV 4K 50 polegadas",
  price: 1999.99,
  originalPrice: 2499.99,
  image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&auto=format&fit=crop",
  tag: 'promocao' as const,
  discountPercentage: 20
}, {
  id: "promo-4",
  title: "Relógio de Parede",
  price: 89.99,
  originalPrice: 119.99,
  image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&auto=format&fit=crop",
  tag: 'promocao' as const,
  discountPercentage: 25
}, {
  id: "promo-5",
  title: "Tênis Esportivo",
  price: 199.99,
  originalPrice: 249.99,
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop",
  tag: 'promocao' as const,
  discountPercentage: 20
}, {
  id: "promo-6",
  title: "Mochila Impermeável",
  price: 149.99,
  originalPrice: 199.99,
  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop",
  tag: 'promocao' as const,
  discountPercentage: 25
}];
export const PromotionProducts: React.FC = () => {
  return (
    <section className="py-6 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Sliding animation container */}
        <div className="relative overflow-hidden">
          <div className="flex gap-4 animate-scroll hover:[animation-play-state:paused]">
            {/* First set of products */}
            {promotionProducts.map((product, index) => (
              <HorizontalProductCard key={`first-${index}`} {...product} />
            ))}
            {/* Duplicate set for seamless loop */}
            {promotionProducts.map((product, index) => (
              <HorizontalProductCard key={`second-${index}`} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
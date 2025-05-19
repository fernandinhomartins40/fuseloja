
import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Percent } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample promotion products data
const promotionProducts = [
  {
    title: "Headphone Bluetooth JBL",
    price: 199.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    discountPercentage: 33
  },
  {
    title: "Cafeteira Espresso",
    price: 399.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    discountPercentage: 33
  },
  {
    title: "Smart TV 4K 50 polegadas",
    price: 1999.99,
    originalPrice: 2499.99,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    discountPercentage: 20
  },
  {
    title: "Relógio de Parede",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    discountPercentage: 25
  },
  {
    title: "Tênis Esportivo",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    discountPercentage: 20
  },
  {
    title: "Mochila Impermeável",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    discountPercentage: 25
  }
];

export const PromotionProducts: React.FC = () => {
  return (
    <section className="py-12 bg-destructive/5">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Ofertas Imperdíveis"
          description="Promoções por tempo limitado com descontos especiais"
          actionLabel="Ver Todas as Promoções"
          onAction={() => console.log("Ver todas as promoções")}
          className="mb-12"
        />
        
        <ScrollArea className="w-full whitespace-nowrap pb-6">
          <div className="flex gap-4 md:gap-6">
            {promotionProducts.map((product, index) => (
              <div key={index} className="min-w-[240px] w-[280px] md:w-[320px] relative flex-shrink-0">
                <div className="absolute top-4 left-4 z-20 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Percent size={14} />
                  {product.discountPercentage}% OFF
                </div>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};

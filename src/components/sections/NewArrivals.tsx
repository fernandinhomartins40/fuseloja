import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Mock data for new arrivals
const newArrivals = [
  {
    id: "n001",
    title: "iPhone 15 Pro Max 256GB",
    price: 8999.99,
    originalPrice: 9999.99,
    image: "https://images.unsplash.com/photo-1592910147797-0b8c482cf989?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n002", 
    title: "MacBook Air M3 13\" 512GB",
    price: 12999.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n003",
    title: "AirPods Pro 3ª Geração",
    price: 1899.99,
    originalPrice: 2199.99,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n004",
    title: "Samsung Galaxy S24 Ultra",
    price: 7499.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n005",
    title: "PlayStation 5 Slim Digital",
    price: 3999.99,
    originalPrice: 4499.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    id: "n006",
    title: "Nintendo Switch OLED",
    price: 2799.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  }
];

export const NewArrivals: React.FC = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Novidades" 
          description="Confira os produtos mais recentes que acabaram de chegar" 
          actionLabel="Ver Todas" 
          onAction={() => console.log("Ver todas as novidades")} 
        />
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {newArrivals.map((product, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="h-full">
                  <ProductCard {...product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex left-0" />
          <CarouselNext className="hidden sm:flex right-0" />
        </Carousel>
      </div>
    </section>
  );
};
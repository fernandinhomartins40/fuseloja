
import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Sample recently added products data
const recentProducts = [
  {
    title: "Fone de Ouvido Pro Com Cancelamento de Ruído",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    title: "Smartwatch Serie 5 Titanium",
    price: 499.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    title: "Câmera DSLR 4K Ultra HD",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    title: "Tablet Ultra Slim 10.5\"",
    price: 899.99,
    originalPrice: 1099.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    title: "Laptop Conversível Tela Touch",
    price: 3299.99,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  },
  {
    title: "Jogos de Tabuleiro Estratégia Medieval",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&auto=format&fit=crop",
    tag: 'novidade' as const
  }
];

export const RecentlyAddedProducts: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Adicionados Recentemente"
          description="Confira os produtos mais recentes na nossa loja"
          actionLabel="Ver Todos"
          onAction={() => console.log("Ver todos os produtos recentes")}
        />
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {recentProducts.map((product, index) => (
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

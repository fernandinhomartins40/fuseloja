
import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Award, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';

// Sample best seller products data
const bestSellerProducts = [
  {
    title: "Smartphone Ultra Plus 512GB",
    price: 4999.99,
    originalPrice: 5499.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&auto=format&fit=crop",
    tag: 'exclusivo' as const,
    soldCount: 3240
  },
  {
    title: "Fone de Ouvido Bluetooth Premium",
    price: 199.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    soldCount: 5421
  },
  {
    title: "Notebook Ultrafino 15\"",
    price: 3699.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&auto=format&fit=crop",
    soldCount: 1987
  },
  {
    title: "Smart TV 55\" 4K QLED",
    price: 2699.99,
    originalPrice: 3099.99,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&auto=format&fit=crop",
    tag: 'promocao' as const,
    soldCount: 2198
  }
];

export const BestSellerProducts: React.FC = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Mais Vendidos"
          description="Os produtos preferidos dos nossos clientes"
          actionLabel="Ver Todos"
          onAction={() => console.log("Ver todos os mais vendidos")}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product, index) => (
            <div key={index} className="relative">
              <div className="absolute top-2 left-2 z-20">
                <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                  <Award size={14} />
                  Mais Vendido
                </Badge>
              </div>
              <ProductCard {...product} />
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp size={14} className="text-green-500" />
                <span>{product.soldCount}+ pessoas compraram</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

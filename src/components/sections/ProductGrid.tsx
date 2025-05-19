
import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { TagType } from '../ui/ProductTag';

interface Product {
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: TagType;
  installments?: number;
}

const products: Product[] = [
  {
    title: "Headphone Bluetooth JBL",
    price: 199.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&auto=format&fit=crop",
    tag: 'promocao'
  },
  {
    title: "Smart TV 4K 50 polegadas",
    price: 1999.99,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&auto=format&fit=crop",
    tag: 'novidade'
  },
  {
    title: "Notebook Ultra Slim",
    price: 2899.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&auto=format&fit=crop"
  },
  {
    title: "Cafeteira Espresso",
    price: 399.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&auto=format&fit=crop",
    tag: 'ultima-unidade'
  },
  {
    title: "Smartwatch Premium",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
    tag: 'exclusivo'
  },
  {
    title: "Câmera Mirrorless",
    price: 2999.99,
    originalPrice: 3599.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&auto=format&fit=crop",
    tag: 'promocao'
  },
  {
    title: "Console de Videogame",
    price: 2999.99,
    originalPrice: 3599.99,
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&auto=format&fit=crop",
    tag: 'pre-venda'
  },
  {
    title: "Tênis Esportivo",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop"
  },
  {
    title: "Panela Elétrica Multifuncional",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&auto=format&fit=crop",
    tag: 'novidade'
  },
  {
    title: "Mochila Impermeável",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop"
  },
  // Removed "Relógio de Parede" product that had the promocao tag
  {
    title: "Cadeira Ergonômica",
    price: 749.99,
    originalPrice: 899.99,
    image: "https://images.unsplash.com/photo-1586158291800-2665f07bba79?q=80&auto=format&fit=crop"
  }
];

export const ProductGrid: React.FC = () => {
  return (
    <section className="py-10 px-4">
      <h2 className="text-center text-[32px] text-[#0B0909] font-bold mb-10">
        Produtos em Destaque
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product, index) => (
          <div key={index} className="product-card-wrapper">
            <ProductCard
              {...product}
            />
          </div>
        ))}
      </div>
    </section>
  );
};


import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagType } from '../ui/ProductTag';

interface Product {
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: TagType;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

// Sample category data with products
const categories: Category[] = [
  {
    id: "electronics",
    name: "Eletrônicos",
    products: [
      {
        title: "Smartphone Ultra Plus 512GB",
        price: 4999.99,
        originalPrice: 5499.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&auto=format&fit=crop",
        tag: 'exclusivo' as TagType
      },
      {
        title: "Notebook Ultrafino 15\"",
        price: 3699.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&auto=format&fit=crop"
      },
      {
        title: "Smartwatch Premium",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
        tag: 'exclusivo' as TagType
      },
      {
        title: "Tablet Ultra Slim 10.5\"",
        price: 899.99,
        originalPrice: 1099.99,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&auto=format&fit=crop",
        tag: 'novidade' as TagType
      }
    ]
  },
  {
    id: "fashion",
    name: "Moda",
    products: [
      {
        title: "Tênis Esportivo",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop"
      },
      {
        title: "Relógio Clássico",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&auto=format&fit=crop"
      },
      {
        title: "Mochila Impermeável",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop"
      },
      {
        title: "Óculos de Sol Premium",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&auto=format&fit=crop",
        tag: 'exclusivo' as TagType
      }
    ]
  },
  {
    id: "home",
    name: "Casa & Decoração",
    products: [
      {
        title: "Cafeteira Espresso",
        price: 399.99,
        originalPrice: 599.99,
        image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&auto=format&fit=crop",
        tag: 'ultima-unidade' as TagType
      },
      {
        title: "Panela Elétrica Multifuncional",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&auto=format&fit=crop",
        tag: 'novidade' as TagType
      },
      {
        title: "Cadeira Ergonômica",
        price: 749.99,
        originalPrice: 899.99,
        image: "https://images.unsplash.com/photo-1586158291800-2665f07bba79?q=80&auto=format&fit=crop"
      },
      {
        title: "Relógio de Parede",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&auto=format&fit=crop",
        tag: 'promocao' as TagType
      }
    ]
  }
];

export const CategoryProducts: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Compre por Categoria"
          description="Explore produtos em suas categorias favoritas"
        />
        
        <Tabs defaultValue={categories[0].id} className="w-full">
          <TabsList className="flex justify-center mb-8 bg-background border overflow-x-auto max-w-full">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="px-4 md:px-8">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {category.products.map((product, index) => (
                  <div key={index} className="w-full">
                    <ProductCard key={index} {...product} />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

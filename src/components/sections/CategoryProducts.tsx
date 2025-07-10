import React, { useState } from 'react';
import { ProductCard } from '../ui/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { TagType } from '../ui/ProductTag';
import { iconComponents, IconName } from '@/utils/categoryIcons';
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
  icon: IconName;
  color: string;
}

// Sample category data with products, icons, and colors
const categories: Category[] = [{
  id: "electronics",
  name: "Eletrônicos",
  icon: "Smartphone",
  color: "#3B82F6",
  products: [{
    title: "Smartphone Ultra Plus 512GB",
    price: 4999.99,
    originalPrice: 5499.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&auto=format&fit=crop",
    tag: 'exclusivo' as TagType
  }, {
    title: "Notebook Ultrafino 15\"",
    price: 3699.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&auto=format&fit=crop"
  }, {
    title: "Smartwatch Premium",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
    tag: 'exclusivo' as TagType
  }, {
    title: "Tablet Ultra Slim 10.5\"",
    price: 899.99,
    originalPrice: 1099.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&auto=format&fit=crop",
    tag: 'novidade' as TagType
  }]
}, {
  id: "fashion",
  name: "Moda",
  icon: "Shirt",
  color: "#EC4899",
  products: [{
    title: "Tênis Esportivo",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop"
  }, {
    title: "Relógio Clássico",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&auto=format&fit=crop"
  }, {
    title: "Mochila Impermeável",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&auto=format&fit=crop"
  }, {
    title: "Óculos de Sol Premium",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&auto=format&fit=crop",
    tag: 'exclusivo' as TagType
  }]
}, {
  id: "home",
  name: "Casa & Decoração",
  icon: "Home",
  color: "#10B981",
  products: [{
    title: "Cafeteira Espresso",
    price: 399.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&auto=format&fit=crop",
    tag: 'ultima-unidade' as TagType
  }, {
    title: "Panela Elétrica Multifuncional",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&auto=format&fit=crop",
    tag: 'novidade' as TagType
  }, {
    title: "Cadeira Ergonômica",
    price: 749.99,
    originalPrice: 899.99,
    image: "https://images.unsplash.com/photo-1586158291800-2665f07bba79?q=80&auto=format&fit=crop"
  }, {
    title: "Relógio de Parede",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&auto=format&fit=crop",
    tag: 'promocao' as TagType
  }]
}];
export const CategoryProducts: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const getActiveCategory = () => {
    return categories.find(cat => cat.id === activeCategory) || categories[0];
  };
  const getContrastTextColor = (hexColor: string): string => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return dark for light backgrounds and light for dark backgrounds
    return luminance > 0.5 ? '#374151' : '#FFFFFF';
  };
  return <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4">
        <SectionHeader title="Compre por Categoria" description="Explore produtos em suas categorias favoritas" />
        
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => {
          const IconComponent = iconComponents[category.icon];
          const isActive = activeCategory === category.id;
          const textColor = getContrastTextColor(category.color);
          return <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 border ${isActive ? 'border-gray-300 shadow-sm' : 'border-transparent hover:border-gray-200 hover:shadow-sm'}`} style={{
            backgroundColor: isActive ? category.color : 'transparent',
            color: isActive ? textColor : '#6B7280'
          }}>
                <IconComponent size={20} />
                <span className="text-sm">{category.name}</span>
              </button>;
        })}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {getActiveCategory().products.map((product, index) => <div key={index} className="w-full">
              <ProductCard {...product} />
            </div>)}
        </div>
      </div>
    </section>;
};
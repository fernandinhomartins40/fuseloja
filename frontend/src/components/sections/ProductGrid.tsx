import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../ui/ProductCard';
import { Product } from '@/types/product';
import apiClient from '@/services/api';

// API function to fetch products
const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products?limit=12');
  return response.data.products;
};

const ProductGrid: React.FC = () => {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products-grid'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produtos em Destaque</h2>
            <p className="text-lg text-muted-foreground">
              Confira nossa seleção especial de produtos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-4 shadow-sm animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Produtos em Destaque</h2>
            <p className="text-lg text-muted-foreground">
              {isError ? 'Erro ao carregar produtos - verifique a conexão com a API' : 'Nenhum produto encontrado'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Produtos em Destaque</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira nossa seleção especial de produtos selecionados especialmente para você
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              imageUrl={product.imageUrl}
              tag={product.tag}
              id={product.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
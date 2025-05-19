
import React from 'react';
import { ProductTag, TagType } from './ProductTag';
import { Card } from './card';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  installments?: number;
  image: string;
  tag?: TagType;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  originalPrice,
  installments = 6,
  image,
  tag
}) => {
  const installmentValue = price / installments;

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
      <div className="relative p-6">
        <div className="relative mb-3 overflow-hidden rounded-md h-[220px]">
          {tag && <ProductTag type={tag} className="absolute top-2 right-2 z-10" />}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-foreground line-clamp-2 min-h-[48px]">{title}</h3>
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-xl font-bold text-destructive">
              R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Em até {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
          </div>
          <button 
            className="flex items-center justify-center w-full py-2 mt-2 text-sm font-medium text-white transition-colors bg-destructive rounded-md hover:bg-destructive/80 gap-2"
            onClick={() => console.log(`Adicionar ao carrinho: ${title}`)}
          >
            <ShoppingCart size={16} />
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </div>
    </Card>
  );
};

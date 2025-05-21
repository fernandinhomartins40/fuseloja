
import React from 'react';
import { ProductTag, TagType } from './ProductTag';
import { Card } from './card';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  installments?: number;
  image: string;
  tag?: TagType;
  id?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  originalPrice,
  installments = 6,
  image,
  tag,
  id = "p001" // Fallback ID if none provided
}) => {
  const installmentValue = price / installments;
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    addItem({
      id,
      title,
      price,
      image,
      stock: 1, // We don't have this info in the ProductCard, assume it's available
      category: "" // We don't have this info in the ProductCard
    });
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group min-w-[240px] w-full h-full flex flex-col">
      <div className="relative p-4 md:p-6 flex flex-col flex-1">
        <Link to={`/produto/${id}`} className="block relative mb-3 overflow-hidden rounded-md aspect-square">
          {tag && <ProductTag type={tag} className="absolute top-2 right-2 z-10" />}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="space-y-1 flex-1 flex flex-col">
          <Link to={`/produto/${id}`} className="block">
            <h3 className="text-base md:text-lg font-medium text-foreground line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] hover:text-destructive transition-colors">{title}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-auto pt-2">
            {originalPrice && (
              <span className="text-xs md:text-sm text-muted-foreground line-through">
                R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-lg md:text-xl font-bold text-destructive">
              R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Em até {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
          </div>
          <button 
            className="flex items-center justify-center w-full py-2 mt-2 text-xs md:text-sm font-medium text-white transition-colors bg-destructive rounded-md hover:bg-destructive/80 gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </div>
    </Card>
  );
};

import React from 'react';
import { ProductTag, TagType } from './ProductTag';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  installments?: number;
  imageUrl: string;
  tag?: TagType;
  id?: string;
}
export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  originalPrice,
  installments = 6,
  imageUrl,
  tag,
  id = "p001" // Fallback ID if none provided
}) => {
  const installmentValue = price / installments;
  const {
    addItem
  } = useCart();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    addItem({
      id,
      title,
      price,
      imageUrl,
      stock: 1,
      // We don't have this info in the ProductCard, assume it's available
      category: "" // We don't have this info in the ProductCard
    });
  };
  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 min-w-[280px] w-full h-full flex flex-col">
      <div className="relative overflow-hidden">
        <Link to={`/produto/${id}`} className="block relative aspect-square overflow-hidden">
          {tag && (
            <div className="absolute top-3 right-3 z-10">
              <ProductTag type={tag} />
            </div>
          )}
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>
      
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <Link to={`/produto/${id}`} className="block">
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] text-sm leading-tight hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        </Link>
        
        <div className="flex flex-col gap-1 mt-auto">
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
          </div>
        </div>
        
        <button 
          className="flex items-center justify-center w-full py-2.5 text-xs font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 gap-2 group/button mt-3"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={14} className="transition-transform group-hover/button:scale-110" />
          ADICIONAR
        </button>
      </div>
    </div>
  );
};
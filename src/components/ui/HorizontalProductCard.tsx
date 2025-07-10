import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HorizontalProductCardProps {
  id?: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  className?: string;
}

export const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  image,
  className
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link 
      to={`/produto/${id || title.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn(
        "block flex items-center gap-3 bg-background border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 min-w-[280px] h-[90px] cursor-pointer hover:scale-[1.02]",
        className
      )}
    >
      {/* Image */}
      <div className="relative flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-16 h-16 object-cover rounded-md"
          loading="lazy"
        />
        {discountPercentage > 0 && (
          <div className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="text-sm font-bold text-destructive">
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </Link>
  );
};
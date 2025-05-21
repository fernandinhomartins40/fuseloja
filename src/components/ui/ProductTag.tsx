
import React from 'react';
import { cn } from '@/lib/utils';

// Ensure this matches with ProductTag in types/product.ts
export type TagType = 'promocao' | 'novidade' | 'exclusivo' | 'ultima-unidade' | 'pre-venda' | 'novo';

export interface ProductTagProps {
  type: TagType;
  className?: string;
}

const tagStyles: Record<TagType, string> = {
  'promocao': 'bg-[#ea384c] text-white',
  'novidade': 'bg-[#0EA5E9] text-white',
  'exclusivo': 'bg-[#16A34A] text-white',
  'ultima-unidade': 'bg-[#F97316] text-white',
  'pre-venda': 'bg-[#9b87f5] text-white',
  'novo': 'bg-[#0EA5E9] text-white', // Added novo tag with the same style as novidade
};

const tagText: Record<TagType, string> = {
  'promocao': 'PROMOÇÃO',
  'novidade': 'NOVIDADE',
  'exclusivo': 'EXCLUSIVO',
  'ultima-unidade': 'ÚLTIMA UNIDADE',
  'pre-venda': 'PRÉ-VENDA',
  'novo': 'NOVO', // Added text for novo tag
};

export const ProductTag: React.FC<ProductTagProps> = ({ type, className }) => {
  return (
    <div
      className={cn(
        "absolute px-2.5 py-1.5 text-xs font-bold rounded-md shadow-sm",
        tagStyles[type],
        className
      )}
    >
      {tagText[type]}
    </div>
  );
};

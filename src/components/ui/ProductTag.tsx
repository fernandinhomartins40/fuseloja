
import React from 'react';
import { cn } from '@/lib/utils';

export type TagType = 'promocao' | 'novidade' | 'exclusivo' | 'ultima-unidade' | 'pre-venda';

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
};

const tagText: Record<TagType, string> = {
  'promocao': 'PROMOÇÃO',
  'novidade': 'NOVIDADE',
  'exclusivo': 'EXCLUSIVO',
  'ultima-unidade': 'ÚLTIMA UNIDADE',
  'pre-venda': 'PRÉ-VENDA',
};

export const ProductTag: React.FC<ProductTagProps> = ({ type, className }) => {
  return (
    <div
      className={cn(
        "absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-md",
        tagStyles[type],
        className
      )}
    >
      {tagText[type]}
    </div>
  );
};

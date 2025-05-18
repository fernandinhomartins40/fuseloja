
import React from 'react';
import { ProductTag, TagType } from './ProductTag';

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
    <article className="border relative p-5 rounded-[5px] border-solid border-[rgba(84,89,95,0.29)]">
      {tag && <ProductTag type={tag} />}
      <img
        src={image}
        alt={title}
        className="w-full h-auto mb-5"
      />
      <h3 className="text-lg text-[#0B0909] mb-2.5">{title}</h3>
      <div className={originalPrice ? "flex gap-2.5 mb-2.5" : "gap-2.5 text-[#D90429] underline mb-2.5"}>
        {originalPrice && (
          <span className="text-[#0B0909] line-through opacity-50">
            R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        )}
        <span className="text-[#D90429] underline">
          R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="text-xs text-[#919191] mb-2.5">
        Em até {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
      </div>
      <button 
        className="text-white w-full cursor-pointer bg-[#D90429] px-5 py-2.5 rounded-[3px] border-[none] hover:bg-[#b8031f] transition-colors"
        onClick={() => console.log(`Adicionar ao carrinho: ${title}`)}
      >
        ADICIONAR AO CARRINHO
      </button>
    </article>
  );
};

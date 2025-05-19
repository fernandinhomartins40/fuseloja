
import React from 'react';

export const Navigation: React.FC = () => {
  return (
    <div className="flex justify-between items-center py-5 px-4">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/4422fe2166933687d9b3b9fe0be3d68809b8b230"
        alt="ShopMaster"
        className="h-[34px]"
      />
      
      <nav className="flex gap-[15px] max-sm:hidden" aria-label="Navegação Principal">
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Ofertas
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Novidades
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Categorias
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Mais Vendidos
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Sobre Nós
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Contato
        </a>
      </nav>
      
      <div className="flex items-center gap-2.5 text-[#54595F] text-[15px] font-extrabold">
        <span>R$ 0,00</span>
        <div>
          <i className="ti ti-shopping-cart"></i>
        </div>
        <div className="w-4 h-4 text-white text-[10px] bg-[#D90429] rounded-[50%] flex items-center justify-center">
          0
        </div>
      </div>
    </div>
  );
};

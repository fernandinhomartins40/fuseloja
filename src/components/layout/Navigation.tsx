
import React from 'react';
import { ShoppingCart, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navigation: React.FC = () => {
  return (
    <div className="flex justify-between items-center py-5 px-4 bg-white">
      <Link to="/">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4422fe2166933687d9b3b9fe0be3d68809b8b230"
          alt="ShopMaster"
          className="h-[34px]"
        />
      </Link>
      
      <nav className="flex gap-[15px] max-sm:hidden" aria-label="Navegação Principal">
        <Link to="/" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Início
        </Link>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Ofertas
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Novidades
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Categorias
        </a>
        <Link to="/sobre" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Sobre Nós
        </Link>
        <Link to="/contato" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Contato
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <button className="relative text-[#54595F] hover:text-[#D90429] transition-colors" aria-label="Perfil do usuário">
          <UserRound size={24} />
        </button>
        
        <button className="relative text-[#54595F] hover:text-[#D90429] transition-colors" aria-label="Carrinho de compras">
          <ShoppingCart size={24} />
          <div className="absolute -top-2 -right-2 w-5 h-5 text-white text-[10px] bg-[#D90429] rounded-full flex items-center justify-center">
            0
          </div>
        </button>
      </div>
    </div>
  );
};

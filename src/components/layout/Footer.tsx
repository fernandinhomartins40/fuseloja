
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0B0909] pt-[60px] pb-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5"
              alt="Logo"
            />
          </div>
          
          <div>
            <h4 className="text-white text-2xl mb-5">Links</h4>
            <nav className="flex flex-col gap-2.5">
              <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Início</a>
              <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Ofertas</a>
              <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Categorias</a>
              <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Sobre</a>
              <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Contato</a>
            </nav>
          </div>
          
          <div>
            <h4 className="text-white text-2xl mb-5">Contato</h4>
            <div className="flex flex-col gap-2.5 text-[#999]">
              <div className="flex items-center gap-2.5">
                <i className="ti ti-phone" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="ti ti-mail" />
                <span>contato@shopmaster.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="ti ti-map-pin" />
                <span>Rua Exemplo, 123 - Centro</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-2xl mb-5">Newsletter</h4>
            <p className="text-[#999] mb-5">Receba nossas novidades e promoções</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full px-4 py-2 rounded-l-[3px] border-[none] focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-[#D90429] text-white px-4 py-2 rounded-r-[3px] border-[none] cursor-pointer hover:bg-[#b8031f] transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-solid border-[#333] py-5 flex flex-col md:flex-row justify-between items-center text-[#999]">
          <p>© 2025 ShopMaster. Todos os direitos reservados.</p>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-[#D90429] text-[#D90429] hover:bg-[#D90429] hover:text-white"
            onClick={() => navigate('/admin')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Painel do Lojista
          </Button>
        </div>
      </div>
    </footer>
  );
};

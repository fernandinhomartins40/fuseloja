
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0909] pt-[60px] pb-0 px-[360px] max-md:p-5">
      <div className="grid grid-cols-[repeat(4,1fr)] gap-10 mb-10 max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
        <div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5"
            alt="Logo"
          />
        </div>
        
        <div>
          <h4 className="text-white text-2xl mb-5">Links</h4>
          <nav className="flex flex-col gap-2.5">
            <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Home</a>
            <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Ofertas</a>
            <a href="#" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Marcas</a>
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
              <span>contato@celulares.com</span>
            </div>
            <div className="flex items-center gap-2.5">
              <i className="ti ti-map-pin" />
              <span>Rua Exemplo, 123 - São Paulo, SP</span>
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
      
      <div className="border-t border-solid border-[#333] py-5 text-center text-[#999]">
        <p>© 2025 Celulares Store. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};


import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#0B0909] py-[25px]">
      <div className="container mx-auto flex justify-end items-center px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-5 text-white max-sm:hidden">
          <div className="flex items-center gap-2 text-base">
            <i className="ti ti-user" />
            <span>Entrar / Minha Conta</span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <i className="ti ti-phone" />
            <span>(11) 99999-9999</span>
          </div>
          <nav className="flex gap-2.5" aria-label="Redes Sociais">
            <a href="#" className="text-white text-xl no-underline hover:text-[#D90429] transition-colors" aria-label="Facebook">
              <i className="ti ti-brand-facebook" />
            </a>
            <a href="#" className="text-white text-xl no-underline hover:text-[#D90429] transition-colors" aria-label="Twitter">
              <i className="ti ti-brand-twitter" />
            </a>
            <a href="#" className="text-white text-xl no-underline hover:text-[#D90429] transition-colors" aria-label="YouTube">
              <i className="ti ti-brand-youtube" />
            </a>
            <a href="#" className="text-white text-xl no-underline hover:text-[#D90429] transition-colors" aria-label="Instagram">
              <i className="ti ti-brand-instagram" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

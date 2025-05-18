import React from 'react';
export const Hero: React.FC = () => {
  return <section className="relative h-[500px] bg-[#0B0909]">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/be236283cc696082892ac0171a0c6023c3c51f1f" alt="Galaxy S22 Ultra" className="w-full h-full object-cover opacity-75" />
      </div>
      
      <div className="container mx-auto flex justify-between items-center h-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-white">
          <h1 className="text-5xl mb-5">GALAXY S22 ULTRA</h1>
          <div className="flex flex-col gap-2.5 text-[#D90429] underline">
            <span className="line-through text-[#999]">De R$5.999,99</span>
            <span className="text-[#D90429] text-2xl font-bold">
              Por R$4.999,99
            </span>
          </div>
          <div className="text-[#999] mx-0 my-5">Últimas Unidades</div>
          <button className="text-white cursor-pointer bg-[#D90429] px-[30px] py-[15px] rounded-[5px] border-[none] hover:bg-[#b8031f] transition-colors">
            Comprar Agora
          </button>
        </div>
        
      </div>
      
      <div className="absolute -translate-y-2/4 w-full flex justify-between px-2.5 py-0 top-2/4 z-20">
        <button className="bg-transparent border-none cursor-pointer" aria-label="Previous slide">
          <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.16 3.125C15.96 3.125 15.7642 3.16667 15.5725 3.25C15.3808 3.33333 15.2267 3.43333 15.11 3.55L7.71 11.05C7.44333 11.3167 7.31 11.6958 7.31 12.1875C7.31 12.6792 7.44333 13.0583 7.71 13.325L15.11 21.35C15.2933 21.5333 15.4642 21.6667 15.6225 21.75C15.7808 21.8333 15.96 21.875 16.16 21.875C16.6433 21.875 17.0267 21.7333 17.31 21.45C17.46 21.3 17.585 21.1208 17.685 20.9125C17.785 20.7042 17.835 20.5 17.835 20.3C17.835 19.8167 17.66 19.4417 17.31 19.175L10.96 12.175L17.31 5.625C17.5767 5.35833 17.71 5.04167 17.71 4.675C17.71 4.19167 17.5767 3.81667 17.31 3.55C17.0933 3.38333 16.9017 3.27083 16.735 3.2125C16.5683 3.15417 16.3767 3.125 16.16 3.125Z" fill="#EEEEEE" fillOpacity="0.9" />
          </svg>
        </button>
        <button className="bg-transparent border-none cursor-pointer" aria-label="Next slide">
          <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3899 13.325C18.6733 13.0417 18.8149 12.6583 18.8149 12.175C18.8149 11.9583 18.7816 11.7583 18.7149 11.575C18.6483 11.3917 18.5399 11.25 18.3899 11.15L10.9899 3.65C10.8233 3.48333 10.6524 3.35417 10.4774 3.2625C10.3024 3.17083 10.0899 3.125 9.83994 3.125C9.42327 3.125 9.08161 3.26667 8.81494 3.55C8.64827 3.7 8.51911 3.875 8.42744 4.075C8.33577 4.275 8.28994 4.475 8.28994 4.675C8.28994 5.175 8.42327 5.55833 8.68994 5.825L15.0649 12.3L8.58994 19.275C8.32327 19.5417 8.18994 19.925 8.18994 20.425C8.18994 20.825 8.35661 21.2083 8.68994 21.575C9.02327 21.775 9.40661 21.875 9.83994 21.875C10.0566 21.875 10.2649 21.8292 10.4649 21.7375C10.6649 21.6458 10.8399 21.5167 10.9899 21.35L18.3899 13.325Z" fill="#EEEEEE" fillOpacity="0.9" />
          </svg>
        </button>
      </div>
    </section>;
};
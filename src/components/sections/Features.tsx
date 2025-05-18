import React from 'react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/263e32dc26aaf9740c76ae87d170b09f1da0a4fe",
      title: "Frete Grátis SP"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d8275e7a23d351947c568738d268d83e6896aaa7",
      title: "Garantia de 30 Dias"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/135671702a51dc08d3999a1c758507e40f912a83",
      title: "Suporte Especializado"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/81a402f2d32c16e57ec170c84885d21371ff2474",
      title: "Entrega Rápida"
    }
  ];

  return (
    <section className="flex justify-between gap-5 px-[360px] py-10 max-md:p-5">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="flex items-center gap-5 text-white font-extrabold bg-[#0B0909] p-5 rounded-[10px]"
        >
          <img
            src={feature.icon}
            alt={feature.title}
            className="w-[51px] h-[51px]"
          />
          <span>{feature.title}</span>
        </div>
      ))}
    </section>
  );
};

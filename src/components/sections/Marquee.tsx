import React from 'react';
import { Truck, Shield, HeadphonesIcon, Zap } from 'lucide-react';

export const Marquee: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: "Frete Grátis SP"
    },
    {
      icon: Shield,
      title: "Garantia de 30 Dias"
    },
    {
      icon: HeadphonesIcon,
      title: "Suporte Especializado"
    },
    {
      icon: Zap,
      title: "Entrega Rápida"
    }
  ];

  // Duplicamos os itens para criar o efeito de loop infinito
  const duplicatedFeatures = [...features, ...features];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-chart-1 to-chart-2 py-6">
      <div className="flex animate-marquee">
        {duplicatedFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-4 text-white font-semibold px-8 py-2 whitespace-nowrap"
            >
              <IconComponent className="w-6 h-6 flex-shrink-0" />
              <span className="text-lg">{feature.title}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
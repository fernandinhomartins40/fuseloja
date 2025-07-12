import React from 'react';
import { HeroSlider } from '../components/sections/HeroSlider';
import { Marquee } from '../components/sections/Marquee';
import { CategoryIcons } from '../components/sections/CategoryIcons';
import { Footer } from '../components/layout/Footer';
import DynamicCategoryCarousels from '../components/sections/DynamicCategoryCarousels';
import { PromotionProducts } from '../components/sections/PromotionProducts';
import { FloatingCartButton } from '../components/cart/FloatingCartButton';
import { SearchBarWithAutocomplete } from '../components/ui/SearchBarWithAutocomplete';
import { NewArrivals } from '../components/sections/NewArrivals';
import { BestSellers } from '../components/sections/BestSellers';
import { useSettings } from '@/contexts/SettingsContext';

const Index = () => {
  const { settings } = useSettings();
  const headerHeight = settings.navbar.height || 80;
  
  return <div className="min-h-screen flex flex-col">
      {/* Header is already provided by PublicLayout in router */}
      
      {/* Main content with proper spacing - start directly after fixed header */}
      <div 
        className="bg-slate-950"
        style={{ 
          marginTop: `-${headerHeight}px`,
          paddingTop: `${headerHeight}px`
        }}
      >
        <Marquee />
        <HeroSlider />
        <PromotionProducts />
        
        {/* Barra de busca moderna com autocomplete */}
        <section className="bg-slate-50 py-[35px]">
          <div className="container mx-auto px-4">
            <SearchBarWithAutocomplete onSearch={value => console.log('Busca avançada:', value)} onProductSelect={product => console.log('Produto selecionado:', product)} />
          </div>
        </section>
        <CategoryIcons />
        <NewArrivals />
        <BestSellers />
        <DynamicCategoryCarousels />
        
        
        <Footer />
        
        {/* Ícone flutuante do carrinho */}
        <FloatingCartButton />
      </div>
    </div>;
};
export default Index;
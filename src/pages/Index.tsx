import React from 'react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { HeroSlider } from '../components/sections/HeroSlider';
import { Marquee } from '../components/sections/Marquee';
import { CategoryIcons } from '../components/sections/CategoryIcons';
import { CategoryGrid } from '../components/sections/CategoryGrid';
import { Footer } from '../components/layout/Footer';
import { SearchBar } from '../components/ui/SearchBar';
import { RecentlyAddedProducts } from '../components/sections/RecentlyAddedProducts';
import { BestSellerProducts } from '../components/sections/BestSellerProducts';
import { CategoryProducts } from '../components/sections/CategoryProducts';
import { PromotionProducts } from '../components/sections/PromotionProducts';
import { RecommendedProducts } from '../components/sections/RecommendedProducts';
import { FloatingCartButton } from '../components/cart/FloatingCartButton';
import { SearchBarWithAutocomplete } from '../components/ui/SearchBarWithAutocomplete';
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <div className="bg-background border-b border-border">
        <div className="container mx-auto">
          <Navigation />
        </div>
      </div>
      <Header />
      
      <Marquee />
      <HeroSlider />
      
      {/* Barra de busca moderna com autocomplete */}
      <section className="py-8 bg-background/50">
        <div className="container mx-auto px-4">
          <SearchBarWithAutocomplete onSearch={value => console.log('Busca avançada:', value)} onProductSelect={product => console.log('Produto selecionado:', product)} />
        </div>
      </section>
      <CategoryIcons />
      <RecentlyAddedProducts />
      <BestSellerProducts />
      <CategoryProducts />
      <PromotionProducts />
      <div className="container mx-auto">
        <CategoryGrid />
      </div>
      <RecommendedProducts />
      <Footer />
      
      {/* Ícone flutuante do carrinho */}
      <FloatingCartButton />
    </div>;
};
export default Index;

import React from 'react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { HeroSlider } from '../components/sections/HeroSlider';
import { Features } from '../components/sections/Features';
import { CategoryIcons } from '../components/sections/CategoryIcons';
import { CategoryGrid } from '../components/sections/CategoryGrid';
import { Footer } from '../components/layout/Footer';
import { SearchBar } from '../components/ui/SearchBar';
import { RecentlyAddedProducts } from '../components/sections/RecentlyAddedProducts';
import { BestSellerProducts } from '../components/sections/BestSellerProducts';
import { CategoryProducts } from '../components/sections/CategoryProducts';
import { PromotionProducts } from '../components/sections/PromotionProducts';
import { RecommendedProducts } from '../components/sections/RecommendedProducts';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white">
        <div className="container mx-auto">
          <Navigation />
        </div>
      </div>
      <Header />
      <div className="bg-[#0B0909] py-4">
        <div className="container mx-auto flex justify-center">
          <SearchBar onSearch={(value) => console.log('Pesquisa:', value)} />
        </div>
      </div>
      <HeroSlider />
      <div className="container mx-auto">
        <Features />
      </div>
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
    </div>
  );
};

export default Index;

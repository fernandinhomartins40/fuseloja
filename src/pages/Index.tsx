
import React from 'react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { CategoryIcons } from '../components/sections/CategoryIcons';
import { CategoryGrid } from '../components/sections/CategoryGrid';
import { ProductGrid } from '../components/sections/ProductGrid';
import { Footer } from '../components/layout/Footer';
import { SearchBar } from '../components/ui/SearchBar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#0B0909]">
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
      <Hero />
      <div className="container mx-auto">
        <Features />
      </div>
      <CategoryIcons />
      <div className="container mx-auto">
        <CategoryGrid />
        <ProductGrid />
      </div>
      <Footer />
    </div>
  );
};

export default Index;

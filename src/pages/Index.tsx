
import React from 'react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { CategoryGrid } from '../components/sections/CategoryGrid';
import { ProductGrid } from '../components/sections/ProductGrid';
import { Footer } from '../components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto">
        <Navigation />
      </div>
      <Hero />
      <div className="container mx-auto">
        <Features />
        <CategoryGrid />
        <ProductGrid />
      </div>
      <Footer />
    </div>
  );
};

export default Index;

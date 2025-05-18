
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
      <Navigation />
      <Hero />
      <Features />
      <CategoryGrid />
      <ProductGrid />
      <Footer />
    </div>
  );
};

export default Index;

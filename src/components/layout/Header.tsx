import React from 'react';
import { Navigation } from './Navigation';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto">
        <Navigation />
      </div>
    </header>
  );
};
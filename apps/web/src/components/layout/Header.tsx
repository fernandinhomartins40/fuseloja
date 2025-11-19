import React from 'react';
import { Navigation } from './Navigation';
import { useSettings } from '@/contexts/SettingsContext';

export const Header: React.FC = () => {
  const { settings } = useSettings();
  const navbarConfig = settings.navbar;
  
  const headerStyle = {
    backgroundColor: navbarConfig.backgroundColor,
    height: navbarConfig.height ? `${navbarConfig.height}px` : '80px',
    borderBottom: navbarConfig.borderWidth && navbarConfig.borderColor 
      ? `${navbarConfig.borderWidth}px solid ${navbarConfig.borderColor}` 
      : undefined,
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={headerStyle}
    >
      <div className="container mx-auto h-full">
        <Navigation />
      </div>
    </header>
  );
};
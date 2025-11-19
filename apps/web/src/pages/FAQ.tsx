
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useSettings } from '@/contexts/SettingsContext';

const FAQ: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div 
          className="prose prose-lg max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: settings.pageContent.faq }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;

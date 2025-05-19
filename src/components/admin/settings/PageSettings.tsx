
import React, { useState } from 'react';
import { PageContent } from '@/types/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from './RichTextEditor';

interface PageSettingsProps {
  settings: PageContent;
  onChange: (settings: PageContent) => void;
}

export const PageSettings: React.FC<PageSettingsProps> = ({ settings, onChange }) => {
  const handlePageContentChange = (page: keyof PageContent, content: string) => {
    onChange({
      ...settings,
      [page]: content
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Conteúdo das Páginas</h3>
        <p className="text-sm text-muted-foreground">
          Edite o conteúdo das páginas institucionais da sua loja.
        </p>
      </div>
      
      <Tabs defaultValue="about">
        <TabsList className="w-full mb-4 grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="terms">Termos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.aboutUs}
              onChange={(content) => handlePageContentChange('aboutUs', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.contact}
              onChange={(content) => handlePageContentChange('contact', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="privacy">
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.privacyPolicy}
              onChange={(content) => handlePageContentChange('privacyPolicy', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="terms">
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.termsOfService}
              onChange={(content) => handlePageContentChange('termsOfService', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.faq}
              onChange={(content) => handlePageContentChange('faq', content)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

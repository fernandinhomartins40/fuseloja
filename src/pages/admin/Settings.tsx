
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings';
import { VisualSettings } from '@/components/admin/settings/VisualSettings';
import { BannerSettings } from '@/components/admin/settings/BannerSettings';
import { PageSettings } from '@/components/admin/settings/PageSettings';
import { StoreSettings } from '@/types/settings';
import { defaultSettings } from '@/utils/defaultSettings';
import { Save, RotateCcw, Download, Upload } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = () => {
    // Em um ambiente real, salvaríamos em um banco de dados ou API
    console.log('Salvando configurações:', settings);
    
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso.",
    });
  };
  
  const handleResetSettings = () => {
    if (window.confirm("Tem certeza que deseja redefinir todas as configurações para os valores padrão?")) {
      setSettings(defaultSettings);
      
      toast({
        title: "Configurações redefinidas",
        description: "Todas as configurações foram restauradas aos valores padrão.",
      });
    }
  };
  
  const handleExportSettings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "store-settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Configurações exportadas",
      description: "O arquivo de configurações foi baixado com sucesso.",
    });
  };
  
  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedSettings = JSON.parse(event.target?.result as string);
          setSettings(importedSettings);
          
          toast({
            title: "Configurações importadas",
            description: "As configurações foram carregadas com sucesso.",
          });
        } catch (error) {
          toast({
            title: "Erro ao importar",
            description: "O arquivo selecionado não é um arquivo de configurações válido.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGeneralSettingsChange = (generalSettings: typeof settings.general) => {
    setSettings({
      ...settings,
      general: generalSettings
    });
  };
  
  const handleVisualSettingsChange = (visualSettings: typeof settings.visual) => {
    setSettings({
      ...settings,
      visual: visualSettings
    });
  };
  
  const handleBannerSettingsChange = (bannerSettings: typeof settings.banners) => {
    setSettings({
      ...settings,
      banners: bannerSettings
    });
  };
  
  const handlePageContentChange = (pageContent: typeof settings.pageContent) => {
    setSettings({
      ...settings,
      pageContent: pageContent
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Configurações da Loja</h1>
          <p className="text-muted-foreground">Personalize sua loja de acordo com sua identidade visual.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Redefinir
          </Button>
          
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          
          <div className="relative">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <input
              type="file"
              accept=".json"
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              onChange={handleImportSettings}
            />
          </div>
          
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>
      
      <Card>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="p-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 w-full">
            <TabsTrigger value="general">Informações Gerais</TabsTrigger>
            <TabsTrigger value="visual">Configurações Visuais</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="pages">Conteúdo das Páginas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings settings={settings.general} onChange={handleGeneralSettingsChange} />
          </TabsContent>
          
          <TabsContent value="visual">
            <VisualSettings settings={settings.visual} onChange={handleVisualSettingsChange} />
          </TabsContent>
          
          <TabsContent value="banners">
            <BannerSettings settings={settings.banners} onChange={handleBannerSettingsChange} />
          </TabsContent>
          
          <TabsContent value="pages">
            <PageSettings settings={settings.pageContent} onChange={handlePageContentChange} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;

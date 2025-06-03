
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings';
import { VisualSettings } from '@/components/admin/settings/VisualSettings';
import { BannerSettings } from '@/components/admin/settings/BannerSettings';
import { PageSettings } from '@/components/admin/settings/PageSettings';
import { useSettings } from '@/contexts/SettingsContext';
import { Save, RotateCcw, Download, Upload, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/layout/PageHeader';

const Settings: React.FC = () => {
  const {
    settings,
    updateGeneralSettings,
    updateVisualSettings,
    updateBannerSettings,
    updatePageContent,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
    isLoading,
    hasUnsavedChanges
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = async () => {
    try {
      await saveSettings();
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };
  
  const handleResetSettings = () => {
    if (window.confirm("Tem certeza que deseja redefinir todas as configurações para os valores padrão?")) {
      resetSettings();
      
      toast({
        title: "Configurações redefinidas",
        description: "Todas as configurações foram restauradas aos valores padrão.",
      });
    }
  };
  
  const handleExportSettings = () => {
    exportSettings();
    
    toast({
      title: "Configurações exportadas",
      description: "O arquivo de configurações foi baixado com sucesso.",
    });
  };
  
  const handleImportSettings = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const success = await importSettings(event.target?.result as string);
        
        if (success) {
          toast({
            title: "Configurações importadas",
            description: "As configurações foram carregadas com sucesso.",
          });
        } else {
          toast({
            title: "Erro ao importar",
            description: "O arquivo selecionado não é um arquivo de configurações válido.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
    
    // Reset input value to allow re-importing the same file
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações da Loja"
        description="Personalize sua loja de acordo com sua identidade visual."
        action={{
          label: isLoading ? "Salvando..." : "Salvar Configurações",
          icon: Save,
          onClick: handleSaveSettings,
          variant: "default"
        }}
      />
      
      {hasUnsavedChanges && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Você possui alterações não salvas.</span>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={isLoading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Redefinir
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExportSettings}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          
          <div className="relative">
            <Button variant="outline" disabled={isLoading}>
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <input
              type="file"
              accept=".json"
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              onChange={handleImportSettings}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      
      <Card className="shadow-sm">
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
            <GeneralSettings 
              settings={settings.general} 
              onChange={updateGeneralSettings} 
            />
          </TabsContent>
          
          <TabsContent value="visual">
            <VisualSettings 
              settings={settings.visual} 
              onChange={updateVisualSettings} 
            />
          </TabsContent>
          
          <TabsContent value="banners">
            <BannerSettings 
              settings={settings.banners} 
              onChange={updateBannerSettings} 
            />
          </TabsContent>
          
          <TabsContent value="pages">
            <PageSettings 
              settings={settings.pageContent} 
              onChange={updatePageContent} 
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;


import React, { useState } from 'react';
import { BannerSettings as BannerSettingsType } from '@fuseloja/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { LogoUploader } from './LogoUploader';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BannerSettingsProps {
  settings: BannerSettingsType;
  onChange: (settings: BannerSettingsType) => void;
}

export const BannerSettings: React.FC<BannerSettingsProps> = ({ settings, onChange }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'secondary'>('main');
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      duration: Number(e.target.value)
    });
  };
  
  const handleTransitionChange = (value: 'fade' | 'slide') => {
    onChange({
      ...settings,
      transition: value
    });
  };
  
  const handleAddMainBanner = () => {
    onChange({
      ...settings,
      mainBanners: [
        ...settings.mainBanners,
        {
          id: uuidv4(),
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
          title: 'Novo Banner',
          subtitle: 'Descrição do banner',
          actionText: 'Ver mais',
          actionLink: '/'
        }
      ]
    });
  };
  
  const handleAddSecondaryBanner = () => {
    onChange({
      ...settings,
      secondaryBanners: [
        ...settings.secondaryBanners,
        {
          id: uuidv4(),
          image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
          title: 'Banner Secundário',
          actionLink: '/',
          buttonText: 'Ver mais',
          buttonStyle: 'primary'
        }
      ]
    });
  };
  
  const handleMainBannerChange = (id: string, field: string, value: string) => {
    onChange({
      ...settings,
      mainBanners: settings.mainBanners.map(banner => 
        banner.id === id ? { ...banner, [field]: value } : banner
      )
    });
  };
  
  const handleSecondaryBannerChange = (id: string, field: string, value: string) => {
    onChange({
      ...settings,
      secondaryBanners: settings.secondaryBanners.map(banner => 
        banner.id === id ? { ...banner, [field]: value } : banner
      )
    });
  };
  
  const handleRemoveMainBanner = (id: string) => {
    onChange({
      ...settings,
      mainBanners: settings.mainBanners.filter(banner => banner.id !== id)
    });
  };
  
  const handleRemoveSecondaryBanner = (id: string) => {
    onChange({
      ...settings,
      secondaryBanners: settings.secondaryBanners.filter(banner => banner.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Banners</h3>
        <p className="text-sm text-muted-foreground">
          Configure os banners da sua loja.
        </p>
      </div>
      
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'main' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('main')}
        >
          Banners Principais
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'secondary' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('secondary')}
        >
          Banners Secundários
        </button>
      </div>
      
      {activeTab === 'main' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duração do Slide (ms)</Label>
              <Input
                id="duration"
                type="number"
                value={settings.duration}
                onChange={handleDurationChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Transição</Label>
              <RadioGroup
                value={settings.transition}
                onValueChange={(value: any) => handleTransitionChange(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fade" id="fade" />
                  <Label htmlFor="fade" className="cursor-pointer">Fade</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="slide" id="slide" />
                  <Label htmlFor="slide" className="cursor-pointer">Slide</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Banners Principais</h4>
              <Button onClick={handleAddMainBanner} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Banner
              </Button>
            </div>
            
            {settings.mainBanners.map(banner => (
              <Card key={banner.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{banner.title || 'Banner sem título'}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMainBanner(banner.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2">Imagem do Banner (1920x500px)</Label>
                    <LogoUploader 
                      imageUrl={banner.image}
                      onImageChange={(url) => handleMainBannerChange(banner.id, 'image', url)}
                      aspectRatio="1920/500"
                      dimensions="1920x500px"
                    />
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Título</Label>
                      <Input
                        value={banner.title}
                        onChange={(e) => handleMainBannerChange(banner.id, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Subtítulo</Label>
                      <Input
                        value={banner.subtitle}
                        onChange={(e) => handleMainBannerChange(banner.id, 'subtitle', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Texto do Botão</Label>
                        <Input
                          value={banner.actionText}
                          onChange={(e) => handleMainBannerChange(banner.id, 'actionText', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Link do Botão</Label>
                        <Input
                          value={banner.actionLink}
                          onChange={(e) => handleMainBannerChange(banner.id, 'actionLink', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'secondary' && (
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Banners Secundários</h4>
            <Button onClick={handleAddSecondaryBanner} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Banner
            </Button>
          </div>
          
          {settings.secondaryBanners.map(banner => (
            <Card key={banner.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{banner.title || 'Banner sem título'}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveSecondaryBanner(banner.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2">Imagem do Banner</Label>
                  <LogoUploader 
                    imageUrl={banner.image}
                    onImageChange={(url) => handleSecondaryBannerChange(banner.id, 'image', url)}
                    aspectRatio="2/1"
                  />
                </div>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Título</Label>
                    <Input
                      value={banner.title}
                      onChange={(e) => handleSecondaryBannerChange(banner.id, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Link</Label>
                    <Input
                      value={banner.actionLink}
                      onChange={(e) => handleSecondaryBannerChange(banner.id, 'actionLink', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Texto do Botão</Label>
                      <Input
                        value={banner.buttonText}
                        onChange={(e) => handleSecondaryBannerChange(banner.id, 'buttonText', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Estilo do Botão</Label>
                      <Select
                        value={banner.buttonStyle}
                        onValueChange={(value) => handleSecondaryBannerChange(banner.id, 'buttonStyle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primário</SelectItem>
                          <SelectItem value="secondary">Secundário</SelectItem>
                          <SelectItem value="outline">Contorno</SelectItem>
                          <SelectItem value="text">Somente texto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

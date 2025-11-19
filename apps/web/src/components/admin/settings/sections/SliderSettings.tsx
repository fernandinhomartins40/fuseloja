
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SmartLogoUploader } from '../SmartLogoUploader';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface SliderBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  actionText: string;
  actionLink: string;
  active: boolean;
}

interface SliderSettingsProps {
  settings: {
    banners: SliderBanner[];
    autoplay: boolean;
    duration: number;
    transition: 'fade' | 'slide';
    showDots: boolean;
    showArrows: boolean;
  };
  onChange: (settings: any) => void;
}

export const SliderSettings: React.FC<SliderSettingsProps> = ({ settings, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  const addBanner = () => {
    const newBanner: SliderBanner = {
      id: Date.now().toString(),
      image: '',
      title: '',
      subtitle: '',
      actionText: 'Ver mais',
      actionLink: '#',
      active: true
    };
    
    handleChange('banners', [...settings.banners, newBanner]);
  };

  const updateBanner = (index: number, field: string, value: any) => {
    const updatedBanners = settings.banners.map((banner, i) =>
      i === index ? { ...banner, [field]: value } : banner
    );
    handleChange('banners', updatedBanners);
  };

  const removeBanner = (index: number) => {
    const updatedBanners = settings.banners.filter((_, i) => i !== index);
    handleChange('banners', updatedBanners);
  };

  return (
    <div className="space-y-6">
      <div className="section-header">
        <h3 className="section-title">Configurações do Slider Principal</h3>
        <p className="section-description">
          Configure os banners e animações do slider da página inicial
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Duração (ms)</Label>
              <Input
                type="number"
                value={settings.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                min="1000"
                max="10000"
                step="500"
              />
            </div>
            
            <div>
              <Label>Transição</Label>
              <Select
                value={settings.transition}
                onValueChange={(value) => handleChange('transition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <Label>Reprodução Automática</Label>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) => handleChange('autoplay', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Mostrar Pontos</Label>
              <Switch
                checked={settings.showDots}
                onCheckedChange={(checked) => handleChange('showDots', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Mostrar Setas</Label>
              <Switch
                checked={settings.showArrows}
                onCheckedChange={(checked) => handleChange('showArrows', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Banners do Slider
            <Button onClick={addBanner} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Banner
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {settings.banners.map((banner, index) => (
              <Card key={banner.id} className="border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Banner {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={banner.active}
                        onCheckedChange={(checked) => updateBanner(index, 'active', checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBanner(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2">Imagem do Banner</Label>
                    <SmartLogoUploader
                      imageUrl={banner.image}
                      onImageChange={(url) => updateBanner(index, 'image', url)}
                      type="banner"
                      dimensions="1200x400px"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={banner.title}
                        onChange={(e) => updateBanner(index, 'title', e.target.value)}
                        placeholder="Título do banner"
                      />
                    </div>
                    <div>
                      <Label>Subtítulo</Label>
                      <Input
                        value={banner.subtitle}
                        onChange={(e) => updateBanner(index, 'subtitle', e.target.value)}
                        placeholder="Subtítulo do banner"
                      />
                    </div>
                    <div>
                      <Label>Texto do Botão</Label>
                      <Input
                        value={banner.actionText}
                        onChange={(e) => updateBanner(index, 'actionText', e.target.value)}
                        placeholder="Texto do botão"
                      />
                    </div>
                    <div>
                      <Label>Link do Botão</Label>
                      <Input
                        value={banner.actionLink}
                        onChange={(e) => updateBanner(index, 'actionLink', e.target.value)}
                        placeholder="URL ou caminho"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {settings.banners.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum banner configurado</p>
                <p className="text-sm">Clique em "Adicionar Banner" para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

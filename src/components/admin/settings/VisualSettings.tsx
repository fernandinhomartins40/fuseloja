
import React from 'react';
import { VisualSettings as VisualSettingsType } from '@/types/settings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from './ColorPicker';
import { LogoUploader } from './LogoUploader';
import { SettingsPreview } from './SettingsPreview';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VisualSettingsProps {
  settings: VisualSettingsType;
  onChange: (settings: VisualSettingsType) => void;
}

export const VisualSettings: React.FC<VisualSettingsProps> = ({ settings, onChange }) => {
  const { settings: globalSettings } = useSettings();
  
  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      
      if (parent === 'colors') {
        onChange({
          ...settings,
          colors: {
            ...settings.colors,
            [child]: value
          }
        });
      }
    } else {
      onChange({
        ...settings,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações Visuais</h3>
        <p className="text-sm text-gray-600">
          Personalize a aparência da sua loja.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Logo e Favicon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2">Logo Principal</Label>
                <LogoUploader 
                  imageUrl={settings.logo}
                  onImageChange={(url) => handleChange('logo', url)}
                />
              </div>
              
              <div>
                <Label className="mb-2">Logo do Rodapé</Label>
                <LogoUploader 
                  imageUrl={settings.footerLogo}
                  onImageChange={(url) => handleChange('footerLogo', url)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se não for definida, a logo principal será usada no rodapé.
                </p>
              </div>
              
              <div>
                <Label className="mb-2">Favicon</Label>
                <LogoUploader 
                  imageUrl={settings.favicon}
                  onImageChange={(url) => handleChange('favicon', url)}
                  small
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Esquema de Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Cor Primária</Label>
                <ColorPicker 
                  color={settings.colors.primary} 
                  onChange={(color) => handleChange('colors.primary', color)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Cor Secundária</Label>
                <ColorPicker 
                  color={settings.colors.secondary} 
                  onChange={(color) => handleChange('colors.secondary', color)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Cor de Fundo</Label>
                <ColorPicker 
                  color={settings.colors.background} 
                  onChange={(color) => handleChange('colors.background', color)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Cor de Texto</Label>
                <ColorPicker 
                  color={settings.colors.text} 
                  onChange={(color) => handleChange('colors.text', color)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fontFamily">Família da Fonte</Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) => handleChange('fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                    <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                    <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                    <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                    <SelectItem value="'Poppins', sans-serif">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Estilo dos Botões</Label>
                <RadioGroup
                  value={settings.buttonStyle}
                  onValueChange={(value) => handleChange('buttonStyle', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rounded" id="rounded" />
                    <Label htmlFor="rounded" className="cursor-pointer">Arredondado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="square" id="square" />
                    <Label htmlFor="square" className="cursor-pointer">Quadrado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bordered" id="bordered" />
                    <Label htmlFor="bordered" className="cursor-pointer">Com borda</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Column */}
        <div>
          <SettingsPreview 
            visualSettings={settings}
            storeName={globalSettings.general.storeName}
          />
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { VisualSettings as VisualSettingsType } from '@/types/settings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from './ColorPicker';
import { LogoUploader } from './LogoUploader';

interface VisualSettingsProps {
  settings: VisualSettingsType;
  onChange: (settings: VisualSettingsType) => void;
}

export const VisualSettings: React.FC<VisualSettingsProps> = ({ settings, onChange }) => {
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
        <p className="text-sm text-muted-foreground">
          Personalize a aparência da sua loja.
        </p>
      </div>
      
      <div className="grid gap-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Logo e Favicon</h4>
          <div className="grid gap-4">
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
              <p className="text-xs text-muted-foreground mt-1">
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
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Esquema de Cores</h4>
          <div className="grid gap-4">
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
          </div>
        </div>
        
        <div className="grid gap-4">
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
        </div>
      </div>
    </div>
  );
};

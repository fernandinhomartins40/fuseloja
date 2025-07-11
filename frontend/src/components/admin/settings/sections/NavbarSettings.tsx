
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SmartLogoUploader } from '../SmartLogoUploader';
import { ColorPicker } from '../ColorPicker';

interface NavbarSettingsProps {
  settings: {
    logo: string;
    showSearch: boolean;
    showCategories: boolean;
    backgroundColor: string;
    textColor: string;
    sticky: boolean;
  };
  onChange: (settings: any) => void;
}

export const NavbarSettings: React.FC<NavbarSettingsProps> = ({ settings, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="section-header">
        <h3 className="section-title">Configurações da Barra de Navegação</h3>
        <p className="section-description">
          Personalize a aparência e funcionalidades da barra de navegação
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <SmartLogoUploader
              imageUrl={settings.logo}
              onImageChange={(url) => handleChange('logo', url)}
              type="logo"
              dimensions="300x100px"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2">Cor de Fundo</Label>
              <ColorPicker
                color={settings.backgroundColor}
                onChange={(color) => handleChange('backgroundColor', color)}
              />
            </div>
            <div>
              <Label className="mb-2">Cor do Texto</Label>
              <ColorPicker
                color={settings.textColor}
                onChange={(color) => handleChange('textColor', color)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Exibir Barra de Pesquisa</Label>
                <p className="text-sm text-muted-foreground">
                  Mostra a barra de pesquisa na navegação
                </p>
              </div>
              <Switch
                checked={settings.showSearch}
                onCheckedChange={(checked) => handleChange('showSearch', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Exibir Menu de Categorias</Label>
                <p className="text-sm text-muted-foreground">
                  Mostra o menu dropdown de categorias
                </p>
              </div>
              <Switch
                checked={settings.showCategories}
                onCheckedChange={(checked) => handleChange('showCategories', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Navegação Fixa</Label>
                <p className="text-sm text-muted-foreground">
                  Mantém a barra de navegação fixa no topo ao rolar
                </p>
              </div>
              <Switch
                checked={settings.sticky}
                onCheckedChange={(checked) => handleChange('sticky', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

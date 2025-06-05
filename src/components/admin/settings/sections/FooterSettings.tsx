
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SmartLogoUploader } from '../SmartLogoUploader';
import { ColorPicker } from '../ColorPicker';

interface FooterSettingsProps {
  settings: {
    logo: string;
    description: string;
    backgroundColor: string;
    textColor: string;
    showSocialMedia: boolean;
    showNewsletter: boolean;
    newsletterTitle: string;
    newsletterDescription: string;
    copyright: string;
    links: {
      aboutUs: boolean;
      contact: boolean;
      privacyPolicy: boolean;
      termsOfService: boolean;
      faq: boolean;
    };
  };
  onChange: (settings: any) => void;
}

export const FooterSettings: React.FC<FooterSettingsProps> = ({ settings, onChange }) => {
  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        ...settings,
        [parent]: {
          ...settings[parent as keyof typeof settings],
          [child]: value
        }
      });
    } else {
      onChange({ ...settings, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="section-header">
        <h3 className="section-title">Configurações do Rodapé</h3>
        <p className="section-description">
          Personalize o rodapé do seu site com informações da empresa e links úteis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Identidade Visual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2">Logo do Rodapé</Label>
              <SmartLogoUploader
                imageUrl={settings.logo}
                onImageChange={(url) => handleChange('logo', url)}
                type="logo"
                dimensions="200x80px"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se não definida, será usada a logo principal
              </p>
            </div>

            <div>
              <Label>Descrição da Empresa</Label>
              <Textarea
                value={settings.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Breve descrição da sua empresa"
                rows={3}
              />
            </div>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Mostrar Redes Sociais</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe os ícones das redes sociais
                </p>
              </div>
              <Switch
                checked={settings.showSocialMedia}
                onCheckedChange={(checked) => handleChange('showSocialMedia', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe formulário de inscrição
                </p>
              </div>
              <Switch
                checked={settings.showNewsletter}
                onCheckedChange={(checked) => handleChange('showNewsletter', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Newsletter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título da Newsletter</Label>
              <Input
                value={settings.newsletterTitle}
                onChange={(e) => handleChange('newsletterTitle', e.target.value)}
                placeholder="Ex: Receba nossas ofertas"
                disabled={!settings.showNewsletter}
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={settings.newsletterDescription}
                onChange={(e) => handleChange('newsletterDescription', e.target.value)}
                placeholder="Descrição da newsletter"
                rows={2}
                disabled={!settings.showNewsletter}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Links do Rodapé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label>Sobre Nós</Label>
                <Switch
                  checked={settings.links.aboutUs}
                  onCheckedChange={(checked) => handleChange('links.aboutUs', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Contato</Label>
                <Switch
                  checked={settings.links.contact}
                  onCheckedChange={(checked) => handleChange('links.contact', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Política de Privacidade</Label>
                <Switch
                  checked={settings.links.privacyPolicy}
                  onCheckedChange={(checked) => handleChange('links.privacyPolicy', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Termos de Uso</Label>
                <Switch
                  checked={settings.links.termsOfService}
                  onCheckedChange={(checked) => handleChange('links.termsOfService', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>FAQ</Label>
                <Switch
                  checked={settings.links.faq}
                  onCheckedChange={(checked) => handleChange('links.faq', checked)}
                />
              </div>
            </div>

            <div>
              <Label>Texto de Copyright</Label>
              <Input
                value={settings.copyright}
                onChange={(e) => handleChange('copyright', e.target.value)}
                placeholder="© 2024 Sua Empresa. Todos os direitos reservados."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

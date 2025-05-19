
import React from 'react';
import { GeneralSettings as GeneralSettingsType } from '@/types/settings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GeneralSettingsProps {
  settings: GeneralSettingsType;
  onChange: (settings: GeneralSettingsType) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'socialMedia') {
        onChange({
          ...settings,
          socialMedia: {
            ...settings.socialMedia,
            [child]: value
          }
        });
      }
    } else {
      onChange({
        ...settings,
        [name]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Informações Gerais</h3>
        <p className="text-sm text-muted-foreground">
          Configure as informações básicas da sua loja.
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="storeName">Nome da Loja</Label>
          <Input
            id="storeName"
            name="storeName"
            value={settings.storeName}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            id="slogan"
            name="slogan"
            value={settings.slogan}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email de Contato</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="address">Endereço</Label>
          <Textarea
            id="address"
            name="address"
            value={settings.address}
            onChange={handleChange}
            rows={2}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="businessHours">Horário de Funcionamento</Label>
          <Textarea
            id="businessHours"
            name="businessHours"
            value={settings.businessHours}
            onChange={handleChange}
            rows={2}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="taxId">CNPJ / Identificação Fiscal</Label>
          <Input
            id="taxId"
            name="taxId"
            value={settings.taxId}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Redes Sociais</h4>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="socialMedia.facebook">Facebook</Label>
              <Input
                id="socialMedia.facebook"
                name="socialMedia.facebook"
                value={settings.socialMedia.facebook}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="socialMedia.instagram">Instagram</Label>
              <Input
                id="socialMedia.instagram"
                name="socialMedia.instagram"
                value={settings.socialMedia.instagram}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="socialMedia.twitter">Twitter</Label>
              <Input
                id="socialMedia.twitter"
                name="socialMedia.twitter"
                value={settings.socialMedia.twitter}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

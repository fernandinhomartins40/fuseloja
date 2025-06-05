
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { IconSelector } from '../../IconSelector';

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  active: boolean;
}

interface FeatureCardsSettingsProps {
  settings: {
    enabled: boolean;
    title: string;
    subtitle: string;
    cards: FeatureCard[];
    layout: 'grid' | 'carousel';
    backgroundColor: string;
  };
  onChange: (settings: any) => void;
}

export const FeatureCardsSettings: React.FC<FeatureCardsSettingsProps> = ({ settings, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  const addCard = () => {
    const newCard: FeatureCard = {
      id: Date.now().toString(),
      icon: 'Star',
      title: '',
      description: '',
      active: true
    };
    
    handleChange('cards', [...settings.cards, newCard]);
  };

  const updateCard = (index: number, field: string, value: any) => {
    const updatedCards = settings.cards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    handleChange('cards', updatedCards);
  };

  const removeCard = (index: number) => {
    const updatedCards = settings.cards.filter((_, i) => i !== index);
    handleChange('cards', updatedCards);
  };

  return (
    <div className="space-y-6">
      <div className="section-header">
        <h3 className="section-title">Configurações dos Cards de Características</h3>
        <p className="section-description">
          Configure os cards que destacam as principais características da sua loja
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Configurações Gerais
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => handleChange('enabled', checked)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título da Seção</Label>
            <Input
              value={settings.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Por que escolher nossa loja?"
            />
          </div>

          <div>
            <Label>Subtítulo</Label>
            <Textarea
              value={settings.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Descrição da seção"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Layout</Label>
              <select
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={settings.layout}
                onChange={(e) => handleChange('layout', e.target.value)}
              >
                <option value="grid">Grade</option>
                <option value="carousel">Carrossel</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Cards de Características
            <Button onClick={addCard} size="sm" disabled={!settings.enabled}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Card
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {settings.cards.map((card, index) => (
              <Card key={card.id} className="border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Card {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={card.active}
                        onCheckedChange={(checked) => updateCard(index, 'active', checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCard(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2">Ícone</Label>
                    <IconSelector
                      value={card.icon}
                      onSelect={(icon) => updateCard(index, 'icon', icon)}
                    />
                  </div>

                  <div>
                    <Label>Título</Label>
                    <Input
                      value={card.title}
                      onChange={(e) => updateCard(index, 'title', e.target.value)}
                      placeholder="Título do card"
                    />
                  </div>

                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={card.description}
                      onChange={(e) => updateCard(index, 'description', e.target.value)}
                      placeholder="Descrição do card"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {settings.cards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum card configurado</p>
                <p className="text-sm">Clique em "Adicionar Card" para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

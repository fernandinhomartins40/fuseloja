
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';

export const UserPreferences: React.FC = () => {
  const { user, updatePreferences } = useUser();
  const preferences = user?.preferences;

  if (!preferences) {
    return null;
  }

  const handleNewsletterChange = (checked: boolean) => {
    updatePreferences({ newsletter: checked });
  };

  const handleMarketingChange = (checked: boolean) => {
    updatePreferences({ marketing: checked });
  };

  const handleNotificationChange = (type: 'orders' | 'promotions' | 'news', checked: boolean) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [type]: checked
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Preferências</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Email e Notificações</CardTitle>
          <CardDescription>
            Gerencie como e quando você deseja receber atualizações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Comunicações</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="newsletter" 
                checked={preferences.newsletter} 
                onCheckedChange={handleNewsletterChange}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="newsletter" className="text-sm font-medium cursor-pointer">
                  Newsletter
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba nossas novidades e atualizações mensais.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marketing" 
                checked={preferences.marketing} 
                onCheckedChange={handleMarketingChange}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                  Marketing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba ofertas especiais e informações sobre produtos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notificações</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="orders" 
                checked={preferences.notifications.orders} 
                onCheckedChange={(checked) => handleNotificationChange('orders', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="orders" className="text-sm font-medium cursor-pointer">
                  Pedidos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre o status dos seus pedidos.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="promotions" 
                checked={preferences.notifications.promotions} 
                onCheckedChange={(checked) => handleNotificationChange('promotions', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="promotions" className="text-sm font-medium cursor-pointer">
                  Promoções
                </Label>
                <p className="text-sm text-muted-foreground">
                  Seja notificado sobre ofertas relâmpago e promoções.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="news" 
                checked={preferences.notifications.news} 
                onCheckedChange={(checked) => handleNotificationChange('news', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="news" className="text-sm font-medium cursor-pointer">
                  Novidades
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre novos produtos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

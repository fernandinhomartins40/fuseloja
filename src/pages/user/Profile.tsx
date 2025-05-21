
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

import { useUser } from '@/contexts/UserContext';
import { UserProfileForm } from '@/components/user/UserProfileForm';
import { UserAddressList } from '@/components/user/UserAddressList';
import { UserOrderHistory } from '@/components/user/UserOrderHistory';
import { UserPreferences } from '@/components/user/UserPreferences';
import { UserSecuritySettings } from '@/components/user/UserSecuritySettings';
import { UserLoginForm } from '@/components/user/UserLoginForm';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleLoginSuccess = () => {
    // Reload page to reflect login state changes
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">Entrar na sua conta</h1>
          <UserLoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="addresses">Endereços</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-6">
          <UserProfileForm />
        </TabsContent>
        
        <TabsContent value="addresses" className="space-y-6">
          <UserAddressList />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-6">
          <UserOrderHistory />
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <UserPreferences />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <UserSecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

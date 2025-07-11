import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Crown, LogOut } from 'lucide-react';

const AdminDashboardSimple: React.FC = () => {
  const { apiUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel do Administrador</h1>
                <p className="text-sm text-gray-500">FuseLoja - Sistema de Gestão (Versão Simples)</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {apiUser?.firstName} {apiUser?.lastName}
                </p>
                <p className="text-sm text-gray-500">Administrador</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🎉 Painel Funcionando!</h2>
          <p className="text-gray-600 mb-4">
            Parabéns! Você acessou com sucesso o painel do administrador.
          </p>
          <div className="space-y-2">
            <p><strong>Usuário:</strong> {apiUser?.firstName} {apiUser?.lastName}</p>
            <p><strong>E-mail:</strong> {apiUser?.email}</p>
            <p><strong>Função:</strong> {apiUser?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSimple; 
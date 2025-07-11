import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const AdminTest: React.FC = () => {
  const { user, apiUser, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Teste do Admin</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado da Autenticação</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>isLoading:</strong> {isLoading ? '✅ Sim' : '❌ Não'}</p>
              <p><strong>isAuthenticated:</strong> {isAuthenticated ? '✅ Sim' : '❌ Não'}</p>
            </div>
            <div>
              <p><strong>user:</strong> {user ? '✅ Existe' : '❌ Nulo'}</p>
              <p><strong>apiUser:</strong> {apiUser ? '✅ Existe' : '❌ Nulo'}</p>
            </div>
          </div>
        </div>

        {apiUser && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Dados do Usuário</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {apiUser.id}</p>
              <p><strong>Email:</strong> {apiUser.email}</p>
              <p><strong>Nome:</strong> {apiUser.firstName} {apiUser.lastName}</p>
              <p><strong>Função:</strong> {apiUser.role}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Testes de Navegação</h2>
          <div className="space-y-2">
            <a href="/" className="block text-blue-500 hover:text-blue-700">→ Página Inicial</a>
            <a href="/admin" className="block text-green-500 hover:text-green-700">→ Admin Dashboard</a>
            <a href="/admin/dashboard" className="block text-purple-500 hover:text-purple-700">→ Admin Dashboard (rota específica)</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest; 
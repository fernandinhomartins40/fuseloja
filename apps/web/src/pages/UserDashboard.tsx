import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Calendar, Settings, LogOut, Edit, Save, X } from 'lucide-react';
import apiClient from '@/services/api';

const UserDashboard: React.FC = () => {
  const { user, apiUser, logout, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    if (apiUser) {
      setEditData({
        firstName: apiUser.firstName,
        lastName: apiUser.lastName
      });
    }
  }, [apiUser]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstName: apiUser?.firstName || '',
      lastName: apiUser?.lastName || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      if (!editData.firstName.trim() || !editData.lastName.trim()) {
        setError('Nome e sobrenome são obrigatórios');
        return;
      }

      const response = await apiClient.put('/users/profile', {
        firstName: editData.firstName.trim(),
        lastName: editData.lastName.trim()
      });

      if (response.data?.success) {
        setSuccess('Perfil atualizado com sucesso!');
        setIsEditing(false);
        // Refresh profile data
        await refreshProfile();
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!apiUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-sm text-gray-500">FuseLoja - Área do Cliente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {apiUser.firstName} {apiUser.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  <Badge variant="outline" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    Cliente
                  </Badge>
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais
                </CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={handleEdit} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                    placeholder="Seu nome"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {apiUser.firstName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                    placeholder="Seu sobrenome"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {apiUser.lastName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="p-3 bg-gray-50 rounded-md flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {apiUser.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberSince">Membro desde</Label>
                <div className="p-3 bg-gray-50 rounded-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(apiUser.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>
              Detalhes sobre sua conta no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Status da Conta</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <Badge variant="default">Ativa</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <Badge variant="outline">Cliente</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Verificação de E-mail</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <Badge variant={apiUser.isEmailVerified ? "default" : "secondary"}>
                    {apiUser.isEmailVerified ? "Verificado" : "Pendente"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Última Atualização</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  {new Date(apiUser.updatedAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard; 
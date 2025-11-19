import React from 'react';
import { ShieldX, Home, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showProfileButton?: boolean;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Acesso Negado",
  message = "Você não tem permissão para acessar esta página.",
  showHomeButton = true,
  showProfileButton = false
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto text-center px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>
          
          <div className="space-y-3">
            {showHomeButton && (
              <Button asChild className="w-full">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
            )}
            
            {showProfileButton && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/perfil">
                  <User className="w-4 h-4 mr-2" />
                  Meu Perfil
                </Link>
              </Button>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Precisa de ajuda? <Link to="/contato" className="text-blue-600 hover:text-blue-800">Entre em contato</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
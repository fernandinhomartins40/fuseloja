
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { user, isAuthenticated } = useUser();
  const { refreshProfile, apiUser } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Use footer logo if available, otherwise use the main logo
  const logoUrl = settings.visual.footerLogo || settings.visual.logo;
  const storeName = settings.general.storeName;
  const phone = settings.general.phone;
  const email = settings.general.email;
  const address = settings.general.address;

  // Força atualização do perfil a cada 30 segundos para evitar problemas de cache
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isAuthenticated) {
        try {
          await refreshProfile();
        } catch (error) {
          console.debug('Profile refresh failed:', error);
        }
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshProfile]);

  // Escuta eventos de atualização de usuário
  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      console.log('User updated event received:', event.detail);
      // Força re-render do componente
      setIsNavigating(false);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    return () => window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
  }, []);

  const handleAdminAccess = async () => {
    // Prevenir múltiplos cliques
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      // FORÇA atualização imediata dos dados antes da verificação
      let currentUserRole = null;
      
      // 1. Tenta refresh do perfil se autenticado
      if (isAuthenticated) {
        try {
          await refreshProfile();
          // Aguarda um pouco para o estado atualizar
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.debug('Profile refresh failed, using cached data');
        }
      }
      
      // 2. Verifica múltiplas fontes de dados (prioridade: apiUser > localStorage > user)
      const storedUser = localStorage.getItem('user');
      if (apiUser?.role) {
        currentUserRole = apiUser.role;
      } else if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          currentUserRole = parsedUser.role;
        } catch (error) {
          console.warn('Error parsing stored user:', error);
        }
      } else if (user?.role) {
        currentUserRole = user.role;
      }
      
      // 3. Força reload da página se for admin mas os dados estão inconsistentes
      const isLoggedIn = isAuthenticated || storedUser;
      if (isLoggedIn && !currentUserRole) {
        console.log('Forçando reload devido a dados inconsistentes...');
        window.location.reload();
        return;
      }
      
      // 4. Navegação baseada no role
      if (isLoggedIn) {
        if (currentUserRole === 'admin') {
          // Para admin, força limpeza de cache antes da navegação
          if (typeof window.clearAppCache === 'function') {
            window.clearAppCache();
          }
          
          // Limpa cache do localStorage se necessário
          if (!apiUser || apiUser.role !== 'admin') {
            const stored = localStorage.getItem('user');
            if (stored) {
              try {
                const userData = JSON.parse(stored);
                if (userData.role === 'admin') {
                  // Força atualização do contexto
                  window.dispatchEvent(new CustomEvent('forceAuthRefresh'));
                }
              } catch (e) {}
            }
          }
          
          navigate('/admin', { replace: true });
          
          // Força reload da página se necessário (como último recurso)
          setTimeout(() => {
            if (window.location.pathname !== '/admin') {
              console.log('Forcing hard redirect to admin panel...');
              window.location.href = '/admin';
            }
          }, 200);
        } else {
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Erro ao acessar painel:', error);
      // Em caso de erro, força login
      navigate('/login', { replace: true });
    } finally {
      // Liberar o botão após um pequeno delay
      setTimeout(() => setIsNavigating(false), 1500);
    }
  };

  return (
    <footer className="bg-[#0B0909] pt-[60px] pb-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <img
              src={logoUrl}
              alt={storeName}
              className="max-h-16"
            />
          </div>
          
          <div>
            <h4 className="text-white text-2xl mb-5">Links</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Início</Link>
              <Link to="/" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Ofertas</Link>
              <Link to="/" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Categorias</Link>
              {settings.footer.links.aboutUs && (
                <Link to="/sobre" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Sobre</Link>
              )}
              {settings.footer.links.contact && (
                <Link to="/contato" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Contato</Link>
              )}
              {settings.footer.links.privacyPolicy && (
                <Link to="/privacidade" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Política de Privacidade</Link>
              )}
              {settings.footer.links.termsOfService && (
                <Link to="/termos" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">Termos de Uso</Link>
              )}
              {settings.footer.links.faq && (
                <Link to="/faq" className="text-[#999] no-underline hover:text-[#D90429] transition-colors">FAQ</Link>
              )}
            </nav>
          </div>
          
          <div>
            <h4 className="text-white text-2xl mb-5">Contato</h4>
            <div className="flex flex-col gap-2.5 text-[#999]">
              <div className="flex items-center gap-2.5">
                <i className="ti ti-phone" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="ti ti-mail" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="ti ti-map-pin" />
                <span>{address}</span>
              </div>
            </div>
          </div>
          
          {settings.footer.showNewsletter && (
            <div>
              <h4 className="text-white text-2xl mb-5">{settings.footer.newsletterTitle}</h4>
              <p className="text-[#999] mb-5">{settings.footer.newsletterDescription}</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="w-full px-4 py-2 rounded-l-[3px] border-[none] focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-[#D90429] text-white px-4 py-2 rounded-r-[3px] border-[none] cursor-pointer hover:bg-[#b8031f] transition-colors"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="border-t border-solid border-[#333] py-5 flex flex-col md:flex-row justify-between items-center text-[#999]">
          <p>{settings.footer.copyright}</p>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-[#D90429] text-[#D90429] hover:bg-[#D90429] hover:text-white"
            onClick={handleAdminAccess}
            disabled={isNavigating}
          >
            {isNavigating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {isNavigating ? 'Redirecionando...' : 'Painel do Lojista'}
          </Button>
        </div>
      </div>
    </footer>
  );
};

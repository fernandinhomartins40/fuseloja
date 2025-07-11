
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

  // Log estado atual para debug
  useEffect(() => {
    console.log('Footer - Estado atual:', {
      isAuthenticated,
      userRole: user?.role,
      apiUserRole: apiUser?.role,
      localStorage: localStorage.getItem('user') ? 'exists' : 'null'
    });
  }, [isAuthenticated, user, apiUser]);

  const handleAdminAccess = async () => {
    // Prevenir múltiplos cliques
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      // MÉTODO SIMPLES E DIRETO: Verifica localStorage primeiro
      const storedUser = localStorage.getItem('user');
      let userRole = null;
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userRole = userData.role;
          console.log('Role encontrado no localStorage:', userRole);
        } catch (error) {
          console.warn('Erro ao parsear localStorage:', error);
        }
      }
      
      // Se não achou no localStorage, verifica contexts
      if (!userRole) {
        userRole = apiUser?.role || user?.role;
        console.log('Role encontrado no context:', userRole);
      }
      
      const isLoggedIn = isAuthenticated || storedUser;
      
      if (isLoggedIn && userRole === 'admin') {
        console.log('✅ Admin identificado - redirecionando para /admin');
        navigate('/admin');
      } else if (isLoggedIn && userRole !== 'admin') {
        console.log('❌ Usuário não é admin - redirecionando para login');
        navigate('/login');
      } else {
        console.log('❌ Usuário não logado - redirecionando para login');
        navigate('/login');
      }
      
    } catch (error) {
      console.error('Erro ao acessar painel:', error);
      navigate('/login');
    } finally {
      // Liberar botão após 1 segundo
      setTimeout(() => setIsNavigating(false), 1000);
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

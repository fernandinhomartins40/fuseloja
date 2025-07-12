
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
  
  // Get configuration values
  const footerConfig = settings.footer;
  const logoUrl = footerConfig.logo || settings.visual.footerLogo || settings.visual.logo;
  const storeName = settings.general.storeName;
  const phone = settings.general.phone;
  const email = settings.general.email;
  const address = settings.general.address;

  // Helper functions for styling
  const getFontSize = (size: string) => {
    const sizeMap = {
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg'
    };
    return sizeMap[size as keyof typeof sizeMap] || 'text-base';
  };

  const getFontWeight = (weight: string) => {
    const weightMap = {
      'normal': 'font-normal',
      'medium': 'font-medium',
      'semibold': 'font-semibold',
      'bold': 'font-bold'
    };
    return weightMap[weight as keyof typeof weightMap] || 'font-normal';
  };

  const getHeadingFontSize = (size: string) => {
    const sizeMap = {
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl'
    };
    return sizeMap[size as keyof typeof sizeMap] || 'text-2xl';
  };

  // Dynamic styles
  const footerStyle = {
    backgroundColor: footerConfig.backgroundColor,
    paddingTop: `${footerConfig.styling.padding.top}px`,
    paddingBottom: `${footerConfig.styling.padding.bottom}px`,
    fontFamily: footerConfig.styling.fontFamily,
  };

  const logoStyle = {
    maxHeight: footerConfig.logoHeight ? `${footerConfig.logoHeight}px` : '64px',
    maxWidth: footerConfig.logoWidth ? `${footerConfig.logoWidth}px` : 'auto',
  };

  const textStyle = {
    color: footerConfig.textColor,
  };

  const headingStyle = {
    color: footerConfig.styling.headingColor,
  };

  const linkStyle = {
    color: footerConfig.textColor,
    marginBottom: `${footerConfig.styling.linkSpacing}px`,
  };

  const linkHoverStyle = {
    color: footerConfig.textHoverColor,
  };

  const borderStyle = {
    borderTopWidth: `${footerConfig.styling.borderWidth}px`,
    borderTopColor: footerConfig.styling.borderColor,
  };

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
    <footer 
      className={`${getFontSize(footerConfig.styling.fontSize)} ${getFontWeight(footerConfig.styling.fontWeight)}`}
      style={footerStyle}
    >
      <div className="container mx-auto" style={{ paddingLeft: `${footerConfig.styling.padding.horizontal}px`, paddingRight: `${footerConfig.styling.padding.horizontal}px` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-10" style={{ gap: `${footerConfig.styling.sectionSpacing}px` }}>
          <div>
            <img
              src={logoUrl}
              alt={storeName}
              className="object-contain transition-all duration-300"
              style={logoStyle}
            />
            {footerConfig.description && (
              <p 
                className="mt-4 leading-relaxed"
                style={textStyle}
              >
                {footerConfig.description}
              </p>
            )}
          </div>
          
          <div>
            <h4 
              className={`${getHeadingFontSize(footerConfig.styling.headingFontSize)} ${getFontWeight(footerConfig.styling.headingFontWeight)} mb-5`}
              style={headingStyle}
            >
              Links
            </h4>
            <nav className="flex flex-col" style={{ gap: `${footerConfig.styling.linkSpacing}px` }}>
              <Link 
                to="/" 
                className="no-underline transition-colors duration-300"
                style={linkStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
              >
                Início
              </Link>
              <Link 
                to="/" 
                className="no-underline transition-colors duration-300"
                style={linkStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
              >
                Ofertas
              </Link>
              <Link 
                to="/" 
                className="no-underline transition-colors duration-300"
                style={linkStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
              >
                Categorias
              </Link>
              {footerConfig.links.aboutUs && (
                <Link 
                  to="/sobre" 
                  className="no-underline transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
                >
                  Sobre
                </Link>
              )}
              {footerConfig.links.contact && (
                <Link 
                  to="/contato" 
                  className="no-underline transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
                >
                  Contato
                </Link>
              )}
              {footerConfig.links.privacyPolicy && (
                <Link 
                  to="/privacidade" 
                  className="no-underline transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
                >
                  Política de Privacidade
                </Link>
              )}
              {footerConfig.links.termsOfService && (
                <Link 
                  to="/termos" 
                  className="no-underline transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
                >
                  Termos de Uso
                </Link>
              )}
              {footerConfig.links.faq && (
                <Link 
                  to="/faq" 
                  className="no-underline transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
                >
                  FAQ
                </Link>
              )}
            </nav>
          </div>
          
          <div>
            <h4 
              className={`${getHeadingFontSize(footerConfig.styling.headingFontSize)} ${getFontWeight(footerConfig.styling.headingFontWeight)} mb-5`}
              style={headingStyle}
            >
              Contato
            </h4>
            <div className="flex flex-col" style={{ gap: `${footerConfig.styling.linkSpacing}px` }}>
              <div className="flex items-center" style={{ gap: `${footerConfig.styling.linkSpacing}px` }}>
                <i className="ti ti-phone" style={textStyle} />
                <span style={textStyle}>{phone}</span>
              </div>
              <div className="flex items-center" style={{ gap: `${footerConfig.styling.linkSpacing}px` }}>
                <i className="ti ti-mail" style={textStyle} />
                <span style={textStyle}>{email}</span>
              </div>
              <div className="flex items-center" style={{ gap: `${footerConfig.styling.linkSpacing}px` }}>
                <i className="ti ti-map-pin" style={textStyle} />
                <span style={textStyle}>{address}</span>
              </div>
            </div>
          </div>
          
          {settings.footer.showNewsletter && (
            <div>
              <h4 
                className={`${getHeadingFontSize(footerConfig.styling.headingFontSize)} ${getFontWeight(footerConfig.styling.headingFontWeight)} mb-5`}
                style={headingStyle}
              >
                {settings.footer.newsletterTitle}
              </h4>
              <p className="mb-5" style={textStyle}>{settings.footer.newsletterDescription}</p>
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
        
        <div 
          className="border-t border-solid py-5 flex flex-col md:flex-row justify-between items-center"
          style={borderStyle}
        >
          <p style={textStyle}>{settings.footer.copyright}</p>
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

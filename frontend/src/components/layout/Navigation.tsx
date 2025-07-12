import React, { useState } from 'react';
import { ShoppingCart, UserRound, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUser } from '@/contexts/UserContext';
import { UserLoginForm } from '../user/UserLoginForm';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from '../cart/CartDrawer';
import { useSettings } from '@/contexts/SettingsContext';
export const Navigation: React.FC = () => {
  const {
    user,
    isAuthenticated,
    logout
  } = useUser();
  const {
    totalItems,
    isCartOpen,
    openCart,
    closeCart
  } = useCart();
  const {
    settings
  } = useSettings();
  const location = useLocation();
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  
  const navbarConfig = settings.navbar;
  
  // Helper function to determine if a menu item is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  // Generate dynamic styles
  const menuItemStyle = (isActive: boolean = false) => ({
    color: isActive ? navbarConfig.menu.activeColor : navbarConfig.menu.color,
    fontWeight: navbarConfig.menu.fontWeight,
    fontSize: getFontSize(navbarConfig.menu.fontSize),
    textTransform: navbarConfig.menu.textTransform,
    transition: 'all 0.3s ease',
  });
  
  const menuItemHoverStyle = {
    color: navbarConfig.menu.hoverColor,
  };
  
  const iconStyle = {
    color: navbarConfig.icons.color,
    width: `${navbarConfig.icons.size}px`,
    height: `${navbarConfig.icons.size}px`,
    transition: `all ${navbarConfig.icons.hoverAnimationDuration}ms ease`,
  };
  
  const iconHoverStyle = {
    color: navbarConfig.icons.hoverColor,
    transform: getIconHoverTransform(),
  };
  
  const logoStyle = {
    height: navbarConfig.logoHeight ? `${navbarConfig.logoHeight}px` : '34px',
    width: navbarConfig.logoWidth ? `${navbarConfig.logoWidth}px` : 'auto',
  };
  
  // Helper functions
  function getFontSize(size: string): string {
    const sizeMap = {
      'xs': '0.75rem',
      'sm': '0.875rem', 
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem'
    };
    return sizeMap[size as keyof typeof sizeMap] || '1rem';
  }
  
  function getIconHoverTransform(): string {
    const { hoverAnimation, hoverAnimationIntensity } = navbarConfig.icons;
    switch (hoverAnimation) {
      case 'scale':
        return `scale(${1 + (hoverAnimationIntensity / 100)})`;
      case 'rotate':
        return `rotate(${hoverAnimationIntensity * 3.6}deg)`;
      case 'bounce':
        return `translateY(-${hoverAnimationIntensity / 10}px)`;
      case 'pulse':
        return 'scale(1.1)';
      default:
        return 'none';
    }
  }
  const handleLogout = () => {
    logout();
  };
  const handleLoginSuccess = () => {
    setLoginSheetOpen(false);
  };
  return <div className="flex justify-between items-center h-full px-4" style={{ backgroundColor: navbarConfig.backgroundColor }}>
      <Link to="/">
        <img 
          src={settings.visual.logo} 
          alt={settings.general.storeName} 
          style={logoStyle}
          className="object-contain transition-all duration-300"
        />
      </Link>
      
      <nav className="flex gap-[15px] max-sm:hidden" aria-label="Navegação Principal">
        <Link 
          to="/" 
          className="no-underline transition-all duration-300"
          style={menuItemStyle(isActiveRoute('/'))}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, menuItemHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, menuItemStyle(isActiveRoute('/')))}
        >
          Início
        </Link>
        <a 
          href="#" 
          className="no-underline transition-all duration-300"
          style={menuItemStyle()}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, menuItemHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, menuItemStyle())}
        >
          Ofertas
        </a>
        <a 
          href="#" 
          className="no-underline transition-all duration-300"
          style={menuItemStyle()}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, menuItemHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, menuItemStyle())}
        >
          Novidades
        </a>
        <a 
          href="#" 
          className="no-underline transition-all duration-300"
          style={menuItemStyle()}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, menuItemHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, menuItemStyle())}
        >
          Categorias
        </a>
        <Link 
          to="/sobre" 
          className="no-underline transition-all duration-300"
          style={menuItemStyle(isActiveRoute('/sobre'))}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, menuItemHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, menuItemStyle(isActiveRoute('/sobre')))}
        >
          Sobre Nós
        </Link>
        <Link 
          to="/contato" 
          className="no-underline transition-all duration-300"
          style={menuItemStyle(isActiveRoute('/contato'))}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, menuItemHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, menuItemStyle(isActiveRoute('/contato')))}
        >
          Contato
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="relative flex items-center transition-all"
                style={iconStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconStyle)}
                aria-label="Perfil do usuário"
              >
                {user?.avatar ? <Avatar style={{ width: `${navbarConfig.icons.size}px`, height: `${navbarConfig.icons.size}px` }}>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar> : <UserRound />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 text-center">
                <p className="text-sm font-medium">Olá, {user?.name.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/perfil" className="cursor-pointer">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/perfil?tab=orders" className="cursor-pointer">Meus Pedidos</Link>
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer font-medium text-blue-600">
                      Painel Administrativo
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <Sheet open={loginSheetOpen} onOpenChange={setLoginSheetOpen}>
            <SheetTrigger asChild>
              <button 
                className="relative transition-all"
                style={iconStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconStyle)}
                aria-label="Entrar"
              >
                <UserRound />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mb-4">
                <SheetTitle>Entre na sua conta</SheetTitle>
              </SheetHeader>
              <UserLoginForm onSuccess={handleLoginSuccess} />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Não tem uma conta?</p>
                <Button variant="link" className="p-0 h-auto">Registre-se</Button>
              </div>
            </SheetContent>
          </Sheet>}
        
        {/* Cart button that opens the cart drawer */}
        <button
          className="relative transition-all"
          style={iconStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconStyle)}
          aria-label="Carrinho de compras"
          onClick={openCart}
        >
          <ShoppingCart />
          <div 
            className="absolute -top-2 -right-2 w-5 h-5 text-white text-[10px] rounded-full flex items-center justify-center transition-all duration-300"
            style={{ backgroundColor: navbarConfig.menu.activeColor }}
          >
            {totalItems}
          </div>
        </button>
        
        {/* Cart Drawer */}
        <CartDrawer open={isCartOpen} onOpenChange={(isOpen) => !isOpen && closeCart()} />
      </div>
    </div>;
};
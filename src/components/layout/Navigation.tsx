
import React, { useState } from 'react';
import { ShoppingCart, UserRound, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUser } from '@/contexts/UserContext';
import { UserLoginForm } from '../user/UserLoginForm';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from '../cart/CartDrawer';
import { useSettings } from '@/contexts/SettingsContext';

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleLoginSuccess = () => {
    setLoginSheetOpen(false);
  };

  return (
    <div className="flex justify-between items-center py-5 px-4 bg-white">
      <Link to="/">
        <img
          src={settings.visual.logo}
          alt={settings.general.storeName}
          className="h-[34px]"
        />
      </Link>
      
      <nav className="flex gap-[15px] max-sm:hidden" aria-label="Navegação Principal">
        <Link to="/" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Início
        </Link>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Ofertas
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Novidades
        </a>
        <a href="#" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Categorias
        </a>
        <Link to="/sobre" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Sobre Nós
        </Link>
        <Link to="/contato" className="text-[#54595F] no-underline text-base hover:text-[#D90429] transition-colors">
          Contato
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative text-[#54595F] hover:text-[#D90429] transition-colors flex items-center" aria-label="Perfil do usuário">
                {user?.avatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <UserRound size={24} />
                )}
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Sheet open={loginSheetOpen} onOpenChange={setLoginSheetOpen}>
            <SheetTrigger asChild>
              <button className="relative text-[#54595F] hover:text-[#D90429] transition-colors" aria-label="Entrar">
                <UserRound size={24} />
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
          </Sheet>
        )}
        
        {/* Cart button that opens the cart drawer */}
        <button 
          className="relative text-[#54595F] hover:text-[#D90429] transition-colors" 
          aria-label="Carrinho de compras"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart size={24} />
          <div className="absolute -top-2 -right-2 w-5 h-5 text-white text-[10px] bg-[#D90429] rounded-full flex items-center justify-center">
            {totalItems}
          </div>
        </button>
        
        {/* Cart Drawer */}
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      </div>
    </div>
  );
};

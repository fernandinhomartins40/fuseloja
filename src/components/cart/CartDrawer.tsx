
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { MinusIcon, PlusIcon, Trash2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { UserLoginForm } from '@/components/user/UserLoginForm';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthForm(true);
      return;
    }
    onOpenChange(false);
    navigate('/checkout');
  };

  const handleAuthSuccess = () => {
    setShowAuthForm(false);
    // Automatically proceed to checkout after successful login/registration
    setTimeout(() => {
      onOpenChange(false);
      navigate('/checkout');
    }, 100);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">Carrinho de Compras</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <h3 className="font-medium text-lg mb-2">Seu carrinho está vazio</h3>
            <p className="text-muted-foreground mb-6">Adicione produtos para continuar comprando</p>
            <Button 
              onClick={() => {
                onOpenChange(false);
                navigate('/');
              }}
            >
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/produto/${item.id}`} 
                      className="font-medium hover:text-destructive line-clamp-2"
                      onClick={() => onOpenChange(false)}
                    >
                      {item.title}
                    </Link>
                    <div className="text-destructive font-medium mt-1">
                      R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Authentication Form Section */}
            {!isAuthenticated && (
              <div className="border-t pt-4 mb-4">
                <div className="mb-4">
                  <h3 className="font-medium text-lg mb-2">Para finalizar sua compra</h3>
                  <p className="text-sm text-muted-foreground">
                    Faça login ou crie uma conta rápida para continuar
                  </p>
                </div>
                
                {showAuthForm ? (
                  <div className="max-h-96 overflow-y-auto">
                    <UserLoginForm onSuccess={handleAuthSuccess} />
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAuthForm(false)}
                      >
                        Ocultar formulário
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowAuthForm(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Entrar ou Criar Conta
                  </Button>
                )}
              </div>
            )}

            <div className="pt-4">
              <Separator className="mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <SheetFooter className="flex flex-col gap-2 sm:flex-col mt-6">
                {isAuthenticated ? (
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                  >
                    Finalizar Compra
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                    variant="outline"
                    disabled
                  >
                    Entre para Finalizar Compra
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => clearCart()}
                  className="w-full"
                >
                  Limpar Carrinho
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

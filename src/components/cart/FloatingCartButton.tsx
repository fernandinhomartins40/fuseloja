
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from './CartDrawer';
import { Button } from '@/components/ui/button';

export const FloatingCartButton: React.FC = () => {
  const { totalItems, subtotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  // Não mostrar se o carrinho estiver vazio
  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-[#D90429] hover:bg-[#B8031E] shadow-lg transition-all duration-300 hover:scale-110 p-0"
        aria-label="Abrir carrinho de compras"
      >
        <div className="relative">
          <ShoppingCart size={24} className="text-white" />
          <div className="absolute -top-2 -right-2 w-6 h-6 text-white text-xs bg-[#0B0909] rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </div>
        </div>
      </Button>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

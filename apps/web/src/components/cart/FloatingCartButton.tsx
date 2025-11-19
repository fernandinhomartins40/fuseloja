
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
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setCartOpen(true)}
          className="relative h-16 w-16 rounded-full bg-[#D90429] hover:bg-[#B8031E] shadow-lg transition-all duration-300 hover:scale-110 p-0"
          aria-label="Abrir carrinho de compras"
        >
          <ShoppingCart size={32} className="text-white" />
          
          {/* Badge com contador de itens */}
          <div className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs bg-[#0B0909] rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
            {totalItems > 99 ? '99+' : totalItems}
          </div>
        </Button>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

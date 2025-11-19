
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { MinusIcon, PlusIcon, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { eCommerceService } from '@/services/eCommerce.service';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const checkoutSchema = z.object({
  name: z.string().min(3, { message: "O nome completo é obrigatório." }),
  whatsapp: z.string().min(10, { message: "O número do WhatsApp é inválido." }).max(15, { message: "O número do WhatsApp é inválido." }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', whatsapp: '' },
  });

  const formatWhatsAppMessage = (customerName: string, customerPhone: string) => {
    const productsText = items.map(item => 
      `🛒 *${item.title}* (Qtd: ${item.quantity}) - R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
    ).join('\n');
    
    const message = `Olá, FuseLoja! 👋

Gostaria de fazer o pedido dos seguintes itens:

${productsText}

*Subtotal:* R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
---
*Meus Dados:*
👤 *Nome:* ${customerName}
📱 *WhatsApp:* ${customerPhone}

Aguardo o contato para finalizar a compra. Obrigado!
    `;
    return encodeURIComponent(message.trim());
  };
  
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Processando seu pedido...");

    try {
      // 1. Cria/obtém o cliente e usuário provisório
      const customerResponse = await eCommerceService.createProvisionalCustomer(data.name, data.whatsapp);
      console.log('Cliente criado/obtido:', customerResponse);
      
      // 2. Cria o pedido no backend
      const orderResponse = await eCommerceService.createOrder(
        data.name,
        data.whatsapp,
        customerResponse.customer.email, // Usa o email do cliente, se existir
        items,
        subtotal
      );
      console.log('Pedido criado:', orderResponse);

      toast.success("Pedido registrado! Redirecionando para o WhatsApp...", { id: toastId, duration: 2000 });
      
      setTimeout(() => {
        const message = formatWhatsAppMessage(data.name, data.whatsapp);
        const whatsappUrl = `https://wa.me/5542999140484?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        clearCart();
        onOpenChange(false);
        setIsSubmitting(false);
        navigate(`/pedido-concluido?source=whatsapp`);
      }, 2000);

    } catch (apiError: any) {
      setIsSubmitting(false);
      const errorMessage = apiError.response?.data?.message || apiError.message || "Falha ao processar o pedido.";
      toast.error(errorMessage, { id: toastId });
    }
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
            <Button onClick={() => onOpenChange(false)}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4 pr-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-red-500" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl><Input placeholder="Seu nome e sobrenome" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl><Input placeholder="(XX) XXXXX-XXXX" type="tel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <SheetFooter className="flex flex-col gap-2 sm:flex-col mt-6">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="mr-2 h-4 w-4" />
                    )}
                    Finalizar via WhatsApp
                  </Button>
                  <Button variant="outline" onClick={clearCart} className="w-full">
                    Limpar Carrinho
                  </Button>
                </SheetFooter>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

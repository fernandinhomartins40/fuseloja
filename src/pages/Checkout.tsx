
import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, MessageSquare, ShoppingCart, Trash2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProvisionalUserForm } from '@/components/user/ProvisionalUserForm';
import { UserLoginForm } from '@/components/user/UserLoginForm';

const checkoutFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  whatsapp: z.string().min(10, { message: 'Número de WhatsApp inválido' }).max(15)
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout: React.FC = () => {
  const { items, subtotal, removeItem, updateQuantity, totalItems } = useCart();
  const { user, isAuthenticated } = useUser();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.name || '',
      whatsapp: user?.phone || ''
    }
  });

  // Update form when user logs in
  React.useEffect(() => {
    if (user) {
      form.setValue('name', user.name);
      form.setValue('whatsapp', user.phone || '');
    }
  }, [user, form]);

  const formatWhatsAppMessage = (formData: CheckoutFormValues) => {
    // Format the products list
    const productsText = items.map(item => 
      `🛒 Produto: ${item.title}
📦 Quantidade: ${item.quantity}
💲 Valor: R$${item.price.toLocaleString('pt-BR')} à vista cada
🔗 Link: ${window.location.origin}/produto/${item.id}
`
    ).join('\n');

    // Format the total and customer data
    const messageText = `Olá, gostaria de comprar os seguintes produtos:

${productsText}
📋 Dados Cliente:

👤 Nome: ${formData.name}
📱 WhatsApp: ${formData.whatsapp}

💰 Valor Total: R$${subtotal.toLocaleString('pt-BR')}`;

    // Encode the message for URL
    return encodeURIComponent(messageText);
  };

  const onSubmit = (data: CheckoutFormValues) => {
    const message = formatWhatsAppMessage(data);
    // WhatsApp business API URL
    const whatsappUrl = `https://wa.me/5542999140484?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Header />
      
      <div className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Seus Produtos</h2>
              <div className="bg-white rounded-md border">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link to={`/produto/${item.id}`} className="font-medium hover:text-destructive">
                        {item.title}
                      </Link>
                      <div className="text-destructive font-medium mt-1">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Seus Dados</h2>
                {!isAuthenticated && (
                  <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Entrar/Cadastrar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Entrar ou Criar Conta</DialogTitle>
                      </DialogHeader>
                      <UserLoginForm onSuccess={handleLoginSuccess} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {isAuthenticated && user?.isProvisional && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Você está usando uma conta provisória. 
                        <Link to="/perfil" className="underline ml-1">
                          Complete seu cadastro
                        </Link> para ter acesso completo.
                      </p>
                    </div>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
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
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full flex items-center gap-2"
                        >
                          <MessageSquare className="h-5 w-5" />
                          Finalizar via WhatsApp
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Produtos ({totalItems})</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-destructive">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Ao clicar em "Finalizar via WhatsApp", você será redirecionado para o WhatsApp 
                    para conversar diretamente com nossa equipe de vendas.
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                asChild
              >
                <Link to="/">
                  <ShoppingCart className="h-4 w-4" />
                  Continuar Comprando
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;

// Missing lucide-react imports
const MinusIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

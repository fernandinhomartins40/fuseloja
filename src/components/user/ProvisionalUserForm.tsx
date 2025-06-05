import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { ProvisionalUserData } from '@/types/user';

const provisionalUserSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  whatsapp: z.string().min(10, { message: 'WhatsApp deve ter pelo menos 10 dígitos' }).max(15),
  birthDate: z.string().regex(/^\d{8}$/, { message: 'Data deve estar no formato DDMMAAAA' }),
});

type ProvisionalUserFormValues = z.infer<typeof provisionalUserSchema>;

interface ProvisionalUserFormProps {
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export const ProvisionalUserForm: React.FC<ProvisionalUserFormProps> = ({ 
  onSuccess, 
  title = "Cadastro Rápido",
  description = "Preencha seus dados para finalizar a compra rapidamente"
}) => {
  const { createProvisionalUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProvisionalUserFormValues>({
    resolver: zodResolver(provisionalUserSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      birthDate: '',
    },
  });

  const onSubmit = async (data: ProvisionalUserFormValues) => {
    setIsLoading(true);
    try {
      // Now data is guaranteed to match ProvisionalUserData type
      await createProvisionalUser(data as ProvisionalUserData);
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatWhatsApp = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const formatBirthDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as DD/MM/AAAA
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
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
                    <Input 
                      placeholder="(00) 00000-0000"
                      value={formatWhatsApp(field.value)}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="DD/MM/AAAA"
                      value={formatBirthDate(field.value)}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Sua data de nascimento será sua senha temporária
                  </p>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar Conta Rápida"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

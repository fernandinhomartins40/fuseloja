
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const phoneLoginSchema = z.object({
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }).max(15),
  birthDate: z.string().regex(/^\d{8}$/, { message: 'Data deve estar no formato DDMMAAAA' }),
});

type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;

interface PhoneLoginFormProps {
  onSuccess?: () => void;
}

export const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({ onSuccess }) => {
  const { phoneLogin } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: '',
      birthDate: '',
    },
  });

  const onSubmit = async (data: PhoneLoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await phoneLogin(data.phone, data.birthDate);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (value: string) => {
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
        <CardTitle>Entrar com Telefone</CardTitle>
        <CardDescription>
          Use seu telefone e data de nascimento para entrar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone/WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(00) 00000-0000"
                      value={formatPhone(field.value)}
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
                  <FormLabel>Data de Nascimento (Senha)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="DD/MM/AAAA"
                      value={formatBirthDate(field.value)}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { AccountUpgradeData } from '@fuseloja/types';
import { Eye, EyeOff } from 'lucide-react';

const accountUpgradeSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  cpf: z.string().regex(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos' }),
  newPassword: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type AccountUpgradeFormValues = z.infer<typeof accountUpgradeSchema>;

interface AccountUpgradeFormProps {
  onSuccess?: () => void;
}

export const AccountUpgradeForm: React.FC<AccountUpgradeFormProps> = ({ onSuccess }) => {
  const { upgradeAccount } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<AccountUpgradeFormValues>({
    resolver: zodResolver(accountUpgradeSchema),
    defaultValues: {
      email: '',
      cpf: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AccountUpgradeFormValues) => {
    setIsLoading(true);
    try {
      const upgradeData: AccountUpgradeData = {
        email: data.email,
        cpf: data.cpf,
        newPassword: data.newPassword,
      };
      
      const success = await upgradeAccount(upgradeData);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XXX.XXX.XXX-XX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completar Cadastro</CardTitle>
        <CardDescription>
          Complete seus dados para ter acesso completo à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu.email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="000.000.000-00"
                      value={formatCPF(field.value)}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="Digite sua nova senha" 
                        type={showPassword ? "text" : "password"}
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="Confirme sua nova senha" 
                        type={showConfirmPassword ? "text" : "password"}
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Atualizando conta..." : "Completar Cadastro"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

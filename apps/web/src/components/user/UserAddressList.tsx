
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useUser } from '@/contexts/UserContext';
import { UserAddressForm } from './UserAddressForm';
import { UserAddress } from '@fuseloja/types';

export const UserAddressList: React.FC = () => {
  const { user, removeAddress, setDefaultAddress } = useUser();
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const addresses = user?.addresses || [];

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
  };

  const handleEditStart = (address: UserAddress) => {
    setEditingAddress(address);
  };

  const handleEditEnd = () => {
    setEditingAddress(null);
  };

  const handleAddStart = () => {
    setAddingNew(true);
  };

  const handleAddEnd = () => {
    setAddingNew(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Meus Endereços</h2>
        <Button onClick={handleAddStart} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Endereço
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Você não possui endereços cadastrados</p>
          <Button onClick={handleAddStart} className="mt-2">
            Adicionar Endereço
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {address.street}, {address.number}
                      {address.complement && `, ${address.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.neighborhood}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city} - {address.state}, {address.zipCode}
                    </p>
                    {address.isDefault && (
                      <Badge variant="outline" className="mt-2">Padrão</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditStart(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover endereço</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover este endereço? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeAddress(address.id)}>
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                {!address.isDefault && (
                  <Button 
                    variant="link" 
                    className="mt-2 p-0 h-auto" 
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Definir como padrão
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit address dialog */}
      <Dialog open={editingAddress !== null} onOpenChange={(open) => !open && handleEditEnd()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Endereço</DialogTitle>
            <DialogDescription>
              Atualize as informações do endereço abaixo.
            </DialogDescription>
          </DialogHeader>
          {editingAddress && (
            <UserAddressForm 
              address={editingAddress} 
              onCancel={handleEditEnd} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add new address dialog */}
      <Dialog open={addingNew} onOpenChange={(open) => !open && handleAddEnd()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Endereço</DialogTitle>
            <DialogDescription>
              Adicione um novo endereço ao seu cadastro.
            </DialogDescription>
          </DialogHeader>
          <UserAddressForm onCancel={handleAddEnd} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

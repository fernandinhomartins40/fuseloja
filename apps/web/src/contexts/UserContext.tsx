import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, initialUser, UserAddress, UserPreferences, ProvisionalUserData, AccountUpgradeData } from '@fuseloja/types';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  phoneLogin: (phone: string, birthDate: string) => Promise<boolean>;
  createProvisionalUser: (data: ProvisionalUserData) => Promise<User>;
  upgradeAccount: (upgradeData: AccountUpgradeData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // For backward compatibility, use the auth hook's user state
  const user = auth.user;
  const isAuthenticated = auth.isAuthenticated;

  // Delegate to auth hook
  const login = auth.login;

  // Delegate to auth hook
  const phoneLogin = auth.phoneLogin;

  // Delegate to auth hook
  const createProvisionalUser = auth.createProvisionalUser;

  // Delegate to auth hook
  const upgradeAccount = auth.upgradeAccount;

  // Delegate to auth hook (convert to non-async for compatibility)
  const logout = () => {
    auth.logout();
  };

  // Delegate to auth hook (convert to non-async for compatibility)
  const updateProfile = (userData: Partial<User>) => {
    auth.updateProfile(userData);
  };

  // Add a new address (keep local logic for compatibility)
  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (user) {
      const newAddress = {
        ...address,
        id: `addr${Date.now().toString()}`
      };
      
      // If this is the first address or marked as default, ensure it's the only default
      let updatedAddresses = [...user.addresses];
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      // If it's the first address, make it default anyway
      if (updatedAddresses.length === 0) {
        newAddress.isDefault = true;
      }
      
      updatedAddresses.push(newAddress);
      
      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
        updatedAt: new Date()
      };
      
      // Update through auth hook to maintain consistency
      auth.updateProfile(updatedUser);
      toast.success("Endereço adicionado com sucesso!");
    }
  };

  // Update an existing address
  const updateAddress = (id: string, addressData: Partial<UserAddress>) => {
    if (user) {
      let updatedAddresses = [...user.addresses];
      
      // If setting as default, update all others
      if (addressData.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }));
      } else {
        // Update the specific address
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === id ? { ...addr, ...addressData } : addr
        );
      }
      
      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
        updatedAt: new Date()
      };
      
      auth.updateProfile(updatedUser);
      toast.success("Endereço atualizado com sucesso!");
    }
  };

  // Remove an address
  const removeAddress = (id: string) => {
    if (user) {
      let updatedAddresses = user.addresses.filter(addr => addr.id !== id);
      
      // If the default address was removed, make the first one default
      if (user.addresses.find(addr => addr.id === id)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
        updatedAt: new Date()
      };
      
      auth.updateProfile(updatedUser);
      toast.success("Endereço removido com sucesso!");
    }
  };

  // Set an address as default
  const setDefaultAddress = (id: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      
      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
        updatedAt: new Date()
      };
      
      auth.updateProfile(updatedUser);
      toast.success("Endereço padrão atualizado!");
    }
  };

  // Update user preferences
  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences,
          notifications: {
            ...user.preferences.notifications,
            ...preferences.notifications
          }
        },
        updatedAt: new Date()
      };
      
      auth.updateProfile(updatedUser);
      toast.success("Preferências atualizadas com sucesso!");
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      login,
      phoneLogin,
      createProvisionalUser,
      upgradeAccount,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      updatePreferences
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

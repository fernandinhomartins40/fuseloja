
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, initialUser, UserAddress, UserPreferences } from '@/types/user';
import { toast } from '@/components/ui/sonner';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Convert string dates back to Date objects
      if (parsedUser.createdAt) parsedUser.createdAt = new Date(parsedUser.createdAt);
      if (parsedUser.updatedAt) parsedUser.updatedAt = new Date(parsedUser.updatedAt);
      parsedUser.orders = parsedUser.orders.map((order: any) => ({
        ...order,
        date: new Date(order.date),
      }));
      
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Mock login function - in a real app this would make an API request
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation (in a real app, this would be handled by the server)
    if (email === "joao.silva@example.com" && password === "password") {
      setUser(initialUser);
      setIsAuthenticated(true);
      toast.success("Login realizado com sucesso!");
      return true;
    } else {
      toast.error("Email ou senha incorretos");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.success("Logout realizado com sucesso");
  };

  // Update profile information
  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date()
      };
      setUser(updatedUser);
      toast.success("Perfil atualizado com sucesso!");
    }
  };

  // Add a new address
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
      
      setUser(updatedUser);
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
      
      setUser(updatedUser);
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
      
      setUser(updatedUser);
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
      
      setUser(updatedUser);
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
      
      setUser(updatedUser);
      toast.success("Preferências atualizadas com sucesso!");
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      login,
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

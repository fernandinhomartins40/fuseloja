import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, initialUser, UserAddress, UserPreferences, ProvisionalUserData, AccountUpgradeData } from '@/types/user';
import { toast } from '@/components/ui/sonner';

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

  // Phone login for provisional users
  const phoneLogin = async (phone: string, birthDate: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for existing provisional users in localStorage
    const storedUsers = localStorage.getItem('provisionalUsers');
    const provisionalUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = provisionalUsers.find((u: User) => 
      u.phone === phone && u.birthDate === birthDate && u.isProvisional
    );
    
    if (foundUser) {
      // Convert string dates back to Date objects
      if (foundUser.createdAt) foundUser.createdAt = new Date(foundUser.createdAt);
      if (foundUser.updatedAt) foundUser.updatedAt = new Date(foundUser.updatedAt);
      foundUser.orders = foundUser.orders.map((order: any) => ({
        ...order,
        date: new Date(order.date),
      }));
      
      setUser(foundUser);
      setIsAuthenticated(true);
      toast.success("Login realizado com sucesso!");
      return true;
    } else {
      toast.error("Usuário não encontrado ou dados incorretos");
      return false;
    }
  };

  // Create provisional user
  const createProvisionalUser = async (data: ProvisionalUserData): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: `provisional_${Date.now()}`,
      name: data.name,
      email: '', // Empty for provisional users
      phone: data.whatsapp,
      birthDate: data.birthDate,
      addresses: [],
      preferences: {
        newsletter: false,
        marketing: false,
        notifications: {
          orders: true,
          promotions: false,
          news: false
        }
      },
      orders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isProvisional: true
    };

    // Store provisional user separately
    const storedUsers = localStorage.getItem('provisionalUsers');
    const provisionalUsers = storedUsers ? JSON.parse(storedUsers) : [];
    provisionalUsers.push(newUser);
    localStorage.setItem('provisionalUsers', JSON.stringify(provisionalUsers));

    setUser(newUser);
    setIsAuthenticated(true);
    toast.success("Cadastro provisório criado com sucesso!");
    
    return newUser;
  };

  // Upgrade provisional account to full account
  const upgradeAccount = async (upgradeData: AccountUpgradeData): Promise<boolean> => {
    if (!user || !user.isProvisional) {
      toast.error("Apenas contas provisórias podem ser atualizadas");
      return false;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const upgradedUser: User = {
      ...user,
      email: upgradeData.email,
      cpf: upgradeData.cpf,
      isProvisional: false,
      updatedAt: new Date()
    };

    // Remove from provisional users and add to regular users
    const storedProvisionalUsers = localStorage.getItem('provisionalUsers');
    if (storedProvisionalUsers) {
      const provisionalUsers = JSON.parse(storedProvisionalUsers);
      const filteredUsers = provisionalUsers.filter((u: User) => u.id !== user.id);
      localStorage.setItem('provisionalUsers', JSON.stringify(filteredUsers));
    }

    setUser(upgradedUser);
    toast.success("Conta atualizada com sucesso!");
    return true;
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

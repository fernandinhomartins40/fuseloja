import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { ApiUser, LoginRequest, RegisterRequest } from '@/types/api';
import { User, ProvisionalUserData, AccountUpgradeData } from '@/types/user';

interface UseAuthReturn {
  user: User | null;
  apiUser: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  createProvisionalUser: (data: ProvisionalUserData) => Promise<User>;
  upgradeAccount: (upgradeData: AccountUpgradeData) => Promise<boolean>;
  phoneLogin: (phone: string, birthDate: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Helper function to convert API user to local user format
const convertApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    email: apiUser.email,
    phone: '', // Will be populated from profile
    birthDate: '', // Will be populated from profile
    addresses: [], // Will be populated from profile
    preferences: {
      newsletter: false,
      marketing: false,
      notifications: {
        orders: true,
        promotions: false,
        news: false
      }
    },
    orders: [], // Will be populated from profile
    createdAt: new Date(apiUser.createdAt),
    updatedAt: new Date(apiUser.updatedAt),
    isProvisional: false,
    cpf: undefined,
    role: apiUser.role // Add role field
  };
};

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          
          if (currentUser) {
            setApiUser(currentUser);
            
            // Try to refresh profile from server
            try {
              const freshProfile = await authService.getProfile();
              setApiUser(freshProfile);
              setUser(convertApiUserToUser(freshProfile));
            } catch (error) {
              // If refresh fails, use cached user
              setUser(convertApiUserToUser(currentUser));
            }
          }
        } else {
          // Check for provisional users in localStorage
          const storedUser = localStorage.getItem('user');
          
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.isProvisional) {
                setUser(parsedUser);
              }
            } catch (error) {
              console.warn('Error parsing stored user:', error);
            }
          }
        }
      } catch (error) {
        console.warn('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      setApiUser(response.user);
      setUser(convertApiUserToUser(response.user));
      
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erro ao fazer login');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      setApiUser(response.user);
      setUser(convertApiUserToUser(response.user));
      
      toast.success('Conta criada com sucesso!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      setApiUser(null);
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      console.warn('Error during logout:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setApiUser(null);
    }
  }, []);

  // Keep provisional user functionality for backward compatibility
  const createProvisionalUser = useCallback(async (data: ProvisionalUserData): Promise<User> => {
    const newUser: User = {
      id: `provisional_${Date.now()}`,
      name: data.name,
      email: '',
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
    toast.success('Cadastro provisório criado com sucesso!');
    
    return newUser;
  }, []);

  const upgradeAccount = useCallback(async (upgradeData: AccountUpgradeData): Promise<boolean> => {
    if (!user || !user.isProvisional) {
      toast.error('Apenas contas provisórias podem ser atualizadas');
      return false;
    }

    try {
      // Register the provisional user as a full user
      const success = await register({
        email: upgradeData.email,
        password: 'temp_password', // This should be handled differently
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' ') || 'User'
      });

      if (success) {
        // Remove from provisional users
        const storedProvisionalUsers = localStorage.getItem('provisionalUsers');
        if (storedProvisionalUsers) {
          const provisionalUsers = JSON.parse(storedProvisionalUsers);
          const filteredUsers = provisionalUsers.filter((u: User) => u.id !== user.id);
          localStorage.setItem('provisionalUsers', JSON.stringify(filteredUsers));
        }

        toast.success('Conta atualizada com sucesso!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar conta');
      return false;
    }
  }, [user, register]);

  const phoneLogin = useCallback(async (phone: string, birthDate: string): Promise<boolean> => {
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
      toast.success('Login realizado com sucesso!');
      return true;
    } else {
      toast.error('Usuário não encontrado ou dados incorretos');
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      if (user.isProvisional) {
        // Update provisional user locally
        const updatedUser = {
          ...user,
          ...userData,
          updatedAt: new Date()
        };
        setUser(updatedUser);
        
        // Update in localStorage
        const storedUsers = localStorage.getItem('provisionalUsers');
        if (storedUsers) {
          const provisionalUsers = JSON.parse(storedUsers);
          const updatedUsers = provisionalUsers.map((u: User) => 
            u.id === user.id ? updatedUser : u
          );
          localStorage.setItem('provisionalUsers', JSON.stringify(updatedUsers));
        }
        
        toast.success('Perfil atualizado com sucesso!');
      } else if (apiUser) {
        // Update through API
        const updatedApiUser = await authService.updateProfile({
          firstName: userData.name?.split(' ')[0],
          lastName: userData.name?.split(' ').slice(1).join(' '),
          phone: userData.phone,
          birthDate: userData.birthDate
        });
        
        setApiUser(updatedApiUser);
        setUser(convertApiUserToUser(updatedApiUser));
        toast.success('Perfil atualizado com sucesso!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    }
  }, [user, apiUser]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!authService.isAuthenticated()) return;

    try {
      const freshProfile = await authService.getProfile();
      setApiUser(freshProfile);
      setUser(convertApiUserToUser(freshProfile));
    } catch (error: any) {
      console.warn('Error refreshing profile:', error);
    }
  }, []);

  const isAuthenticated = !!(user || apiUser);

  return {
    user,
    apiUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    createProvisionalUser,
    upgradeAccount,
    phoneLogin,
    updateProfile,
    refreshProfile
  };
};

export default useAuth;
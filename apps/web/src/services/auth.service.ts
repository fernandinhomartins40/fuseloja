import apiClient from './api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  ApiUser,
  UpdateProfileRequest
} from '@fuseloja/types';

export class AuthService {
  
  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store tokens with correct key names
      localStorage.setItem('token', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update apiClient tokens
      apiClient.setTokens(
        response.data.tokens.accessToken, 
        response.data.tokens.refreshToken
      );
    }
    
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
    
    if (response.success && response.data) {
      // Store tokens with correct key names
      localStorage.setItem('token', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update apiClient tokens
      apiClient.setTokens(
        response.data.tokens.accessToken, 
        response.data.tokens.refreshToken
      );
    }
    
    return response.data!;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('Error during logout:', error);
    } finally {
      // Clear all local data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('storeSettings');
      localStorage.removeItem('provisionalUsers');
      apiClient.clearTokens();
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken
    });

    if (response.success && response.data) {
      // Store tokens with correct key names
      localStorage.setItem('token', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      
      // Update apiClient tokens
      apiClient.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }

    return response.data!;
  }

  // Profile methods
  async getProfile(): Promise<ApiUser> {
    const response = await apiClient.get<{ user: ApiUser }>('/auth/me');
    
    if (response.success && response.data) {
      // Update local user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }
    
    throw new Error('Failed to get profile');
  }

  async updateProfile(userData: UpdateProfileRequest): Promise<ApiUser> {
    const response = await apiClient.put<{ user: ApiUser }>('/auth/me', userData);
    
    if (response.success && response.data) {
      // Update local user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }
    
    throw new Error('Failed to update profile');
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    const response = await apiClient.post('/auth/change-password', passwordData);
    
    if (!response.success) {
      throw new Error('Failed to change password');
    }
  }

  // Password reset methods
  async forgotPassword(email: string): Promise<void> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    
    if (!response.success) {
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword
    });
    
    if (!response.success) {
      throw new Error('Failed to reset password');
    }
  }

  // Email verification methods
  async verifyEmail(userId: string, token: string): Promise<void> {
    const response = await apiClient.post('/auth/verify-email', {
      userId,
      token
    });
    
    if (!response.success) {
      throw new Error('Failed to verify email');
    }
  }

  async resendVerification(email: string): Promise<void> {
    const response = await apiClient.post('/auth/resend-verification', { email });
    
    if (!response.success) {
      throw new Error('Failed to resend verification email');
    }
  }

  // Token validation
  async validateToken(token: string): Promise<ApiUser | null> {
    try {
      const response = await apiClient.post<{ valid: boolean; user: ApiUser }>('/auth/validate', {
        token
      });
      
      if (response.success && response.data?.valid) {
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  // Utility methods
  // Authentication status check
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    try {
      // Simple JWT expiry check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      return payload.exp > now;
    } catch (error) {
      console.warn('Error checking token validity:', error);
      return false;
    }
  }

  getCurrentUser(): ApiUser | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.warn('Error parsing user from localStorage:', error);
      return null;
    }
  }

  getAccessToken(): string | null {
    return apiClient.getAccessToken();
  }

  // Check email availability
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ available: boolean }>(`/auth/check-email/${email}`);
      return response.data?.available ?? false;
    } catch (error) {
      return false;
    }
  }

  // Session management
  async getSessions(): Promise<any[]> {
    const response = await apiClient.get<{ sessions: any[] }>('/auth/sessions');
    return response.data?.sessions ?? [];
  }

  async logoutAll(): Promise<void> {
    const response = await apiClient.post('/auth/logout-all');
    
    if (response.success) {
      // Clear local data but don't redirect (user initiated action)
      apiClient.clearTokens();
      localStorage.removeItem('user');
    }
  }

  // Security methods
  async getSecurityEvents(): Promise<any[]> {
    const response = await apiClient.get<{ events: any[] }>('/auth/security-events');
    return response.data?.events ?? [];
  }

  async reportSuspiciousActivity(description: string, type: string): Promise<void> {
    await apiClient.post('/auth/report-suspicious', {
      description,
      type
    });
  }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;
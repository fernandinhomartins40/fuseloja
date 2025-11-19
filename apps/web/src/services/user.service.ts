import apiClient from './api';
import { ApiUser, UpdateProfileRequest } from '@/types/api';

export class UserService {
  
  // Profile management
  async getProfile(): Promise<ApiUser> {
    const response = await apiClient.get<{ user: ApiUser }>('/auth/me');
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    throw new Error('Failed to get user profile');
  }

  async updateProfile(userData: UpdateProfileRequest): Promise<ApiUser> {
    const response = await apiClient.put<{ user: ApiUser }>('/auth/me', userData);
    
    if (response.success && response.data) {
      // Update local storage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }
    
    throw new Error('Failed to update profile');
  }

  // Address management (for future implementation)
  async getAddresses(): Promise<any[]> {
    // This would be implemented when address endpoints are available in backend
    const response = await apiClient.get('/user/addresses');
    return response.data?.addresses ?? [];
  }

  async addAddress(addressData: any): Promise<any> {
    const response = await apiClient.post('/user/addresses', addressData);
    return response.data?.address;
  }

  async updateAddress(addressId: string, addressData: any): Promise<any> {
    const response = await apiClient.put(`/user/addresses/${addressId}`, addressData);
    return response.data?.address;
  }

  async removeAddress(addressId: string): Promise<void> {
    await apiClient.delete(`/user/addresses/${addressId}`);
  }

  async setDefaultAddress(addressId: string): Promise<void> {
    await apiClient.patch(`/user/addresses/${addressId}/default`);
  }

  // Preferences management
  async getPreferences(): Promise<any> {
    const response = await apiClient.get('/user/preferences');
    return response.data?.preferences;
  }

  async updatePreferences(preferences: any): Promise<any> {
    const response = await apiClient.put('/user/preferences', preferences);
    return response.data?.preferences;
  }

  // Order history (for future implementation)
  async getOrderHistory(): Promise<any[]> {
    const response = await apiClient.get('/user/orders');
    return response.data?.orders ?? [];
  }

  async getOrder(orderId: string): Promise<any> {
    const response = await apiClient.get(`/user/orders/${orderId}`);
    return response.data?.order;
  }

  // Avatar/Profile image
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.upload('/user/avatar', formData);
    
    if (response.success && response.data) {
      return response.data.avatarUrl;
    }
    
    throw new Error('Failed to upload avatar');
  }

  async removeAvatar(): Promise<void> {
    await apiClient.delete('/user/avatar');
  }

  // Notification preferences
  async getNotificationSettings(): Promise<any> {
    const response = await apiClient.get('/user/notification-settings');
    return response.data?.settings;
  }

  async updateNotificationSettings(settings: any): Promise<any> {
    const response = await apiClient.put('/user/notification-settings', settings);
    return response.data?.settings;
  }

  // Privacy settings
  async getPrivacySettings(): Promise<any> {
    const response = await apiClient.get('/user/privacy-settings');
    return response.data?.settings;
  }

  async updatePrivacySettings(settings: any): Promise<any> {
    const response = await apiClient.put('/user/privacy-settings', settings);
    return response.data?.settings;
  }

  // Account deletion
  async requestAccountDeletion(): Promise<void> {
    await apiClient.post('/user/request-deletion');
  }

  async cancelAccountDeletion(): Promise<void> {
    await apiClient.post('/user/cancel-deletion');
  }

  // Two-factor authentication (for future implementation)
  async enableTwoFactor(): Promise<{ qrCode: string; backupCodes: string[] }> {
    const response = await apiClient.post('/user/2fa/enable');
    return response.data;
  }

  async disableTwoFactor(code: string): Promise<void> {
    await apiClient.post('/user/2fa/disable', { code });
  }

  async verifyTwoFactor(code: string): Promise<boolean> {
    const response = await apiClient.post('/user/2fa/verify', { code });
    return response.data?.verified ?? false;
  }

  // Export user data (GDPR compliance)
  async exportUserData(): Promise<Blob> {
    const response = await apiClient.get('/user/export-data', {
      responseType: 'blob'
    });
    
    return new Blob([response.data], { type: 'application/json' });
  }
}

// Create singleton instance
export const userService = new UserService();
export default userService;
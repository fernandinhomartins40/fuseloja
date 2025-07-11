import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { ApiResponse, ApiErrorResponse, JwtPayload } from '@/types/api';

// Extend AxiosRequestConfig to include metadata
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Dynamic API base URL based on environment
const getApiBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // In development mode, always use localhost
  if (import.meta.env.DEV || import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }
  
  // Production - use same domain but port 3000
  if (hostname.includes('fuseloja.com.br')) {
    const baseHost = hostname.replace('www.', '');
    return `${protocol}//${baseHost}:3000`;
  }
  
  // Local development fallback
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // Fallback to same origin with port 3000
  return `${protocol}//${hostname}:3000`;
};

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing: boolean = false;
  private failedQueue: any[] = [];
  private baseURL: string;

  constructor() {
    this.baseURL = getApiBaseUrl();
    const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api/v1';
    
    console.log('🔗 API Base URL:', this.baseURL + apiPrefix);
    
    this.client = axios.create({
      baseURL: this.baseURL + apiPrefix,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.loadTokensFromStorage();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token to requests
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${this.baseURL}/api/v1/auth/refresh`, {
        refreshToken: this.refreshToken
      });

      const { tokens } = response.data.data;
      this.setTokens(tokens.accessToken, tokens.refreshToken);
      return tokens.accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private handleApiError(error: AxiosError<ApiErrorResponse>) {
    const message = error.response?.data?.message || 
                   error.message || 
                   'Erro de conexão com o servidor';

    // Don't show error toast for 401 errors (handled by token refresh)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: message,
        data: error.response?.data
      });
    }
  }

  private loadTokensFromStorage() {
    try {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    } catch (error) {
      console.warn('Error loading tokens from localStorage:', error);
    }
  }

  private saveTokensToStorage() {
    try {
      if (this.accessToken) {
        localStorage.setItem('accessToken', this.accessToken);
      }
      if (this.refreshToken) {
        localStorage.setItem('refreshToken', this.refreshToken);
      }
    } catch (error) {
      console.warn('Error saving tokens to localStorage:', error);
    }
  }

  private clearTokensFromStorage() {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.warn('Error clearing tokens from localStorage:', error);
    }
  }

  // Public methods
  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.saveTokensToStorage();
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.clearTokensFromStorage();
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  public getTokenPayload(): JwtPayload | null {
    if (!this.accessToken) return null;

    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      return payload;
    } catch (error) {
      console.warn('Error parsing JWT payload:', error);
      return null;
    }
  }

  public logout() {
    this.clearTokens();
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  }

  // HTTP Methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Upload method for files
  public async upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  }

  // Get axios instance for advanced usage
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
import { useState, useCallback } from 'react';
import apiClient from '@/services/api';
import { ApiResponse } from '@/types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);
        
        if (response.success && response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
          return response.data;
        } else {
          const errorMessage = response.error || response.message || 'Erro desconhecido';
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Erro de conexão';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useGet<T = any>(url: string) {
  return useApi<T>(() => apiClient.get(url));
}

export function usePost<T = any>(url: string) {
  return useApi<T>((data: any) => apiClient.post(url, data));
}

export function usePut<T = any>(url: string) {
  return useApi<T>((data: any) => apiClient.put(url, data));
}

export function useDelete<T = any>(url: string) {
  return useApi<T>(() => apiClient.delete(url));
}

// Hook for file uploads
export function useUpload<T = any>(url: string) {
  return useApi<T>((formData: FormData) => apiClient.upload(url, formData));
}

// Hook with automatic loading state management
export function useApiWithState<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  immediate: boolean = false
) {
  const api = useApi<T>(apiFunction);
  
  const [hasExecuted, setHasExecuted] = useState(false);

  // Execute immediately if requested
  if (immediate && !hasExecuted && !api.loading) {
    setHasExecuted(true);
    api.execute();
  }

  return api;
}

// Hook for paginated data
export function usePaginatedApi<T = any>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<ApiResponse<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  }>>
) {
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const api = useApi(apiFunction);

  const loadPage = useCallback(
    async (page: number, limit: number = pagination.limit, ...args: any[]) => {
      try {
        const result = await api.execute(page, limit, ...args);
        
        if (result) {
          if (page === 1) {
            setAllData(result.data);
          } else {
            setAllData(prev => [...prev, ...result.data]);
          }
          setPagination(result.pagination);
        }
        
        return result;
      } catch (error) {
        throw error;
      }
    },
    [api, pagination.limit]
  );

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      return loadPage(pagination.page + 1);
    }
    return Promise.resolve(null);
  }, [loadPage, pagination.page, pagination.totalPages]);

  const refresh = useCallback(() => {
    setAllData([]);
    return loadPage(1);
  }, [loadPage]);

  const hasMore = pagination.page < pagination.totalPages;

  return {
    data: allData,
    pagination,
    loading: api.loading,
    error: api.error,
    loadPage,
    loadMore,
    refresh,
    hasMore,
    reset: () => {
      setAllData([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
      api.reset();
    },
  };
}

export default useApi;
// src/shared/api/index.ts
import { apiClient } from './apiClient';
import type { ApiResponse, RequestOptions } from './types';
import { tokenManager } from './tokenManager';

// Export everything from the shared API directory
export * from './apiClient';
export * from './types';
export * from './tokenManager';

// Create a default api instance for re-export
export { apiClient as default };

/**
 * Creates a service factory for a specific domain
 * This allows creating API service modules with a consistent pattern
 */
export function createApiService<T>(basePath: string) {
  return {
    // Generic CRUD operations
    getAll: async (options?: RequestOptions): Promise<T[]> => {
      const response = await apiClient.get<T[]>(basePath, options);
      if (response.error) throw response.error;
      return response.data || [];
    },
    
    getById: async (id: string | number, options?: RequestOptions): Promise<T> => {
      const response = await apiClient.get<T>(`${basePath}/${id}`, options);
      if (response.error) throw response.error;
      if (!response.data) throw new Error(`Resource not found with id: ${id}`);
      return response.data;
    },
    
    create: async (data: Partial<T>, options?: RequestOptions): Promise<T> => {
      const response = await apiClient.post<T>(basePath, data, options);
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to create resource');
      return response.data;
    },
    
    update: async (id: string | number, data: Partial<T>, options?: RequestOptions): Promise<T> => {
      const response = await apiClient.put<T>(`${basePath}/${id}`, data, options);
      if (response.error) throw response.error;
      if (!response.data) throw new Error(`Failed to update resource with id: ${id}`);
      return response.data;
    },
    
    delete: async (id: string | number, options?: RequestOptions): Promise<void> => {
      const response = await apiClient.delete<void>(`${basePath}/${id}`, options);
      if (response.error) throw response.error;
    },
    
    // Custom request helper
    request: async <R>(
      method: string, 
      endpoint: string, 
      data?: any, 
      options?: RequestOptions
    ): Promise<R> => {
      const fullEndpoint = endpoint.startsWith('/') 
        ? `${basePath}${endpoint}` 
        : `${basePath}/${endpoint}`;
        
      let response: ApiResponse<R>;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await apiClient.get<R>(fullEndpoint, options);
          break;
        case 'POST':
          response = await apiClient.post<R>(fullEndpoint, data, options);
          break;
        case 'PUT':
          response = await apiClient.put<R>(fullEndpoint, data, options);
          break;
        case 'PATCH':
          response = await apiClient.patch<R>(fullEndpoint, data, options);
          break;
        case 'DELETE':
          response = await apiClient.delete<R>(fullEndpoint, options);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      if (response.error) throw response.error;
      if (method.toUpperCase() !== 'DELETE' && !response.data) {
        throw new Error('No data returned from server');
      }
      
      return response.data as R;
    }
  };
}

/**
 * Get the current auth token with fallbacks
 */
export function getAuthToken(): string | null {
  return tokenManager.getToken() || 
    (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
}

/**
 * Authenticate all requests with the current token
 */
export function withAuth<T>(promise: Promise<T>): Promise<T> {
  // This is a simple pass-through for now, as the apiClient
  // already handles authentication. But having this function
  // can be useful for adding additional auth logic in the future.
  return promise;
}
// src/shared/api/apiFactory.ts
import { apiClient, ApiResponse, RequestOptions } from './apiClient';
import { tokenManager } from './tokenManager';
import { logger } from '@/shared/lib/logger';

/**
 * Creates a feature-specific API service
 * 
 * This factory function follows the pattern used in feature/auth
 * and provides a consistent way to create API services for each feature
 * 
 * @param basePath - The base path for all endpoints in this service
 * @param options - Advanced configuration options
 */
export function createApiService<T = any>(
  basePath: string,
  options: {
    requiresAuth?: boolean;
    errorHandler?: (error: any) => Error;
    responseHandler?: (data: any) => T;
  } = {}
) {
  const {
    requiresAuth = true,
    errorHandler = (error) => error instanceof Error ? error : new Error(String(error)),
    responseHandler = (data) => data as T
  } = options;

  // Base path normalization
  const normalizedBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  
  return {
    // Generic request method
    request: async <R = T>(
      endpoint: string,
      method: string = 'GET',
      data?: any,
      customOptions?: RequestOptions
    ): Promise<R> => {
      const fullEndpoint = endpoint.startsWith('/')
        ? `${normalizedBasePath}${endpoint}`
        : `${normalizedBasePath}/${endpoint}`;
      
      const defaultOptions: RequestOptions = {
        requiresAuth,
        autoRefreshToken: true,
      };
      
      try {
        let response: ApiResponse<R>;
        
        switch (method.toUpperCase()) {
          case 'GET':
            response = await apiClient.get<R>(fullEndpoint, {
              ...defaultOptions,
              ...customOptions
            });
            break;
          case 'POST':
            response = await apiClient.post<R>(
              fullEndpoint,
              data,
              { ...defaultOptions, ...customOptions }
            );
            break;
          case 'PUT':
            response = await apiClient.put<R>(
              fullEndpoint,
              data,
              { ...defaultOptions, ...customOptions }
            );
            break;
          case 'PATCH':
            response = await apiClient.patch<R>(
              fullEndpoint,
              data,
              { ...defaultOptions, ...customOptions }
            );
            break;
          case 'DELETE':
            response = await apiClient.delete<R>(
              fullEndpoint,
              { ...defaultOptions, ...customOptions }
            );
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        
        if (response.error) {
          throw errorHandler(response.error);
        }
        
        return response.data ? responseHandler(response.data) as R : {} as R;
      } catch (error) {
        logger.error(`API error for ${method} ${fullEndpoint}:`, {
          error: error instanceof Error ? error.message : String(error)
        });
        throw errorHandler(error);
      }
    },
    
    // Convenience methods
    get: async <R = T>(endpoint: string, options?: RequestOptions): Promise<R> => {
      return await module.request<R>(endpoint, 'GET', undefined, options);
    },
    
    post: async <R = T>(endpoint: string, data?: any, options?: RequestOptions): Promise<R> => {
      return await module.request<R>(endpoint, 'POST', data, options);
    },
    
    put: async <R = T>(endpoint: string, data?: any, options?: RequestOptions): Promise<R> => {
      return await module.request<R>(endpoint, 'PUT', data, options);
    },
    
    patch: async <R = T>(endpoint: string, data?: any, options?: RequestOptions): Promise<R> => {
      return await module.request<R>(endpoint, 'PATCH', data, options);
    },
    
    delete: async <R = T>(endpoint: string, options?: RequestOptions): Promise<R> => {
      return await module.request<R>(endpoint, 'DELETE', undefined, options);
    },
    
    // Advanced methods - similar pattern to what's used in auth feature
    getWithAuth: async <R = T>(endpoint: string): Promise<R> => {
      const token = tokenManager.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      return await module.get<R>(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    
    // Create resource collection helpers
    collection: (resourcePath: string = '') => {
      const resourceEndpoint = resourcePath ? 
        (resourcePath.startsWith('/') ? resourcePath : `/${resourcePath}`) : 
        '';
      
      return {
        findAll: async (queryParams?: Record<string, string>): Promise<T[]> => {
          let endpoint = resourceEndpoint;
          
          if (queryParams && Object.keys(queryParams).length > 0) {
            const params = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
              params.append(key, value);
            });
            endpoint = `${resourceEndpoint}?${params.toString()}`;
          }
          
          return await module.get<T[]>(endpoint);
        },
        
        findById: async (id: string | number): Promise<T> => {
          return await module.get<T>(`${resourceEndpoint}/${id}`);
        },
        
        create: async (data: Partial<T>): Promise<T> => {
          return await module.post<T>(resourceEndpoint, data);
        },
        
        update: async (id: string | number, data: Partial<T>): Promise<T> => {
          return await module.put<T>(`${resourceEndpoint}/${id}`, data);
        },
        
        patch: async (id: string | number, data: Partial<T>): Promise<T> => {
          return await module.patch<T>(`${resourceEndpoint}/${id}`, data);
        },
        
        remove: async (id: string | number): Promise<void> => {
          await module.delete(`${resourceEndpoint}/${id}`);
        }
      };
    }
  };
  
  // Self-reference for method chaining
  const module = this;
  
  return module;
}

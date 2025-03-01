import { apiClient } from './apiClient';
import type { RequestOptions, ApiResponse } from './apiClient';

/**
 * Interface for service methods
 */
export interface ApiService<T> {
  getAll: (options?: RequestOptions) => Promise<ApiResponse<T[]>>;
  getById: (id: string | number, options?: RequestOptions) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  update: (id: string | number, data: Partial<T>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  patch: (id: string | number, data: Partial<T>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  remove: (id: string | number, options?: RequestOptions) => Promise<ApiResponse<void>>;
}

/**
 * Create a service for interacting with a specific API resource
 * 
 * @param baseEndpoint The base endpoint for the resource (e.g., '/users')
 * @returns A service object with methods for common CRUD operations
 */
export function createApiService<T>(baseEndpoint: string): ApiService<T> {
  // Ensure the base endpoint has the correct format
  const endpoint = baseEndpoint.startsWith('/')
    ? baseEndpoint
    : `/${baseEndpoint}`;

  return {
    /**
     * Get all resources of this type
     */
    getAll: async (options?: RequestOptions): Promise<ApiResponse<T[]>> => {
      return apiClient.get<T[]>(endpoint, options);
    },

    /**
     * Get a resource by ID
     */
    getById: async (id: string | number, options?: RequestOptions): Promise<ApiResponse<T>> => {
      return apiClient.get<T>(`${endpoint}/${id}`, options);
    },

    /**
     * Create a new resource
     */
    create: async (data: Partial<T>, options?: RequestOptions): Promise<ApiResponse<T>> => {
      return apiClient.post<T>(endpoint, data, options);
    },

    /**
     * Update a resource (complete replacement)
     */
    update: async (id: string | number, data: Partial<T>, options?: RequestOptions): Promise<ApiResponse<T>> => {
      return apiClient.put<T>(`${endpoint}/${id}`, data, options);
    },

    /**
     * Partially update a resource
     */
    patch: async (id: string | number, data: Partial<T>, options?: RequestOptions): Promise<ApiResponse<T>> => {
      return apiClient.patch<T>(`${endpoint}/${id}`, data, options);
    },

    /**
     * Delete a resource
     */
    remove: async (id: string | number, options?: RequestOptions): Promise<ApiResponse<void>> => {
      return apiClient.delete<void>(`${endpoint}/${id}`, options);
    }
  };
}

/**
 * Create a service with custom methods
 * 
 * @param baseEndpoint The base endpoint for the resource
 * @param customMethods Object containing custom methods to add to the service
 * @returns A service object with standard CRUD and custom methods
 */
export function createExtendedApiService<T, TMethods>(
  baseEndpoint: string,
  customMethods: TMethods
): ApiService<T> & TMethods {
  const baseService = createApiService<T>(baseEndpoint);
  return { ...baseService, ...customMethods };
}

export default createApiService;

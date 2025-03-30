/**
 * Endpoint Utilities
 * 
 * This module provides utilities for creating and managing API endpoints
 * in a consistent way across the application.
 */
import { replaceUrlParams } from '../core/utils/urlUtils';

/**
 * Helper function to determine API paths based on environment variables
 * 
 * @param defaultPath The default API path
 * @returns The complete API path with proper prefix
 */
export const getApiBasePath = (defaultPath: string): string => {
  // If a custom base path is defined in env variables, use it
  const customBasePath = process.env.NEXT_PUBLIC_API_PATH_PREFIX || '/api';
  
  // If the custom path already ends with a slash or is empty, don't add another one
  const prefix = customBasePath.endsWith('/') || customBasePath === '' 
    ? customBasePath.slice(0, -1)
    : customBasePath;
    
  // Remove leading slash from defaultPath if prefix is not empty
  const cleanPath = defaultPath.startsWith('/') ? defaultPath.slice(1) : defaultPath;
  
  return `${prefix}/${cleanPath}`;
};

/**
 * Interface for endpoint definitions
 */
export interface EndpointDefinition {
  [key: string]: string | ((...args: any[]) => string);
}

/**
 * Creates a set of endpoint constants for a specific domain/feature
 * 
 * @param basePath The base path for the domain/feature
 * @param endpoints Optional additional endpoints to include
 * @returns An object with endpoint constants
 */
export function createEndpoints(
  basePath: string,
  endpoints: EndpointDefinition = {}
): EndpointDefinition {
  // Get the API base path with proper prefixing
  const BASE_URL = getApiBasePath(basePath);
  
  // Standard CRUD endpoints
  const standardEndpoints: EndpointDefinition = {
    BASE: BASE_URL,
    LIST: BASE_URL,
    DETAIL: (id: string | number) => `${BASE_URL}/${id}`,
    CREATE: BASE_URL,
    UPDATE: (id: string | number) => `${BASE_URL}/${id}`,
    PATCH: (id: string | number) => `${BASE_URL}/${id}`,
    DELETE: (id: string | number) => `${BASE_URL}/${id}`,
  };
  
  // Merge standard endpoints with custom endpoints
  return {
    ...standardEndpoints,
    ...endpoints
  };
}

/**
 * Builds a complete URL with path parameters replaced
 * 
 * @param endpoint The endpoint URL or function
 * @param params Parameters to replace in the URL
 * @returns The complete URL with parameters replaced
 */
export function buildEndpointUrl(
  endpoint: string | ((...args: any[]) => string),
  params?: Record<string, any>
): string {
  if (!endpoint) {
    throw new Error('Invalid endpoint: undefined or null');
  }
  
  // If endpoint is a function, call it with params
  const url = typeof endpoint === 'function' 
    ? endpoint(...Object.values(params || {}))
    : endpoint;
    
  // Replace path parameters in the URL
  return params ? replaceUrlParams(url, params) : url;
}

/**
 * Example usage of createEndpoints
 * 
 * ```typescript
 * // Create endpoints for users feature
 * const USER_ENDPOINTS = createEndpoints('users', {
 *   // Additional custom endpoints
 *   SEARCH: `${BASE_URL}/search`,
 *   BY_ROLE: (role: string) => `${BASE_URL}/role/${role}`,
 *   PROFILE: (userId: number) => `${BASE_URL}/${userId}/profile`,
 * });
 * 
 * // Usage:
 * USER_ENDPOINTS.LIST // '/api/users'
 * USER_ENDPOINTS.DETAIL(123) // '/api/users/123'
 * USER_ENDPOINTS.BY_ROLE('admin') // '/api/users/role/admin'
 * ```
 */

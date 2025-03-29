/**
 * OpenAPI Query Keys
 * 
 * This utility creates consistent query keys for OpenAPI-generated services.
 * It helps maintain cache consistency and provides type safety for query keys.
 */

import { QueryKey } from '@tanstack/react-query';

/**
 * Factory function to create a query key generator for a specific service
 * 
 * @param service - The service name
 * @returns An object with methods to create different types of query keys
 */
export function createOpenApiQueryKeys(service: string) {
  return {
    /**
     * Creates a query key for all entities of this service
     */
    all: (): QueryKey => [service],
    
    /**
     * Creates a query key for a list operation with optional filters
     */
    list: (filters?: Record<string, unknown>): QueryKey => 
      filters ? [service, 'list', filters] : [service, 'list'],
    
    /**
     * Creates a query key for a detail operation
     */
    detail: (id: string | number): QueryKey => [service, 'detail', id],
    
    /**
     * Creates a query key for a custom operation
     */
    custom: (operation: string, params?: Record<string, unknown>): QueryKey => 
      params ? [service, operation, params] : [service, operation],
  };
}

// Pre-created query keys for common services (based on the OpenAPI spec)
export const authKeys = createOpenApiQueryKeys('auth');
export const userKeys = createOpenApiQueryKeys('users');
export const productKeys = createOpenApiQueryKeys('products');

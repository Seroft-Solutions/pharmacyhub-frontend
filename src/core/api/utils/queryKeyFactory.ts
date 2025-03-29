/**
 * Query Key Factory
 * 
 * This module provides utilities for creating and managing query keys
 * in a consistent way across the application.
 */
import { QueryKey } from '@tanstack/react-query';

/**
 * Interface for a query key filter object
 */
export interface QueryKeyFilter {
  exact?: boolean;
  prefix?: boolean;
  predicate?: (queryKey: QueryKey) => boolean;
}

/**
 * Creates a query key factory for a specific domain/feature
 * 
 * @param domain The domain/feature for the query keys
 * @returns A factory function for creating query keys
 */
export function createQueryKeyFactory<T extends string>(domain: string) {
  // Return a factory function for creating query keys
  return {
    /**
     * Creates a query key for a specific entity type
     * 
     * @param entity The entity type
     * @returns A function for creating entity-specific query keys
     */
    all: () => [domain] as const,
    
    /**
     * Creates a query key for lists
     * 
     * @param filters Optional filters for the list
     * @returns A query key for lists
     */
    lists: (filters?: Record<string, any>) => 
      filters ? [domain, 'list', filters] as const : [domain, 'list'] as const,
    
    /**
     * Creates a query key for a specific entity
     * 
     * @param id The entity ID
     * @returns A query key for the entity
     */
    detail: (id: string | number) => [domain, 'detail', id] as const,
    
    /**
     * Creates a query key for a specific action
     * 
     * @param action The action name
     * @param params Optional parameters for the action
     * @returns A query key for the action
     */
    action: <P extends Record<string, any>>(action: T, params?: P) => 
      params ? [domain, action, params] as const : [domain, action] as const,
    
    /**
     * Creates a query key filter for invalidating queries
     * 
     * @param options Filter options
     * @returns A query key filter object
     */
    filter: (options: {
      exact?: boolean;
      prefix?: boolean;
      predicate?: (queryKey: QueryKey) => boolean;
    } = {}) => {
      // Default to prefix match
      if (Object.keys(options).length === 0) {
        options.prefix = true;
      }
      
      return {
        ...options,
        queryKey: [domain]
      };
    }
  };
}

/**
 * Example usage of the query key factory
 * 
 * ```typescript
 * // Create a query key factory for users
 * const userKeys = createQueryKeyFactory<'me' | 'permissions'>('users');
 * 
 * // Get all users
 * userKeys.all(); // ['users']
 * 
 * // Get a list of users with filters
 * userKeys.lists({ role: 'admin' }); // ['users', 'list', { role: 'admin' }]
 * 
 * // Get a specific user
 * userKeys.detail('123'); // ['users', 'detail', '123']
 * 
 * // Get current user
 * userKeys.action('me'); // ['users', 'me']
 * 
 * // Get user permissions
 * userKeys.action('permissions', { userId: '123' }); // ['users', 'permissions', { userId: '123' }]
 * 
 * // Invalidate all user queries
 * queryClient.invalidateQueries(userKeys.filter());
 * ```
 */

/**
 * Core API query keys
 */
export const apiKeys = {
  all: () => ['api'] as const,
  config: () => ['api', 'config'] as const,
  health: () => ['api', 'health'] as const,
  status: () => ['api', 'status'] as const,
};

/**
 * User query keys
 */
export const userKeys = createQueryKeyFactory<'me' | 'permissions' | 'profile'>('users');

/**
 * Auth query keys
 */
export const authKeys = createQueryKeyFactory<'session' | 'tokens' | 'login' | 'register'>('auth');
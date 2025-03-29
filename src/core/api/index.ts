/**
 * Core API Module
 * 
 * This module manages all API-related functionality for the application.
 * It provides tools for making API requests, handling responses, and
 * integrating with TanStack Query for state management.
 * 
 * Key features:
 * - API client configuration and customization
 * - Data fetching hooks with TanStack Query integration
 * - Request/response handling with proper error management
 * - Standardized API response types and interfaces
 * - Debugging utilities for API connectivity
 * 
 * Usage examples:
 * ```ts
 * // Using the API client directly
 * import { apiClient } from '@/core/api';
 * const response = await apiClient.get<UserData>('/users/me');
 * 
 * // Using hooks for data fetching
 * import { useApiQuery } from '@/core/api/hooks';
 * const { data, isLoading } = useApiQuery(['users', 'me'], '/users/me');
 * 
 * // Using hooks for mutations
 * import { useApiMutation } from '@/core/api/hooks';
 * const { mutate } = useApiMutation<UserData>('/users');
 * ```
 */

// Export core functionality
export { 
  apiClient, 
  createApiClient,
  queryClient,
  createQueryClient,
  defaultQueryErrorHandler
} from './core';

// Export components
export * from './components';

// Export hooks
export * from './hooks';

// Export services
export * from './services';

// Export types
export * from './types';

// Export utilities
export * from './utils';

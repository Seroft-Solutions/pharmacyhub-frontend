/**
 * Core API Module
 * 
 * This module handles all API-related functionality including:
 * - API client setup
 * - Data fetching utilities
 * - Request/response handling
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

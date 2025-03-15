/**
 * TanStack Query Client Configuration
 * 
 * This module provides a pre-configured QueryClient for TanStack Query
 * with optimal defaults for caching, retries, and error handling.
 */
import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiClient';

/**
 * Default error handler for query errors
 */
export const defaultQueryErrorHandler = (error: unknown) => {
  if (!error) return;

  // Handle API errors with more context
  if ((error as ApiError).status && (error as ApiError).data) {
    const apiError = error as ApiError;
    const errorData = apiError.data;
    
    console.error('[TanStack Query] API Error:', {
      status: apiError.status,
      data: errorData,
      message: errorData?.message || errorData?.error || `Request failed with status ${apiError.status}`
    });
    return;
  }

  // Generic error handling
  console.error('[TanStack Query] Error:', error instanceof Error ? error.message : 'An unexpected error occurred');
};

/**
 * Create a configured query client with optimized defaults
 */
export const createQueryClient = (options: {
  defaultStaleTime?: number;
  defaultGcTime?: number;
} = {}) => {
  const {
    defaultStaleTime = 5 * 60 * 1000, // 5 minutes
    defaultGcTime = 10 * 60 * 1000    // 10 minutes
  } = options;

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: defaultStaleTime,
        gcTime: defaultGcTime,
        retry: (failureCount, error) => {
          // Don't retry on 401, 403, or 404 errors
          if ((error as ApiError).status) {
            const status = (error as ApiError).status;
            if (status && [401, 403, 404].includes(status)) {
              return false;
            }
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        refetchOnMount: true,
      },
      mutations: {
        retry: (failureCount, error) => {
          // Only retry network-related errors, not 4xx/5xx responses
          if ((error as ApiError).status) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
};

/**
 * Default query client instance with common configuration
 */
export const queryClient = createQueryClient();

export default queryClient;

/**
 * TanStack Query Client Configuration
 * 
 * This module provides a pre-configured QueryClient for TanStack Query
 * with optimal defaults for caching, retries, and error handling.
 */
import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { ApiError } from './apiClient';

/**
 * Default error handler for query errors
 */
export const defaultQueryErrorHandler = (error: unknown) => {
  if (!error) return;
  
  // Extract error message
  const message = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';
  
  // Handle API errors with more context
  if ((error as ApiError).status && (error as ApiError).data) {
    const apiError = error as ApiError;
    const errorData = apiError.data;
    const errorMessage = 
      errorData?.message || 
      errorData?.error || 
      `Request failed with status ${apiError.status}`;
    
    toast({
      variant: 'destructive',
      title: 'API Error',
      description: errorMessage,
    });
    
    console.error('[TanStack Query] API Error:', {
      status: apiError.status,
      data: errorData
    });
    
    return;
  }
  
  // Generic error handling
  toast({
    variant: 'destructive',
    title: 'Error',
    description: message,
  });
  
  console.error('[TanStack Query] Error:', error);
};

/**
 * Create a configured query client with optimized defaults
 */
export const createQueryClient = (options: {
  defaultStaleTime?: number;
  defaultGcTime?: number;
  errorHandler?: (error: unknown) => void;
} = {}) => {
  const {
    defaultStaleTime = 5 * 60 * 1000, // 5 minutes
    defaultGcTime = 10 * 60 * 1000,   // 10 minutes
    errorHandler = defaultQueryErrorHandler
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
        onError: errorHandler,
      },
      mutations: {
        retry: (failureCount, error) => {
          // Only retry network-related errors, not 4xx/5xx responses
          if ((error as ApiError).status) {
            return false;
          }
          return failureCount < 2;
        },
        onError: errorHandler,
      },
    },
  });
};

/**
 * Default query client instance with common configuration
 */
export const queryClient = createQueryClient();

export default queryClient;

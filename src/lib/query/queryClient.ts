import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

// Define types for API errors
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

export interface ApiError extends Error {
  status?: number;
  data?: ApiErrorResponse;
}

/**
 * Default error handler for query errors
 */
export const defaultQueryErrorHandler = (error: unknown) => {
  const message = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';
  
  // Extract more detailed error info from API errors
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
    
    console.error('API Error:', {
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
  
  console.error('Query Error:', error);
};

/**
 * Create a configured query client with default options
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
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
        onError: defaultQueryErrorHandler,
      },
      mutations: {
        retry: (failureCount, error) => {
          // Only retry network-related errors, not 4xx/5xx responses
          if ((error as ApiError).status) {
            return false;
          }
          return failureCount < 2;
        },
        onError: defaultQueryErrorHandler,
      },
    },
  });
};

// Export a singleton query client for global use
export const queryClient = createQueryClient();

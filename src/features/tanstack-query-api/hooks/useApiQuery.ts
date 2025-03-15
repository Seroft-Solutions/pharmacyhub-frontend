/**
 * Custom hook for making API queries with TanStack Query
 * 
 * This hook simplifies creating queries with proper caching, error handling,
 * and automatic re-fetching behavior.
 */
import { 
  useQuery, 
  UseQueryOptions,
  QueryFunctionContext,
  QueryKey
} from '@tanstack/react-query';
import apiClient from '../core/apiClient';
import { logger } from '@/shared/lib/logger';

// Extended options type with our API-specific options
export interface UseApiQueryOptions<TData, TError = Error, TQueryFnData = TData> 
  extends Omit<UseQueryOptions<TData, TError, TQueryFnData, QueryKey>, 'queryKey' | 'queryFn'> {
  // API specific options
  headers?: Record<string, string>;
  params?: Record<string, any>;
  parseResponse?: (data: any) => TData;
}

/**
 * Hook for fetching data from an API endpoint with TanStack Query
 * 
 * @param queryKey Array query key for TanStack Query caching
 * @param endpoint API endpoint URL or function that returns URL
 * @param options Query options including API-specific options
 * @returns TanStack Query result with data, loading state, and error
 */
export function useApiQuery<TData = any, TError = Error, TQueryFnData = TData>(
  queryKey: QueryKey,
  endpoint: string | ((params: any) => string),
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { 
    headers,
    params,
    parseResponse,
    ...queryOptions
  } = options;

  return useQuery<TData, TError, TQueryFnData, QueryKey>({
    queryKey,
    queryFn: async ({ queryKey: currentQueryKey }: QueryFunctionContext<QueryKey>) => {
      try {
        // Determine the actual endpoint to call
        const actualEndpoint = typeof endpoint === 'function'
          ? endpoint(params)
          : endpoint;
          
        logger.debug(`Fetching data from ${actualEndpoint}`, { queryKey: currentQueryKey });
        
        // Make the API request
        const response = await apiClient.get(actualEndpoint, {
          headers,
          params
        });
        
        // Parse the response if a parser is provided
        const data = parseResponse ? parseResponse(response.data) : response.data;
        
        return data as TData;
      } catch (error) {
        logger.error(`API query error for ${typeof endpoint === 'function' ? 'dynamic endpoint' : endpoint}`, {
          error,
          queryKey: currentQueryKey
        });
        throw error;
      }
    },
    ...queryOptions
  });
}

export default useApiQuery;

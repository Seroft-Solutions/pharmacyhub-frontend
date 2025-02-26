import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';

interface UseApiQueryOptions<TResponse, TData = TResponse> extends 
  Omit<UseQueryOptions<TResponse, Error, TData>, 'queryKey' | 'queryFn'> {
  requiresAuth?: boolean;
}

interface UseApiMutationOptions<TData, TVariables> extends 
  Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> {
  requiresAuth?: boolean;
}

interface PaginationParams {
  page: number;
  pageSize: number;
}

export function useApiQuery<TResponse, TData = TResponse>(
  queryKey: Array<string | number>,
  endpoint: string,
  options: UseApiQueryOptions<TResponse, TData> = {}
) {
  const { requiresAuth = true, ...queryOptions } = options;

  return useQuery<TResponse, Error, TData>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<TResponse>(endpoint, { requiresAuth });
      if (response.error) {
        throw response.error;
      }
      return response.data as TResponse;
    },
    ...queryOptions
  });
}

export function useApiMutation<TData, TVariables = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TData, TVariables> = {}
) {
  const { requiresAuth = true, ...mutationOptions } = options;

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const response = await apiClient.post<TData>(endpoint, variables, { requiresAuth });
      if (response.error) {
        throw response.error;
      }
      return response.data as TData;
    },
    ...mutationOptions
  });
}

export function useApiPut<TData, TVariables = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TData, TVariables> = {}
) {
  const { requiresAuth = true, ...mutationOptions } = options;

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const response = await apiClient.put<TData>(endpoint, variables, { requiresAuth });
      if (response.error) {
        throw response.error;
      }
      return response.data as TData;
    },
    ...mutationOptions
  });
}

export function useApiDelete<TData>(
  endpoint: string,
  options: UseApiMutationOptions<TData, void> = {}
) {
  const { requiresAuth = true, ...mutationOptions } = options;

  return useMutation<TData, Error>({
    mutationFn: async () => {
      const response = await apiClient.delete<TData>(endpoint, { requiresAuth });
      if (response.error) {
        throw response.error;
      }
      return response.data as TData;
    },
    ...mutationOptions
  });
}

export function useApiPaginatedQuery<TResponse, TData = TResponse>(
  queryKey: Array<string | number>,
  endpoint: string,
  { page, pageSize }: PaginationParams,
  options: UseApiQueryOptions<TResponse, TData> = {}
) {
  const paginatedEndpoint = `${endpoint}?page=${page}&size=${pageSize}`;
  
  return useApiQuery<TResponse, TData>(
    [...queryKey, `page-${page}`, `size-${pageSize}`],
    paginatedEndpoint,
    options
  );
}

export function useApiInfiniteQuery<TResponse, TData = TResponse>(
  queryKey: Array<string | number>,
  endpoint: string,
  options: UseApiQueryOptions<TResponse, TData> = {}
) {
  const { requiresAuth = true, ...queryOptions } = options;

  return useQuery<TResponse, Error, TData>({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<TResponse>(
        `${endpoint}?page=${pageParam}`,
        { requiresAuth }
      );
      if (response.error) {
        throw response.error;
      }
      return response.data as TResponse;
    },
    ...queryOptions
  });
}
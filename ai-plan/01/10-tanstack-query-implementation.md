# Task 10: Implement TanStack Query for API State

## Description
Implement TanStack Query (React Query) for managing server state throughout the application, focusing on the core/api module and ensuring proper data fetching patterns.

## Implementation Steps

1. **Current API State Audit**
   - Review current API data fetching approaches
   - Identify patterns that need to be converted to TanStack Query
   - Map out data dependencies
   - Identify caching requirements

2. **Query Client Setup**
   - Set up the QueryClient with proper defaults
   - Configure default stale times, cache times, retry logic
   - Set up React Query DevTools for development
   - Create a QueryClientProvider

3. **Core Query Hooks Implementation**
   - Create base query hooks for common API operations
   - Implement proper error handling
   - Add loading and error states
   - Implement proper typing
   - Create utilities for pagination, infinite loading, etc.

4. **Query Key Management**
   - Design a consistent query key structure
   - Implement query key factories
   - Document query key patterns

5. **Mutation Hooks Implementation**
   - Create base mutation hooks for data modification
   - Implement optimistic updates where appropriate
   - Add proper error handling and rollback
   - Implement cache invalidation strategies

6. **Integration with Existing API Client**
   - Ensure TanStack Query works with the existing API client
   - Standardize error handling between both
   - Create adapter patterns if needed

7. **Documentation**
   - Document the TanStack Query implementation
   - Create examples of query and mutation hook usage
   - Document caching strategies
   - Update README.md files

## Implementation Examples

### Query Client Setup Example

```typescript
// core/api/client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Base Query Hook Example

```typescript
// core/api/hooks/useQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

export function useApiQuery<TData>(
  endpoint: string,
  queryKey: unknown[],
  options?: UseQueryOptions<TData>
) {
  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<TData>(endpoint);
      return data;
    },
    ...options,
  });
}
```

### Product Query Example

```typescript
// features/products/api/productQueries.ts
import { useApiQuery } from '@/core/api/hooks/useQuery';
import { Product } from '../types';

export const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (filters: string) => [...productsKeys.lists(), { filters }] as const,
  details: () => [...productsKeys.all, 'detail'] as const,
  detail: (id: string) => [...productsKeys.details(), id] as const,
};

export function useProductsQuery(filters: string = '') {
  return useApiQuery<Product[]>(
    `/products?${filters}`,
    productsKeys.list(filters)
  );
}

export function useProductQuery(id: string) {
  return useApiQuery<Product>(
    `/products/${id}`,
    productsKeys.detail(id),
    {
      enabled: !!id,
    }
  );
}
```

## Verification Criteria
- TanStack Query properly implemented
- QueryClient configured with appropriate defaults
- Query hooks created for common operations
- Mutation hooks created for data modifications
- Proper typing for all hooks
- Good performance through proper caching
- Clear documentation

## Time Estimate
Approximately 2-3 days

## Dependencies
- Task 02: Migrate app-api-handler to core/api
- Task 06: Refactor core/api components

## Risks
- May require significant refactoring of components that use API data
- Caching behavior changes may affect application state
- May require coordination with backend for optimized API endpoints

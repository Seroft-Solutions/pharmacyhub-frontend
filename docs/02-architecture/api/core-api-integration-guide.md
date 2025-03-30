# Core API Integration Guide

## Table of Contents

- [Introduction](#introduction)
- [Core API Module Structure](#core-api-module-structure)
- [Integration Patterns](#integration-patterns)
  - [Query Hooks Implementation](#query-hooks-implementation)
  - [Mutation Hooks Implementation](#mutation-hooks-implementation)
  - [Endpoint Management](#endpoint-management)
  - [Error Handling](#error-handling)
- [Feature-Specific Integration](#feature-specific-integration)
- [Extending Core Functionality](#extending-core-functionality)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Introduction

The Core API module serves as the foundation for all data fetching and mutations in the PharmacyHub Frontend. It provides a standardized, consistent approach to API integration that follows our architecture principles, particularly the "Core as Foundation" principle.

### Purpose

The core API module aims to:

- Provide a unified approach to API interactions
- Reduce duplication across features
- Ensure consistent patterns for data fetching and mutations
- Handle common concerns like error handling, caching, and authentication
- Support TypeScript for type safety

### Benefits of Using Core Module

Using the core API module instead of direct TanStack Query implementation offers several benefits:

- **Consistency**: All features follow the same patterns for API interactions
- **Reduced Boilerplate**: Common patterns are implemented once in core
- **Centralized Configuration**: Authentication, error handling, and caching configured in one place
- **Easier Testing**: Standardized approach makes testing more straightforward
- **Maintainability**: Changes to API handling can be made in one place

### When to Use Core API Module

Always use the core API module for:

- Data fetching with TanStack Query
- Data mutations with TanStack Query
- Managing query keys
- Error handling for API requests
- API endpoint definition

## Core API Module Structure

The core API module is organized to provide a clear separation of concerns and to make it easy to find and use the functionality you need.

### Directory Structure

```
/src/core/api/
  /core/              # Core implementation
    /apiClient.ts     # Base API client configuration
    /error.ts         # Error handling utilities
    /utils/           # Internal utilities
  /hooks/             # React hooks for data fetching and mutations
    /query/           # Query hooks
      /useApiQuery.ts # Main query hook
    /mutation/        # Mutation hooks
      /useApiMutation.ts # Main mutation hook
  /utils/             # Utilities for API integration
    /endpointUtils.ts # Endpoint creation utilities
    /queryKeyFactory.ts # Query key utilities
  /types/             # TypeScript types for API functionality
  /index.ts           # Public API for the core module
```

### Key Components

#### API Client

The core API client (`apiClient`) provides a configured Axios instance with:

- Base URL configuration
- Authentication header management
- Request and response interceptors
- Timeout handling
- Error normalization

#### Query Hooks

The core query hooks provide wrappers around TanStack Query for data fetching:

- `useApiQuery`: Main hook for data fetching
- Additional specialized hooks for pagination, infinite loading, etc.

#### Mutation Hooks

The core mutation hooks provide wrappers around TanStack Query for data mutations:

- `useApiMutation`: Main hook for data mutations
- Specialized hooks for common HTTP methods (POST, PUT, PATCH, DELETE)

#### Query Key Factory

Utilities for creating consistent query keys across the application:

- `createQueryKeyFactory`: Creates a factory for domain-specific query keys
- `createParameterizedQueryKey`: Adds parameters to query keys

#### Error Handling

Utilities for consistent error handling:

- `handleApiError`: Processes API errors for consistent format
- `createApiError`: Creates typed API errors

#### Endpoint Utilities

Utilities for managing API endpoints:

- `createEndpoints`: Creates a set of endpoint constants for a feature
- `buildEndpointUrl`: Builds complete URLs with parameters

## Integration Patterns

This section covers the proper patterns for integrating with the core API module.

### Query Hooks Implementation

Query hooks are used for data fetching. Here's how to properly implement them using the core module:

#### Basic Query Hook Example

```typescript
// src/features/exams-preparation/api/hooks/useExamQuery.ts
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam } from '../../types';

export function useExamQuery(examId: number | undefined, options = {}) {
  return useApiQuery<Exam>(
    examsQueryKeys.detail(examId as number),
    examId ? EXAM_ENDPOINTS.DETAIL(examId) : '',
    {
      enabled: !!examId && (options.enabled !== false),
      ...options
    }
  );
}
```

Key points:
- Import `useApiQuery` from core
- Use query keys from a consistent factory
- Use endpoint constants
- Handle undefined parameters gracefully
- Type the return data properly
- Pass through additional options

#### Query Hook with Filtering Example

```typescript
// src/features/exams-preparation/api/hooks/useExamsQuery.ts
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam, ExamStatus, PaginatedResponse } from '../../types';

export interface UseExamsQueryOptions {
  page?: number;
  limit?: number;
  status?: ExamStatus;
  search?: string;
  isPremium?: boolean;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  tag?: string;
  enabled?: boolean;
}

export function useExamsQuery(options: UseExamsQueryOptions = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    isPremium,
    sortBy,
    sortDir,
    tag,
    enabled = true,
  } = options;

  // Build query parameters
  const params = {
    page,
    limit,
    ...(status && { status }),
    ...(search && { search }),
    ...(isPremium !== undefined && { isPremium }),
    ...(sortBy && { sortBy }),
    ...(sortDir && { sortDir }),
    ...(tag && { tag }),
  };

  return useApiQuery<PaginatedResponse<Exam>>(
    examsQueryKeys.lists(params),
    EXAM_ENDPOINTS.LIST,
    {
      params,
      enabled,
    }
  );
}
```

Key points:
- Define a typed options interface
- Build query parameters dynamically
- Include parameters in query key for proper caching
- Handle defaults for pagination
- Type the return data correctly

### Mutation Hooks Implementation

Mutation hooks are used for data changes (create, update, delete). Here's how to properly implement them using the core module:

#### Basic Mutation Hook Example

```typescript
// src/features/exams-preparation/api/hooks/useExamMutations.ts
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam } from '../../types';

export interface CreateExamPayload {
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  status: string;
  isPremium: boolean;
  price?: number;
}

export function useCreateExamMutation() {
  return useApiMutation<Exam, CreateExamPayload>(
    EXAM_ENDPOINTS.CREATE,
    {
      onSuccess: (_, __, context) => {
        // Invalidate the exams list queries to refetch after creation
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
      }
    }
  );
}
```

Key points:
- Import `useApiMutation` from core
- Define typed payload interface
- Use endpoint constants
- Implement proper query invalidation in onSuccess
- Type the return data correctly

#### Update/Delete Mutation Example

```typescript
// Example update mutation
export function useUpdateExamMutation() {
  return useApiMutation<Exam, { id: number; data: UpdateExamPayload }>(
    ({ id }) => EXAM_ENDPOINTS.UPDATE(id),
    {
      method: 'PUT',
      onSuccess: (_, variables, context) => {
        // Invalidate both the list queries and the specific exam query
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
        
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.detail(variables.id),
        });
      }
    }
  );
}

// Example delete mutation
export function useDeleteExamMutation() {
  return useApiMutation<void, number>(
    (id) => EXAM_ENDPOINTS.DELETE(id),
    {
      method: 'DELETE',
      onSuccess: (_, id, context) => {
        // Invalidate the exams list queries after deletion
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
        
        // Also invalidate the specific exam query
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.detail(id),
        });
      }
    }
  );
}
```

Key points:
- Use function endpoint for dynamic URLs
- Specify HTTP method (PUT, DELETE, etc.)
- Invalidate both list and detail queries for proper cache updates
- Type the parameters and return data correctly

### Endpoint Management

Proper endpoint management helps ensure consistency and maintainability. Here's how to use the core utilities for endpoint management:

#### Creating Endpoint Constants

```typescript
// src/features/exams-preparation/api/constants/endpoints.ts
import { createEndpoints } from '@/core/api/utils/endpointUtils';

export const EXAM_ENDPOINTS = createEndpoints('v1/exams-preparation', {
  // Custom endpoints beyond standard CRUD
  PUBLISHED: `${createEndpoints('v1/exams-preparation').BASE}/published`,
  BY_STATUS: (status: string) => `${createEndpoints('v1/exams-preparation').BASE}/status/${status}`,
  
  // Nested resource endpoints
  QUESTIONS: (examId: number) => `${createEndpoints('v1/exams-preparation').BASE}/${examId}/questions`,
  QUESTION_DETAIL: (examId: number, questionId: number) => 
    `${createEndpoints('v1/exams-preparation').BASE}/${examId}/questions/${questionId}`,
});
```

Key points:
- Use `createEndpoints` from core
- Include base path for the feature
- Define standard CRUD endpoints through the factory
- Add custom endpoints for specific functionality
- Create nested resource endpoints with parameters

#### Grouping Related Endpoints

```typescript
// Example of grouping related endpoints
export const QUESTION_ENDPOINTS = {
  LIST: (examId: number) => EXAM_ENDPOINTS.QUESTIONS(examId),
  DETAIL: (examId: number, questionId: number) => EXAM_ENDPOINTS.QUESTION_DETAIL(examId, questionId),
  CREATE: (examId: number) => EXAM_ENDPOINTS.QUESTIONS(examId),
  UPDATE: (examId: number, questionId: number) => EXAM_ENDPOINTS.QUESTION_DETAIL(examId, questionId),
  DELETE: (examId: number, questionId: number) => EXAM_ENDPOINTS.QUESTION_DETAIL(examId, questionId),
};
```

Key points:
- Group related endpoints in a logical way
- Reuse existing endpoint definitions
- Name consistently with CRUD operations

### Error Handling

Consistent error handling is crucial for a good user experience. Here's how to use the core error handling utilities:

#### Basic Error Handling

```typescript
// Example of using core error handling
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { handleApiError } from '@/core/api/core/error';

function useCustomQuery(id: number) {
  return useApiQuery(
    ['custom', id],
    `/api/custom/${id}`,
    {
      // Error handling is built into useApiQuery
      // No need to manually handle errors for basic cases
    }
  );
}
```

The core query hooks already include error handling, so in most cases, you don't need to add additional error handling code.

#### Custom Error Handling

For cases where you need custom error handling:

```typescript
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { handleApiError } from '@/core/api/core/error';

function useCustomQuery(id: number) {
  return useApiQuery({
    queryKey: ['custom', id],
    queryFn: async () => {
      try {
        // Custom logic here
        const response = await fetch(`/api/custom/${id}`);
        return await response.json();
      } catch (error) {
        // Use core error handling
        throw handleApiError(error, {
          context: {
            feature: 'custom-feature',
            action: 'getCustomData',
            id
          }
        });
      }
    }
  });
}
```

Key points:
- Import `handleApiError` from core
- Use it to process caught errors
- Add context information for better error tracking
- Throw the processed error to let TanStack Query handle it

## Feature-Specific Integration

Creating a feature-specific API layer that properly leverages the core API module ensures a clean, maintainable implementation. Here's how to structure your feature's API integration:

### Directory Structure

Follow this structure for your feature's API layer:

```
/src/features/your-feature/api/
  /constants/            # API constants
    /endpoints.ts        # Endpoint definitions
    /index.ts            # Export constants
  /hooks/                # Feature-specific API hooks
    /useEntityQuery.ts   # Query hooks for specific entities
    /useEntityMutation.ts # Mutation hooks for specific entities
    /index.ts            # Export all hooks
  /utils/                # API utilities
    /queryKeys.ts        # Query key definitions
    /index.ts            # Export utilities
  /index.ts              # Public API for the feature's API layer
  /README.md             # Documentation for the API layer
```

### Creating a Clean Public API

Export all the hooks and utilities through index files:

```typescript
// src/features/your-feature/api/index.ts
export * from './hooks';
export * from './constants';
export { featureQueryKeys } from './utils/queryKeys';
```

This creates a clean public API that can be imported with:

```typescript
import { useEntityQuery, ENTITY_ENDPOINTS } from '@/features/your-feature/api';
```

### Testing Your Integration

Create tests for your API hooks to ensure they're properly leveraging the core API module:

```typescript
// src/features/your-feature/api/__tests__/useEntityQuery.test.ts
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEntityQuery } from '../hooks/useEntityQuery';
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';

// Mock the core API module
jest.mock('@/core/api/hooks/query/useApiQuery');

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useEntityQuery', () => {
  it('should call useApiQuery with the correct parameters', () => {
    // Render the hook
    renderHook(() => useEntityQuery(1), {
      wrapper: createWrapper(),
    });
    
    // Verify useApiQuery was called with the correct parameters
    expect(useApiQuery).toHaveBeenCalledWith(
      expect.any(Array),
      expect.stringContaining('/api/entity/1'),
      expect.objectContaining({
        enabled: true,
      })
    );
  });
});
```

## Extending Core Functionality

Sometimes you may need to extend the core functionality for specific use cases. Here are guidelines for when and how to extend:

### When to Extend vs. When to Use As-Is

**Use as-is when:**
- The core functionality covers your needs
- Your use case follows standard patterns
- You need basic query or mutation functionality

**Extend when:**
- You need domain-specific behavior not covered by core
- You're implementing a pattern that will be reused across the feature
- You need custom error handling for specific scenarios

### How to Properly Extend

1. **Create a thin wrapper** around core functionality:

```typescript
// Example of a thin wrapper around useApiQuery
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';

export function useFeatureQuery<TData>(
  endpoint: string,
  options = {}
) {
  return useApiQuery<TData>(
    ['feature', endpoint],
    `/api/feature/${endpoint}`,
    {
      // Feature-specific default options
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options
    }
  );
}
```

2. **Use composition** to build on core functionality:

```typescript
// Example of composition
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { useState, useEffect } from 'react';

export function useFeatureQueryWithLocalState<TData>(
  endpoint: string,
  options = {}
) {
  // Use core hook
  const query = useApiQuery<TData>(
    ['feature', endpoint],
    `/api/feature/${endpoint}`,
    options
  );
  
  // Add feature-specific functionality
  const [localState, setLocalState] = useState<TData | null>(null);
  
  useEffect(() => {
    if (query.data) {
      setLocalState(query.data);
      localStorage.setItem('cached-data', JSON.stringify(query.data));
    }
  }, [query.data]);
  
  return {
    ...query,
    localState,
    resetLocalState: () => setLocalState(null)
  };
}
```

3. **Contribute back to core** if the functionality would be useful across features:

If you find yourself implementing the same extension in multiple features, consider contributing it back to the core API module.

Process for contributing to core:
1. Identify the reusable pattern
2. Create a clean, generic implementation
3. Add proper TypeScript typing
4. Add tests for the new functionality
5. Document the new functionality
6. Submit a pull request to add it to the core module

## Troubleshooting

Here are solutions to common issues when integrating with the core API module:

### Common Issues and Solutions

#### Query Not Firing

**Issue**: Query hook doesn't fetch data.

**Possible causes and solutions**:
- Check if `enabled` is set to `false` (either directly or through conditional logic)
- Verify query key dependencies are properly defined
- Check if endpoint is correctly formatted
- Ensure authentication is properly configured if the endpoint requires it

#### Stale Data Not Refreshing

**Issue**: After a mutation, related queries are not refreshing.

**Possible causes and solutions**:
- Ensure proper query invalidation in `onSuccess` callbacks
- Check that query keys match between the query and invalidation
- Verify QueryClient is properly set up
- Check that the invalidation is using the correct query key structure

#### Type Errors

**Issue**: TypeScript errors related to API types.

**Possible causes and solutions**:
- Ensure proper typing for query and mutation hooks
- Check that response types match the actual API response
- Verify that payload types match the API requirements
- Use proper typing for query parameters and options

#### Network Errors

**Issue**: Network errors when making API requests.

**Possible causes and solutions**:
- Check if the API server is running and accessible
- Verify endpoint URLs are correct
- Check for CORS issues in the browser console
- Ensure authorization headers are properly set if required
- Verify network connectivity

### Debugging Tips

1. **Use the React Query Devtools**
   The React Query Devtools provide insights into query states, cache contents, and more.

2. **Log Query Keys**
   Log your query keys to ensure they're constructed correctly:
   ```typescript
   console.log('Query Key:', examsQueryKeys.detail(examId));
   ```

3. **Inspect Network Requests**
   Use browser developer tools to inspect the actual network requests being made.

4. **Enable TanStack Query Logging**
   Configure TanStack Query to log debug information:
   ```typescript
   const queryClient = new QueryClient({
     config: {
       logger: {
         log: console.log,
         warn: console.warn,
         error: console.error,
       }
     }
   });
   ```

5. **Check for Circular Dependencies**
   Circular dependencies can cause subtle issues. Check your import structure.

### Performance Considerations

1. **Optimize Query Keys**
   Only include necessary data in query keys to avoid unnecessary refetching.

2. **Use Appropriate Stale Times**
   Set appropriate stale times based on how frequently the data changes.

3. **Batch Queries**
   Use techniques like `useQueries` for batching multiple related queries.

4. **Use Selective Loading**
   Only enable queries when their dependencies are ready to avoid unnecessary requests.

5. **Leverage Data Transformations**
   Use the `select` option to transform data rather than transforming in components.

## Reference

This section provides a reference of the core API module exports and their usage.

### Core API Module Exports

```typescript
// Main hooks
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';

// Query key utilities
import { createQueryKeyFactory } from '@/core/api/utils/queryKeyFactory';

// Endpoint utilities
import { createEndpoints } from '@/core/api/utils/endpointUtils';

// Error handling
import { handleApiError, createApiError } from '@/core/api/core/error';

// API client
import { apiClient } from '@/core/api/core/apiClient';
```

### Available Hooks and Utilities

#### Query Hooks

- `useApiQuery`: Main hook for data fetching
- `useApiPaginatedQuery`: Hook for paginated queries
- `useApiInfiniteQuery`: Hook for infinite queries (load more functionality)

#### Mutation Hooks

- `useApiMutation`: Main hook for data mutations
- `useApiPut`: Specialized hook for PUT requests
- `useApiPatch`: Specialized hook for PATCH requests
- `useApiDelete`: Specialized hook for DELETE requests

#### Query Key Utilities

- `createQueryKeyFactory`: Creates a factory for domain-specific query keys
- `createParameterizedQueryKey`: Adds parameters to query keys

#### Endpoint Utilities

- `createEndpoints`: Creates a set of endpoint constants for a feature
- `buildEndpointUrl`: Builds complete URLs with parameters
- `getApiBasePath`: Determines API paths based on environment variables

#### Error Handling

- `handleApiError`: Processes API errors for consistent format
- `createApiError`: Creates typed API errors
- `isApiError`: Type guard for API errors

### Configuration Options

#### useApiQuery Options

```typescript
interface UseApiQueryOptions<TData, TError, TQueryFnData> {
  // Standard TanStack Query options
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  retryDelay?: number | ((retryAttempt: number, error: TError) => number);
  
  // Core API specific options
  requiresAuth?: boolean;
  deduplicate?: boolean;
  timeout?: number;
  params?: Record<string, any>;
  
  // Query function options
  enabled?: boolean;
  select?: (data: TQueryFnData) => TData;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: (data: TData | undefined, error: TError | null) => void;
}
```

#### useApiMutation Options

```typescript
interface UseApiMutationOptions<TData, TError, TVariables, TContext> {
  // Standard TanStack Query options
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  retryDelay?: number | ((retryAttempt: number, error: TError) => number);
  
  // Core API specific options
  requiresAuth?: boolean;
  timeout?: number;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  
  // Mutation function options
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => Promise<unknown> | unknown;
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => Promise<unknown> | unknown;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, context: TContext | undefined) => Promise<unknown> | unknown;
}
```

---

This guide should help developers properly leverage the core API module in their feature implementations. For any questions or issues not covered here, please contact the architecture team.

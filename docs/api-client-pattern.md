# API Client Design Pattern with React Query

This document outlines the recommended design pattern for implementing API client functionality with React Query in the PharmacyHub frontend application.

## Core Architecture

The API client implementation follows a layered architecture:

1. **Base API Client**: A generic client that handles HTTP requests, authentication, and error handling
2. **Feature-specific API Services**: Domain-specific wrappers around the base client
3. **React Query Hooks**: Custom hooks that expose data fetching and mutations with proper caching

## Base API Client

Located at `src/shared/api/apiClient.ts`, this class provides:

- Request handling with proper error management
- Authentication token management
- Standard response formatting
- Convenience methods for different HTTP methods (GET, POST, etc.)

```typescript
// Example base client method
async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
  return this.request<T>(endpoint, { ...options, method: 'GET' });
}
```

## Feature-specific API Services

Each feature should have its own API service that:

- Uses the base API client for network requests
- Defines feature-specific endpoints
- Handles data transformation if needed
- Provides type safety with proper interfaces

```typescript
// Example from examApi.ts
const examApi = {
  getExamById: async (examId: number): Promise<Exam> => {
    const response = await apiClient.get<Exam>(`/exams/${examId}`);
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Exam not found');
    return response.data;
  },
  // ...other methods
}
```

## React Query Hooks Layer

The React Query hooks layer:

- Defines query keys for proper caching
- Encapsulates API calls using React Query's `useQuery` and `useMutation`
- Provides loading, error, and data states
- Handles cache invalidation and updates

```typescript
// Example query keys
export const EXAM_KEYS = {
  all: ['exams'] as const,
  lists: () => [...EXAM_KEYS.all, 'list'] as const,
  detail: (id: number) => [...EXAM_KEYS.all, 'detail', id] as const,
  // ...other keys
};

// Example hook
export function useExam(examId: number | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.detail(examId as number),
    queryFn: () => examApi.getExamById(examId as number),
    enabled: !!examId,
  });
}
```

## Best Practices

### 1. Query Key Structure

Use structured, predictable query keys that:

- Are organized hierarchically (from general to specific)
- Include relevant parameters that affect the query result
- Support proper cache invalidation

```typescript
// Good pattern for query keys
const KEYS = {
  all: ['resource'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (filters: object) => [...KEYS.lists(), { filters }] as const,
  details: () => [...KEYS.all, 'detail'] as const,
  detail: (id: string | number) => [...KEYS.details(), id] as const,
};
```

### 2. Error Handling

Throw errors from the API layer and handle them in components:

```typescript
// In API service
getResource: async (id: number): Promise<Resource> => {
  const response = await apiClient.get<Resource>(`/resources/${id}`);
  if (response.error) throw response.error;
  return response.data;
}

// In component
const { data, error, isLoading } = useResourceQuery(id);
if (error) {
  return <ErrorComponent message={error.message} />;
}
```

### 3. Data Transformation

Transform data at the API service level when needed:

```typescript
getTransformedData: async (): Promise<TransformedType> => {
  const response = await apiClient.get<RawType>('/endpoint');
  if (response.error) throw response.error;
  return transformData(response.data);
}
```

### 4. Mutations

For data modifications, use React Query mutations:

```typescript
const createMutation = useMutation({
  mutationFn: (newData) => api.createResource(newData),
  onSuccess: (data) => {
    // Invalidate and refetch queries that may have been affected
    queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    // Or directly update the cache
    queryClient.setQueryData(KEYS.detail(data.id), data);
  },
});
```

### 5. Composition

Compose complex data requirements using multiple hooks:

```typescript
function useResourceWithRelations(id) {
  const resource = useResource(id);
  const relatedItems = useRelatedItems(id, {
    enabled: !!resource.data,
  });
  
  return {
    resource: resource.data,
    relatedItems: relatedItems.data,
    isLoading: resource.isLoading || relatedItems.isLoading,
    error: resource.error || relatedItems.error,
  };
}
```

## Implementation Examples

The exams feature demonstrates this pattern:

1. **API Client**: Base HTTP client with authentication
2. **API Service**: Exam-specific API methods
3. **Query Hooks**: React Query hooks for exams data
4. **UI Components**: Components that use the hooks

## Migration Guide

When implementing new features or refactoring existing ones:

1. Start by defining the API service using the base client
2. Create React Query hooks with proper query keys
3. Build UI components that consume these hooks
4. Ensure proper error handling and loading states

## Benefits

This pattern provides:

1. **Separation of concerns**: Clear boundaries between API, data management, and UI
2. **Consistency**: Unified approach to API access across the application
3. **Caching**: Automatic caching and synchronization with server state
4. **Performance**: Reduced network requests and optimized rendering
5. **Developer experience**: Simple, declarative API for data fetching

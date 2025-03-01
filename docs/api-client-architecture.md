# PharmacyHub API Client Architecture

This document outlines the architecture of the centralized API client implementation for the PharmacyHub frontend application. The API client is designed to provide a consistent, type-safe, and maintainable approach to handling backend communication.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Components](#key-components)
3. [API Client](#api-client)
4. [React Query Integration](#react-query-integration)
5. [API Services](#api-services)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

## Architecture Overview

The API client architecture is built with the following principles in mind:

- **Centralization**: All API communication is consolidated in a single location.
- **Type Safety**: Strong TypeScript typing throughout the entire API layer.
- **Consistency**: Standard patterns for error handling, authentication, and data transformation.
- **Maintainability**: Modular architecture that's easy to extend and update.
- **Performance**: Optimized data fetching with caching, deduplication, and error handling.

The architecture consists of several layers:

1. **Core API Client**: Low-level fetch wrapper with error handling, authentication, and request/response processing.
2. **TanStack Query Integration**: React hooks for data fetching with caching, refetching, and state management.
3. **Service Layer**: Domain-specific services that encapsulate API endpoints for different entities.
4. **Feature-specific API Modules**: API functionality scoped to specific application features.

## Key Components

### Core Libraries

- **TanStack Query (React Query)**: Library for fetching, caching, and updating server state in React applications.
- **Fetch API**: Native browser API for making HTTP requests.

### Project Components

- `/lib/api/apiClient.ts`: Core API client implementation.
- `/lib/query/queryClient.ts`: TanStack Query client configuration.
- `/lib/api/hooks.ts`: React hooks for API communication.
- `/lib/api/createService.ts`: Factory functions for creating API services.
- `/lib/api/services/*`: Domain-specific API services.
- `/features/*/api/*`: Feature-specific API modules.

## API Client

The API client (`apiClient.ts`) provides a consistent interface for making HTTP requests with the following features:

- **Authentication**: Automatic token inclusion and refresh.
- **Error Handling**: Consistent error processing and reporting.
- **Request Deduplication**: Prevents duplicate concurrent requests.
- **Timeout Handling**: Configurable request timeouts.
- **Retry Logic**: Automatic retries for failed requests.
- **TypeScript Integration**: Full type safety for requests and responses.

### Key Methods

```typescript
// Basic HTTP methods
get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>
post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>
put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>
patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>
delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>

// Core request method
request<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>
```

### Response Structure

All API responses follow a consistent structure:

```typescript
interface ApiResponse<T> {
  data: T | null;       // Response data (if successful)
  error: ApiError | null; // Error object (if failed)
  status: number;       // HTTP status code
}
```

## React Query Integration

The React Query integration provides hooks for data fetching with the following features:

- **Caching**: Automatic caching of query results.
- **Background Refetching**: Updates data in the background.
- **Stale-While-Revalidate**: Shows stale data while fetching fresh data.
- **Pagination**: Support for paginated queries.
- **Infinite Queries**: Support for "load more" patterns.
- **Optimistic Updates**: Update UI before server confirmation.
- **Prefetching**: Load data before it's needed.

### Key Hooks

```typescript
// Data fetching hooks
useApiQuery<TData>(queryKey, endpoint, options)
useApiPaginatedQuery<TData>(queryKey, endpoint, paginationParams, options)
useApiInfiniteQuery<TData>(queryKey, endpoint, options)

// Data mutation hooks
useApiMutation<TData, TVariables>(endpoint, options)
useApiPut<TData, TVariables>(endpoint, options)
useApiPatch<TData, TVariables>(endpoint, options)
useApiDelete<TData>(endpoint, options)
```

## API Services

The service layer provides domain-specific services for different entities:

- **User Service**: User profile and account management.
- **Auth Service**: Authentication and authorization.
- **Exam Service**: Exam management and submission.
- **Progress Service**: Progress tracking and statistics.

Each service provides type-safe methods for interacting with specific API endpoints.

### Service Factory

The `createApiService` function creates standardized CRUD operations for any entity:

```typescript
const userService = createApiService<User>('/users');

// Generated methods:
userService.getAll()
userService.getById(id)
userService.create(data)
userService.update(id, data)
userService.patch(id, data)
userService.remove(id)
```

For more complex services, the `createExtendedApiService` function allows adding custom methods:

```typescript
const authService = createExtendedApiService<User, {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
}>('/auth', {
  login: async (credentials) => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }
});
```

## Usage Examples

### Basic Data Fetching

```tsx
import { useApiQuery } from '@/lib/api';
import { User } from '@/lib/api/services';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useApiQuery<User>(
    ['users', userId],
    `/users/${userId}`
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  
  return <UserProfileDisplay user={data} />;
}
```

### Using Services

```tsx
import { userService } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading } = useQuery(['users'], () => 
    userService.getAll().then(response => {
      if (response.error) throw response.error;
      return response.data;
    })
  );

  // ...
}
```

### Data Mutations

```tsx
import { useApiMutation } from '@/lib/api';

function CreateUserForm() {
  const { mutate, isLoading } = useApiMutation<User, NewUserData>(
    '/users',
    {
      onSuccess: (data) => {
        // Handle successful creation
      }
    }
  );

  const handleSubmit = (formData) => {
    mutate(formData);
  };

  // ...
}
```

### Using Query Keys

```tsx
import { apiQueryKeys, useApiQuery } from '@/lib/api';

function ExamDetail({ examId }) {
  const { data } = useApiQuery(
    apiQueryKeys.exams.detail(examId),
    `/exams/${examId}`
  );

  // ...
}
```

## Best Practices

1. **Use Query Keys Consistently**:
   - Leverage the `apiQueryKeys` object for consistent query keys.
   - Structure keys hierarchically (e.g., `['users', userId, 'posts']`).

2. **Handle Errors Properly**:
   - Check for `response.error` before using `response.data`.
   - Use error boundaries for top-level error handling.

3. **Optimize Refetching**:
   - Configure appropriate `staleTime` and `cacheTime` for each query.
   - Use `refetchOnWindowFocus` and `refetchOnMount` based on data freshness requirements.

4. **Leverage Type Safety**:
   - Define interfaces for all request/response data.
   - Use generics with API hooks for type inference.

5. **Structure API Modules**:
   - Keep domain-specific logic in service files.
   - Organize feature-specific API code within feature directories.

6. **Use Optimistic Updates**:
   - Update the UI immediately before server confirmation.
   - Handle rollback if the server request fails.

7. **Implement Authentication Properly**:
   - Use the `requiresAuth` option for endpoints that need authentication.
   - Handle token refresh transparently.

By following these principles and best practices, the PharmacyHub API client architecture provides a robust foundation for interacting with the backend services in a consistent, type-safe, and maintainable way.

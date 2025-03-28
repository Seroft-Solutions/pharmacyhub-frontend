# TanStack Query API Integration

This package provides a complete solution for API communication in React applications using TanStack Query (formerly React Query). It includes a custom API client, query hooks, service factories, and standardized types.

## Features

- **API Client** - A robust fetch wrapper with authentication, error handling, and request deduplication
- **TanStack Query Integration** - Custom hooks for data fetching and mutations that work with TanStack Query
- **Service Factory** - Create type-safe API services for different entities
- **TypeScript Support** - Full type safety from request to response
- **Standardized Response Structures** - Consistent error handling and data access patterns

## Installation

This package is ready to use in your project. It's recommended to put it in your project's `src/features` directory.

Make sure you have the following dependencies installed:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Usage

### Setting up the Provider

Wrap your application with the `QueryProvider` component:

```tsx
// In your app layout or root component:
import { QueryProvider } from '@/features/core/tanstack-query-api';

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

### Basic Data Fetching

Use the `useApiQuery` hook to fetch data:

```tsx
import { useApiQuery, apiQueryKeys } from '@/features/core/tanstack-query-api';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useApiQuery(
    apiQueryKeys.users.detail(userId),
    `/users/${userId}`
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### Mutations

Use the mutation hooks for creating, updating, or deleting data:

```tsx
import { useApiMutation } from '@/features/core/tanstack-query-api';

function CreateUserForm() {
  const { mutate, isLoading } = useApiMutation(
    '/users',
    {
      onSuccess: (data) => {
        console.log('User created:', data);
        // Handle success (e.g., show notification, navigate)
      },
      onError: (error) => {
        console.error('Failed to create user:', error);
        // Handle error (e.g., show error message)
      }
    }
  );

  const handleSubmit = (formData) => {
    mutate(formData);
  };

  // Form component
}
```

### Paginated Queries

For paginated data:

```tsx
import { useApiPaginatedQuery, apiQueryKeys } from '@/features/core/tanstack-query-api';

function UserList() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useApiPaginatedQuery(
    apiQueryKeys.users.list(),
    '/users',
    { page, size: 10 }
  );

  // Render paginated list
}
```

### Creating Services

Create reusable services for your entities:

```tsx
import { createApiService } from '@/features/core/tanstack-query-api';

// Define your entity type
interface User {
  id: string;
  name: string;
  email: string;
}

// Create a service
const userService = createApiService<User>('/users');

// Use the service
const response = await userService.getAll();
const user = await userService.getById('123');
```

For custom methods, use the extended service factory:

```tsx
import { createExtendedApiService, apiClient } from '@/features/core/tanstack-query-api';

const authService = createExtendedApiService<User, {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
}>('/auth', {
  login: async (credentials) => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }
});

// Use the custom method
const response = await authService.login({ email, password });
```

## API Reference

### Core

- `apiClient` - The main API client instance
- `createApiClient(config)` - Factory function to create custom API clients
- `queryClient` - The pre-configured TanStack Query client
- `createQueryClient(options)` - Factory function to create custom query clients

### Hooks

- `useApiQuery(queryKey, endpoint, options)` - Hook for GET requests
- `useApiMutation(endpoint, options)` - Hook for POST requests
- `useApiPut(endpoint, options)` - Hook for PUT requests
- `useApiPatch(endpoint, options)` - Hook for PATCH requests
- `useApiDelete(endpoint, options)` - Hook for DELETE requests
- `useApiPaginatedQuery(queryKey, endpoint, paginationParams, options)` - Hook for paginated queries
- `useApiInfiniteQuery(queryKey, endpoint, options)` - Hook for infinite queries

### Services

- `createApiService(baseEndpoint)` - Create a basic CRUD service
- `createExtendedApiService(baseEndpoint, customMethods)` - Create a service with custom methods

### Utilities

- `apiQueryKeys` - Standard query keys for common entities
- `buildQueryString(params)` - Build URL query parameters from an object

## Best Practices

1. **Use Query Keys Consistently**
   - Leverage the `apiQueryKeys` object for consistent query keys
   - Structure keys hierarchically (e.g., `['users', userId, 'posts']`)

2. **Handle Errors Properly**
   - Check for `response.error` before using `response.data`
   - Use appropriate error boundaries at the component level

3. **Optimize Refetching**
   - Configure appropriate `staleTime` for each query
   - Use `refetchOnWindowFocus` based on data freshness requirements

4. **Leverage Type Safety**
   - Define interfaces for all request/response data
   - Use generics with API hooks for type inference

5. **Use Optimistic Updates**
   - Update the UI immediately before server confirmation
   - Handle rollback if the server request fails

## Porting to Other Projects

This entire feature can be easily ported to other projects by copying the `src/features/tanstack-query-api` directory. The module is self-contained and only requires TanStack Query as a dependency.

When porting to a new project:

1. Copy the entire directory to your new project's `src/features` folder
2. Install TanStack Query dependencies if not already installed
3. Configure your API base URL in your environment variables or directly in the code
4. Update any project-specific types or configurations as needed

## License

This module is proprietary and intended for use within your organization's projects only.

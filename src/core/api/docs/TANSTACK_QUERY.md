# TanStack Query Integration

This document explains the TanStack Query integration in the PharmacyHub frontend.

## Overview

TanStack Query (formerly React Query) is used for server state management, providing:

- Automatic fetching, caching, and stale-time management
- Mutations with optimistic updates
- Pagination and infinite scrolling
- Automatic background refetching
- Garbage collection of unused queries
- Retry on error
- Prefetching
- DevTools integration

## Setup

### QueryClient Provider

The QueryClient is set up in the `QueryClientProvider` component, which should be used at the application root:

```tsx
import { QueryClientProvider } from '@/core/api/providers';

function App() {
  return (
    <QueryClientProvider>
      {/* Your application components */}
    </QueryClientProvider>
  );
}
```

By default, the provider uses sensible defaults for stale time and garbage collection time, but these can be customized:

```tsx
<QueryClientProvider
  defaultStaleTime={10 * 60 * 1000} // 10 minutes
  defaultGcTime={20 * 60 * 1000} // 20 minutes
>
  {/* Your application components */}
</QueryClientProvider>
```

### Query Keys

Query keys are used to identify and deduplicate queries. We use a factory pattern to create consistent query keys across the application:

```tsx
import { userKeys } from '@/core/api/utils/queryKeyFactory';

// Get all users
userKeys.all(); // ['users']

// Get a list of users with filters
userKeys.lists({ role: 'admin' }); // ['users', 'list', { role: 'admin' }]

// Get a specific user
userKeys.detail('123'); // ['users', 'detail', '123']
```

You can create your own query key factory for each domain in your application:

```tsx
import { createQueryKeyFactory } from '@/core/api/utils/queryKeyFactory';

// Create a query key factory for products
export const productKeys = createQueryKeyFactory<'recommended' | 'popular'>('products');
```

## Data Fetching

### Basic Queries

For simple data fetching, use the `useApiQuery` hook:

```tsx
import { useApiQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useApiQuery(
    userKeys.detail(userId),
    `/users/${userId}`
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}
```

### Pagination

For paginated queries, use the `useApiPaginatedQuery` hook:

```tsx
import { useApiPaginatedQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useState } from 'react';

function UserList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, isLoading, error } = useApiPaginatedQuery(
    userKeys.lists(),
    '/users',
    { page, size }
  );

  // Pagination UI and rendering logic
}
```

### Infinite Queries

For infinite scrolling, use the `useApiInfiniteQuery` hook:

```tsx
import { useApiInfiniteQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';

function InfiniteUserList() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useApiInfiniteQuery(
    userKeys.lists(),
    '/users'
  );

  // Infinite scrolling UI and rendering logic
}
```

## Data Mutations

### Basic Mutations

For creating or updating data, use the `useApiMutation` hook:

```tsx
import { useApiMutation } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useApiMutation(
    '/users',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(userKeys.lists());
      }
    }
  );

  const handleSubmit = (userData) => {
    mutate(userData);
  };

  // Form and rendering logic
}
```

### Optimistic Updates

For a better user experience, you can use optimistic updates:

```tsx
import { useApiMutation } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { optimisticAddItem } from '@/core/api/utils/optimisticUpdates';
import { useQueryClient } from '@tanstack/react-query';

function CreateUserWithOptimisticUpdate() {
  const queryClient = useQueryClient();

  const { mutate } = useApiMutation(
    '/users',
    {
      onMutate: async (newUser) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(userKeys.lists());

        // Optimistically add the new user to the list
        const previousUsers = optimisticAddItem({
          queryClient,
          queryKey: userKeys.lists(),
          newItem: { ...newUser, id: 'temp-id' }
        });

        // Return context for potential rollback
        return { previousUsers };
      },
      onError: (error, variables, context) => {
        // Rollback in case of error
        if (context?.previousUsers) {
          queryClient.setQueryData(userKeys.lists(), context.previousUsers);
        }
      },
      onSettled: () => {
        // Always refetch to ensure consistency
        queryClient.invalidateQueries(userKeys.lists());
      }
    }
  );

  // Form and rendering logic
}
```

## Advanced Features

### Query Invalidation

To refresh data after mutations, invalidate the relevant queries:

```tsx
// Invalidate all user queries
queryClient.invalidateQueries(userKeys.filter());

// Invalidate a specific user
queryClient.invalidateQueries(userKeys.detail('123'));

// Invalidate all users lists
queryClient.invalidateQueries(userKeys.lists());
```

### Prefetching

To improve the user experience, prefetch data before it's needed:

```tsx
// Prefetch a specific user
queryClient.prefetchQuery(userKeys.detail('123'), () => 
  apiClient.get(`/users/123`)
);
```

### Query Cancellation

To cancel outgoing requests when new ones are made:

```tsx
// Cancel all user queries
queryClient.cancelQueries(userKeys.filter());

// Cancel a specific user query
queryClient.cancelQueries(userKeys.detail('123'));
```

## Best Practices

1. **Use Query Keys Consistently**: Always use the query key factories to ensure consistent query keys across the application.

2. **Avoid Redundant Queries**: If you already have the data, use `initialData` to provide it to the query.

3. **Handle Loading States**: Always handle loading states in your components to provide a good user experience.

4. **Handle Errors Properly**: Use error boundaries or local error handling to show meaningful error messages.

5. **Optimize Renders**: Use the selector pattern to only subscribe to the specific parts of the query result that your component needs.

6. **Use Optimistic Updates**: When possible, use optimistic updates to provide a better user experience.

7. **Stay Consistent**: Follow the patterns established in this documentation for all new API integrations.

## Tips and Tricks

### Type Safety

All hooks are fully typed with TypeScript, so make sure to specify the correct types for your data:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

const { data } = useApiQuery<User>(userKeys.detail('123'), '/users/123');
```

### Error Handling

The error object returned by the hooks is already normalized, so you can access common properties regardless of the error source:

```tsx
const { error } = useApiQuery(userKeys.detail('123'), '/users/123');

if (error) {
  console.error(error.message, error.status, error.data);
}
```

### Dependent Queries

For queries that depend on other queries, use the `enabled` option:

```tsx
const { data: user } = useApiQuery(userKeys.detail(userId), `/users/${userId}`);

const { data: userPosts } = useApiQuery(
  ['users', userId, 'posts'],
  `/users/${userId}/posts`,
  { enabled: !!user }
);
```
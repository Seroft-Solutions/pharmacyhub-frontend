# API State Migration Guide

This guide explains how to migrate from direct API calls to TanStack Query for API state management.

## Why Migrate?

TanStack Query provides several benefits over direct API calls:

- **Automatic Caching**: Data is cached automatically based on query keys.
- **Stale Time Management**: Data is refetched automatically when it becomes stale.
- **Loading and Error States**: Built-in loading and error states for better UX.
- **Automatic Retries**: Failed requests are retried automatically.
- **Optimistic Updates**: Better user experience by optimistically updating the UI.
- **Prefetching**: Fetch data before it's needed for a better UX.
- **DevTools**: Debug API requests and cache state with the DevTools.
- **Garbage Collection**: Automatically clean up unused data.

## Migration Steps

### Step 1: Add the QueryClientProvider

First, add the QueryClientProvider to your application:

**Before:**

```tsx
function App() {
  return (
    <div>
      {/* Your application components */}
    </div>
  );
}
```

**After:**

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

### Step 2: Create Query Key Factories for Your Domains

Create query key factories for each domain in your application:

```tsx
import { createQueryKeyFactory } from '@/core/api/utils/queryKeyFactory';

// Create a query key factory for products
export const productKeys = createQueryKeyFactory<'recommended' | 'popular'>('products');

// Create a query key factory for orders
export const orderKeys = createQueryKeyFactory<'history' | 'pending'>('orders');
```

### Step 3: Replace Direct API Calls with Query Hooks

**Before:**

```tsx
import { useEffect, useState } from 'react';
import { apiClient } from '@/core/api';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/users/${userId}`);
        setUser(response.data);
        setError(null);
      } catch (error) {
        setError(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
}
```

**After:**

```tsx
import { useApiQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';

function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useApiQuery(
    userKeys.detail(userId),
    `/users/${userId}`
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
}
```

### Step 4: Replace Form Submission with Mutation Hooks

**Before:**

```tsx
import { useState } from 'react';
import { apiClient } from '@/core/api';

function CreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (userData) => {
    try {
      setLoading(true);
      await apiClient.post('/users', userData);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

**After:**

```tsx
import { useApiMutation } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useApiMutation(
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

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### Step 5: Add Optimistic Updates for a Better UX

**Before:**

```tsx
// No optimistic updates in the direct API call approach
```

**After:**

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

## Available Hooks

The API module provides the following hooks:

- **useApiQuery**: For fetching data
- **useApiPaginatedQuery**: For fetching paginated data
- **useApiInfiniteQuery**: For infinite scrolling
- **useApiMutation**: For creating, updating, and deleting data
- **useApiPut**: For updating data with PUT
- **useApiPatch**: For updating data with PATCH
- **useApiDelete**: For deleting data

## Available Utilities

The API module provides the following utilities:

- **createQueryKeyFactory**: For creating query key factories
- **optimisticAddItem**: For optimistically adding items to a list
- **optimisticUpdateItem**: For optimistically updating items in a list
- **optimisticRemoveItem**: For optimistically removing items from a list
- **optimisticAddItemToInfiniteQuery**: For optimistically adding items to an infinite query
- **optimisticUpdateItemInInfiniteQuery**: For optimistically updating items in an infinite query
- **optimisticRemoveItemFromInfiniteQuery**: For optimistically removing items from an infinite query

## Transition Period

During the transition period, both the direct API calls and TanStack Query hooks will be available. However, new code should use TanStack Query hooks to benefit from automatic caching, stale time management, and optimistic updates.
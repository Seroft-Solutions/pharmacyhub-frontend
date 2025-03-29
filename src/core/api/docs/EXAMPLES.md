# TanStack Query Examples

This document provides practical examples of using TanStack Query in the PharmacyHub frontend.

## Basic Queries

### Fetching a Single Item

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

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Email: {data.email}</p>
    </div>
  );
}
```

### Fetching a List

```tsx
import { useApiQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';

function UserList() {
  const { data, isLoading, error } = useApiQuery(
    userKeys.lists(),
    '/users'
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Fetching with Parameters

```tsx
import { useApiQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';

function FilteredUserList({ role }) {
  const { data, isLoading, error } = useApiQuery(
    userKeys.lists({ role }),
    '/users',
    {
      params: { role }
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Mutations

### Creating a New Item

```tsx
import { useApiMutation } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function CreateUser() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { mutate, isLoading, error } = useApiMutation(
    '/users',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(userKeys.lists());
        setName('');
        setEmail('');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### Updating an Item

```tsx
import { useApiPut } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

function UpdateUser({ user }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const { mutate, isLoading, error } = useApiPut(
    `/users/${user.id}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(userKeys.detail(user.id));
        queryClient.invalidateQueries(userKeys.lists());
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update User'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### Deleting an Item

```tsx
import { useApiMutation } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useQueryClient } from '@tanstack/react-query';

function DeleteUser({ userId }) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useApiMutation(
    `/users/${userId}`,
    {
      method: 'DELETE',
      onSuccess: () => {
        queryClient.invalidateQueries(userKeys.lists());
      }
    }
  );

  return (
    <button
      onClick={() => mutate()}
      disabled={isLoading}
    >
      {isLoading ? 'Deleting...' : 'Delete User'}
    </button>
  );
}
```

## Pagination

### Basic Pagination

```tsx
import { useApiPaginatedQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useState } from 'react';

function PaginatedUserList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, isLoading, error } = useApiPaginatedQuery(
    userKeys.lists(),
    '/users',
    { page, size }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ul>
        {data.content.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1} of {data.totalPages}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= data.totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Infinite Scrolling

```tsx
import { useApiInfiniteQuery } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { useEffect } from 'react';

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

  // Example of intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ul>
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      <div id="sentinel" style={{ height: '20px' }}>
        {isFetchingNextPage ? 'Loading more...' : ''}
      </div>
    </div>
  );
}
```

## Optimistic Updates

### Adding an Item Optimistically

```tsx
import { useApiMutation } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { optimisticAddItem } from '@/core/api/utils/optimisticUpdates';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function CreateUserOptimistic() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { mutate, isLoading, error } = useApiMutation(
    '/users',
    {
      onMutate: async (newUser) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(userKeys.lists());

        // Add the user optimistically
        const previousUsers = optimisticAddItem({
          queryClient,
          queryKey: userKeys.lists(),
          newItem: {
            ...newUser,
            id: `temp-${Date.now()}` // Temporary ID
          }
        });

        return { previousUsers };
      },
      onError: (err, newUser, context) => {
        // Revert to previous state on error
        if (context?.previousUsers) {
          queryClient.setQueryData(userKeys.lists(), context.previousUsers);
        }
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(userKeys.lists());
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, email });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### Updating an Item Optimistically

```tsx
import { useApiPut } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { optimisticUpdateItem } from '@/core/api/utils/optimisticUpdates';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

function UpdateUserOptimistic({ user }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const { mutate, isLoading, error } = useApiPut(
    `/users/${user.id}`,
    {
      onMutate: async (updatedUser) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(userKeys.lists());
        await queryClient.cancelQueries(userKeys.detail(user.id));

        // Update the user optimistically in the list
        const previousUsers = optimisticUpdateItem({
          queryClient,
          queryKey: userKeys.lists(),
          id: user.id,
          getItemId: item => item.id,
          updates: updatedUser
        });

        // Update the user optimistically in the detail view
        const previousUser = queryClient.getQueryData(userKeys.detail(user.id));
        queryClient.setQueryData(userKeys.detail(user.id), {
          ...previousUser,
          ...updatedUser
        });

        return { previousUsers, previousUser };
      },
      onError: (err, updatedUser, context) => {
        // Revert to previous state on error
        if (context?.previousUsers) {
          queryClient.setQueryData(userKeys.lists(), context.previousUsers);
        }
        
        if (context?.previousUser) {
          queryClient.setQueryData(userKeys.detail(user.id), context.previousUser);
        }
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(userKeys.lists());
        queryClient.invalidateQueries(userKeys.detail(user.id));
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update User'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### Removing an Item Optimistically

```tsx
import { useApiMutation } from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/queryKeyFactory';
import { optimisticRemoveItem } from '@/core/api/utils/optimisticUpdates';
import { useQueryClient } from '@tanstack/react-query';

function DeleteUserOptimistic({ user }) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useApiMutation(
    `/users/${user.id}`,
    {
      method: 'DELETE',
      onMutate: async () => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(userKeys.lists());

        // Remove the user optimistically
        const previousUsers = optimisticRemoveItem({
          queryClient,
          queryKey: userKeys.lists(),
          id: user.id,
          getItemId: item => item.id
        });

        return { previousUsers };
      },
      onError: (err, variables, context) => {
        // Revert to previous state on error
        if (context?.previousUsers) {
          queryClient.setQueryData(userKeys.lists(), context.previousUsers);
        }
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(userKeys.lists());
      }
    }
  );

  return (
    <button
      onClick={() => mutate()}
      disabled={isLoading}
    >
      {isLoading ? 'Deleting...' : 'Delete User'}
    </button>
  );
}
```
# Auth State Migration Guide

This guide explains how to migrate components from the old Context-based auth state to the new Zustand-based auth state.

## Why Migrate?

The new Zustand-based auth state provides several benefits:

- **Better Performance**: Zustand is more performant than React Context for state management.
- **Fine-grained Updates**: Components only re-render when their specific pieces of state change.
- **Simpler API**: Zustand provides a simpler API for state management.
- **Better DevTools**: Zustand integrates with Redux DevTools for better debugging.
- **Follows Architecture Principles**: Aligns with our architecture principles for state management.

## Migration Steps

### Step 1: Use Selector Hooks Instead of Context

**Before:**

```tsx
import { useAuthContext } from '@/core/auth';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuthContext();
  
  return (
    <div>
      {isAuthenticated ? `Welcome, ${user?.firstName}!` : 'Please log in'}
    </div>
  );
};
```

**After:**

```tsx
import { useUser, useIsAuthenticated } from '@/core/auth';

const MyComponent = () => {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  
  return (
    <div>
      {isAuthenticated ? `Welcome, ${user?.firstName}!` : 'Please log in'}
    </div>
  );
};
```

### Step 2: Use Action Hooks for Auth Operations

**Before:**

```tsx
import { useAuthContext } from '@/core/auth';

const LoginButton = () => {
  const { login } = useAuthContext();
  
  const handleLogin = async () => {
    await login('user@example.com', 'password');
  };
  
  return <button onClick={handleLogin}>Log In</button>;
};
```

**After:**

```tsx
import { useAuthActions } from '@/core/auth';

const LoginButton = () => {
  const { login } = useAuthActions();
  
  const handleLogin = async () => {
    await login('user@example.com', 'password');
  };
  
  return <button onClick={handleLogin}>Log In</button>;
};
```

### Step 3: Use RBAC Helper Hooks

**Before:**

```tsx
import { useAuthContext } from '@/core/auth';

const AdminButton = () => {
  const { hasRole } = useAuthContext();
  
  if (!hasRole('ADMIN')) return null;
  
  return <button>Admin Action</button>;
};
```

**After:**

```tsx
import { useRbacHelpers } from '@/core/auth';

const AdminButton = () => {
  const { hasRole } = useRbacHelpers();
  
  if (!hasRole('ADMIN')) return null;
  
  return <button>Admin Action</button>;
};
```

### Step 4: Continue Using useAuth for Convenience

If you prefer a single hook with all auth functionality, you can continue using `useAuth` which now uses the Zustand store internally:

```tsx
import { useAuth } from '@/core/auth';

const ProfileComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <div>
      <h2>Welcome, {user?.firstName}!</h2>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};
```

## Available Hooks

The new auth state provides the following hooks:

- **useUser()** - Get the current user
- **useIsAuthenticated()** - Check if user is authenticated
- **useAuthLoading()** - Check if auth operations are in progress
- **useAuthError()** - Get any auth error
- **useRbacHelpers()** - Get RBAC helper functions (hasRole, hasPermission, hasAccess)
- **useAuthActions()** - Get auth actions (login, logout, refreshUserProfile)
- **useAuth()** - Get all auth functionality in a single hook (convenience method)

## Transition Period

During the transition period, both the Context-based API and the Zustand-based API will be available. However, the Context-based API is deprecated and will be removed in a future release.
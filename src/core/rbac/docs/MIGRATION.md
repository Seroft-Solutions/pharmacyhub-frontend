# RBAC State Migration Guide

This guide explains how to migrate from the Context-based RBAC state to the new Zustand-based RBAC state.

## Why Migrate?

The new Zustand-based RBAC state provides several benefits:

- **Better Performance**: Zustand is more performant than React Context for state management.
- **Fine-grained Updates**: Components only re-render when their specific pieces of state change.
- **Simpler API**: Zustand provides a simpler API for state management.
- **Built-in Persistence**: State can be persisted across page refreshes using Zustand middleware.
- **Better DevTools Integration**: Zustand integrates with Redux DevTools for better debugging.
- **Follows Architecture Principles**: Aligns with our architecture principles for state management.

## Migration Steps

### Step 1: Use Selector Hooks Instead of useRBAC

**Before:**

```tsx
import { useRBAC } from '@/core/rbac';

const MyComponent = () => {
  const { hasPermission, hasRole } = useRBAC();
  
  if (!hasPermission('users:read')) {
    return null;
  }
  
  return <div>User has permission to read users</div>;
};
```

**After:**

```tsx
import { usePermissionCheck, useRoleCheck } from '@/core/rbac/state';

const MyComponent = () => {
  const { hasPermission } = usePermissionCheck();
  const { hasRole } = useRoleCheck();
  
  if (!hasPermission('users:read')) {
    return null;
  }
  
  return <div>User has permission to read users</div>;
};
```

### Step 2: Use State Selectors for RBAC State

**Before:**

```tsx
import { useRBAC } from '@/core/rbac';

const MyComponent = () => {
  const { isInitialized, isLoading } = useRBAC();
  
  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }
  
  return <div>RBAC is ready</div>;
};
```

**After:**

```tsx
import { useIsRbacInitialized, useIsRbacLoading } from '@/core/rbac/state';

const MyComponent = () => {
  const isInitialized = useIsRbacInitialized();
  const isLoading = useIsRbacLoading();
  
  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }
  
  return <div>RBAC is ready</div>;
};
```

### Step 3: Use Action Selectors for RBAC Actions

**Before:**

```tsx
// This wasn't directly exposed in the previous API
import { rbacService } from '@/core/rbac/services/rbacService';

const MyComponent = () => {
  const handleReset = () => {
    rbacService.reset();
  };
  
  return <button onClick={handleReset}>Reset RBAC</button>;
};
```

**After:**

```tsx
import { useRbacActions } from '@/core/rbac/state';

const MyComponent = () => {
  const { reset } = useRbacActions();
  
  return <button onClick={reset}>Reset RBAC</button>;
};
```

### Step 4: Continue Using useRBAC for Backward Compatibility

If you prefer to keep using the `useRBAC` hook for now, you can continue to do so. The hook has been updated to use the Zustand store internally:

```tsx
import { useRBAC } from '@/core/rbac';

const MyComponent = () => {
  const rbac = useRBAC();
  
  if (!rbac.hasPermission('users:read')) {
    return null;
  }
  
  return <div>User has permission to read users</div>;
};
```

## Available Hooks

The new RBAC state provides the following hooks:

- **useUserPermissions()** - Get the current user permissions
- **useIsRbacInitialized()** - Check if RBAC is initialized
- **useIsRbacLoading()** - Check if RBAC is loading
- **useRbacError()** - Get any RBAC error
- **usePermissionCheck()** - Get permission check functions (hasPermission, hasAnyPermission, hasAllPermissions)
- **useRoleCheck()** - Get role check functions (hasRole, hasAnyRole, hasAllRoles)
- **useAuthorization()** - Get authorization functions (isAuthorized)
- **useRbacActions()** - Get RBAC actions (initialize, reset)
- **useRbacStore()** - Get the full RBAC store (only use this if you need direct access to the store)

## Transition Period

During the transition period, both the Context-based API and the Zustand-based API will be available. However, the Context-based API is deprecated and will be removed in a future release.
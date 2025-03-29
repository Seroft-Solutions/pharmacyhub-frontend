# RBAC State Management

This document explains the RBAC state management implementation using Zustand.

## Overview

The RBAC module uses Zustand for state management, providing a centralized store for all RBAC-related state and functionality. This includes:

- User permissions and roles
- Permission and role checking
- Authorization logic
- RBAC initialization and status

## Store Structure

The RBAC store is structured as follows:

```typescript
interface RbacStore {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  error: NormalizedError | null;
  userPermissions: UserPermissions | null;
  
  // Actions
  initialize: (permissions: UserPermissions) => void;
  reset: () => void;

  // Permission methods
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;

  // Role methods
  hasRole: (role: Role, checkInheritance?: boolean) => boolean;
  hasAnyRole: (roles: Role[], checkInheritance?: boolean) => boolean;
  hasAllRoles: (roles: Role[], checkInheritance?: boolean) => boolean;

  // Authorization methods
  isAuthorized: (rolesOrPermissions: (Role | Permission)[], options?: PermissionCheckOptions) => boolean;
}
```

## Middleware

The RBAC store uses the following middleware:

- **devtools**: For Redux DevTools integration
- **persist**: For persisting the state in localStorage

## Selectors

The RBAC store provides a set of selector hooks for accessing specific parts of the state:

### State Selectors

- **useUserPermissions()**: Get the current user permissions
- **useIsRbacInitialized()**: Check if RBAC is initialized
- **useIsRbacLoading()**: Check if RBAC is loading
- **useRbacError()**: Get any RBAC error

### Permission Selectors

- **usePermissionCheck()**: Get permission check functions
  - hasPermission
  - hasAnyPermission
  - hasAllPermissions

### Role Selectors

- **useRoleCheck()**: Get role check functions
  - hasRole
  - hasAnyRole
  - hasAllRoles

### Authorization Selectors

- **useAuthorization()**: Get authorization functions
  - isAuthorized

### Action Selectors

- **useRbacActions()**: Get RBAC actions
  - initialize
  - reset

## Helper Functions

The RBAC store also provides some helper functions:

- **getUserPermissions()**: Get all user permissions
- **getUserRoles()**: Get all user roles

## Integration with Context API

For backward compatibility, the RBAC context and provider still exist, but they now use the Zustand store internally. This ensures that existing components that use the RBAC context still work correctly.

## Usage Examples

### Basic Permission Check

```tsx
import { usePermissionCheck } from '@/core/rbac/state';

const MyComponent = () => {
  const { hasPermission } = usePermissionCheck();
  
  if (!hasPermission('users:read')) {
    return null;
  }
  
  return <div>User has permission to read users</div>;
};
```

### Role Check with Inheritance

```tsx
import { useRoleCheck } from '@/core/rbac/state';

const MyComponent = () => {
  const { hasRole } = useRoleCheck();
  
  if (!hasRole('admin', true)) {
    return null;
  }
  
  return <div>User has admin role or inherits from it</div>;
};
```

### Authorization Check

```tsx
import { useAuthorization } from '@/core/rbac/state';

const MyComponent = () => {
  const { isAuthorized } = useAuthorization();
  
  if (!isAuthorized(['admin', 'users:read'])) {
    return null;
  }
  
  return <div>User is authorized</div>;
};
```

### Checking RBAC Status

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

### Initializing RBAC

```tsx
import { useRbacActions } from '@/core/rbac/state';

const MyComponent = () => {
  const { initialize } = useRbacActions();
  
  useEffect(() => {
    // Initialize RBAC with user permissions
    initialize({
      roles: ['user'],
      permissions: ['users:read', 'articles:read']
    });
  }, [initialize]);
  
  return <div>Initializing RBAC...</div>;
};
```
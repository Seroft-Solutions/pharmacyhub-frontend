# Role-Based Access Control (RBAC) Module Documentation

## Overview

The RBAC module provides comprehensive permission and role-based access control for the PharmacyHub application. This module follows the component design principles, ensuring each component has a single responsibility, maintains size limitations, and implements clear interfaces.

## Directory Structure

```
/core/rbac/
├── api/                # API-related functions and query keys
├── components/         # UI components for access control
├── constants/          # RBAC-related constants
├── contexts/           # React contexts for RBAC and features
├── docs/               # Documentation
├── hooks/              # Custom hooks for RBAC functionality
├── registry/           # Feature registry
├── services/           # Core RBAC services
├── state/              # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── index.ts            # Public API exports
└── permissions.ts      # Permission definitions
```

## Core Components

### Contexts

#### RBACProvider
- **File**: `contexts/RBACProvider.tsx`
- **Purpose**: Provides RBAC functionality to the application
- **Usage**: Wrap your application with this provider to enable RBAC

```jsx
import { RBACProvider } from '@/core/rbac';

function App() {
  return (
    <RBACProvider initialPermissions={userPermissions}>
      <YourApp />
    </RBACProvider>
  );
}
```

#### FeatureProvider
- **File**: `contexts/FeatureContext.tsx`
- **Purpose**: Provides feature flag functionality
- **Usage**: Automatically wrapped by RBACProvider

### Hooks

#### useRBAC
- **File**: `hooks/useRBAC.ts`
- **Purpose**: Access RBAC context in components
- **Usage**: For accessing all RBAC functions

```jsx
import { useRBAC } from '@/core/rbac';

function Component() {
  const { hasPermission, hasRole } = useRBAC();
  
  // Use hasPermission, hasRole, etc.
}
```

#### usePermission
- **File**: `hooks/usePermission.ts`
- **Purpose**: Check for a specific permission
- **Usage**: When you need to check a single permission

```jsx
import { usePermission } from '@/core/rbac';

function Component() {
  const { hasPermission } = usePermission('MANAGE_USERS');
  
  if (hasPermission) {
    // Render or perform action
  }
}
```

#### usePermissions
- **File**: `hooks/usePermissions.ts`
- **Purpose**: Check for multiple permissions
- **Usage**: When you need to check multiple permissions

```jsx
import { usePermissions } from '@/core/rbac';

function Component() {
  const { hasPermission } = usePermissions(['CREATE_USER', 'EDIT_USER']);
  
  if (hasPermission) {
    // Render or perform action
  }
}
```

#### useRole
- **File**: `hooks/useRole.ts`
- **Purpose**: Check for a specific role
- **Usage**: When you need to check if the user has a specific role

```jsx
import { useRole } from '@/core/rbac';

function Component() {
  const { hasRole } = useRole('ADMIN');
  
  if (hasRole) {
    // Render or perform action
  }
}
```

#### useFeatureAccess
- **File**: `hooks/useFeatureAccess.ts`
- **Purpose**: Check if a feature is accessible
- **Usage**: When you need to check feature access

```jsx
import { useFeatureAccess } from '@/core/rbac';

function Component() {
  const { hasAccess } = useFeatureAccess('ADVANCED_REPORTING');
  
  if (hasAccess) {
    // Render feature
  }
}
```

### Components

#### PermissionGuard
- **File**: `components/PermissionGuard.tsx`
- **Purpose**: Conditionally render content based on permissions
- **Usage**: Wrap content that requires specific permissions

```jsx
import { PermissionGuard } from '@/core/rbac';

function Component() {
  return (
    <PermissionGuard 
      permissions="MANAGE_USERS"
      fallback={<AccessDenied />}
    >
      <UserManagement />
    </PermissionGuard>
  );
}
```

#### RoleGuard
- **File**: `components/RoleGuard.tsx`
- **Purpose**: Conditionally render content based on roles
- **Usage**: Wrap content that requires specific roles

```jsx
import { RoleGuard } from '@/core/rbac';

function Component() {
  return (
    <RoleGuard 
      roles="ADMIN"
      fallback={<AccessDenied />}
    >
      <AdminPanel />
    </RoleGuard>
  );
}
```

#### FeatureGuard
- **File**: `components/FeatureGuard.tsx`
- **Purpose**: Conditionally render content based on feature access
- **Usage**: Wrap content for feature-gated functionality

```jsx
import { FeatureGuard } from '@/core/rbac';

function Component() {
  return (
    <FeatureGuard 
      feature="ADVANCED_REPORTING"
      fallback={<FeatureUnavailable />}
    >
      <AdvancedReports />
    </FeatureGuard>
  );
}
```

### Services

#### rbacService
- **File**: `services/rbacService.ts`
- **Purpose**: Core RBAC functionality
- **Usage**: Used internally by hooks and components

#### featureFlagService
- **File**: `services/featureFlagService.ts`
- **Purpose**: Feature flag management
- **Usage**: Used internally by hooks and components

## Types

### Permission
String literal type representing a permission.

### Role
String literal type representing a role.

### UserPermissions
Object containing user's permissions and roles.

```typescript
interface UserPermissions {
  permissions: Permission[];
  roles: Role[];
}
```

### PermissionCheckOptions
Options for permission checking.

```typescript
interface PermissionCheckOptions {
  all?: boolean;
  throwOnError?: boolean;
}
```

### More types are available in the `types/` directory.

## Utilities

The RBAC module includes several utility functions in the `utils/` directory:

- **permissionErrors.ts**: Error handling for permissions
- **errorUtils.ts**: Error utilities for RBAC functions

## Initialization

```typescript
import { initializeRbac } from '@/core/rbac';

// Initialize at application startup
initializeRbac();
```

## Best Practices

1. **Use Specific Hooks**: Prefer specific hooks like `usePermission` over `useRBAC` when possible.

2. **Component Guards**: Use the component guards to protect UI sections rather than conditional rendering.

3. **Error Handling**: Use the `throwOnError` option when you want to handle permission errors.

4. **Feature Flags**: Use feature flags for gradual rollouts and A/B testing.

5. **Documentation**: Document all permission and role requirements in your components.

## Refactoring Notes

The RBAC module has been refactored to follow component design principles:

1. **Single Responsibility**: Each component has a focused purpose
2. **Size Limitations**: Components stay under 200 lines
3. **Function Length**: Functions stay under 30 lines
4. **Clear Interfaces**: Well-defined interfaces between components

This refactoring improves code maintainability, testability, and overall quality.

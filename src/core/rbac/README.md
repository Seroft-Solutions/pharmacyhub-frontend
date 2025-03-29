# RBAC (Role-Based Access Control) Module

## Overview

The RBAC module provides comprehensive permission and role-based access control for the PharmacyHub application. It enables components to check user permissions, roles, and feature access in a declarative way.

## Features

- **Permission Checking**: Check if a user has specific permissions
- **Role Management**: Check if a user has specific roles
- **UI Protection**: Guard components that require specific permissions or roles
- **Feature Flags**: Enable or disable features based on access control
- **Centralized Access Control**: Consistent access control across the application

## Documentation

For detailed documentation, see:

- [RBAC Documentation](./docs/RBAC_DOCUMENTATION.md) - Comprehensive module documentation
- [RBAC Usage Guide](./docs/RBAC_USAGE_GUIDE.md) - Developer guide for using RBAC
- [Component Analysis](./docs/COMPONENT_ANALYSIS.md) - Analysis of the module's components and structure

## Getting Started

### Setup

```tsx
// _app.tsx
import { RBACProvider, initializeRbac } from '@/core/rbac';

// Initialize RBAC
initializeRbac();

function MyApp({ Component, pageProps }: AppProps) {
  // Get user permissions from auth service
  const userPermissions = getUserPermissions();
  
  return (
    <RBACProvider initialPermissions={userPermissions}>
      <Component {...pageProps} />
    </RBACProvider>
  );
}
```

### Basic Usage

```tsx
// Using hooks
import { usePermission, useRole } from '@/core/rbac';

function MyComponent() {
  const { hasPermission } = usePermission('MANAGE_USERS');
  const { hasRole } = useRole('ADMIN');
  
  if (hasPermission && hasRole) {
    return <AdminPanel />;
  }
  
  return <AccessDenied />;
}

// Using guards
import { PermissionGuard, RoleGuard } from '@/core/rbac';

function MyProtectedComponent() {
  return (
    <PermissionGuard 
      permissions="MANAGE_USERS"
      fallback={<AccessDenied />}
    >
      <RoleGuard 
        roles="ADMIN"
        fallback={<AccessDenied />}
      >
        <AdminPanel />
      </RoleGuard>
    </PermissionGuard>
  );
}
```

## Architecture

The RBAC module follows component design principles:

- **Single Responsibility**: Each component has a clear, focused purpose
- **Size Limitations**: Components stay under 200 lines
- **Function Length**: Functions stay under 30 lines
- **Clear Interfaces**: Well-defined interfaces between components

## Testing

Run tests with:

```bash
npm test -- --testPathPattern=rbac
```

## Folder Structure

- `/api` - API integrations
- `/components` - UI guard components
- `/constants` - RBAC constants
- `/contexts` - React contexts
- `/docs` - Documentation
- `/hooks` - React hooks
- `/registry` - Feature registry
- `/services` - Core services
- `/state` - State management
- `/types` - TypeScript types
- `/utils` - Utility functions

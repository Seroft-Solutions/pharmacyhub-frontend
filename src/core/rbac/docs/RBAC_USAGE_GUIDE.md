# RBAC Usage Guide for Developers

## Introduction

The Role-Based Access Control (RBAC) module provides robust permission and role-based access control capabilities for the PharmacyHub application. This guide will help you understand how to use the RBAC module effectively in your development work.

## Getting Started

### Setup

The RBAC module is initialized at the application startup:

```tsx
// _app.tsx or similar
import { RBACProvider, initializeRbac } from '@/core/rbac';

// Initialize RBAC services
initializeRbac();

function MyApp({ Component, pageProps }: AppProps) {
  // Get user permissions from your auth service
  const userPermissions = getUserPermissions();
  
  return (
    <RBACProvider initialPermissions={userPermissions}>
      <Component {...pageProps} />
    </RBACProvider>
  );
}
```

### Basic Permission Checking

The simplest way to check permissions is using the `usePermission` hook:

```tsx
import { usePermission } from '@/core/rbac';

function UserManagementPanel() {
  const { hasPermission, isLoading } = usePermission('MANAGE_USERS');
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!hasPermission) {
    return <AccessDenied />;
  }
  
  return <UserManagementUI />;
}
```

### Using Guards for UI Protection

For a more declarative approach, use guard components:

```tsx
import { PermissionGuard } from '@/core/rbac';

function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Basic usage */}
      <PermissionGuard 
        permissions="VIEW_STATISTICS"
        fallback={<p>You don't have access to statistics</p>}
      >
        <Statistics />
      </PermissionGuard>
      
      {/* Multiple permissions (ANY) */}
      <PermissionGuard 
        permissions={['MANAGE_USERS', 'VIEW_USERS']}
        fallback={<p>No access to user management</p>}
      >
        <UserPanel />
      </PermissionGuard>
      
      {/* Multiple permissions (ALL) */}
      <PermissionGuard 
        permissions={['EDIT_SETTINGS', 'PUBLISH_SETTINGS']}
        options={{ all: true }}
        fallback={<p>You need both edit and publish permissions</p>}
      >
        <SettingsPanel />
      </PermissionGuard>
    </div>
  );
}
```

### Role-Based Access Control

Similar to permission checking, you can check roles:

```tsx
import { useRole, RoleGuard } from '@/core/rbac';

// Using the hook
function AdminTools() {
  const { hasRole } = useRole('ADMIN');
  
  if (!hasRole) {
    return null;
  }
  
  return <AdminToolsUI />;
}

// Using the guard component
function ManagerView() {
  return (
    <RoleGuard 
      roles={['MANAGER', 'ADMIN']} 
      fallback={<p>Managers only</p>}
    >
      <ManagementDashboard />
    </RoleGuard>
  );
}
```

### Feature Flags

For feature-gated functionality:

```tsx
import { useFeatureAccess, FeatureGuard } from '@/core/rbac';

// Using the hook
function BetaFeature() {
  const { hasAccess } = useFeatureAccess('NEW_REPORTING_TOOLS');
  
  if (!hasAccess) {
    return null;
  }
  
  return <NewReportingUI />;
}

// Using the guard component
function FeatureShowcase() {
  return (
    <div>
      <FeatureGuard 
        feature="ADVANCED_ANALYTICS" 
        fallback={<p>Coming soon!</p>}
      >
        <AdvancedAnalytics />
      </FeatureGuard>
    </div>
  );
}
```

## Advanced Usage

### Combining Permissions and Roles

For complex access scenarios, you can use the `useRBAC` hook:

```tsx
import { useRBAC } from '@/core/rbac';

function ComplexAccessComponent() {
  const { hasPermission, hasRole, isAuthorized } = useRBAC();
  
  // Check specific permission
  const canManageUsers = hasPermission('MANAGE_USERS');
  
  // Check specific role
  const isAdmin = hasRole('ADMIN');
  
  // Complex authorization check (ANY of these)
  const canAccess = isAuthorized([
    'ADMIN', // Role
    'MANAGE_DASHBOARD', // Permission
    'VIEW_REPORTS' // Permission
  ]);
  
  // Use these variables for conditional rendering
}
```

### Handling Loading States

All RBAC hooks provide loading states:

```tsx
import { usePermission } from '@/core/rbac';

function ProtectedComponent() {
  const { hasPermission, isLoading, error } = usePermission('SOME_PERMISSION');
  
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  if (error) {
    return <ErrorDisplay message={error.message} />;
  }
  
  if (!hasPermission) {
    return <AccessDenied />;
  }
  
  return <ProtectedContent />;
}
```

### Dynamic Permission Checking

For runtime permission checking:

```tsx
import { useRBAC } from '@/core/rbac';

function DynamicPermissionComponent({ requiredPermission }) {
  const { hasPermission } = useRBAC();
  
  const canAccess = hasPermission(requiredPermission);
  
  if (!canAccess) {
    return <AccessDenied />;
  }
  
  return <ProtectedContent />;
}
```

### Error Handling

You can configure permission checks to throw errors:

```tsx
import { usePermission } from '@/core/rbac';

function CriticalComponent() {
  try {
    // This will throw an error if the permission check fails
    const { hasPermission } = usePermission('CRITICAL_OPERATION', { 
      throwOnError: true 
    });
    
    // If we get here, the permission check passed
    return <CriticalOperation />;
  } catch (error) {
    // Handle the permission error
    console.error('Permission error:', error);
    return <CriticalError error={error} />;
  }
}
```

## Working with Backend Integration

### Syncing Permissions with Backend

```tsx
import { useEffect } from 'react';
import { useRBAC } from '@/core/rbac';
import { useUserQuery } from '@/api/hooks';

function PermissionSyncComponent() {
  const { data: user, isLoading } = useUserQuery();
  const rbac = useRBAC();
  
  useEffect(() => {
    if (user && !isLoading) {
      // Update RBAC with latest permissions from backend
      rbac.updatePermissions({
        permissions: user.permissions,
        roles: user.roles
      });
    }
  }, [user, isLoading, rbac]);
  
  // Rest of component
}
```

### Server-Side Permission Checks

Always perform permission checks on both client and server:

```tsx
// Client-side
import { usePermission } from '@/core/rbac';

function ProtectedComponent() {
  const { hasPermission } = usePermission('EDIT_USERS');
  
  if (!hasPermission) {
    return <AccessDenied />;
  }
  
  return <UserEditForm onSubmit={handleSubmit} />;
}

// Server-side API route or middleware
function handleUserEdit(req, res) {
  // Check permission on server
  if (!hasPermission(req.user, 'EDIT_USERS')) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  
  // Process edit request
}
```

## Best Practices

1. **Use Specific Hooks**: Use the most specific hook for your needs (`usePermission` over `useRBAC` when possible).

2. **Consistent Protection**: Protect both UI and API routes with the same permission checks.

3. **Error Handling**: Handle loading states and errors gracefully.

4. **Permission Naming**: Use consistent naming conventions for permissions (e.g., `VERB_NOUN`).

5. **Documentation**: Document required permissions in component JSDoc comments.

6. **Testing**: Write tests for permission-protected components with different permission scenarios.

7. **Fallbacks**: Always provide meaningful fallbacks for guard components.

8. **Feature Flags**: Use feature flags for gradual rollouts and A/B testing.

## Common Pitfalls

1. **Forgetting Server Validation**: Always validate permissions on both client and server.

2. **Neglecting Loading States**: Handle loading states to prevent flickering UI.

3. **Deep Nesting Guards**: Avoid deeply nesting multiple guard components; combine permissions instead.

4. **Hardcoding Permissions**: Use constants for permission strings to avoid typos.

5. **Too Many Permissions**: Group related operations under a single permission when appropriate.

6. **UI Leaks**: Ensure protected information doesn't leak through in error states or loading states.

## Conclusion

The RBAC module provides a flexible and powerful way to implement access control in your application. By following these guidelines, you can ensure a secure and maintainable implementation.

If you have questions or need assistance, refer to the main RBAC documentation or contact the core architecture team.

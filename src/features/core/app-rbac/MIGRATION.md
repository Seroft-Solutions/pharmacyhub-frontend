## Using Constants Instead of Strings

### Before

```tsx
<PermissionCheck permission="DELETE_USERS" verifyOnBackend={true}>
  <DeleteUserButton />
</PermissionCheck>

<AccessCheck 
  roles={['ADMIN']} 
  permissions={['MANAGE_SETTINGS']}
  requireAll={true}
  verifyOnBackend={true}
>
  <SystemSettings />
</AccessCheck>
```

### After

```tsx
import { Permission, Role } from '@/features/rbac';

<PermissionCheck permission={Permission.DELETE_USERS} verifyOnBackend={true}>
  <DeleteUserButton />
</PermissionCheck>

<AccessCheck 
  roles={[Role.ADMIN]} 
  permissions={[Permission.MANAGE_SETTINGS]}
  requireAll={true}
  verifyOnBackend={true}
>
  <SystemSettings />
</AccessCheck>
```

## Feature Guards

The new RBAC feature adds support for feature-level access control:

```tsx
import { FeatureGuard, Feature, Permission, Role } from '@/features/rbac';

// Basic feature guard (just checks if feature is enabled)
<FeatureGuard feature={Feature.EXAMS}>
  <ExamModule />
</FeatureGuard>

// Feature guard with permission requirements
<FeatureGuard 
  feature={Feature.LICENSING} 
  permissionsRequired={[Permission.VIEW_EXAMS, Permission.TAKE_EXAM]}
  requireAll={true}
>
  <LicensingModule />
</FeatureGuard>

// Feature guard with role requirements
<FeatureGuard 
  feature={Feature.ANALYTICS} 
  rolesRequired={[Role.ADMIN, Role.PHARMACY_MANAGER]}
  requireAll={false}
>
  <AnalyticsModule />
</FeatureGuard>
```# RBAC Migration Guide

This guide explains how to migrate from the old auth-based RBAC system to the new standalone RBAC feature.

## Overview

The RBAC (Role-Based Access Control) functionality has been extracted from the `auth` feature into its own standalone feature for better modularity and reusability. This guide will help you update your code to use the new RBAC feature.

## Import Changes

### Before

```tsx
import { PermissionGuard, RoleGuard, Permission, Role } from '@/features/auth';
```

### After

```tsx
import { PermissionGuard, RoleGuard, Permission, Role } from '@/features/rbac';
```

## Component Migration

### Permission Guards

#### Before

```tsx
import { PermissionGuard, Permission } from '@/features/auth';

<PermissionGuard permission={Permission.VIEW_EXAMS}>
  <ExamsList />
</PermissionGuard>
```

#### After

```tsx
import { PermissionGuard, Permission } from '@/features/rbac';

<PermissionGuard permission={Permission.VIEW_EXAMS}>
  <ExamsList />
</PermissionGuard>
```

### Role Guards

#### Before

```tsx
import { RoleGuard, Role } from '@/features/auth';

<RoleGuard role={Role.ADMIN}>
  <AdminPanel />
</RoleGuard>
```

#### After

```tsx
import { RoleGuard, Role } from '@/features/rbac';

<RoleGuard role={Role.ADMIN}>
  <AdminPanel />
</RoleGuard>
```

### Admin and Manager Guards

#### Before

```tsx
import { AdminGuard, ManagerGuard } from '@/features/auth/ui/rbac/RoleGuards';

<AdminGuard>
  <AdminDashboard />
</AdminGuard>

<ManagerGuard>
  <ManagerDashboard />
</ManagerGuard>
```

#### After

```tsx
import { AdminGuard, ManagerGuard } from '@/features/rbac';

<AdminGuard>
  <AdminDashboard />
</AdminGuard>

<ManagerGuard>
  <ManagerDashboard />
</ManagerGuard>
```

## Hook Migration

### Before

```tsx
import { useAuth } from '@/features/auth';

const MyComponent = () => {
  const { hasPermission, hasRole } = useAuth();
  
  if (hasPermission('EDIT_EXAM')) {
    // ...
  }
  
  if (hasRole('ADMIN')) {
    // ...
  }
};
```

### After

```tsx
import { useAccess } from '@/features/rbac';

const MyComponent = () => {
  const { hasPermission, hasRole } = useAccess();
  
  if (hasPermission('EDIT_EXAM')) {
    // ...
  }
  
  if (hasRole('ADMIN')) {
    // ...
  }
};
```

## Backend Verification

The new RBAC feature adds support for backend verification of permissions and roles. Here's how to use it:

```tsx
import { PermissionCheck, AccessCheck } from '@/features/rbac';

// Verify permission on the backend
<PermissionCheck permission="DELETE_USERS" verifyOnBackend={true}>
  <DeleteUserButton />
</PermissionCheck>

// Complex access check with backend verification
<AccessCheck 
  roles={['ADMIN']} 
  permissions={['MANAGE_SETTINGS']}
  requireAll={true}
  verifyOnBackend={true}
>
  <SystemSettings />
</AccessCheck>
```

## RequireAuth with RBAC

The `RequireAuth` component from the auth feature now supports RBAC parameters:

```tsx
import { RequireAuth } from '@/features/auth';

<RequireAuth
  requiredRoles={['ADMIN']}
  requiredPermissions={['MANAGE_SETTINGS']}
  requireAll={true}
>
  <ProtectedPage />
</RequireAuth>
```

## API Integration

The new RBAC feature includes TanStack Query hooks for data fetching:

```tsx
import { useAccessProfile, useCheckPermissions } from '@/features/rbac';

// Get current user's access profile
const { data: accessProfile } = useAccessProfile();

// Check specific permissions on the backend
const { data: permissionCheck } = useCheckPermissions([
  'EDIT_EXAM',
  'DELETE_EXAM'
]);
```

## Deprecation Timeline

The old RBAC components in the auth feature are now marked as deprecated and will be removed in a future version. Please migrate to the new RBAC feature as soon as possible.

## Need Help?

If you encounter any issues during migration, please refer to the [RBAC feature documentation](README.md) or contact the development team.

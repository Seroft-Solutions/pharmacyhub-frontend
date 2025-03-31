# RBAC Integration Guide for Exams Preparation

This guide documents how the exams-preparation feature integrates with the core RBAC module, following the Core as Foundation principle.

## Overview

The exams-preparation feature leverages the core RBAC module for all permission-based access control:

```typescript
import { usePermissions, useRoles } from '@/core/rbac/hooks';
import { registerFeature } from '@/core/rbac/registry';
```

## Permission Structure

### Exam Permissions

The feature defines exam-specific permissions in a dedicated enum:

```typescript
export enum ExamPermission {
  VIEW_EXAMS = 'exam:view',
  TAKE_EXAM = 'exam:take',
  VIEW_RESULTS = 'exam:results:view',
  CREATE_EXAM = 'exam:create',
  EDIT_EXAM = 'exam:edit',
  DELETE_EXAM = 'exam:delete',
  MANAGE_PREMIUM = 'exam:premium:manage',
}
```

### Permission Constants

For more granular control, the feature defines permission constants:

```typescript
export const EXAM_PERMISSIONS = {
  // View permissions
  VIEW: 'exams-preparation:view',
  VIEW_DETAILS: 'exams-preparation:view-details',
  VIEW_RESULTS: 'exams-preparation:view-results',
  
  // Create/Edit permissions
  CREATE: 'exams-preparation:create',
  EDIT: 'exams-preparation:edit',
  DELETE: 'exams-preparation:delete',
  
  // Management permissions
  PUBLISH: 'exams-preparation:publish',
  ARCHIVE: 'exams-preparation:archive',
  
  // ... more permissions
};
```

## Role-Based Access Control

The feature defines role-permission mappings:

```typescript
export const ExamRole = {
  STUDENT: [
    ExamPermission.VIEW_EXAMS,
    ExamPermission.TAKE_EXAM,
    ExamPermission.VIEW_RESULTS,
  ],
  INSTRUCTOR: [
    ExamPermission.VIEW_EXAMS,
    ExamPermission.TAKE_EXAM,
    ExamPermission.VIEW_RESULTS,
    ExamPermission.CREATE_EXAM,
    ExamPermission.EDIT_EXAM,
  ],
  ADMIN: Object.values(ExamPermission),
};
```

## Integration with Core RBAC

### Permission Hooks

The feature uses core RBAC hooks for permission checks:

```typescript
const { hasPermission, checkPermissions } = usePermissions();
const { hasRole } = useRoles();

// Check single permission
if (hasPermission(ExamPermission.EDIT_EXAM)) {
  // Allow edit
}

// Check multiple permissions
if (checkPermissions([
  ExamPermission.CREATE_EXAM,
  ExamPermission.EDIT_EXAM
])) {
  // Allow full exam management
}

// Check roles
if (hasRole('admin')) {
  // Show admin features
}
```

### Custom Permission Hook

The feature provides a custom hook that wraps core RBAC functionality:

```typescript
export function useExamPermissions() {
  const { hasPermission, checkPermissions } = usePermissions();
  const { hasRole } = useRoles();
  
  return {
    // Core functionality
    hasPermission,
    checkPermissions,
    hasRole,
    
    // Exam-specific convenience methods
    canViewExam: () => hasPermission(ExamPermission.VIEW_EXAMS),
    canTakeExam: () => hasPermission(ExamPermission.TAKE_EXAM),
    // ... more convenience methods
    
    // Role-based convenience methods
    isAdmin: () => hasRole('admin'),
    isInstructor: () => hasRole('instructor'),
    isStudent: () => hasRole('student'),
  };
}
```

### Permission Registration

The feature registers its permissions with the core RBAC system:

```typescript
// In register.ts
export function registerExamsRBAC() {
  registerFeature({
    name: 'exams-preparation',
    permissions: [
      // All permissions from constants
    ],
    roles: {
      admin: [ /* admin permissions */ ],
      instructor: [ /* instructor permissions */ ],
      student: [ /* student permissions */ ],
    },
    defaultEnabled: true,
  });
}
```

## Permission Guards

### PermissionGuard Component

The feature includes a PermissionGuard component built on core RBAC:

```typescript
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback,
  loadingComponent = <LoadingState message="Checking permissions..." />
}) => {
  const { hasPermission, checkPermissions, isLoading } = usePermissions();

  // Handle loading state
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Check permissions and render accordingly
  if (Array.isArray(permission)) {
    if (!checkPermissions(permission)) {
      return <>{fallback || <AccessDenied />}</>;
    }
  } else if (!hasPermission(permission)) {
    return <>{fallback || <AccessDenied />}</>;
  }

  return <>{children}</>;
};
```

### Combined Auth and Permission Guards

The feature supports combining authentication and permission checks:

```tsx
<AuthGuard fallbackUrl="/login">
  <PermissionGuard permission={EXAM_PERMISSIONS.EDIT}>
    <ExamEditor />
  </PermissionGuard>
</AuthGuard>
```

## Component-Level Access Control

Use permission checks within components:

```tsx
function ExamActionButtons({ examId }) {
  const { canEditExam, canDeleteExam } = useExamPermissions();
  
  return (
    <div className="flex gap-2">
      {canEditExam() && (
        <Button onClick={() => editExam(examId)}>Edit</Button>
      )}
      
      {canDeleteExam() && (
        <Button variant="destructive" onClick={() => deleteExam(examId)}>Delete</Button>
      )}
    </div>
  );
}
```

## Server-Side Permission Checks

For server components and API routes:

```tsx
import { getServerSession } from '@/core/auth/server';
import { checkPermission } from '@/core/rbac/server';
import { EXAM_PERMISSIONS } from '../api/constants/permissions';

export default async function AdminPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  const hasPermission = await checkPermission(
    session.user.id, 
    EXAM_PERMISSIONS.EDIT
  );
  
  if (!hasPermission) {
    redirect('/access-denied');
  }
  
  // Render admin page
  return <AdminContent />;
}
```

## Best Practices

1. **Use Core RBAC Hooks**: Always use core RBAC hooks for permission checks
2. **Consistent Permission Naming**: Use a consistent naming scheme for permissions
3. **Role-Based UI**: Customize UI based on user roles and permissions
4. **Guard Components**: Use PermissionGuard for declarative access control
5. **Document Permissions**: Keep permissions documented in one place
6. **Register with Core**: Register all permissions with the core RBAC registry
7. **Progressive Enhancement**: Design for users with minimal permissions first

## Feature Flag Integration

The RBAC system also supports feature flags:

```typescript
import { useFeatureFlag } from '@/core/rbac/hooks';

function NewFeature() {
  const { isEnabled } = useFeatureFlag('new-exam-editor');
  
  if (!isEnabled) {
    return null;
  }
  
  return <NewExamEditor />;
}
```

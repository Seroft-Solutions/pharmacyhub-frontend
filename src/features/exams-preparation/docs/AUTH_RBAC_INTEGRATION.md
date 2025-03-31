# Auth & RBAC Integration Guide

This guide explains how to properly integrate with the core Auth and RBAC modules in the exams-preparation feature.

## Authentication Integration

### Using Core Auth Module

Always use the core auth module for user authentication:

```typescript
import { useAuth } from '@/core/auth';

function ExamComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Handle unauthenticated users
  if (!isAuthenticated) {
    return <AuthRequiredMessage />;
  }
  
  // Render component for authenticated users
  return <ExamContent user={user} />;
}
```

### Authentication Guards

Create reusable authentication guards:

```typescript
// src/features/exams-preparation/components/guards/AuthGuard.tsx
import { ReactNode } from 'react';
import { useAuth } from '@/core/auth';
import { LoadingSpinner } from '@/components/ui/loading';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return fallback || <div>Authentication required</div>;
  }
  
  return <>{children}</>;
}
```

### Server-Side Authentication

For server components and API routes, use server-side authentication:

```typescript
// In a server component
import { getServerSession } from '@/core/auth/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login?redirect=' + encodeURIComponent('/exams'));
  }
  
  // Render protected content
  return <ExamContent user={session.user} />;
}
```

## RBAC Integration

### Permission-Based Access Control

Use the core RBAC module for permission checks:

```typescript
import { usePermissions } from '@/core/rbac';

function AdminExamComponent() {
  const { hasPermission, isLoading } = usePermissions();
  
  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Check permission
  if (!hasPermission('exams:manage')) {
    return <AccessDeniedMessage />;
  }
  
  // Render admin component
  return <AdminExamContent />;
}
```

### Permission Guards

Create reusable permission guards:

```typescript
// src/features/exams-preparation/components/guards/PermissionGuard.tsx
import { ReactNode } from 'react';
import { usePermissions } from '@/core/rbac';
import { LoadingSpinner } from '@/components/ui/loading';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback 
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = usePermissions();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!hasPermission(permission)) {
    return fallback || <div>Access denied</div>;
  }
  
  return <>{children}</>;
}
```

### Feature-Specific Permissions

Define exam-specific permissions in a constants file:

```typescript
// src/features/exams-preparation/constants/permissions.ts
export const EXAM_PERMISSIONS = {
  VIEW: 'exams:view',
  CREATE: 'exams:create',
  EDIT: 'exams:edit',
  DELETE: 'exams:delete',
  MANAGE_QUESTIONS: 'exams:questions:manage',
  VIEW_RESULTS: 'exams:results:view',
  MANAGE_RESULTS: 'exams:results:manage',
};
```

Then use them consistently across the feature:

```typescript
import { EXAM_PERMISSIONS } from '../constants/permissions';
import { PermissionGuard } from '../components/guards/PermissionGuard';

function ExamAdminPanel() {
  return (
    <div>
      <PermissionGuard permission={EXAM_PERMISSIONS.VIEW}>
        <ExamList />
      </PermissionGuard>
      
      <PermissionGuard permission={EXAM_PERMISSIONS.CREATE}>
        <CreateExamButton />
      </PermissionGuard>
      
      <PermissionGuard permission={EXAM_PERMISSIONS.MANAGE_RESULTS}>
        <ResultsManagement />
      </PermissionGuard>
    </div>
  );
}
```

### Server-Side Permission Checks

For server components and API routes, use server-side permission checks:

```typescript
// In a server component
import { getServerSession } from '@/core/auth/server';
import { checkPermission } from '@/core/rbac/server';
import { redirect } from 'next/navigation';
import { EXAM_PERMISSIONS } from '../constants/permissions';

export default async function AdminPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login?redirect=' + encodeURIComponent('/exams/admin'));
  }
  
  const hasPermission = await checkPermission(
    session.user.id, 
    EXAM_PERMISSIONS.MANAGE_QUESTIONS
  );
  
  if (!hasPermission) {
    redirect('/access-denied');
  }
  
  // Render admin page
  return <AdminContent />;
}
```

## Role-Based UI Customization

Use the core RBAC module to customize UI based on user roles:

```typescript
import { useRoles } from '@/core/rbac';

function ExamDashboard() {
  const { hasRole } = useRoles();
  
  const isAdmin = hasRole('admin');
  const isInstructor = hasRole('instructor');
  const isStudent = hasRole('student');
  
  return (
    <div>
      <h1>Exams Dashboard</h1>
      
      {isAdmin && <AdminPanel />}
      
      {isInstructor && <InstructorTools />}
      
      {isStudent && <StudentExams />}
    </div>
  );
}
```

## Best Practices

1. **Consistent Permission Names**: Use a consistent naming scheme for permissions
2. **Central Definition**: Define all permissions in a constants file
3. **Guard Components**: Create reusable guard components
4. **Granular Permissions**: Use specific, granular permissions
5. **Server and Client Consistency**: Apply the same permission logic on both server and client
6. **Role-Based UI**: Customize UI based on user roles when appropriate
7. **Progressive Enhancement**: Design for users with minimal permissions, then enhance for those with more

## Migration Guide

For existing code in the exams-preparation feature:

1. Identify all authentication checks and update to use core auth module
2. Identify all permission checks and update to use core RBAC module
3. Define consistent permission constants
4. Create reusable guard components
5. Update server-side code to use core auth and RBAC server utilities

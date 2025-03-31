# Core Integration Improvements

This document outlines the improvements needed to better integrate the exams-preparation feature with core modules.

## Auth Integration Improvements

### Current State

The feature currently uses basic auth integration:

```typescript
import { useAuth } from '@/core/auth';

// In ExamAccessGuard.tsx
const { user, isLoading: authLoading } = useAuth();
```

### Recommended Improvements

1. **Enhanced Auth Guard**

Update `ExamAccessGuard.tsx` to leverage more core auth functionality:

```typescript
import { useAuth, AuthGuard } from '@/core/auth';
import { Spinner } from '@/core/ui/atoms/spinner';
import { AccessDenied } from '@/core/ui/molecules/access-denied';

interface ExamAccessGuardProps {
  examId: number;
  children: ReactNode;
}

export const ExamAccessGuard: React.FC<ExamAccessGuardProps> = ({ 
  examId, 
  children 
}) => {
  const { error } = useExamStore();
  
  // Use the core AuthGuard component instead of reimplementing
  return (
    <AuthGuard
      loadingComponent={<Spinner />}
      fallback={<AccessDenied redirectPath="/login" />}
    >
      {error ? <ErrorState message={error} /> : children}
    </AuthGuard>
  );
};
```

2. **Server-Side Auth Integration**

Add server-side auth integration for server components and API routes:

```typescript
// In a server component
import { getServerSession } from '@/core/auth/server';
import { redirect } from 'next/navigation';

export default async function ProtectedExamPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login?redirect=' + encodeURIComponent('/exams'));
  }
  
  // Render protected content
  return <ExamContent user={session.user} />;
}
```

## RBAC Integration Improvements

### Current State

The feature has a basic RBAC implementation:

```typescript
import { hasPermission, RBACProvider } from '@/core/rbac';

// Custom implementation
export const hasExamPermission = (permission: ExamPermission) => {
  return hasPermission(permission);
};
```

### Recommended Improvements

1. **Use Core RBAC Hooks**

Update RBAC implementation to use the full range of core RBAC hooks:

```typescript
// Instead of custom implementation
export const canViewExam = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.VIEW_EXAMS);
};

// Better component usage
function ExamAdminPanel() {
  const { hasPermission } = usePermissions();
  const { hasRole } = useRoles();
  
  const canManageExams = hasPermission(ExamPermission.MANAGE_EXAMS);
  const isAdmin = hasRole('admin');
  
  // Render based on permissions and roles
}
```

2. **Use Core Permission Guards**

Replace custom permission checking with core RBAC guard components:

```typescript
import { PermissionGuard } from '@/core/rbac/components';
import { ExamPermission } from '../constants/permissions';

function ExamEditor() {
  return (
    <PermissionGuard
      permission={ExamPermission.EDIT_EXAM}
      fallback={<AccessDenied message="You cannot edit exams" />}
    >
      <EditExamForm />
    </PermissionGuard>
  );
}
```

3. **Register Feature Permissions**

Register exam permissions with the core RBAC registry:

```typescript
// In src/features/exams-preparation/rbac/register.ts
import { registerFeature } from '@/core/rbac/registry';
import { ExamPermission, ExamRole } from './constants';

export function registerExamRBAC() {
  registerFeature({
    name: 'exams-preparation',
    permissions: Object.values(ExamPermission),
    roles: ExamRole,
    defaultEnabled: true,
  });
}

// Call this during app initialization
```

## Implementation Plan

1. **Auth Improvements**:
   - Update `ExamAccessGuard` to use core auth components
   - Add server-side auth integration for server components
   - Verify all auth checks use core auth module

2. **RBAC Improvements**:
   - Update RBAC implementation to use core RBAC hooks
   - Replace custom permission checking with core guards
   - Register exam permissions with core RBAC registry
   - Update documentation to reflect best practices

3. **Testing and Verification**:
   - Test all auth and RBAC integration points
   - Verify proper functionality with different user roles
   - Ensure consistent behavior between client and server

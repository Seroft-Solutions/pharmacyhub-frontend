# Auth Integration Guide for Exams Preparation Feature

This guide documents the proper integration of the exams-preparation feature with the core Auth module.

## Core Auth Integration

The exams-preparation feature fully leverages the core Auth module for all authentication-related functionality:

```typescript
import { useAuth } from '@/core/auth';
import { AuthGuard } from '@/core/auth/components';
```

## Guards and Protection

### Client-Side Protection

For client components that require authentication:

```typescript
import { AuthGuard } from '@/core/auth/components';
import { LoadingState } from '../atoms';

function ProtectedExamComponent() {
  return (
    <AuthGuard
      loadingComponent={<LoadingState message="Checking authentication..." />}
      fallbackUrl="/login?redirect=/exams"
    >
      <ExamContent />
    </AuthGuard>
  );
}
```

### Server-Side Protection

For server components that require authentication:

```typescript
import { getServerSession } from '@/core/auth/server';
import { redirect } from 'next/navigation';

export default async function ProtectedServerComponent() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login?redirect=' + encodeURIComponent('/exams'));
  }
  
  // Continue with authenticated content
  return <ExamContent user={session.user} />;
}
```

## Accessing User Information

Use the core auth hook to access user information:

```typescript
import { useAuth } from '@/core/auth';

function UserAwareComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <NotAuthenticatedMessage />;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

## Auth Status Flags

The core Auth module provides several useful status flags:

```typescript
const { 
  isAuthenticated,  // Is the user authenticated?
  isLoading,        // Is auth state loading?
  isError,          // Is there an auth error?
  isInitialized,    // Has auth been initialized?
} = useAuth();
```

## Working with Sessions

Use the session management utilities:

```typescript
import { useAuth } from '@/core/auth';

function SessionManager() {
  const { logout, refreshSession } = useAuth();
  
  const handleLogout = () => {
    logout();
    // Redirect or show logout message
  };
  
  const handleRefresh = async () => {
    await refreshSession();
    // Session refreshed
  };
  
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleRefresh}>Refresh Session</button>
    </div>
  );
}
```

## Advanced Auth Integration

### Custom ExamAccessGuard

The exams-preparation feature includes a specialized `ExamAccessGuard` that builds on the core AuthGuard:

```typescript
import { AuthGuard } from '@/core/auth/components';

export const ExamAccessGuard: React.FC<ExamAccessGuardProps> = ({ 
  examId, 
  children 
}) => {
  const { error } = useExamStore();
  
  return (
    <AuthGuard
      loadingComponent={<LoadingState message="Checking authentication..." />}
      fallbackUrl={`/login?redirect=/exams/${examId}`}
    >
      {error ? <ErrorState message={error} /> : children}
    </AuthGuard>
  );
};
```

### Combined Auth and RBAC Guards

For components that need both authentication and specific permissions:

```typescript
import { AuthGuard } from '@/core/auth/components';
import { PermissionGuard } from '@/core/rbac/components';
import { EXAM_PERMISSIONS } from '../api/constants/permissions';

function ProtectedAdminComponent() {
  return (
    <AuthGuard fallbackUrl="/login">
      <PermissionGuard 
        permission={EXAM_PERMISSIONS.EDIT}
        fallback={<AccessDeniedMessage />}
      >
        <AdminExamEditor />
      </PermissionGuard>
    </AuthGuard>
  );
}
```

## Session and Token Management

The exams-preparation feature leverages the core Auth module for all token management:

```typescript
import { useAuth } from '@/core/auth';

function ExamSession() {
  const { getToken, isSessionExpiring, extendSession } = useAuth();
  
  const callProtectedApi = async () => {
    const token = await getToken();
    // Use token in API call
  };
  
  useEffect(() => {
    if (isSessionExpiring) {
      // Prompt user to extend session
      extendSession();
    }
  }, [isSessionExpiring, extendSession]);
  
  // Component implementation
}
```

## Best Practices

1. **Use AuthGuard**: Always use the core AuthGuard component for protected routes and components
2. **Server-Side Auth**: Use getServerSession for server components and API routes
3. **Handle States**: Always handle loading and error states for auth operations
4. **Minimize Auth Logic**: Keep auth logic minimal in components by using guards
5. **Combine with RBAC**: Use auth and permission guards together for complete access control
6. **Consistent Redirects**: Use consistent redirect patterns across the feature

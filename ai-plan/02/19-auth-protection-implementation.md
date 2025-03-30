# Authentication and Authorization Implementation Plan

This document outlines the comprehensive plan for implementing authentication and authorization controls across the PharmacyHub Frontend, ensuring proper access control for different user roles.

## Current Implementation Analysis

The current authentication implementation has several issues:

1. **Inconsistent Auth Checks**: Authentication is verified differently across different parts of the application
2. **Duplicated Logic**: Auth verification logic is repeated in multiple components
3. **Mixed Responsibility**: Some components handle both rendering and authentication
4. **Unclear Role Checks**: Role-based access control is implemented inconsistently
5. **No Clear Auth Flow**: The authentication flow is not standardized across the application

## Authentication Strategy

We'll implement a layered authentication strategy:

1. **Layout-Level Authentication**: Each route group layout will handle authentication and redirection
2. **Route Guards**: Specific routes will have additional guards for fine-grained control
3. **Component-Level Guards**: UI components will conditionally render based on permissions
4. **API-Level Protection**: API routes will be protected with authentication middleware

## Implementation Details

### 1. Auth Context Provider

Create a centralized auth context provider that will be used across the application:

```tsx
// src/features/core/app-auth/context/AuthContext.tsx
'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/features/core/app-auth/types';
import { authService } from '@/features/core/app-auth/services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize authentication state
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up token refresh interval
    const refreshInterval = setInterval(() => {
      if (user) {
        authService.refreshToken().catch((error) => {
          console.error('Error refreshing token:', error);
          // Force logout if refresh fails
          logout();
        });
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      router.replace('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.replace('/login');
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Token refresh error:', error);
      // Force logout if refresh fails
      logout();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    hasPermission,
    login,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Layout-Level Authentication

Implement authentication checks at the layout level for different route groups:

#### Public Layout (Root)
```tsx
// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/core/app-auth/context";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PharmacyHub",
  description: "Your complete pharmacy management solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

#### Auth Layout (Unauthenticated Users Only)
```tsx
// src/app/(auth)/layout.tsx
'use client';

import { useAuth } from '@/features/core/app-auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthLoadingScreen } from '@/features/core/app-auth/components';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect authenticated users to dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Only show auth pages to unauthenticated users
  return !isAuthenticated ? (
    <div className="auth-layout">
      {children}
    </div>
  ) : null;
}
```

#### Dashboard Layout (Authenticated Users Only)
```tsx
// src/app/(dashboard)/layout.tsx
'use client';

import { useAuth } from '@/features/core/app-auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLoadingScreen } from '@/features/core/ui/components';
import { DashboardShell } from '@/features/shell/components';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect unauthenticated users to login
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <DashboardLoadingScreen />;
  }

  // Only show dashboard to authenticated users
  return isAuthenticated ? (
    <DashboardShell>
      {children}
    </DashboardShell>
  ) : null;
}
```

#### Admin Layout (Admin Users Only)
```tsx
// src/app/(admin)/layout.tsx
'use client';

import { useAuth } from '@/features/core/app-auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLoadingScreen } from '@/features/core/ui/components';
import { AdminShell } from '@/features/shell/components';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const isAdmin = hasRole('ADMIN') || hasRole('PER_ADMIN');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect unauthenticated users to login
        router.replace('/login');
      } else if (!isAdmin) {
        // Redirect non-admin users to dashboard
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return <AdminLoadingScreen />;
  }

  // Only show admin dashboard to authenticated admin users
  return isAuthenticated && isAdmin ? (
    <AdminShell>
      {children}
    </AdminShell>
  ) : null;
}
```

### 3. Route-Level Guards

Create reusable route guards that can be used to protect specific pages:

```tsx
// src/features/core/app-auth/guards/RouteGuard.tsx
'use client';

import { useAuth } from '@/features/core/app-auth/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingScreen } from '@/features/core/ui/components';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallbackPath?: string;
}

export const RouteGuard = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/dashboard',
}: RouteGuardProps) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.replace(fallbackPath);
      return;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.replace(fallbackPath);
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    requiredRole,
    requiredPermission,
    hasRole,
    hasPermission,
    router,
    fallbackPath,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
};
```

### 4. Component-Level Guards

Create component-level guards for conditional rendering based on roles and permissions:

```tsx
// src/features/core/app-auth/guards/RoleGuard.tsx
'use client';

import { useAuth } from '@/features/core/app-auth/context';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
}

export const RoleGuard = ({
  children,
  roles,
  fallback = null,
}: RoleGuardProps) => {
  const { hasRole } = useAuth();
  
  const hasAccess = roles.some(role => hasRole(role));
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// src/features/core/app-auth/guards/PermissionGuard.tsx
'use client';

import { useAuth } from '@/features/core/app-auth/context';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: string[];
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  children,
  permissions,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasPermission } = useAuth();
  
  const hasAccess = permissions.some(permission => hasPermission(permission));
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
```

### 5. Middleware for API Routes

Implement middleware for protecting API routes:

```tsx
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/features/core/app-auth/utils/jwt';

export async function middleware(request: NextRequest) {
  // Only apply middleware to /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Skip authentication for public API routes
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
  ];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Check for authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decodedToken = await verifyToken(token);
    
    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decodedToken.sub);
    requestHeaders.set('x-user-roles', decodedToken.roles.join(','));
    
    // Continue with modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
```

## Implementation Examples

### Protected Page Example

```tsx
// src/app/(dashboard)/settings/page.tsx
'use client';

import { useAuth } from '@/features/core/app-auth/context';
import { SettingsForm } from '@/features/settings/components';

export default function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      {user && <SettingsForm userId={user.id} />}
    </div>
  );
}
```

### Admin Feature Example

```tsx
// src/app/(admin)/users/page.tsx
'use client';

import { RouteGuard } from '@/features/core/app-auth/guards';
import { UsersManagement } from '@/features/admin/components';

export default function UsersManagementPage() {
  return (
    <RouteGuard requiredRole="ADMIN">
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Users Management</h1>
        <UsersManagement />
      </div>
    </RouteGuard>
  );
}
```

### Conditional UI Example

```tsx
// src/features/exams/components/ExamActions.tsx
'use client';

import { RoleGuard, PermissionGuard } from '@/features/core/app-auth/guards';
import { Button } from '@/components/ui/button';

interface ExamActionsProps {
  examId: string;
}

export function ExamActions({ examId }: ExamActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline">View Details</Button>
      
      <PermissionGuard permissions={['EXAM_TAKE']}>
        <Button variant="primary">Start Exam</Button>
      </PermissionGuard>
      
      <RoleGuard roles={['ADMIN', 'INSTRUCTOR']}>
        <Button variant="secondary">Edit Exam</Button>
        <Button variant="destructive">Delete Exam</Button>
      </RoleGuard>
    </div>
  );
}
```

## Authentication Flow

1. **Initial Load**:
   - Check localStorage for token
   - If token exists, validate and set user
   - If token invalid or missing, clear user state

2. **Login**:
   - User enters credentials
   - Send login request to API
   - Store token in localStorage
   - Set user state and redirect to dashboard

3. **Protected Route Access**:
   - Layout checks authentication status
   - If authenticated and has permission, render content
   - If not authenticated, redirect to login
   - If authenticated but lacks permission, redirect to appropriate page

4. **Token Refresh**:
   - Automatic token refresh at regular intervals
   - If refresh fails, log user out

5. **Logout**:
   - Clear tokens from localStorage
   - Reset user state
   - Redirect to login page

## Roles and Permissions

The system will support both role-based and permission-based access control:

1. **Roles**: Broad categories (ADMIN, INSTRUCTOR, STUDENT)
2. **Permissions**: Fine-grained capabilities (EXAM_CREATE, EXAM_EDIT, EXAM_TAKE)

Roles will have associated permissions, and access checks can be performed at multiple levels:

- **Layout Level**: Basic role checks (isAdmin, isAuthenticated)
- **Route Level**: More specific role or permission requirements
- **Component Level**: Granular permission checks for UI elements

## Verification Criteria

- Authentication checks at all levels (layout, route, component)
- Proper redirects based on authentication status
- Role and permission checks working correctly
- Token refresh functioning properly
- No unauthorized access to protected routes
- Proper error handling for auth failures
- User-friendly auth-related UI (loading states, error messages)

## Implementation Timeline

1. **Phase 1**: Set up auth context and provider (Day 1)
2. **Phase 2**: Implement layout-level authentication (Days 2-3)
3. **Phase 3**: Create route and component guards (Days 4-5)
4. **Phase 4**: Add API route middleware (Day 6)
5. **Phase 5**: Testing and verification (Days 7-8)

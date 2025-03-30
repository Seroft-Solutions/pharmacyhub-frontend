# App Directory Reorganization Plan

## Current Structure Analysis

The current app directory structure has several issues:

1. **Inconsistent Route Group Usage**: Some features use route groups (`(auth)`, `(dashboard)`, `(exams)`), while others use regular routes (`admin`, `auth`).
2. **Duplicated Functionality**: Both `(auth)` and `auth` directories exist, creating confusion.
3. **Mixed Route Structure**: Some routes are nested under route groups, while similar ones are at the root level.
4. **Unorganized Authentication**: Auth-related routes are split across multiple locations (`(auth)`, `auth`, `verify-email`, etc.).
5. **Misaligned Dashboard Routes**: Dashboard routes are split between `(dashboard)` and its subdirectories.
6. **Unclear Admin Section**: Admin functionality exists in both `/admin` and `/(dashboard)/admin`.

## Proposed Structure

I propose a clean, hierarchical structure using route groups properly:

```
/src/app
  ├── layout.tsx                # Root layout with providers
  ├── page.tsx                  # Landing page
  ├── globals.css               # Global styles
  ├── (auth)                    # Auth route group - doesn't affect URL
  │   ├── layout.tsx            # Auth layout with redirects for logged-in users
  │   ├── login                 # /login
  │   ├── register              # /register
  │   ├── forgot-password       # /forgot-password
  │   ├── reset-password        # /reset-password
  │   └── verify-email          # /verify-email
  ├── (dashboard)               # User dashboard route group
  │   ├── layout.tsx            # Dashboard layout with user nav and authentication
  │   ├── page.tsx              # /dashboard
  │   ├── settings              # /settings
  │   ├── payments              # /payments
  │   └── profile               # /profile
  ├── (exams)                   # Exams route group
  │   ├── layout.tsx            # Exams layout with exams navigation
  │   ├── page.tsx              # /exams
  │   ├── [examId]              # /exams/[examId]
  │   │   ├── page.tsx          # Exam details
  │   │   ├── attempt           # /exams/[examId]/attempt
  │   │   └── results           # /exams/[examId]/results
  │   ├── dashboard             # /exams/dashboard (Student dashboard)
  │   └── payments              # /exams/payments (Payment history)
  ├── (admin)                   # Admin route group
  │   ├── layout.tsx            # Admin layout with admin check and navigation
  │   ├── page.tsx              # /admin
  │   ├── users                 # /admin/users
  │   ├── settings              # /admin/settings
  │   ├── reports               # /admin/reports
  │   ├── session-monitoring    # /admin/session-monitoring
  │   ├── payments              # /admin/payments
  │   └── exams                 # /admin/exams
  │       ├── page.tsx          # Exams management
  │       ├── [examId]          # /admin/exams/[examId]
  │       │   ├── page.tsx      # Edit exam 
  │       │   ├── questions     # /admin/exams/[examId]/questions
  │       │   └── results       # /admin/exams/[examId]/results
  │       └── create            # /admin/exams/create
  ├── api                       # API routes
  └── _error                    # Error handlers
```

## Implementation Steps

### 1. Create Base Structure

1. **Create Route Group Directories**
   - Maintain existing `(auth)`, `(dashboard)`, and `(exams)` route groups
   - Create new `(admin)` route group to replace current `/admin` folder
   - Ensure clear separation between different functional areas

2. **Set Up Base Layouts**
   - Update root layout with core providers
   - Configure route group layouts with appropriate authentication and authorization checks
   - Ensure consistent UI across different sections

### 2. Migrate Authentication Routes

3. **Consolidate Auth Routes into the `(auth)` Route Group**
   - Move `/auth` content into `/(auth)` and remove the duplicate
   - Move standalone auth-related routes (`/verify-email`, etc.) into `/(auth)`
   - Ensure consistent authentication flow

4. **Implement Auth Guards and Redirects**
   - Update `(auth)` layout with redirection for authenticated users
   - Add appropriate loading states for auth check

### 3. Reorganize User Dashboard

5. **Structure Dashboard Routes**
   - Organize dashboard routes logically in `(dashboard)`
   - Remove duplicate dashboard routes from other locations
   - Ensure consistent URL structure

6. **Update Dashboard Layout**
   - Add authentication requirements to dashboard layout
   - Ensure proper navigation and UI components

### 4. Restructure Exams Feature

7. **Organize Exam Routes**
   - Structure exam routes logically in `(exams)`
   - Implement proper dynamic routes using slugs
   - Create consistent route naming conventions

8. **Set Up Exam Layouts and Navigation**
   - Update exam layout for consistent navigation
   - Configure nested layouts for exam sections
   - Ensure proper loading states

### 5. Reorganize Admin Section

9. **Create Dedicated Admin Route Group**
   - Move all admin functionality to `(admin)` route group
   - Implement admin role verification
   - Set up consistent URL structure

10. **Implement Admin Dashboard and Subsections**
    - Create admin dashboard page
    - Organize admin routes by function
    - Set up exam management section

### 6. Clean Up and Finalize

11. **Remove Duplicate Routes**
    - Identify and eliminate all duplicate routes
    - Ensure redirects for legacy URLs

12. **Implement Error Handling**
    - Create error and not-found pages for each section
    - Implement appropriate loading states

13. **Create Navigation Components**
    - Update navigation components to match new structure
    - Ensure consistent UI across the application

## Auth Protection Implementation

Each route group will have a layout with appropriate authentication and authorization checks:

### Auth Layout (`(auth)/layout.tsx`)
```tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/features/core/app-auth/hooks';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // Show loading state
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // Only render children when not authenticated
  return (
    <div className="auth-layout">
      {!user && children}
    </div>
  );
}
```

### Dashboard Layout (`(dashboard)/layout.tsx`)
```tsx
"use client";

import { AppLayout } from "@/features/shell";
import { DASHBOARD_FEATURES } from "@/features/shell/navigation/features";
import { useAuth } from '@/features/core/app-auth/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return <DashboardLoadingState />;
  }

  // AppLayout has auth check built in
  return (
    <AppLayout 
      requireAuth={true} 
      appName="Dashboard" 
      features={DASHBOARD_FEATURES}
    >
      {children}
    </AppLayout>
  );
}
```

### Admin Layout (`(admin)/layout.tsx`)
```tsx
"use client";

import { AppLayout } from "@/features/shell";
import { ADMIN_FEATURES } from "@/features/shell/navigation/adminFeatures";
import { useAuth } from '@/features/core/app-auth/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasRole, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // First check if user is authenticated
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Then check if user has admin role
    if (!isLoading && isAuthenticated) {
      const isAdmin = hasRole('ADMIN') || hasRole('PER_ADMIN');
      if (!isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, hasRole, router]);

  // Show loading state
  if (isLoading) {
    return <AdminLoadingState />;
  }

  // AppLayout with admin features
  return (
    <AppLayout 
      requireAuth={true} 
      appName="Admin Portal" 
      features={ADMIN_FEATURES}
      forceAdminMode={true}
      showSidebar={true}
    >
      {children}
    </AppLayout>
  );
}
```

## Navigation Implementation

The navigation will be aligned with the route structure:

1. **Main Navigation**: Shows in layout.tsx with:
   - Dashboard link for authenticated users
   - Admin link for admin users
   - Exams link for all users
   - Authentication links for guests

2. **Section Navigation**: Each route group layout will include section-specific navigation:
   - Dashboard navigation shows user-related links
   - Admin navigation shows admin function links
   - Exams navigation shows exam-related links

3. **Breadcrumbs**: Will be implemented to show current location in hierarchy

## Benefits of Reorganization

1. **Improved Structure**: Clear separation of concerns with logical route grouping
2. **Consistent Authentication**: Centralized auth checks at the layout level
3. **Better Navigation**: Navigation aligns with route structure
4. **Enhanced Performance**: Proper code splitting with route groups
5. **Simplified Maintenance**: Easier to understand and maintain
6. **Clear Authorization**: Role-based access control at layout level
7. **Better User Experience**: Consistent UI and navigation patterns

## Migration Strategy

To minimize disruption, the migration will follow these steps:

1. Create the new structure alongside existing routes
2. Implement layouts and route grouping
3. Add redirects from old routes to new routes
4. Test thoroughly to ensure all functionality works
5. Remove old routes once the new structure is verified

This approach ensures no functionality is lost during the transition and enables a gradual migration to the new structure.

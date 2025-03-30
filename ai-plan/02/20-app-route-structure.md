# App Route Structure Implementation Plan

This document provides a detailed implementation plan for reorganizing and structuring the routes in the PharmacyHub Frontend using Next.js 15's App Router with route groups.

## Comprehensive Route Structure

Here is the complete route structure for the application, including all pages, layouts, and special files:

```
/src/app
  ├── layout.tsx                      # Root layout with global providers
  ├── page.tsx                        # Landing page
  ├── favicon.ico                     # Favicon
  ├── globals.css                     # Global styles
  ├── not-found.tsx                   # Global 404 page
  ├── error.tsx                       # Global error page
  ├── loading.tsx                     # Global loading state
  ├── (auth)                          # Auth route group (doesn't affect URL)
  │   ├── layout.tsx                  # Auth layout
  │   ├── loading.tsx                 # Auth loading state
  │   ├── error.tsx                   # Auth error handling
  │   ├── login
  │   │   ├── page.tsx                # /login
  │   │   └── loading.tsx             # Login loading state
  │   ├── register
  │   │   ├── page.tsx                # /register
  │   │   └── loading.tsx             # Register loading state
  │   ├── forgot-password
  │   │   ├── page.tsx                # /forgot-password
  │   │   └── loading.tsx             # Forgot password loading state
  │   ├── reset-password
  │   │   ├── page.tsx                # /reset-password
  │   │   ├── [token]
  │   │   │   └── page.tsx            # /reset-password/[token]
  │   │   └── loading.tsx             # Reset password loading state
  │   └── verify-email
  │       ├── page.tsx                # /verify-email
  │       ├── [token]
  │       │   └── page.tsx            # /verify-email/[token]
  │       └── loading.tsx             # Verify email loading state
  ├── (dashboard)                     # Dashboard route group
  │   ├── layout.tsx                  # Dashboard layout
  │   ├── loading.tsx                 # Dashboard loading state
  │   ├── error.tsx                   # Dashboard error handling
  │   ├── page.tsx                    # /dashboard
  │   ├── settings
  │   │   ├── page.tsx                # /settings
  │   │   ├── profile
  │   │   │   └── page.tsx            # /settings/profile
  │   │   ├── security
  │   │   │   └── page.tsx            # /settings/security
  │   │   ├── notifications
  │   │   │   └── page.tsx            # /settings/notifications
  │   │   └── loading.tsx             # Settings loading state
  │   ├── payments
  │   │   ├── page.tsx                # /payments
  │   │   ├── [requestId]
  │   │   │   └── page.tsx            # /payments/[requestId]
  │   │   └── loading.tsx             # Payments loading state
  │   └── profile
  │       ├── page.tsx                # /profile
  │       └── loading.tsx             # Profile loading state
  ├── (exams)                         # Exams route group
  │   ├── layout.tsx                  # Exams layout
  │   ├── loading.tsx                 # Exams loading state
  │   ├── error.tsx                   # Exams error handling
  │   ├── page.tsx                    # /exams
  │   ├── dashboard
  │   │   ├── page.tsx                # /exams/dashboard
  │   │   └── loading.tsx             # Exams dashboard loading state
  │   ├── [examId]
  │   │   ├── page.tsx                # /exams/[examId]
  │   │   ├── layout.tsx              # Exam detail layout
  │   │   ├── loading.tsx             # Exam detail loading state
  │   │   ├── not-found.tsx           # Exam not found page
  │   │   ├── error.tsx               # Exam error handling
  │   │   ├── attempt
  │   │   │   ├── page.tsx            # /exams/[examId]/attempt
  │   │   │   ├── loading.tsx         # Attempt loading state
  │   │   │   └── error.tsx           # Attempt error handling
  │   │   └── results
  │   │       ├── page.tsx            # /exams/[examId]/results
  │   │       ├── [attemptId]
  │   │       │   └── page.tsx        # /exams/[examId]/results/[attemptId]
  │   │       └── loading.tsx         # Results loading state
  │   └── payments
  │       ├── page.tsx                # /exams/payments
  │       ├── [requestId]
  │       │   └── page.tsx            # /exams/payments/[requestId]
  │       └── loading.tsx             # Exam payments loading state
  ├── (admin)                         # Admin route group
  │   ├── layout.tsx                  # Admin layout
  │   ├── loading.tsx                 # Admin loading state
  │   ├── error.tsx                   # Admin error handling
  │   ├── page.tsx                    # /admin
  │   ├── users
  │   │   ├── page.tsx                # /admin/users
  │   │   ├── [userId]
  │   │   │   └── page.tsx            # /admin/users/[userId]
  │   │   └── loading.tsx             # Users loading state
  │   ├── settings
  │   │   ├── page.tsx                # /admin/settings
  │   │   └── loading.tsx             # Admin settings loading state
  │   ├── session-monitoring
  │   │   ├── page.tsx                # /admin/session-monitoring
  │   │   └── loading.tsx             # Session monitoring loading state
  │   ├── payments
  │   │   ├── page.tsx                # /admin/payments
  │   │   ├── [requestId]
  │   │   │   └── page.tsx            # /admin/payments/[requestId]
  │   │   └── loading.tsx             # Admin payments loading state
  │   └── exams
  │       ├── page.tsx                # /admin/exams
  │       ├── loading.tsx             # Admin exams loading state
  │       ├── create
  │       │   ├── page.tsx            # /admin/exams/create
  │       │   └── loading.tsx         # Create exam loading state
  │       └── [examId]
  │           ├── page.tsx            # /admin/exams/[examId]
  │           ├── loading.tsx         # Edit exam loading state
  │           ├── error.tsx           # Edit exam error handling
  │           ├── not-found.tsx       # Exam not found page
  │           ├── questions
  │           │   ├── page.tsx        # /admin/exams/[examId]/questions
  │           │   ├── loading.tsx     # Questions loading state
  │           │   ├── create
  │           │   │   └── page.tsx    # /admin/exams/[examId]/questions/create
  │           │   └── [questionId]
  │           │       └── page.tsx    # /admin/exams/[examId]/questions/[questionId]
  │           └── results
  │               ├── page.tsx        # /admin/exams/[examId]/results
  │               └── loading.tsx     # Results loading state
  └── api                             # API routes (if needed)
      ├── auth
      │   ├── login
      │   │   └── route.ts            # /api/auth/login
      │   └── refresh
      │       └── route.ts            # /api/auth/refresh
      └── [...]                       # Other API routes
```

## Implementation Approach

### 1. Route Group Creation

First, create the route group directories:

```bash
# Create auth route group
mkdir -p src/app/(auth)/{login,register,forgot-password,reset-password,verify-email}

# Create dashboard route group
mkdir -p src/app/(dashboard)/{settings/{profile,security,notifications},payments,profile}

# Create exams route group
mkdir -p src/app/(exams)/{dashboard,[examId]/{attempt,results},payments}

# Create admin route group
mkdir -p src/app/(admin)/{users,settings,session-monitoring,payments,exams/{create,[examId]/{questions/{create,[questionId]},results}}}

# Create special pages
touch src/app/not-found.tsx src/app/error.tsx src/app/loading.tsx
```

### 2. Page Implementation

Next, implement the pages with the correct structure:

#### Root Layout
```tsx
// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "PharmacyHub",
    template: "%s | PharmacyHub",
  },
  description: "Your complete pharmacy management solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
```

#### Auth Layout
```tsx
// src/app/(auth)/layout.tsx
"use client";

import { useAuth } from "@/features/core/app-auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLayout } from "@/features/auth/components";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="auth-loading">Loading...</div>;
  }

  return !user ? <AuthLayout>{children}</AuthLayout> : null;
}
```

#### Dashboard Layout
```tsx
// src/app/(dashboard)/layout.tsx
"use client";

import { useAuth } from "@/features/core/app-auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/features/dashboard/components";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return user ? <DashboardLayout>{children}</DashboardLayout> : null;
}
```

#### Exams Layout
```tsx
// src/app/(exams)/layout.tsx
"use client";

import { ExamsLayout } from "@/features/exams/components";
import { FeatureGuard } from "@/features/core/app-rbac/components";

export default function ExamsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureGuard feature="exams" fallback={<div>Access denied</div>}>
      <ExamsLayout>{children}</ExamsLayout>
    </FeatureGuard>
  );
}
```

#### Admin Layout
```tsx
// src/app/(admin)/layout.tsx
"use client";

import { useAuth } from "@/features/core/app-auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminLayout } from "@/features/admin/components";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const isAdmin = hasRole("ADMIN") || hasRole("PER_ADMIN");

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return user && isAdmin ? <AdminLayout>{children}</AdminLayout> : null;
}
```

### 3. Dynamic Routes Implementation

Implement dynamic routes with proper data fetching:

#### Exam Detail Page
```tsx
// src/app/(exams)/[examId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getExamById } from "@/features/exams/api/server";
import { ExamDetail, ExamDetailSkeleton } from "@/features/exams/components";

export async function generateMetadata({ params }) {
  const exam = await getExamById(params.examId);
  
  if (!exam) {
    return {
      title: "Exam Not Found",
    };
  }
  
  return {
    title: exam.title,
    description: exam.description || "Exam details",
  };
}

export default async function ExamDetailPage({ params }) {
  const exam = await getExamById(params.examId);
  
  if (!exam) {
    notFound();
  }
  
  return (
    <div className="exam-detail-page">
      <Suspense fallback={<ExamDetailSkeleton />}>
        <ExamDetail examId={params.examId} />
      </Suspense>
    </div>
  );
}
```

#### Admin Exam Edit Page
```tsx
// src/app/(admin)/exams/[examId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getExamById } from "@/features/exams/api/server";
import { ExamEditForm, ExamEditSkeleton } from "@/features/admin/components";
import { PermissionGuard } from "@/features/core/app-rbac/components";

export async function generateMetadata({ params }) {
  const exam = await getExamById(params.examId);
  
  if (!exam) {
    return {
      title: "Exam Not Found - Admin",
    };
  }
  
  return {
    title: `Edit: ${exam.title}`,
    description: "Edit exam details",
  };
}

export default async function AdminExamEditPage({ params }) {
  const exam = await getExamById(params.examId);
  
  if (!exam) {
    notFound();
  }
  
  return (
    <PermissionGuard permission="EXAM_EDIT">
      <div className="admin-exam-edit-page">
        <h1>Edit Exam</h1>
        <Suspense fallback={<ExamEditSkeleton />}>
          <ExamEditForm examId={params.examId} />
        </Suspense>
      </div>
    </PermissionGuard>
  );
}
```

### 4. Loading and Error States

Implement proper loading and error states:

#### Loading State
```tsx
// src/app/(exams)/loading.tsx
import { ExamsLoadingSkeleton } from "@/features/exams/components";

export default function ExamsLoading() {
  return <ExamsLoadingSkeleton />;
}
```

#### Error Handling
```tsx
// src/app/(admin)/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/shared/lib/logger";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error("Admin UI error", { error });
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="mt-4 text-muted-foreground">
        There was an error loading this page.
      </p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
```

#### Not Found
```tsx
// src/app/(exams)/[examId]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExamNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Exam Not Found</h2>
      <p className="mt-4 text-muted-foreground">
        The exam you are looking for does not exist or has been removed.
      </p>
      <Button asChild className="mt-6">
        <Link href="/exams">Return to Exams</Link>
      </Button>
    </div>
  );
}
```

### 5. Parallel Routes and Intercepting Routes

Implement advanced routing patterns for enhanced user experience:

#### Parallel Routes for Admin Dashboard
```tsx
// src/app/(admin)/@stats/page.tsx
import { AdminStats } from "@/features/admin/components";

export default async function AdminStatsPage() {
  return <AdminStats />;
}

// src/app/(admin)/@activities/page.tsx
import { RecentActivities } from "@/features/admin/components";

export default async function AdminActivitiesPage() {
  return <RecentActivities />;
}

// src/app/(admin)/page.tsx
export default function AdminDashboardPage({
  stats,
  activities,
}: {
  stats: React.ReactNode;
  activities: React.ReactNode;
}) {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stats-section">{stats}</div>
        <div className="activities-section">{activities}</div>
      </div>
    </div>
  );
}
```

#### Intercepting Routes for Modals
```tsx
// src/app/(exams)/[examId]/questions/[questionId]/(..)edit/page.tsx
"use client";

import { QuestionEditModal } from "@/features/exams/components";
import { useRouter } from "next/navigation";

export default function QuestionEditModal({ params }) {
  const router = useRouter();
  
  const handleClose = () => {
    router.back();
  };
  
  return (
    <QuestionEditModal
      examId={params.examId}
      questionId={params.questionId}
      onClose={handleClose}
    />
  );
}
```

## Implementation Strategy

To ensure a smooth implementation, follow these steps:

1. **Create Base Structure**:
   - Set up the main route groups first
   - Implement shared layouts
   - Create base navigation components

2. **Implement Authentication**:
   - Add auth-related layouts and guards
   - Set up authentication flows
   - Test access control

3. **Add Dynamic Routes**:
   - Implement major dynamic routes
   - Set up proper data fetching
   - Add loading and error states

4. **Enhance with Advanced Patterns**:
   - Add parallel routes where beneficial
   - Implement intercepting routes for modals
   - Optimize with streaming and suspense

5. **Testing and Verification**:
   - Test all routes and navigation flows
   - Verify authentication and authorization
   - Ensure proper loading and error states
   - Check SEO metadata

## Route Navigation Patterns

### Programmatic Navigation
```tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NavigationExample() {
  const router = useRouter();
  
  const handleNavigate = () => {
    router.push("/exams/dashboard");
  };
  
  return (
    <Button onClick={handleNavigate}>
      Go to Exams Dashboard
    </Button>
  );
}
```

### Link Component
```tsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ExamCard({ exam }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/exams/${exam.id}`} className="hover:underline">
            {exam.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{exam.description}</p>
      </CardContent>
    </Card>
  );
}
```

### Active Link Detection
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground/70 hover:text-foreground hover:bg-accent"
      )}
    >
      {children}
    </Link>
  );
}
```

## Verification Checklist

To ensure proper implementation, verify the following:

- [ ] All route groups and pages created with the correct structure
- [ ] Layouts properly implement authentication checks
- [ ] Dynamic routes handle data fetching and error states
- [ ] Loading and error UI components implemented for all routes
- [ ] SEO metadata configured for all main pages
- [ ] Navigation components working with the new route structure
- [ ] Auth redirects functioning correctly
- [ ] RBAC guards applied to protected routes
- [ ] Advanced routing patterns (parallel, intercepting) implemented where needed
- [ ] Mobile responsiveness maintained throughout

## Benefits of Implementation

This implementation provides several benefits:

1. **Improved Organization**: Clear separation of concerns with logical route grouping
2. **Better Authentication**: Centralized authentication at the layout level
3. **Enhanced User Experience**: Proper loading states and error handling
4. **SEO Optimization**: Metadata for all pages
5. **Role-Based Access**: Proper authorization for protected routes
6. **Maintainability**: Easy to understand and extend
7. **Performance**: Optimized with streaming and component-level code splitting

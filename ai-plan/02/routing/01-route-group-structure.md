# Task R01: Create Basic Route Group Structure

## Description
Set up the foundational routing structure for the Exams feature using Next.js 15 App Router with route groups. This task focuses on creating the basic folder structure, implementing shared layouts, and setting up the main navigation components.

## Implementation Steps

1. **Create Route Group Directory Structure**
   - Create the base route group folder: `src/app/(exams)`
   - Set up main sections:
     - `src/app/(exams)/page.tsx` (Main exams landing page)
     - `src/app/(exams)/layout.tsx` (Shared layout for all exam routes)
     - `src/app/(exams)/dashboard` (Student dashboard)
     - `src/app/(exams)/admin` (Admin section)
     - `src/app/(exams)/[examId]` (Dynamic exam routes)

2. **Implement Base Layout Component**
   ```tsx
   // src/app/(exams)/layout.tsx
   import { ExamFeatureProvider } from '@/features/exams/context';
   import { ExamNavigation } from '@/features/exams/components/navigation';
   import { ExamGuard } from '@/features/exams/rbac';
   
   export const metadata = {
     title: 'PharmacyHub - Exams',
     description: 'Manage and take exams on PharmacyHub',
   };
   
   export default function ExamsLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <ExamGuard>
         <ExamFeatureProvider>
           <div className="exams-layout">
             <ExamNavigation />
             <main className="exams-content">
               {children}
             </main>
           </div>
         </ExamFeatureProvider>
       </ExamGuard>
     );
   }
   ```

3. **Create Main Index Page**
   ```tsx
   // src/app/(exams)/page.tsx
   import { ExamsDashboard } from '@/features/exams/components/organisms';
   import { Metadata } from 'next';
   
   export const metadata: Metadata = {
     title: 'PharmacyHub - Exams Dashboard',
     description: 'View and manage your exams',
   };
   
   export default function ExamsPage() {
     return <ExamsDashboard />;
   }
   ```

4. **Set Up Error and Loading States**
   ```tsx
   // src/app/(exams)/error.tsx
   'use client';
   
   import { ErrorDisplay } from '@/features/exams/components/feedback';
   
   export default function ExamsError({
     error,
     reset,
   }: {
     error: Error & { digest?: string };
     reset: () => void;
   }) {
     return <ErrorDisplay error={error} onReset={reset} />;
   }
   
   // src/app/(exams)/loading.tsx
   import { LoadingSpinner } from '@/features/exams/components/feedback';
   
   export default function ExamsLoading() {
     return <LoadingSpinner fullPage />;
   }
   ```

5. **Create Empty State Pages for Key Sections**
   - Create placeholder pages for main sections
   - Set up basic routes for student dashboard
   - Set up basic routes for admin section

6. **Implement Exam Navigation Component**
   - Develop the navigation component with links to key sections
   - Implement responsive design for mobile and desktop
   - Include user-specific navigation based on roles

7. **Configure Route Group for Non-URL Segments**
   - Ensure the route group `(exams)` doesn't affect the URL structure
   - Verify that routes are correctly generated without the group name
   - Test basic navigation to ensure URL patterns are correct

## Example Navigation Component

```tsx
// src/features/exams/components/navigation/ExamNavigation.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useExamFeatureAccess } from '@/features/exams/rbac';

export function ExamNavigation() {
  const pathname = usePathname();
  const { canViewExams, canTakeExams, canManageExams } = useExamFeatureAccess();
  
  return (
    <nav className="exams-navigation">
      <ul>
        <li className={pathname === '/exams' ? 'active' : ''}>
          <Link href="/exams">Dashboard</Link>
        </li>
        
        {canTakeExams && (
          <li className={pathname.startsWith('/exams/dashboard') ? 'active' : ''}>
            <Link href="/exams/dashboard">My Exams</Link>
          </li>
        )}
        
        {canManageExams && (
          <li className={pathname.startsWith('/exams/admin') ? 'active' : ''}>
            <Link href="/exams/admin">Admin</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
```

## Next.js Route Group Benefits

Using route groups in this way provides several benefits:

1. **Organization without URL impact**: The `(exams)` route group organizes code without affecting URLs
2. **Shared layouts**: Common UI elements are shared across the exam feature
3. **Isolated contexts**: State providers can be scoped to specific routes
4. **Role-based access control**: Guards can be applied at the layout level
5. **Optimized bundle splitting**: Better code organization leads to improved loading performance

## Verification Criteria
- Route group structure created with all necessary directories
- Basic layout component implemented with proper providers
- Index page and main section pages created
- Navigation component implemented with role-based links
- Error and loading states implemented
- URLs correctly generated without the route group name
- Basic navigation works between sections

## Time Estimate
Approximately 4-6 hours

## Dependencies
- Completion of Task 04 from the main plan (RBAC Integration)
- Availability of core navigation components

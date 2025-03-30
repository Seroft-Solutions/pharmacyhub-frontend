# Task R04: Set Up Layout Hierarchy

## Description
Design and implement a comprehensive layout hierarchy for the Exams feature using Next.js 15 App Router's nested layouts. This task focuses on creating a consistent user experience with shared UI elements while optimizing for performance through layout nesting.

## Implementation Steps

1. **Design Layout Hierarchy**
   - Map out the complete layout hierarchy for the exams feature
   - Identify shared elements at each level
   - Determine layout nesting strategy for optimal performance

   ```
   RootLayout (app/layout.tsx)
   └── ExamsLayout (app/(exams)/layout.tsx)
       ├── ExamsDashboardLayout (app/(exams)/dashboard/layout.tsx)
       ├── ExamDetailsLayout (app/(exams)/[examId]/layout.tsx)
       │   ├── ExamAttemptLayout (app/(exams)/[examId]/attempt/layout.tsx)
       │   └── ExamResultsLayout (app/(exams)/[examId]/results/layout.tsx)
       └── AdminLayout (app/(exams)/admin/layout.tsx)
           ├── AdminDashboardLayout (app/(exams)/admin/dashboard/layout.tsx)
           └── ExamEditLayout (app/(exams)/admin/[examId]/layout.tsx)
               └── QuestionManagementLayout (app/(exams)/admin/[examId]/questions/layout.tsx)
   ```

2. **Implement Root Exams Layout**
   - Enhance the base layout with providers, context, and theme
   - Set up global navigation and breadcrumbs
   - Implement responsive design considerations

   ```tsx
   // src/app/(exams)/layout.tsx
   import { Suspense } from 'react';
   import { ExamFeatureProvider } from '@/features/exams/context';
   import { ExamNavigation } from '@/features/exams/components/navigation';
   import { ExamBreadcrumbs } from '@/features/exams/components/navigation';
   import { ExamGuard } from '@/features/exams/rbac';
   import { LoadingSpinner } from '@/features/exams/components/feedback';
   
   export default function ExamsLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <ExamGuard>
         <ExamFeatureProvider>
           <div className="exams-feature-container">
             <header className="exams-header">
               <h1 className="exams-title">PharmacyHub Exams</h1>
               <ExamNavigation />
             </header>
             
             <Suspense fallback={<LoadingSpinner size="small" />}>
               <ExamBreadcrumbs />
             </Suspense>
             
             <main className="exams-content">
               {children}
             </main>
             
             <footer className="exams-footer">
               <p>&copy; {new Date().getFullYear()} PharmacyHub</p>
             </footer>
           </div>
         </ExamFeatureProvider>
       </ExamGuard>
     );
   }
   ```

3. **Create Exam Details Layout**
   - Implement layout for specific exam routes
   - Add exam-specific navigation and context

   ```tsx
   // src/app/(exams)/[examId]/layout.tsx
   import { Suspense } from 'react';
   import { ExamContext } from '@/features/exams/context';
   import { ExamHeader } from '@/features/exams/components/molecules';
   import { ExamNavTabs } from '@/features/exams/components/navigation';
   import { LoadingSpinner } from '@/features/exams/components/feedback';
   import { getExamById } from '@/features/exams/api/server';
   import { notFound } from 'next/navigation';
   
   export default async function ExamLayout({
     children,
     params,
   }: {
     children: React.ReactNode;
     params: { examId: string };
   }) {
     // Fetch basic exam data for the header
     const exam = await getExamById(params.examId);
     
     // Handle not found
     if (!exam) {
       notFound();
     }
     
     return (
       <ExamContext.Provider value={{ examId: params.examId, exam }}>
         <div className="exam-container">
           <ExamHeader 
             title={exam.title} 
             status={exam.status}
             lastUpdated={exam.updatedAt}
           />
           
           <Suspense fallback={<LoadingSpinner size="small" />}>
             <ExamNavTabs examId={params.examId} />
           </Suspense>
           
           <div className="exam-content-wrapper">
             {children}
           </div>
         </div>
       </ExamContext.Provider>
     );
   }
   ```

4. **Implement Admin Layout Hierarchy**
   - Create the admin layout with sidebar navigation
   - Implement admin-specific UI elements and controls

   ```tsx
   // src/app/(exams)/admin/layout.tsx
   import { AdminSidebar } from '@/features/exams/components/navigation';
   import { AdminHeader } from '@/features/exams/components/molecules';
   import { ExamOperationGuard } from '@/features/exams/rbac';
   import { ExamOperation } from '@/features/exams/rbac/types';
   import { redirect } from 'next/navigation';
   
   export default function AdminLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <ExamOperationGuard
         operation={ExamOperation.EDIT}
         fallback={() => redirect('/exams')}
       >
         <div className="admin-layout">
           <AdminHeader />
           
           <div className="admin-content-wrapper">
             <AdminSidebar />
             
             <main className="admin-content">
               {children}
             </main>
           </div>
         </div>
       </ExamOperationGuard>
     );
   }
   ```

5. **Create Template-Specific Layouts**
   - Implement layouts for specific templates like exam attempt
   - Add specialized UI elements for each use case

   ```tsx
   // src/app/(exams)/[examId]/attempt/layout.tsx
   import { ExamTimerProvider } from '@/features/exams/context';
   import { ExamAttemptHeader } from '@/features/exams/components/molecules';
   import { getExamById } from '@/features/exams/api/server';
   import { notFound } from 'next/navigation';
   
   export default async function ExamAttemptLayout({
     children,
     params,
   }: {
     children: React.ReactNode;
     params: { examId: string };
   }) {
     // Fetch exam data
     const exam = await getExamById(params.examId);
     
     // Handle not found
     if (!exam) {
       notFound();
     }
     
     return (
       <ExamTimerProvider timeLimit={exam.timeLimit}>
         <div className="exam-attempt-container">
           <ExamAttemptHeader 
             title={exam.title}
             questionsCount={exam.questions?.length || 0}
           />
           
           <div className="exam-attempt-content">
             {children}
           </div>
         </div>
       </ExamTimerProvider>
     );
   }
   ```

6. **Implement Responsive Layouts**
   - Create media queries and responsive styles
   - Implement mobile navigation patterns
   - Ensure layouts work on all device sizes

   ```tsx
   // Example mobile navigation component
   'use client'
   
   import { useState } from 'react';
   import Link from 'next/link';
   import { usePathname } from 'next/navigation';
   import { MenuIcon, XIcon } from '@/core/ui/icons';
   
   export function MobileNavigation() {
     const [isOpen, setIsOpen] = useState(false);
     const pathname = usePathname();
     
     const toggleMenu = () => setIsOpen(!isOpen);
     
     return (
       <div className="mobile-navigation">
         <button 
           className="mobile-menu-button" 
           onClick={toggleMenu}
           aria-expanded={isOpen}
         >
           {isOpen ? <XIcon /> : <MenuIcon />}
           <span className="sr-only">
             {isOpen ? 'Close menu' : 'Open menu'}
           </span>
         </button>
         
         {isOpen && (
           <nav className="mobile-menu">
             <ul>
               <li className={pathname === '/exams' ? 'active' : ''}>
                 <Link href="/exams" onClick={toggleMenu}>Dashboard</Link>
               </li>
               {/* Other navigation items */}
             </ul>
           </nav>
         )}
       </div>
     );
   }
   ```

7. **Create Shared UI Components**
   - Implement reusable layout components
   - Create consistent patterns for headers, navigation, and content areas

   ```tsx
   // src/features/exams/components/layout/ContentCard.tsx
   import { PropsWithChildren } from 'react';
   
   interface ContentCardProps {
     title?: string;
     subtitle?: string;
     footer?: React.ReactNode;
     className?: string;
   }
   
   export function ContentCard({
     title,
     subtitle,
     footer,
     className = '',
     children,
   }: PropsWithChildren<ContentCardProps>) {
     return (
       <div className={`content-card ${className}`}>
         {(title || subtitle) && (
           <div className="content-card-header">
             {title && <h2 className="content-card-title">{title}</h2>}
             {subtitle && <p className="content-card-subtitle">{subtitle}</p>}
           </div>
         )}
         
         <div className="content-card-body">
           {children}
         </div>
         
         {footer && (
           <div className="content-card-footer">
             {footer}
           </div>
         )}
       </div>
     );
   }
   ```

## Shared Context Across Layouts

Implement context providers for sharing data across layout boundaries:

```tsx
// src/features/exams/context/ExamContext.tsx
'use client'

import { createContext, useContext, PropsWithChildren } from 'react';
import { Exam } from '@/features/exams/types';

interface ExamContextType {
  examId: string;
  exam: Exam | null;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamProvider({
  examId,
  exam,
  children,
}: PropsWithChildren<ExamContextType>) {
  return (
    <ExamContext.Provider value={{ examId, exam }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  
  return context;
}
```

## Layout Template Patterns

Create reusable layout templates:

```tsx
// src/features/exams/components/templates/TwoColumnLayout.tsx
interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  sidebarWidth?: string;
  reversed?: boolean;
}

export function TwoColumnLayout({
  sidebar,
  content,
  sidebarWidth = '300px',
  reversed = false,
}: TwoColumnLayoutProps) {
  return (
    <div 
      className={`two-column-layout ${reversed ? 'reversed' : ''}`}
      style={{ 
        '--sidebar-width': sidebarWidth 
      } as React.CSSProperties}
    >
      <div className="sidebar-container">
        {sidebar}
      </div>
      
      <div className="content-container">
        {content}
      </div>
    </div>
  );
}
```

## Verification Criteria
- Complete layout hierarchy implemented
- Nested layouts working correctly
- Shared UI elements consistent across routes
- Responsive design for all layouts
- Context providers properly sharing data
- Navigation components working correctly
- Layouts optimized for performance
- Accessibility considerations addressed
- UI consistent with design system

## Time Estimate
Approximately 4-6 hours

## Dependencies
- Completion of Task R01 (Create Basic Route Group Structure)
- Completion of Task R02 (Implement Student/User Exam Routes)
- Completion of Task R03 (Implement Admin Exam Routes)
- Core UI components available

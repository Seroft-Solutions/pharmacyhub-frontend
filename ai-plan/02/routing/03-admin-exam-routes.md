# Task R03: Implement Admin Exam Routes

## Description
Implement the routing structure for admin exam management, including routes for creating, editing, and managing exams, questions, and viewing results. This task focuses on setting up the admin section of the exams feature with appropriate access controls.

## Implementation Steps

1. **Create Admin Section Base Structure**
   - Implement `src/app/(exams)/admin/page.tsx` for the admin dashboard
   - Create admin-specific layout with `src/app/(exams)/admin/layout.tsx`
   - Set up admin navigation and RBAC guards

   ```tsx
   // src/app/(exams)/admin/layout.tsx
   import { ExamAdminNavigation } from '@/features/exams/components/navigation';
   import { ExamOperationGuard } from '@/features/exams/rbac';
   import { ExamOperation } from '@/features/exams/rbac/types';
   import { redirect } from 'next/navigation';
   
   export const metadata = {
     title: 'Exam Administration - PharmacyHub',
     description: 'Manage exams, questions, and results',
   };
   
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
           <ExamAdminNavigation />
           <main className="admin-content">
             {children}
           </main>
         </div>
       </ExamOperationGuard>
     );
   }
   ```

2. **Implement Exam Creation Route**
   - Create `src/app/(exams)/admin/create/page.tsx` for exam creation
   - Implement form components and submission handling

   ```tsx
   // src/app/(exams)/admin/create/page.tsx
   'use client'
   
   import { ExamForm } from '@/features/exams/components/organisms';
   import { useCreateExamMutation } from '@/features/exams/api/hooks';
   import { useRouter } from 'next/navigation';
   
   export default function CreateExamPage() {
     const router = useRouter();
     const createExamMutation = useCreateExamMutation();
     
     const handleCreateExam = async (examData) => {
       try {
         const newExam = await createExamMutation.mutateAsync(examData);
         router.push(`/exams/admin/${newExam.id}`);
       } catch (error) {
         // Handle error
       }
     };
     
     return (
       <div className="create-exam-page">
         <h1>Create New Exam</h1>
         <ExamForm onSubmit={handleCreateExam} />
       </div>
     );
   }
   ```

3. **Implement Exam Edit Routes**
   - Create dynamic routes for editing exams:
     - `src/app/(exams)/admin/[examId]/page.tsx` - Edit exam
     - `src/app/(exams)/admin/[examId]/layout.tsx` - Exam admin layout

   ```tsx
   // src/app/(exams)/admin/[examId]/page.tsx
   import { ExamEditForm } from '@/features/exams/components/organisms';
   import { getExamById } from '@/features/exams/api/server';
   import { notFound } from 'next/navigation';
   
   export default async function EditExamPage({ 
     params 
   }: { 
     params: { examId: string } 
   }) {
     // Fetch exam data
     const exam = await getExamById(params.examId);
     
     // Handle not found
     if (!exam) {
       notFound();
     }
     
     return <ExamEditForm exam={exam} />;
   }
   ```

4. **Implement Question Management Routes**
   - Create routes for managing questions:
     - `src/app/(exams)/admin/[examId]/questions/page.tsx` - List questions
     - `src/app/(exams)/admin/[examId]/questions/create/page.tsx` - Create question
     - `src/app/(exams)/admin/[examId]/questions/[questionId]/page.tsx` - Edit question

   ```tsx
   // src/app/(exams)/admin/[examId]/questions/page.tsx
   import { QuestionsList } from '@/features/exams/components/organisms';
   import { getExamById, getExamQuestions } from '@/features/exams/api/server';
   import { notFound } from 'next/navigation';
   
   export default async function QuestionsListPage({ 
     params 
   }: { 
     params: { examId: string } 
   }) {
     // Fetch exam data
     const exam = await getExamById(params.examId);
     
     // Handle not found
     if (!exam) {
       notFound();
     }
     
     // Fetch questions
     const questions = await getExamQuestions(params.examId);
     
     return (
       <div className="questions-list-page">
         <h1>Questions for {exam.title}</h1>
         <QuestionsList 
           examId={params.examId} 
           questions={questions} 
         />
       </div>
     );
   }
   ```

5. **Implement Results Management Routes**
   - Create routes for viewing and managing results:
     - `src/app/(exams)/admin/results/page.tsx` - All results
     - `src/app/(exams)/admin/results/[examId]/page.tsx` - Results for specific exam

   ```tsx
   // src/app/(exams)/admin/results/page.tsx
   import { AdminResultsDashboard } from '@/features/exams/components/organisms';
   import { getAllExamResults } from '@/features/exams/api/server';
   
   export default async function AdminResultsPage() {
     // Fetch results summary
     const resultsSummary = await getAllExamResults();
     
     return <AdminResultsDashboard resultsSummary={resultsSummary} />;
   }
   ```

6. **Implement Admin-Specific Guards**
   - Create operation-specific guards for admin actions
   - Apply guards at route and component levels

   ```tsx
   // src/app/(exams)/admin/[examId]/layout.tsx
   import { ExamEditNavigation } from '@/features/exams/components/navigation';
   import { ExamOperationGuard } from '@/features/exams/rbac';
   import { ExamOperation } from '@/features/exams/rbac/types';
   import { getExamById } from '@/features/exams/api/server';
   import { notFound, redirect } from 'next/navigation';
   
   export default async function ExamEditLayout({
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
       <ExamOperationGuard
         operation={ExamOperation.EDIT}
         fallback={() => redirect('/exams')}
       >
         <div className="exam-edit-layout">
           <ExamEditNavigation examId={params.examId} examTitle={exam.title} />
           <div className="exam-edit-content">
             {children}
           </div>
         </div>
       </ExamOperationGuard>
     );
   }
   ```

7. **Add Parallel Routes for Admin Dashboard**
   - Implement parallel routes for showing different admin dashboards
   - Use named slots for different dashboard sections

   ```tsx
   // src/app/(exams)/admin/@stats/page.tsx
   import { ExamStats } from '@/features/exams/components/organisms';
   import { getExamStats } from '@/features/exams/api/server';
   
   export default async function ExamStatsPage() {
     const stats = await getExamStats();
     return <ExamStats stats={stats} />;
   }
   
   // src/app/(exams)/admin/@recent/page.tsx
   import { RecentExams } from '@/features/exams/components/organisms';
   import { getRecentExams } from '@/features/exams/api/server';
   
   export default async function RecentExamsPage() {
     const exams = await getRecentExams();
     return <RecentExams exams={exams} />;
   }
   
   // src/app/(exams)/admin/page.tsx
   export default function AdminDashboard({
     stats,
     recent,
   }: {
     stats: React.ReactNode;
     recent: React.ReactNode;
   }) {
     return (
       <div className="admin-dashboard">
         <h1>Exam Administration</h1>
         <div className="dashboard-grid">
           <div className="stats-section">{stats}</div>
           <div className="recent-section">{recent}</div>
         </div>
       </div>
     );
   }
   ```

8. **Implement Intercepting Routes for Modal Patterns**
   - Use intercepting routes for showing edit modals over lists
   - Implement modal patterns for better UX

   ```tsx
   // src/app/(exams)/admin/[examId]/questions/[questionId]/(..)edit/page.tsx
   'use client'
   
   import { QuestionEditModal } from '@/features/exams/components/organisms';
   import { useQuestionQuery } from '@/features/exams/api/hooks';
   import { useRouter } from 'next/navigation';
   
   export default function QuestionEditModalPage({ 
     params 
   }: { 
     params: { examId: string, questionId: string } 
   }) {
     const router = useRouter();
     const { data: question, isLoading } = useQuestionQuery(params.questionId);
     
     const handleClose = () => {
       router.back();
     };
     
     return (
       <QuestionEditModal
         question={question}
         isLoading={isLoading}
         onClose={handleClose}
       />
     );
   }
   ```

## Custom Hooks for Navigation

Create custom hooks to manage exam admin navigation:

```tsx
// src/features/exams/hooks/useExamAdminNavigation.ts
import { useRouter, usePathname } from 'next/navigation';

export function useExamAdminNavigation(examId: string) {
  const router = useRouter();
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  const navigateToExamEdit = () => router.push(`/exams/admin/${examId}`);
  
  const navigateToQuestions = () => router.push(`/exams/admin/${examId}/questions`);
  
  const navigateToResults = () => router.push(`/exams/admin/${examId}/results`);
  
  return {
    isActive,
    navigateToExamEdit,
    navigateToQuestions,
    navigateToResults,
  };
}
```

## Server Actions for Form Submissions

Implement server actions for form submissions:

```tsx
// src/features/exams/actions/examActions.ts
'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiClient } from '@/core/api/server';
import { CreateExamRequest, UpdateExamRequest } from '@/features/exams/types';

export async function createExam(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  const examData: CreateExamRequest = {
    title,
    description,
    // Other fields...
  };
  
  try {
    const response = await apiClient.post('/exams', examData);
    const newExam = response.data;
    
    revalidatePath('/exams/admin');
    redirect(`/exams/admin/${newExam.id}`);
  } catch (error) {
    // Handle error
    return { error: 'Failed to create exam' };
  }
}

export async function updateExam(examId: string, formData: FormData) {
  // Similar implementation
}
```

## Verification Criteria
- All admin routes implemented with proper layouts
- Dynamic routes using slugs for exam and question IDs
- Parallel routes implemented for admin dashboard
- Intercepting routes implemented for modal patterns
- Server components with appropriate data fetching
- Server actions for form submissions
- Client components for interactive elements
- Proper error handling and not-found pages
- RBAC guards applied at appropriate levels
- Navigation works correctly between routes

## Time Estimate
Approximately 8-10 hours

## Dependencies
- Completion of Task R01 (Create Basic Route Group Structure)
- Completion of Task 04 from the main plan (RBAC Integration)
- Availability of required components from the exams feature
- API endpoints for admin operations

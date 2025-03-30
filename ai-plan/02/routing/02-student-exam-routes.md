# Task R02: Implement Student/User Exam Routes

## Description
Implement the routing structure for student/user exam interactions, including the dashboard for viewing available exams, dynamic routes for exam details, and routes for taking exams and viewing results.

## Implementation Steps

1. **Create Student Dashboard Route**
   - Implement `src/app/(exams)/dashboard/page.tsx` for the student dashboard
   - Set up metadata and descriptions
   - Connect to the appropriate components from the exams feature

   ```tsx
   // src/app/(exams)/dashboard/page.tsx
   import { StudentExamDashboard } from '@/features/exams/components/organisms';
   import { Metadata } from 'next';
   
   export const metadata: Metadata = {
     title: 'My Exams - PharmacyHub',
     description: 'View and take your assigned exams',
   };
   
   export default function StudentDashboardPage() {
     return <StudentExamDashboard />;
   }
   ```

2. **Implement Dynamic Exam Routes**
   - Create the dynamic route structure for individual exams using slugs:
     - `src/app/(exams)/[examId]/page.tsx` - Exam details
     - `src/app/(exams)/[examId]/layout.tsx` - Exam-specific layout
     - `src/app/(exams)/[examId]/loading.tsx` - Loading state
     - `src/app/(exams)/[examId]/error.tsx` - Error handling

   ```tsx
   // src/app/(exams)/[examId]/page.tsx
   import { ExamDetails } from '@/features/exams/components/organisms';
   import { getExamById } from '@/features/exams/api/server';
   import { Metadata } from 'next';
   import { notFound } from 'next/navigation';
   
   // Generate metadata dynamically based on the exam
   export async function generateMetadata({ 
     params 
   }: { 
     params: { examId: string } 
   }): Promise<Metadata> {
     const exam = await getExamById(params.examId);
     
     if (!exam) {
       return {
         title: 'Exam Not Found',
       };
     }
     
     return {
       title: `${exam.title} - PharmacyHub Exams`,
       description: exam.description || 'Take this exam on PharmacyHub',
     };
   }
   
   export default async function ExamDetailsPage({ 
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
     
     return <ExamDetails exam={exam} />;
   }
   ```

3. **Implement Exam Layout with Navigation**
   ```tsx
   // src/app/(exams)/[examId]/layout.tsx
   import { ExamHeader } from '@/features/exams/components/molecules';
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
       <div className="exam-specific-layout">
         <ExamHeader exam={exam} />
         <div className="exam-content">
           {children}
         </div>
       </div>
     );
   }
   ```

4. **Create Exam Attempt Route**
   - Implement the route for taking an exam:
     - `src/app/(exams)/[examId]/attempt/page.tsx`
     - Add appropriate guards and error handling

   ```tsx
   // src/app/(exams)/[examId]/attempt/page.tsx
   import { ExamAttempt } from '@/features/exams/components/organisms';
   import { getExamById } from '@/features/exams/api/server';
   import { examCanBeAttempted } from '@/features/exams/utils/examUtils';
   import { redirect, notFound } from 'next/navigation';
   
   export default async function ExamAttemptPage({ 
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
     
     // Check if the exam can be attempted
     const canAttempt = await examCanBeAttempted(params.examId);
     
     // Redirect if not allowed to attempt
     if (!canAttempt) {
       redirect(`/exams/${params.examId}`);
     }
     
     return <ExamAttempt examId={params.examId} />;
   }
   ```

5. **Implement Results Routes**
   - Create routes for viewing exam results:
     - `src/app/(exams)/[examId]/results/page.tsx` - All attempts
     - `src/app/(exams)/[examId]/results/[attemptId]/page.tsx` - Specific attempt

   ```tsx
   // src/app/(exams)/[examId]/results/page.tsx
   import { ExamResultsList } from '@/features/exams/components/organisms';
   import { getExamById, getExamAttempts } from '@/features/exams/api/server';
   import { notFound } from 'next/navigation';
   
   export default async function ExamResultsPage({ 
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
     
     // Fetch attempt data
     const attempts = await getExamAttempts(params.examId);
     
     return <ExamResultsList exam={exam} attempts={attempts} />;
   }
   ```

6. **Implement Not Found and Custom Error Pages**
   ```tsx
   // src/app/(exams)/[examId]/not-found.tsx
   import { ExamNotFound } from '@/features/exams/components/feedback';
   
   export default function ExamNotFoundPage() {
     return <ExamNotFound />;
   }
   ```

7. **Set Up Proper Navigation Between Routes**
   - Create navigation utilities for moving between exam routes
   - Implement breadcrumbs for nested routes
   - Ensure proper navigation patterns for the user flow

## Server Components and Data Fetching

For optimal performance, implement server components with proper data fetching:

```tsx
// src/features/exams/api/server.ts
import { apiClient } from '@/core/api/server';
import { Exam, ExamAttempt } from '@/features/exams/types';

export async function getExamById(examId: string): Promise<Exam | null> {
  try {
    const response = await apiClient.get(`/exams/${examId}`);
    return response.data;
  } catch (error) {
    // Handle specific error cases if needed
    return null;
  }
}

export async function getExamAttempts(examId: string): Promise<ExamAttempt[]> {
  try {
    const response = await apiClient.get(`/exams/${examId}/attempts`);
    return response.data;
  } catch (error) {
    // Handle errors
    return [];
  }
}
```

## Dynamic Metadata Generation

Use Next.js 15's dynamic metadata generation for SEO:

```tsx
// Example of dynamic metadata with generateMetadata
export async function generateMetadata({ 
  params 
}: { 
  params: { examId: string, attemptId: string } 
}): Promise<Metadata> {
  const exam = await getExamById(params.examId);
  const attempt = await getAttemptById(params.attemptId);
  
  if (!exam || !attempt) {
    return {
      title: 'Result Not Found',
    };
  }
  
  return {
    title: `Results: ${exam.title} (${attempt.date}) - PharmacyHub`,
    description: `View your results for ${exam.title}`,
  };
}
```

## Verification Criteria
- All student/user routes implemented with proper layouts
- Dynamic routes using slugs for exam IDs and attempt IDs
- Server components with appropriate data fetching
- Client components for interactive elements
- Proper error handling and not-found pages
- Metadata generation for SEO
- Navigation works correctly between routes
- Loading states implemented for better UX

## Time Estimate
Approximately 6-8 hours

## Dependencies
- Completion of Task R01 (Create Basic Route Group Structure)
- Availability of required components from the exams feature
- API endpoints for fetching exam data

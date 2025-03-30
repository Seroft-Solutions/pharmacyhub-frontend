# Task R05: Implement Loading and Error States

## Description
Create comprehensive loading and error states for all routes in the Exams feature using Next.js 15 App Router's built-in loading, error, and not-found handling. This task focuses on enhancing user experience with appropriate feedback during data loading, error conditions, and when resources are not found.

## Implementation Steps

1. **Design Loading UI Components**
   - Create reusable loading components with different styles and sizes
   - Implement skeleton loaders for content-rich pages
   - Design loading indicators for different contexts

   ```tsx
   // src/features/exams/components/feedback/LoadingSpinner.tsx
   export interface LoadingSpinnerProps {
     size?: 'small' | 'medium' | 'large';
     fullPage?: boolean;
     label?: string;
   }
   
   export function LoadingSpinner({
     size = 'medium',
     fullPage = false,
     label = 'Loading...',
   }: LoadingSpinnerProps) {
     const containerClass = fullPage ? 'loading-full-page' : 'loading-container';
     
     return (
       <div className={`${containerClass} loading-${size}`}>
         <div className="spinner"></div>
         {label && <p className="loading-label">{label}</p>}
       </div>
     );
   }
   
   // src/features/exams/components/feedback/SkeletonLoader.tsx
   export interface SkeletonLoaderProps {
     type: 'card' | 'list' | 'table' | 'text';
     count?: number;
   }
   
   export function SkeletonLoader({
     type,
     count = 1,
   }: SkeletonLoaderProps) {
     const items = Array.from({ length: count }, (_, i) => i);
     
     return (
       <div className={`skeleton-${type}`}>
         {items.map((index) => (
           <div key={index} className="skeleton-item">
             {type === 'card' && (
               <>
                 <div className="skeleton-header"></div>
                 <div className="skeleton-body">
                   <div className="skeleton-line"></div>
                   <div className="skeleton-line"></div>
                   <div className="skeleton-line"></div>
                 </div>
               </>
             )}
             {/* Other skeleton types */}
           </div>
         ))}
       </div>
     );
   }
   ```

2. **Implement Root Loading States**
   - Create loading.tsx files for each route
   - Apply appropriate loading UI based on route context

   ```tsx
   // src/app/(exams)/loading.tsx
   import { LoadingSpinner } from '@/features/exams/components/feedback';
   
   export default function ExamsLoading() {
     return <LoadingSpinner fullPage label="Loading exams..." />;
   }
   
   // src/app/(exams)/dashboard/loading.tsx
   import { SkeletonLoader } from '@/features/exams/components/feedback';
   
   export default function DashboardLoading() {
     return (
       <div className="dashboard-loading">
         <h1>My Exams</h1>
         <SkeletonLoader type="card" count={4} />
       </div>
     );
   }
   ```

3. **Create Custom Error Components**
   - Design error displays for different error types
   - Implement retry functionality where appropriate
   - Create user-friendly error messages

   ```tsx
   // src/features/exams/components/feedback/ErrorDisplay.tsx
   export interface ErrorDisplayProps {
     error: Error;
     onReset?: () => void;
     fullPage?: boolean;
   }
   
   export function ErrorDisplay({
     error,
     onReset,
     fullPage = false,
   }: ErrorDisplayProps) {
     // Determine error type and message
     const errorType = error.name;
     const errorMessage = error.message || 'An unexpected error occurred';
     
     return (
       <div className={`error-display ${fullPage ? 'full-page' : ''}`}>
         <div className="error-icon">⚠️</div>
         <h2 className="error-title">Something went wrong</h2>
         <p className="error-message">{errorMessage}</p>
         {onReset && (
           <button 
             onClick={onReset}
             className="error-retry-button"
           >
             Try again
           </button>
         )}
       </div>
     );
   }
   
   // src/features/exams/components/feedback/NotFoundDisplay.tsx
   export interface NotFoundDisplayProps {
     type?: 'exam' | 'question' | 'result' | 'generic';
     navigateBackLabel?: string;
     onNavigateBack?: () => void;
   }
   
   export function NotFoundDisplay({
     type = 'generic',
     navigateBackLabel = 'Go back',
     onNavigateBack,
   }: NotFoundDisplayProps) {
     const titles = {
       exam: 'Exam Not Found',
       question: 'Question Not Found',
       result: 'Result Not Found',
       generic: 'Not Found',
     };
     
     const messages = {
       exam: 'The exam you are looking for does not exist or has been removed.',
       question: 'The question you are looking for does not exist or has been removed.',
       result: 'The result you are looking for does not exist or has been removed.',
       generic: 'The resource you are looking for does not exist or has been removed.',
     };
     
     return (
       <div className="not-found-display">
         <div className="not-found-icon">🔍</div>
         <h2 className="not-found-title">{titles[type]}</h2>
         <p className="not-found-message">{messages[type]}</p>
         {onNavigateBack && (
           <button 
             onClick={onNavigateBack}
             className="not-found-back-button"
           >
             {navigateBackLabel}
           </button>
         )}
       </div>
     );
   }
   ```

4. **Implement Error Boundaries**
   - Create error.tsx files for each route
   - Configure error handling based on route context

   ```tsx
   // src/app/(exams)/error.tsx
   'use client'
   
   import { ErrorDisplay } from '@/features/exams/components/feedback';
   
   export default function ExamsError({
     error,
     reset,
   }: {
     error: Error & { digest?: string };
     reset: () => void;
   }) {
     return (
       <ErrorDisplay 
         error={error} 
         onReset={reset} 
         fullPage
       />
     );
   }
   
   // src/app/(exams)/[examId]/error.tsx
   'use client'
   
   import { useEffect } from 'react';
   import { ErrorDisplay } from '@/features/exams/components/feedback';
   import { logError } from '@/core/utils/errorLogging';
   
   export default function ExamError({
     error,
     reset,
     params,
   }: {
     error: Error & { digest?: string };
     reset: () => void;
     params: { examId: string };
   }) {
     // Log exam-specific errors
     useEffect(() => {
       logError('ExamError', { examId: params.examId, error });
     }, [error, params.examId]);
     
     return (
       <ErrorDisplay 
         error={error} 
         onReset={reset}
       />
     );
   }
   ```

5. **Create Not Found Pages**
   - Implement not-found.tsx files for key routes
   - Design user-friendly not found experiences

   ```tsx
   // src/app/(exams)/[examId]/not-found.tsx
   'use client'
   
   import { NotFoundDisplay } from '@/features/exams/components/feedback';
   import { useRouter } from 'next/navigation';
   
   export default function ExamNotFound() {
     const router = useRouter();
     
     return (
       <NotFoundDisplay 
         type="exam"
         navigateBackLabel="Back to Exams"
         onNavigateBack={() => router.push('/exams')}
       />
     );
   }
   
   // src/app/(exams)/admin/[examId]/questions/[questionId]/not-found.tsx
   'use client'
   
   import { NotFoundDisplay } from '@/features/exams/components/feedback';
   import { useRouter } from 'next/navigation';
   
   export default function QuestionNotFound({
     params,
   }: {
     params: { examId: string };
   }) {
     const router = useRouter();
     
     return (
       <NotFoundDisplay 
         type="question"
         navigateBackLabel="Back to Questions"
         onNavigateBack={() => router.push(`/exams/admin/${params.examId}/questions`)}
       />
     );
   }
   ```

6. **Implement Suspense Boundaries**
   - Use Suspense for streaming in different parts of the UI
   - Create fallback components for Suspense
   - Optimize loading experience with streaming

   ```tsx
   // src/app/(exams)/dashboard/page.tsx
   import { Suspense } from 'react';
   import { StudentDashboard } from '@/features/exams/components/organisms';
   import { SkeletonLoader, LoadingSpinner } from '@/features/exams/components/feedback';
   
   export default function DashboardPage() {
     return (
       <div className="dashboard-page">
         <h1>My Exams</h1>
         
         <div className="dashboard-sections">
           <section>
             <h2>Upcoming Exams</h2>
             <Suspense fallback={<SkeletonLoader type="card" count={2} />}>
               <UpcomingExams />
             </Suspense>
           </section>
           
           <section>
             <h2>Recent Results</h2>
             <Suspense fallback={<SkeletonLoader type="list" count={3} />}>
               <RecentResults />
             </Suspense>
           </section>
         </div>
       </div>
     );
   }
   
   // Components that fetch their own data
   async function UpcomingExams() {
     const exams = await getUpcomingExams();
     return <ExamsList exams={exams} />;
   }
   
   async function RecentResults() {
     const results = await getRecentResults();
     return <ResultsList results={results} />;
   }
   ```

7. **Add Loading Indicators for Actions**
   - Implement loading states for form submissions
   - Create loading indicators for client-side transitions
   - Design interactive loading experiences

   ```tsx
   // src/features/exams/components/molecules/SubmitButton.tsx
   'use client'
   
   import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
   
   interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     isLoading?: boolean;
     loadingText?: string;
   }
   
   export function SubmitButton({
     children,
     isLoading = false,
     loadingText = 'Submitting...',
     ...props
   }: PropsWithChildren<SubmitButtonProps>) {
     return (
       <button
         {...props}
         disabled={isLoading || props.disabled}
         className={`submit-button ${isLoading ? 'loading' : ''} ${props.className || ''}`}
       >
         {isLoading ? (
           <>
             <span className="spinner-icon"></span>
             <span>{loadingText}</span>
           </>
         ) : (
           children
         )}
       </button>
     );
   }
   ```

## Best Practices for Loading States

1. **Progressive Loading**
   - Show content as soon as it's available
   - Use streaming and suspense for partial loading
   - Implement skeleton loaders that match the content shape

2. **Contextual Loading**
   - Use different loading indicators based on context
   - Show more detailed loading for longer operations
   - Provide feedback on multi-step processes

3. **Error Handling**
   - Create specific error states for different error types
   - Provide clear recovery actions
   - Log errors for debugging

4. **Consistent Experience**
   - Use consistent loading patterns across the feature
   - Maintain proper layout during loading
   - Avoid content jumps as data loads

## Loading and Error State Component Reference

```markdown
# Loading Components

| Component | Usage | Props |
|-----------|-------|-------|
| LoadingSpinner | General purpose loading indicator | size, fullPage, label |
| SkeletonLoader | Content placeholder during loading | type, count |
| LoadingBar | Progress indicator for multi-step processes | progress, total |
| LoadingOverlay | Transparent overlay for in-place loading | message |

# Error Components

| Component | Usage | Props |
|-----------|-------|-------|
| ErrorDisplay | General purpose error display | error, onReset, fullPage |
| NotFoundDisplay | Resource not found display | type, navigateBackLabel, onNavigateBack |
| ErrorBoundary | Client component error boundary | fallback |
| ApiErrorMessage | Formatted API error message | error, fieldErrors |
```

## Verification Criteria
- Loading states implemented for all routes
- Appropriate loading UI for different contexts
- Error boundaries with proper error handling
- Not-found pages for key resources
- Suspense boundaries for streaming content
- Loading indicators for user actions
- Consistent loading and error experience
- Accessible loading and error states

## Time Estimate
Approximately 3-4 hours

## Dependencies
- Completion of Tasks R01-R04
- Core UI components available
- Error logging infrastructure in place

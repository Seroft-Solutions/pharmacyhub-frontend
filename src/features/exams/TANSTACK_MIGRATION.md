# TanStack Query Migration Guide for Exams Feature

This document provides guidance on how to migrate from the legacy API implementation to the new TanStack Query implementation for the Exams feature.

## Overview

The Exams feature now has full integration with TanStack Query (React Query) for data fetching, caching, and state management. This implementation follows the patterns and best practices established in the `tanstack-query-api` feature.

Key benefits:
- Automatic caching and background refetching
- Optimistic updates
- Easy loading and error states
- Deduplication of requests
- Retry logic with exponential backoff
- Dev tools for debugging

## Directory Structure

The TanStack Query implementation is organized as follows:

```
src/features/exams/
├── api/
│   ├── tanstack/
│   │   ├── examApiService.ts   # API service with TanStack Query integration
│   │   ├── examHooks.ts        # TanStack Query hooks for data fetching
│   │   ├── examQueryKeys.ts    # Query keys for caching
│   │   └── index.ts            # Exports for the tanstack module
│   └── index.ts                # Main API exports (includes both implementations)
└── hooks/
    ├── useTanstackExams.ts     # Unified interface for TanStack Query
    └── index.ts                # Exports all hooks
```

## How to Use

### Basic Data Fetching

```tsx
import { useTanstackExams } from '@/features/exams/hooks';

function ExamList() {
  const { usePublishedExams } = useTanstackExams();
  const { data: exams, isLoading, error } = usePublishedExams();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>Available Exams</h1>
      <ul>
        {exams?.map(exam => (
          <li key={exam.id}>{exam.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Data Mutations

```tsx
import { useTanstackExams } from '@/features/exams/hooks';

function StartExamButton({ examId }) {
  const { useStartExam } = useTanstackExams();
  const { mutate: startExam, isPending, error } = useStartExam();
  
  const handleClick = () => {
    startExam(examId, {
      onSuccess: (data) => {
        // Navigate to the exam page
        router.push(`/exams/${examId}/attempt/${data.id}`);
      }
    });
  };
  
  return (
    <button 
      onClick={handleClick} 
      disabled={isPending}
    >
      {isPending ? 'Starting...' : 'Start Exam'}
    </button>
  );
}
```

### Complete Exam Session

For a complete exam session with both API integration and local state management:

```tsx
import { useTanstackExamSession } from '@/features/exams/hooks';

function ExamSession({ examId }) {
  const {
    exam,
    questions,
    isLoading,
    error,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    isCompleted,
    startExam,
    answerQuestion,
    submitExam,
    toggleFlagQuestion,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    handleTimeExpired
  } = useTanstackExamSession(examId);

  // Implement your UI using these values and functions
  // ...
}
```

## Query Keys

If you need to manually invalidate queries or interact with the cache, use the query keys:

```tsx
import { useTanstackExams } from '@/features/exams/hooks';
import { useQueryClient } from '@tanstack/react-query';

function InvalidateCache() {
  const { queryKeys } = useTanstackExams();
  const queryClient = useQueryClient();
  
  const handleClick = () => {
    // Invalidate all exam queries
    queryClient.invalidateQueries({
      queryKey: queryKeys.all()
    });
    
    // Or invalidate a specific exam
    queryClient.invalidateQueries({
      queryKey: queryKeys.detail(123)
    });
  };
  
  return <button onClick={handleClick}>Refresh Data</button>;
}
```

## Migrating Existing Components

When migrating existing components from the legacy API implementation:

1. Replace direct API imports with hooks from `useTanstackExams()`
2. Replace loading state management with the built-in `isLoading` property
3. Replace error handling with the built-in `error` property
4. Update effect dependencies to watch for data changes from the query hooks

Example migration:

**Before:**
```tsx
import { examService } from '@/features/exams/api';
import { useState, useEffect } from 'react';

function ExamDetailPage({ examId }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await examService.getExamById(examId);
        setExam(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExam();
  }, [examId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!exam) return <div>Exam not found</div>;
  
  return (
    <div>
      <h1>{exam.title}</h1>
      <p>{exam.description}</p>
      {/* ... */}
    </div>
  );
}
```

**After:**
```tsx
import { useTanstackExams } from '@/features/exams/hooks';

function ExamDetailPage({ examId }) {
  const { useExam } = useTanstackExams();
  const { data: exam, isLoading, error } = useExam(examId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!exam) return <div>Exam not found</div>;
  
  return (
    <div>
      <h1>{exam.title}</h1>
      <p>{exam.description}</p>
      {/* ... */}
    </div>
  );
}
```

## Enhanced Features

The TanStack Query implementation provides several enhanced features over the legacy implementation:

### Paginated Queries

```tsx
import { useTanstackExams } from '@/features/exams/hooks';
import { useState } from 'react';

function PaginatedExamList() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const { usePaginatedExams } = useTanstackExams();
  const { data, isLoading } = usePaginatedExams({
    page,
    size: pageSize,
    status: 'PUBLISHED'
  });
  
  return (
    <div>
      {/* List rendering */}
      <div className="pagination">
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data || data.length < pageSize || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Dependent Queries

```tsx
import { useTanstackExams } from '@/features/exams/hooks';

function ExamQuestions({ examId }) {
  const { useExam, useExamQuestions } = useTanstackExams();
  
  // First query to get the exam
  const { 
    data: exam, 
    isLoading: isExamLoading 
  } = useExam(examId);
  
  // Second query that depends on the first one
  const { 
    data: questions, 
    isLoading: isQuestionsLoading 
  } = useExamQuestions(examId, {
    // This query won't run until exam data is available
    enabled: !!exam
  });
  
  const isLoading = isExamLoading || isQuestionsLoading;
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{exam.title}</h1>
      <h2>Questions ({questions.length})</h2>
      {/* Question list */}
    </div>
  );
}
```

### Optimistic Updates

```tsx
import { useTanstackExams } from '@/features/exams/hooks';
import { useQueryClient } from '@tanstack/react-query';

function FlagQuestionButton({ attemptId, questionId, isFlagged }) {
  const { useFlagQuestion, useUnflagQuestion, queryKeys } = useTanstackExams();
  const queryClient = useQueryClient();
  
  const flagMutation = useFlagQuestion();
  const unflagMutation = useUnflagQuestion();
  
  const handleToggleFlag = () => {
    const mutation = isFlagged ? unflagMutation : flagMutation;
    
    mutation.mutate(
      { attemptId, questionId },
      {
        // Optimistically update the UI
        onMutate: async () => {
          // Cancel any outgoing refetches
          await queryClient.cancelQueries({
            queryKey: queryKeys.flagged(attemptId)
          });
          
          // Get the current flagged questions
          const previousFlagged = queryClient.getQueryData(
            queryKeys.flagged(attemptId)
          );
          
          // Optimistically update the cache
          queryClient.setQueryData(
            queryKeys.flagged(attemptId),
            old => {
              if (isFlagged) {
                // Remove from flagged list
                return old.filter(fq => fq.questionId !== questionId);
              } else {
                // Add to flagged list
                return [...old, { questionId, attemptId }];
              }
            }
          );
          
          // Return the previous value to roll back if needed
          return { previousFlagged };
        },
        onError: (err, variables, context) => {
          // Roll back on error
          queryClient.setQueryData(
            queryKeys.flagged(attemptId),
            context.previousFlagged
          );
        },
        onSettled: () => {
          // Refetch to ensure cache is correct
          queryClient.invalidateQueries({
            queryKey: queryKeys.flagged(attemptId)
          });
        }
      }
    );
  };
  
  return (
    <button 
      onClick={handleToggleFlag}
      disabled={flagMutation.isPending || unflagMutation.isPending}
    >
      {isFlagged ? 'Unflag' : 'Flag'} Question
    </button>
  );
}
```

## Best Practices

1. **Use the high-level hooks**: Start with `useTanstackExams()` to access all functionality.

2. **Keep UI components clean**: Extract data fetching logic to custom hooks when needed.

3. **Take advantage of caching**: Adjust staleTime and cacheTime for specific queries if needed.

4. **Use query options**: Set `enabled` to control when queries run and `refetchOnWindowFocus` to control refetching behavior.

5. **Structure query keys correctly**: Follow the pattern from `examQueryKeys` for predictable caching.

6. **Invalidate appropriately**: After mutations, invalidate only the affected parts of the cache.

7. **Handle loading and error states**: Always account for isLoading and error states in your UI.

## Conclusion

The TanStack Query implementation for the Exams feature provides a modern, declarative approach to data fetching and state management. By utilizing this implementation, you'll benefit from automatic caching, background refetching, and many other features that improve both user experience and developer productivity.

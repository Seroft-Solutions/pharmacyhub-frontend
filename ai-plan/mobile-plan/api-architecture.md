# PharmacyHub Exams Feature - API Architecture for Mobile Compatibility

## Introduction

This document outlines the API architecture strategy for mobile compatibility implementation. Efficient data management is crucial for mobile performance, offline capabilities, and a smooth user experience. We will leverage TanStack Query (formerly React Query) to create a centralized, efficient API layer that reduces boilerplate code and provides a single source of truth.

## Current API Implementation Analysis

The current implementation uses custom hooks for API integration:

- `useExamApiHooks.ts`
- `useExamAttemptHooks.ts` 
- `useExamHooks.ts`
- `useExamPaperHooks.ts`

While functional, this approach has some limitations for mobile use:

1. Limited offline capability
2. No structured caching strategy
3. Potential redundant data fetching
4. Inconsistent error handling
5. No background synchronization

## Proposed TanStack Query Architecture

### Core Architecture Components

1. **Centralized Query Client**
   - Setup TanStack Query with mobile-optimized configuration
   - Configure global error handling
   - Implement offline persistence strategy

2. **Query/Mutation Hooks Factory**
   - Create factory functions to generate API hooks
   - Ensure consistent patterns across all API endpoints
   - Implement proper type safety

3. **Offline Support Layer**
   - Implement offline mutation queue
   - Set up background synchronization
   - Provide optimistic updates for better UX

4. **Cache Management**
   - Configure cache invalidation strategy
   - Implement prefetching for important data
   - Set up memory-efficient caching for mobile

### Key Technical Files

#### 1. `examQueryClient.ts`

```typescript
// src/features/exams/api/examQueryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Create a client
export const examQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Mobile optimized configuration
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false, // Reduce unnecessary fetches on mobile
      refetchOnReconnect: true, // Refetch when connection is restored
      retry: 3, // More retries for mobile's unstable connections
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      
      // Mobile-specific options
      networkMode: 'always', // 'always', 'online', or 'offlineFirst'
      
      // Structuring error handling
      useErrorBoundary: false, // Handle errors within components
    },
    mutations: {
      // Mobile optimized mutation settings
      retry: 2,
      retryDelay: 1000,
      networkMode: 'online', // Only process mutations when online
    },
  },
});

// Set up persistence for offline support
if (typeof window !== 'undefined') {
  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'PHARMACY_HUB_EXAM_QUERY_CACHE',
    throttleTime: 1000, // Only save cache once per second maximum
    serialize: data => JSON.stringify(data),
    deserialize: data => JSON.parse(data),
  });

  persistQueryClient({
    queryClient: examQueryClient,
    persister: localStoragePersister,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    buster: APP_VERSION, // Use app version to bust cache on updates
    dehydrateOptions: {
      shouldDehydrateQuery: query => {
        // Only persist specific queries to save space on mobile
        const queryKey = query.queryKey[0];
        const persistableQueries = [
          'examsList', 
          'examDetails', 
          'questionBank', 
          'userProgress'
        ];
        
        return typeof queryKey === 'string' && persistableQueries.includes(queryKey);
      },
    },
  });
}
```

#### 2. `examQueryProvider.tsx`

```typescript
// src/features/exams/api/examQueryProvider.tsx
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { examQueryClient } from './examQueryClient';

interface ExamQueryProviderProps {
  children: React.ReactNode;
}

export function ExamQueryProvider({ children }: ExamQueryProviderProps) {
  return (
    <QueryClientProvider client={examQueryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
```

#### 3. `apiUtils.ts`

```typescript
// src/features/exams/api/apiUtils.ts
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Common types
export type ApiError = AxiosError<{
  message: string;
  code: string;
  details?: any;
}>;

// Helper for standardized error handling
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error);
    }
    
    // Format standard error messages
    if ((error as ApiError).response?.data?.message) {
      return error as ApiError;
    }
    
    // Create a standardized error format
    const apiError = error as ApiError;
    apiError.response = apiError.response || {
      data: {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      },
      status: 500,
      statusText: 'Error',
      headers: {},
      config: {},
    };
    
    return apiError;
  }
  
  // Handle non-Error objects
  const apiError = new Error('Unknown error') as ApiError;
  apiError.response = {
    data: {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    status: 500,
    statusText: 'Error',
    headers: {},
    config: {},
  };
  
  return apiError;
}

// Helper for mobile-optimized query options
export function createMobileQueryOptions<TData, TError = ApiError>(
  options?: UseQueryOptions<TData, TError>
): UseQueryOptions<TData, TError> {
  return {
    // Mobile-specific defaults
    staleTime: 1000 * 60 * 5, // 5 minutes 
    cacheTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  };
}

// Helper for mobile-optimized mutation options
export function createMobileMutationOptions<TData, TVariables, TError = ApiError, TContext = unknown>(
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationOptions<TData, TError, TVariables, TContext> {
  return {
    // Retry logic for flaky mobile connections
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Add your defaults here
    ...options,
    // Error handling
    onError: (error, variables, context) => {
      // Default error handling
      handleApiError(error);
      
      // Call custom error handler if provided
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  };
}
```

### 4. `examQueryHooks.ts`

```typescript
// src/features/exams/api/hooks/examQueryHooks.ts
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryResult,
  UseMutationResult
} from '@tanstack/react-query';
import { 
  createMobileQueryOptions, 
  createMobileMutationOptions,
  ApiError,
  handleApiError
} from '../apiUtils';
import { examService } from '../services/examService';
import type { 
  Exam, 
  ExamMeta, 
  ExamAttempt, 
  ExamResponse,
  QuestionResponse,
  ExamListParams,
  ExamSubmitParams
} from '../types';

// Query key factory for consistent key patterns
export const examKeys = {
  all: ['exams'] as const,
  lists: () => [...examKeys.all, 'list'] as const,
  list: (params: ExamListParams) => [...examKeys.lists(), params] as const,
  details: () => [...examKeys.all, 'detail'] as const,
  detail: (id: number) => [...examKeys.details(), id] as const,
  attempts: () => [...examKeys.all, 'attempts'] as const,
  attempt: (id: number) => [...examKeys.attempts(), id] as const,
};

// =============================================
// Exams List API
// =============================================

export function useExamsList(
  params: ExamListParams = { page: 1, limit: 20 },
  options = {}
): UseQueryResult<ExamMeta[], ApiError> {
  return useQuery<ExamMeta[], ApiError>(
    examKeys.list(params),
    () => examService.getExams(params),
    createMobileQueryOptions({
      // Enable prefetching for list views
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options,
    })
  );
}

// =============================================
// Exam Details API
// =============================================

export function useExamDetails(
  examId: number,
  options = {}
): UseQueryResult<Exam, ApiError> {
  return useQuery<Exam, ApiError>(
    examKeys.detail(examId),
    () => examService.getExamById(examId),
    createMobileQueryOptions({
      // Critical data, more aggressive fetching
      staleTime: 1000 * 60 * 5, // 5 minutes
      ...options,
    })
  );
}

// =============================================
// Exam Attempt API
// =============================================

export function useStartExam(options = {}): UseMutationResult<
  ExamAttempt,
  ApiError,
  { examId: number; userId: string },
  unknown
> {
  const queryClient = useQueryClient();
  
  return useMutation<ExamAttempt, ApiError, { examId: number; userId: string }>(
    ({ examId, userId }) => examService.startExam(examId, userId),
    createMobileMutationOptions({
      // Optimistically update the UI
      onSuccess: (data, variables) => {
        // Update queries with the new attempt data
        queryClient.setQueryData(
          examKeys.attempt(data.id),
          data
        );
        
        // Update attempts list
        queryClient.invalidateQueries(examKeys.attempts());
        
        // Custom success handler
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      ...options,
    })
  );
}

export function useExamAttempt(
  attemptId: number,
  options = {}
): UseQueryResult<ExamAttempt, ApiError> {
  return useQuery<ExamAttempt, ApiError>(
    examKeys.attempt(attemptId),
    () => examService.getAttempt(attemptId),
    createMobileQueryOptions({
      // Critical data during exam taking
      staleTime: 1000 * 30, // 30 seconds, more frequent updates
      refetchInterval: 1000 * 60, // Poll every minute for changes
      ...options,
    })
  );
}

// =============================================
// Question Response API 
// =============================================

export function useAnswerQuestion(options = {}): UseMutationResult<
  QuestionResponse,
  ApiError,
  { attemptId: number; questionId: number; selectedOption: number },
  { previousResponses: Record<number, QuestionResponse> }
> {
  const queryClient = useQueryClient();
  
  return useMutation<
    QuestionResponse,
    ApiError,
    { attemptId: number; questionId: number; selectedOption: number },
    { previousResponses: Record<number, QuestionResponse> }
  >(
    ({ attemptId, questionId, selectedOption }) => 
      examService.answerQuestion(attemptId, questionId, selectedOption),
    createMobileMutationOptions({
      // Keep track of previous state
      onMutate: async ({ attemptId, questionId, selectedOption }) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(examKeys.attempt(attemptId));
        
        // Snapshot current data
        const previousResponses = queryClient.getQueryData<ExamAttempt>(
          examKeys.attempt(attemptId)
        )?.responses || {};
        
        // Optimistically update
        queryClient.setQueryData<ExamAttempt | undefined>(
          examKeys.attempt(attemptId),
          old => {
            if (!old) return undefined;
            
            return {
              ...old,
              responses: {
                ...old.responses,
                [questionId]: {
                  questionId,
                  selectedOption,
                  timeSpent: 0, // This would be tracked in the UI
                  isCorrect: false, // Unknown until submission
                }
              }
            };
          }
        );
        
        // Return context with snapshot
        return { previousResponses };
      },
      
      // If error, roll back
      onError: (err, { attemptId }, context) => {
        if (context?.previousResponses) {
          queryClient.setQueryData<ExamAttempt | undefined>(
            examKeys.attempt(attemptId),
            old => {
              if (!old) return undefined;
              
              return {
                ...old,
                responses: context.previousResponses
              };
            }
          );
        }
      },
      
      // After success or error, refetch
      onSettled: (_, __, { attemptId }) => {
        queryClient.invalidateQueries(examKeys.attempt(attemptId));
      },
      
      ...options,
    })
  );
}

// =============================================
// Submit Exam API 
// =============================================

export function useSubmitExam(options = {}): UseMutationResult<
  ExamResponse,
  ApiError,
  { attemptId: number },
  unknown
> {
  const queryClient = useQueryClient();
  
  return useMutation<ExamResponse, ApiError, { attemptId: number }>(
    ({ attemptId }) => examService.submitExam(attemptId),
    createMobileMutationOptions({
      // Critical operation with retry
      retry: 5, // More retries for this critical operation
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      onSuccess: (data, { attemptId }) => {
        // Update attempt with submission data
        queryClient.setQueryData(
          examKeys.attempt(attemptId),
          old => ({
            ...old,
            isCompleted: true,
            submittedAt: new Date().toISOString(),
            score: data.score,
            result: data,
          })
        );
        
        // Invalidate relevant queries
        queryClient.invalidateQueries(examKeys.attempts());
        
        // Custom success handler
        if (options.onSuccess) {
          options.onSuccess(data, { attemptId });
        }
      },
      ...options,
    })
  );
}

// =============================================
// Flag Question API 
// =============================================

export function useFlagQuestion(options = {}): UseMutationResult<
  void,
  ApiError,
  { attemptId: number; questionId: number; isFlagged: boolean },
  { previousFlags: Set<number> }
> {
  const queryClient = useQueryClient();
  
  return useMutation<
    void,
    ApiError,
    { attemptId: number; questionId: number; isFlagged: boolean },
    { previousFlags: Set<number> }
  >(
    ({ attemptId, questionId, isFlagged }) => 
      examService.flagQuestion(attemptId, questionId, isFlagged),
    createMobileMutationOptions({
      // Optimistic update for better UX
      onMutate: async ({ attemptId, questionId, isFlagged }) => {
        await queryClient.cancelQueries(examKeys.attempt(attemptId));
        
        // Snapshot current flags
        const attempt = queryClient.getQueryData<ExamAttempt>(
          examKeys.attempt(attemptId)
        );
        
        const previousFlags = new Set(attempt?.flaggedQuestions || []);
        
        // Update optimistically
        queryClient.setQueryData<ExamAttempt | undefined>(
          examKeys.attempt(attemptId),
          old => {
            if (!old) return undefined;
            
            const newFlags = new Set(old.flaggedQuestions || []);
            
            if (isFlagged) {
              newFlags.add(questionId);
            } else {
              newFlags.delete(questionId);
            }
            
            return {
              ...old,
              flaggedQuestions: Array.from(newFlags)
            };
          }
        );
        
        return { previousFlags };
      },
      
      // Rollback on error
      onError: (err, { attemptId }, context) => {
        if (context?.previousFlags) {
          queryClient.setQueryData<ExamAttempt | undefined>(
            examKeys.attempt(attemptId),
            old => {
              if (!old) return undefined;
              
              return {
                ...old,
                flaggedQuestions: Array.from(context.previousFlags)
              };
            }
          );
        }
      },
      
      // Refetch after mutation settles
      onSettled: (_, __, { attemptId }) => {
        queryClient.invalidateQueries(examKeys.attempt(attemptId));
      },
      
      ...options,
    })
  );
}
```

#### 5. `examOfflineSync.ts`

```typescript
// src/features/exams/api/examOfflineSync.ts
import { examQueryClient } from './examQueryClient';
import { examService } from './services/examService';
import { examKeys } from './hooks/examQueryHooks';

// Types
interface QueuedMutation {
  id: string;
  timestamp: number;
  type: 'answer' | 'flag' | 'submit';
  data: any;
  attempts: number;
  processedAt?: number;
}

// Queue management
const QUEUE_KEY = 'PHARMACY_HUB_OFFLINE_MUTATION_QUEUE';

// Load the queue from localStorage
export function loadMutationQueue(): QueuedMutation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (e) {
    console.error('Failed to load offline mutation queue', e);
    return [];
  }
}

// Save the queue to localStorage
export function saveMutationQueue(queue: QueuedMutation[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline mutation queue', e);
  }
}

// Add a mutation to the queue
export function queueMutation(type: 'answer' | 'flag' | 'submit', data: any): void {
  const queue = loadMutationQueue();
  
  const newMutation: QueuedMutation = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    type,
    data,
    attempts: 0,
  };
  
  saveMutationQueue([...queue, newMutation]);
}

// Process the mutation queue
export async function processMutationQueue(): Promise<void> {
  // Only process if online
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return;
  }
  
  const queue = loadMutationQueue();
  if (queue.length === 0) return;
  
  // Process in order (FIFO)
  const [mutation, ...remainingQueue] = queue;
  
  try {
    // Increment attempt counter
    mutation.attempts += 1;
    
    // Process based on type
    switch (mutation.type) {
      case 'answer':
        await examService.answerQuestion(
          mutation.data.attemptId,
          mutation.data.questionId,
          mutation.data.selectedOption
        );
        break;
        
      case 'flag':
        await examService.flagQuestion(
          mutation.data.attemptId,
          mutation.data.questionId,
          mutation.data.isFlagged
        );
        break;
        
      case 'submit':
        await examService.submitExam(mutation.data.attemptId);
        break;
    }
    
    // Mark as processed
    mutation.processedAt = Date.now();
    
    // Invalidate relevant queries
    if (mutation.data.attemptId) {
      examQueryClient.invalidateQueries(examKeys.attempt(mutation.data.attemptId));
    }
    
    // Remove from queue on success
    saveMutationQueue(remainingQueue);
    
    // Continue processing the queue
    if (remainingQueue.length > 0) {
      await processMutationQueue();
    }
  } catch (error) {
    console.error('Failed to process mutation', mutation, error);
    
    // If max attempts reached, remove from queue
    if (mutation.attempts >= 5) {
      saveMutationQueue(remainingQueue);
    } else {
      // Otherwise, put it back in the queue with incremented attempts
      saveMutationQueue([...remainingQueue, mutation]);
    }
  }
}

// Setup background sync
export function setupOfflineSyncHandlers(): void {
  if (typeof window === 'undefined') return;
  
  // Process queue when coming online
  window.addEventListener('online', () => {
    processMutationQueue();
  });
  
  // Check for unprocessed mutations periodically
  const intervalId = setInterval(() => {
    if (navigator.onLine) {
      processMutationQueue();
    }
  }, 60000); // Check every minute
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
  });
  
  // Initial processing
  if (navigator.onLine) {
    processMutationQueue();
  }
}
```

#### 6. `useExamSession.ts` (Enhanced with TanStack Query)

```typescript
// src/features/exams/hooks/useExamSession.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  useExamDetails, 
  useExamAttempt, 
  useStartExam,
  useAnswerQuestion,
  useFlagQuestion,
  useSubmitExam 
} from '../api/hooks/examQueryHooks';
import { queueMutation, processMutationQueue } from '../api/examOfflineSync';

export function useExamSession(examId: number) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [localAttemptId, setLocalAttemptId] = useState<number | null>(null);
  
  // Fetch exam details
  const { 
    data: exam,
    isLoading: isLoadingExam,
    error: examError
  } = useExamDetails(examId);
  
  // Mutations
  const { 
    mutate: startExam,
    isLoading: isStarting,
    error: startError 
  } = useStartExam({
    onSuccess: (data) => {
      setLocalAttemptId(data.id);
    }
  });
  
  const {
    mutate: answerQuestion,
    isLoading: isAnswering
  } = useAnswerQuestion();
  
  const {
    mutate: toggleFlagQuestion,
    isLoading: isFlagging
  } = useFlagQuestion();
  
  const {
    mutate: submitExam,
    isLoading: isSubmitting,
    error: submitError
  } = useSubmitExam();
  
  // Get attempt data if we have an attemptId
  const {
    data: attempt,
    isLoading: isLoadingAttempt
  } = useExamAttempt(localAttemptId!, {
    enabled: !!localAttemptId // Only run query if we have an attemptId
  });
  
  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processMutationQueue(); // Process any pending mutations
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Handle answering a question
  const handleAnswerQuestion = useCallback((questionId: number, selectedOption: number) => {
    if (!localAttemptId) return;
    
    // Optimistically update UI state immediately
    
    if (isOnline) {
      // If online, use the mutation directly
      answerQuestion({ 
        attemptId: localAttemptId, 
        questionId, 
        selectedOption 
      });
    } else {
      // If offline, queue the mutation for later
      queueMutation('answer', { 
        attemptId: localAttemptId, 
        questionId, 
        selectedOption 
      });
    }
  }, [localAttemptId, answerQuestion, isOnline]);
  
  // Handle flagging a question
  const handleToggleFlag = useCallback((questionId: number) => {
    if (!localAttemptId || !attempt) return;
    
    const currentFlags = new Set(attempt.flaggedQuestions || []);
    const isFlagged = currentFlags.has(questionId);
    
    if (isOnline) {
      toggleFlagQuestion({
        attemptId: localAttemptId,
        questionId,
        isFlagged: !isFlagged
      });
    } else {
      queueMutation('flag', {
        attemptId: localAttemptId,
        questionId,
        isFlagged: !isFlagged
      });
    }
  }, [localAttemptId, attempt, toggleFlagQuestion, isOnline]);
  
  // Handle submitting the exam
  const handleSubmitExam = useCallback(() => {
    if (!localAttemptId) return;
    
    if (isOnline) {
      submitExam({ attemptId: localAttemptId });
    } else {
      queueMutation('submit', { attemptId: localAttemptId });
      // Show warning that submission will happen when online
    }
  }, [localAttemptId, submitExam, isOnline]);
  
  // Navigation functions
  const navigateToQuestion = useCallback((index: number) => {
    if (exam && exam.questions && index >= 0 && index < exam.questions.length) {
      setCurrentQuestionIndex(index);
      setShowSummary(false);
    }
  }, [exam]);
  
  const nextQuestion = useCallback(() => {
    if (exam && exam.questions && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, exam]);
  
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);
  
  const toggleSummary = useCallback(() => {
    setShowSummary(prev => !prev);
  }, []);
  
  // Timer expiration handler
  const handleTimeExpired = useCallback(() => {
    handleSubmitExam();
  }, [handleSubmitExam]);
  
  // Helper functions
  const getAnsweredQuestionsCount = useCallback(() => {
    if (!attempt || !attempt.responses) return 0;
    return Object.keys(attempt.responses).length;
  }, [attempt]);
  
  const getFlaggedQuestionsCount = useCallback(() => {
    if (!attempt || !attempt.flaggedQuestions) return 0;
    return attempt.flaggedQuestions.length;
  }, [attempt]);
  
  const isFlagged = useCallback((questionId: number) => {
    if (!attempt || !attempt.flaggedQuestions) return false;
    return attempt.flaggedQuestions.includes(questionId);
  }, [attempt]);
  
  const hasAnswer = useCallback((questionId: number) => {
    if (!attempt || !attempt.responses) return false;
    return !!attempt.responses[questionId];
  }, [attempt]);
  
  const getCompletionPercentage = useCallback(() => {
    if (!exam || !exam.questions || !attempt) return 0;
    return (getAnsweredQuestionsCount() / exam.questions.length) * 100;
  }, [exam, attempt, getAnsweredQuestionsCount]);
  
  return {
    // Data
    exam,
    questions: exam?.questions || [],
    currentQuestionIndex,
    answers: attempt?.responses || {},
    flaggedQuestions: new Set(attempt?.flaggedQuestions || []),
    timeRemaining: attempt?.timeRemaining || (exam?.duration || 0) * 60,
    isCompleted: attempt?.isCompleted || false,
    showSummary,
    
    // Loading states
    isLoading: isLoadingExam || isLoadingAttempt,
    error: examError,
    isStarting,
    isSubmitting,
    isSaving: isAnswering,
    isFlagging,
    startError,
    submitError,
    
    // Actions
    startExam,
    answerQuestion: handleAnswerQuestion,
    toggleFlagQuestion: handleToggleFlag,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    toggleSummary,
    submitExam: handleSubmitExam,
    handleTimeExpired,
    
    // Helpers
    hasAnswer,
    isFlagged,
    getAnsweredQuestionsCount,
    getFlaggedQuestionsCount,
    getCompletionPercentage,
    isOnline
  };
}
```

## Benefits of the TanStack Query Architecture

### 1. Reduced Boilerplate

The new architecture significantly reduces boilerplate code by:

- Centralizing query/mutation logic in factory functions
- Standardizing error handling patterns
- Creating reusable hooks for common operations
- Establishing consistent patterns for all API interactions

### 2. Mobile Performance Optimization

TanStack Query provides several performance benefits for mobile:

- **Intelligent caching**: Prevents unnecessary refetches
- **Stale-while-revalidate pattern**: Shows data immediately while refreshing in background
- **Automatic retries**: Handles unreliable mobile connections
- **Deduplication**: Prevents duplicate requests for the same data
- **Request cancellation**: Avoids race conditions and wasted bandwidth

### 3. Offline Capabilities

The architecture supports robust offline usage:

- **Persistent storage**: Cache persists across app restarts
- **Mutation queueing**: Operations performed offline are saved and processed when back online
- **Optimistic updates**: UI updates immediately for better user experience
- **Background synchronization**: Automatic processing of queued operations
- **Conflict resolution**: Handles conflicts between local and server state

### 4. Improved Developer Experience

The new architecture enhances developer experience through:

- **Type safety**: Strong TypeScript integration
- **DevTools**: Built-in debugging tools for query monitoring
- **Predictable patterns**: Consistent API across different endpoints
- **Separation of concerns**: Clear distinction between data fetching and presentation
- **Testability**: Easier to test with mock data providers

## Implementation Plan for API Architecture

### Phase 1: Setting up TanStack Query Foundation (1 week)

1. Install and configure TanStack Query
2. Create query client with mobile-optimized settings
3. Set up persistence layer for offline support
4. Implement query key factories for consistency
5. Create helper utilities for common patterns

### Phase 2: Migrating Core API Hooks (1 week)

1. Identify critical API endpoints for mobile experience
2. Create centralized query hooks for exam data
3. Implement mutation hooks with optimistic updates
4. Set up proper error handling patterns
5. Update components to use new hooks

### Phase 3: Offline Support Implementation (1 week)

1. Implement offline mutation queue
2. Create background synchronization logic
3. Add local storage persistence for critical data
4. Implement optimistic updates for critical actions
5. Add network status detection and handling

### Phase 4: Testing and Optimization (1 week)

1. Test API hooks under various network conditions
2. Measure and optimize performance metrics
3. Implement proper error recovery strategies
4. Document architecture for other developers
5. Create examples for future API integration

## Conclusion

This centralized API architecture using TanStack Query will provide a robust foundation for mobile compatibility in the PharmacyHub exams feature. By implementing standardized patterns, efficient caching, and offline support, we will deliver a smooth user experience even under challenging mobile network conditions.

The architecture prioritizes:
- Single source of truth for data
- Efficient network usage
- Graceful handling of connectivity issues
- Optimistic UI updates
- Consistent error handling

These improvements will directly contribute to the success of the mobile compatibility initiative by ensuring reliable data management across devices and network conditions.

# PharmacyHub Exams Feature - Mobile API Integration

## Overview

This document outlines how the exams feature will integrate with the existing TanStack Query API infrastructure for mobile compatibility. We'll leverage the centralized API layer at `src/features/core/tanstack-query-api` rather than creating a separate implementation.

## Integration with Existing TanStack Query API

### Using the Existing API Hooks Factory

We'll use the `createApiHooks` factory function to create consistent API hooks for the exams feature:

```typescript
// src/features/exams/api/examApiHooks.ts
import { createApiHooks } from '@/features/core/tanstack-query-api';
import { EXAM_ENDPOINTS } from './constants/endpoints';
import type { 
  Exam, 
  ExamAttempt, 
  ExamSubmission,
  ExamSearchParams 
} from '../types';

/**
 * API hooks for exam feature
 */
export const examApiHooks = createApiHooks<Exam, ExamSearchParams>(
  EXAM_ENDPOINTS,
  {
    resourceName: 'exams',
    defaultStaleTime: 5 * 60 * 1000, // 5 minutes
    requiresAuth: true
  }
);

// Export all hooks
export const {
  useList: useExamsList,
  useDetail: useExamDetail,
  useCreate: useCreateExam,
  useUpdate: useUpdateExam,
  useDelete: useDeleteExam,
  queryKeys: examQueryKeys
} = examApiHooks;

/**
 * API hooks for exam attempts
 */
export const examAttemptApiHooks = createApiHooks<ExamAttempt>(
  EXAM_ENDPOINTS.attempts,
  {
    resourceName: 'examAttempts',
    defaultStaleTime: 30 * 1000, // 30 seconds - more frequent updates during exams
    requiresAuth: true
  }
);

// Export attempt hooks
export const {
  useCreate: useStartExamAttempt,
  useDetail: useExamAttemptDetail,
  useUpdate: useUpdateExamAttempt,
  queryKeys: examAttemptQueryKeys
} = examAttemptApiHooks;

/**
 * Custom hook for answering a question
 */
export function useAnswerQuestion() {
  return examAttemptApiHooks.useAction<
    void, 
    { attemptId: number; questionId: number; answerId: number }
  >(
    EXAM_ENDPOINTS.answerQuestion,
    {
      onSuccess: (_, variables) => {
        // Invalidate the specific attempt to refresh the answers list
        examAttemptApiHooks.queryClient.invalidateQueries(
          examAttemptQueryKeys.detail(variables.attemptId)
        );
      }
    }
  );
}

/**
 * Custom hook for flagging a question
 */
export function useFlagQuestion() {
  return examAttemptApiHooks.useAction<
    void, 
    { attemptId: number; questionId: number; isFlagged: boolean }
  >(
    EXAM_ENDPOINTS.flagQuestion,
    {
      onSuccess: (_, variables) => {
        // Invalidate the specific attempt to refresh the flagged questions
        examAttemptApiHooks.queryClient.invalidateQueries(
          examAttemptQueryKeys.detail(variables.attemptId)
        );
      }
    }
  );
}

/**
 * Custom hook for submitting an exam
 */
export function useSubmitExam() {
  return examAttemptApiHooks.useAction<
    ExamSubmission, 
    { attemptId: number }
  >(
    EXAM_ENDPOINTS.submitExam,
    {
      onSuccess: (_, variables) => {
        // Invalidate both the attempt and the exam to refresh their status
        examAttemptApiHooks.queryClient.invalidateQueries(
          examAttemptQueryKeys.detail(variables.attemptId)
        );
        
        // Also invalidate the exam lists to show updated status
        examApiHooks.queryClient.invalidateQueries(
          examQueryKeys.lists()
        );
      }
    }
  );
}
```

### API Endpoints Constants

```typescript
// src/features/exams/api/constants/endpoints.ts
export const EXAM_ENDPOINTS = {
  // Main exam endpoints
  list: '/api/exams',
  detail: '/api/exams/:id',
  create: '/api/exams',
  update: '/api/exams/:id',
  delete: '/api/exams/:id',
  
  // Exam attempt endpoints
  attempts: {
    list: '/api/exam-attempts',
    detail: '/api/exam-attempts/:id',
    create: '/api/exam-attempts',
    update: '/api/exam-attempts/:id',
    delete: '/api/exam-attempts/:id',
  },
  
  // Custom action endpoints
  answerQuestion: '/api/exam-attempts/:attemptId/questions/:questionId/answer',
  flagQuestion: '/api/exam-attempts/:attemptId/questions/:questionId/flag',
  submitExam: '/api/exam-attempts/:attemptId/submit',
  
  // Other useful endpoints
  progress: '/api/exams/:examId/progress',
  results: '/api/exam-attempts/:attemptId/results'
};
```

## Offline-Ready Exam Session Hook

```typescript
// src/features/exams/hooks/useExamSession.ts
import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { 
  useExamDetail, 
  useStartExamAttempt,
  useExamAttemptDetail,
  useAnswerQuestion,
  useFlagQuestion,
  useSubmitExam
} from '../api/examApiHooks';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

/**
 * Hook that manages an exam-taking session
 * with offline support
 */
export function useExamSession(examId: number) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [localAttemptId, setLocalAttemptId] = useState<number | null>(null);
  
  // Network status
  const { isOnline } = useNetworkStatus();
  
  // Offline storage
  const { 
    getData: getOfflineAnswers, 
    setData: setOfflineAnswers 
  } = useOfflineStorage(`exam_${examId}_answers`);
  
  const { 
    getData: getOfflineFlags, 
    setData: setOfflineFlags 
  } = useOfflineStorage(`exam_${examId}_flags`);
  
  // API Hooks
  const examQuery = useExamDetail(examId);
  const startExamMutation = useStartExamAttempt();
  const attemptQuery = useExamAttemptDetail(localAttemptId!, {
    enabled: !!localAttemptId
  });
  
  const answerQuestionMutation = useAnswerQuestion();
  const flagQuestionMutation = useFlagQuestion();
  const submitExamMutation = useSubmitExam();
  
  // Get cached offline answers when offline
  useEffect(() => {
    if (!isOnline && localAttemptId) {
      // Get locally stored answers and flags
      const offlineAnswers = getOfflineAnswers() || {};
      const offlineFlags = getOfflineFlags() || [];
      
      // Update the attempt with offline data
      if (attemptQuery.data) {
        attemptQuery.data.answers = {
          ...attemptQuery.data.answers,
          ...offlineAnswers
        };
        
        attemptQuery.data.flaggedQuestions = [
          ...(attemptQuery.data.flaggedQuestions || []),
          ...offlineFlags
        ];
      }
    }
  }, [isOnline, localAttemptId, attemptQuery.data]);
  
  // Sync offline data when coming back online
  useEffect(() => {
    if (isOnline && localAttemptId) {
      const syncOfflineData = async () => {
        // Get locally stored answers and flags
        const offlineAnswers = getOfflineAnswers() || {};
        const offlineFlags = getOfflineFlags() || [];
        
        // Sync answers
        for (const [questionId, answerId] of Object.entries(offlineAnswers)) {
          try {
            await answerQuestionMutation.mutateAsync({
              attemptId: localAttemptId,
              questionId: parseInt(questionId),
              answerId: answerId as number
            });
          } catch (error) {
            console.error('Failed to sync answer:', error);
          }
        }
        
        // Sync flags
        for (const questionId of offlineFlags) {
          try {
            await flagQuestionMutation.mutateAsync({
              attemptId: localAttemptId,
              questionId,
              isFlagged: true
            });
          } catch (error) {
            console.error('Failed to sync flag:', error);
          }
        }
        
        // Clear offline storage after successful sync
        setOfflineAnswers({});
        setOfflineFlags([]);
      };
      
      syncOfflineData();
    }
  }, [isOnline, localAttemptId]);
  
  // Handler functions
  const startExam = useCallback(async (params: { userId: string }) => {
    try {
      const result = await startExamMutation.mutateAsync({
        examId,
        userId: params.userId
      });
      
      setLocalAttemptId(result.id);
      return result;
    } catch (error) {
      console.error('Failed to start exam:', error);
      throw error;
    }
  }, [examId, startExamMutation]);
  
  const answerQuestion = useCallback(async (questionId: number, answerId: number) => {
    if (!localAttemptId) return;
    
    // Store the answer locally first
    const offlineAnswers = getOfflineAnswers() || {};
    offlineAnswers[questionId] = answerId;
    setOfflineAnswers(offlineAnswers);
    
    // Optimistically update UI
    if (attemptQuery.data) {
      attemptQuery.data.answers = {
        ...attemptQuery.data.answers,
        [questionId]: answerId
      };
    }
    
    // If online, send to server
    if (isOnline) {
      try {
        await answerQuestionMutation.mutateAsync({
          attemptId: localAttemptId,
          questionId,
          answerId
        });
      } catch (error) {
        console.error('Failed to answer question:', error);
      }
    }
  }, [localAttemptId, isOnline, attemptQuery.data, answerQuestionMutation]);
  
  const toggleFlagQuestion = useCallback(async (questionId: number) => {
    if (!localAttemptId || !attemptQuery.data) return;
    
    // Check current flag state
    const flaggedQuestions = attemptQuery.data.flaggedQuestions || [];
    const isFlagged = flaggedQuestions.includes(questionId);
    const newIsFlagged = !isFlagged;
    
    // Store the flag locally
    const offlineFlags = getOfflineFlags() || [];
    if (newIsFlagged) {
      if (!offlineFlags.includes(questionId)) {
        offlineFlags.push(questionId);
      }
    } else {
      const index = offlineFlags.indexOf(questionId);
      if (index >= 0) {
        offlineFlags.splice(index, 1);
      }
    }
    setOfflineFlags(offlineFlags);
    
    // Optimistically update UI
    if (attemptQuery.data) {
      if (newIsFlagged) {
        attemptQuery.data.flaggedQuestions = [
          ...flaggedQuestions,
          questionId
        ];
      } else {
        attemptQuery.data.flaggedQuestions = flaggedQuestions.filter(
          id => id !== questionId
        );
      }
    }
    
    // If online, send to server
    if (isOnline) {
      try {
        await flagQuestionMutation.mutateAsync({
          attemptId: localAttemptId,
          questionId,
          isFlagged: newIsFlagged
        });
      } catch (error) {
        console.error('Failed to flag question:', error);
      }
    }
  }, [localAttemptId, isOnline, attemptQuery.data, flagQuestionMutation]);
  
  const submitExam = useCallback(async () => {
    if (!localAttemptId) return;
    
    if (isOnline) {
      try {
        const result = await submitExamMutation.mutateAsync({
          attemptId: localAttemptId
        });
        
        // Clear offline storage after successful submission
        setOfflineAnswers({});
        setOfflineFlags([]);
        
        return result;
      } catch (error) {
        console.error('Failed to submit exam:', error);
        throw error;
      }
    } else {
      throw new Error("Cannot submit exam while offline");
    }
  }, [localAttemptId, isOnline, submitExamMutation]);
  
  // Navigation functions
  const navigateToQuestion = useCallback((index: number) => {
    const questions = examQuery.data?.questions || [];
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setShowSummary(false);
    }
  }, [examQuery.data]);
  
  const nextQuestion = useCallback(() => {
    const questions = examQuery.data?.questions || [];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, examQuery.data]);
  
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);
  
  const toggleSummary = useCallback(() => {
    setShowSummary(prev => !prev);
  }, []);
  
  // Helper functions
  const getAnsweredQuestionsCount = useCallback(() => {
    if (!attemptQuery.data?.answers) return 0;
    return Object.keys(attemptQuery.data.answers).length;
  }, [attemptQuery.data]);
  
  const getFlaggedQuestionsCount = useCallback(() => {
    if (!attemptQuery.data?.flaggedQuestions) return 0;
    return attemptQuery.data.flaggedQuestions.length;
  }, [attemptQuery.data]);
  
  const hasAnswer = useCallback((questionId: number) => {
    if (!attemptQuery.data?.answers) return false;
    return attemptQuery.data.answers[questionId] !== undefined;
  }, [attemptQuery.data]);
  
  const isFlagged = useCallback((questionId: number) => {
    if (!attemptQuery.data?.flaggedQuestions) return false;
    return attemptQuery.data.flaggedQuestions.includes(questionId);
  }, [attemptQuery.data]);
  
  return {
    // Data
    exam: examQuery.data,
    questions: examQuery.data?.questions || [],
    currentQuestionIndex,
    answers: attemptQuery.data?.answers || {},
    flaggedQuestions: new Set(attemptQuery.data?.flaggedQuestions || []),
    timeRemaining: attemptQuery.data?.timeRemaining || (examQuery.data?.duration || 0) * 60,
    isCompleted: attemptQuery.data?.isCompleted || false,
    showSummary,
    isOnline,
    
    // Loading states
    isLoading: examQuery.isLoading || attemptQuery.isLoading,
    error: examQuery.error || attemptQuery.error,
    isStarting: startExamMutation.isPending,
    isSubmitting: submitExamMutation.isPending,
    isSaving: answerQuestionMutation.isPending,
    isFlagging: flagQuestionMutation.isPending,
    
    // Actions
    startExam,
    answerQuestion,
    toggleFlagQuestion,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    toggleSummary,
    submitExam,
    
    // Helpers
    hasAnswer,
    isFlagged,
    getAnsweredQuestionsCount,
    getFlaggedQuestionsCount
  };
}
```

## Network Status Hook

```typescript
// src/hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline };
}
```

## Offline Storage Hook

```typescript
// src/hooks/useOfflineStorage.ts
import { useState, useCallback } from 'react';

export function useOfflineStorage<T>(key: string) {
  // Get data from localStorage
  const getData = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting data for key "${key}":`, error);
      return null;
    }
  }, [key]);
  
  // Set data to localStorage
  const setData = useCallback((data: T) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting data for key "${key}":`, error);
    }
  }, [key]);
  
  // Remove data from localStorage
  const removeData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key "${key}":`, error);
    }
  }, [key]);
  
  return { getData, setData, removeData };
}
```

## Mobile-Optimized NetworkStatusIndicator Component

```tsx
// src/features/exams/components/common/NetworkStatusIndicator.tsx
import React, { useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { CheckIcon, WifiOffIcon } from 'lucide-react';

interface NetworkStatusIndicatorProps {
  className?: string;
}

export function NetworkStatusIndicator({ className }: NetworkStatusIndicatorProps) {
  const { isOnline } = useNetworkStatus();
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Show animation when status changes
  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, [isOnline]);
  
  return (
    <div
      className={`flex items-center px-2 py-1 rounded-full text-xs transition-all duration-300 ${
        showAnimation ? 'scale-110' : 'scale-100'
      } ${
        isOnline 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      } ${className}`}
    >
      {isOnline ? (
        <>
          <CheckIcon className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Online</span>
        </>
      ) : (
        <>
          <WifiOffIcon className="h-3 w-3 mr-1" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
```

## Benefits of This Implementation

1. **Seamless Integration**: Uses the existing TanStack Query API infrastructure rather than creating a new implementation.

2. **Feature-Based Structure**: Follows the feature-based architecture by keeping API hooks within the exams feature folder.

3. **Maintainable and Scalable**: Leverages the factories and utilities for consistent code patterns.

4. **Mobile-Focused**: Includes offline support and network status monitoring for better mobile experience.

5. **Small, Focused Components**: Each component and hook has a clear, single responsibility.

6. **Pluggable Design**: Components can be added or removed without affecting the entire system.

7. **Code Reusability**: Reuses existing infrastructure like `createApiHooks` rather than duplicating functionality.

## Implementation Considerations

1. **Offline Support**: Prioritize offline functionality for mobile users who may experience connectivity issues.

2. **Progressive Enhancement**: Start with the core functionality and progressively enhance for more capable devices.

3. **Network Status Handling**: Provide clear visual feedback for offline/online status.

4. **Loading States**: Show appropriate loading states for slower mobile connections.

5. **Error Recovery**: Implement robust error handling and recovery mechanisms.

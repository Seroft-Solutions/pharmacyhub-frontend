'use client';

/**
 * Exam API Hooks
 *
 * This module provides React hooks for interacting with exam-related APIs.
 * It leverages the createApiHooks factory from tanstack-query-api.
 */
import { createApiHooks } from '@/core/api/services/factories/createApiHooks';
import { useQueryClient } from '@tanstack/react-query';
import { EXAM_ENDPOINTS } from '../constants';
import { useEffect, useRef } from 'react';
import type {
  Exam,
  ExamStatus,
  Question,
  ExamStats,
} from '../../types';
import { useCheckManualExamAccess } from '@/features/payments/manual/api/hooks/useManualPaymentApiHooks';
import usePremiumStatus from '@/features/payments/premium/hooks/usePremiumStatus';

/**
 * Create standard CRUD hooks for exams
 */
export const examApiHooks = createApiHooks<Exam>(
  {
    ...EXAM_ENDPOINTS,
    // Map the endpoints to match what createApiHooks expects
    list: EXAM_ENDPOINTS.all,
    detail: EXAM_ENDPOINTS.byId
  },
  {
    resourceName: 'exams',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

/**
 * Extended exam query keys
 */
export const examQueryKeys = {
  ...examApiHooks.queryKeys,
  published: () => [...examApiHooks.queryKeys.all(), 'published'] as const,
  byStatus: (status: ExamStatus) => 
    [...examApiHooks.queryKeys.all(), 'status', status.toString()] as const,
  questions: (examId: number) => 
    [...examApiHooks.queryKeys.detail(examId), 'questions'] as const,
  stats: () => [...examApiHooks.queryKeys.all(), 'stats'] as const,
};

/**
 * Custom hooks built on top of the standard hooks
 */

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = () => {
  return examApiHooks.useCustomQuery<Exam[]>(
    'published',
    'published',
    {
      requiresAuth: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatus = (status: ExamStatus) => {
  return examApiHooks.useCustomQuery<Exam[]>(
    'byStatus',
    ['status', status],
    {
      enabled: !!status,
      staleTime: 5 * 60 * 1000, // 5 minutes
      urlParams: {
        status: status.toString()
      }
    }
  );
};

/**
 * Utility to add payment headers to requests
 * This is essential for premium exam access
 */
const addPremiumAccessHeaders = (examId: number, hasUniversalAccess: boolean, manualAccess?: boolean) => {
  return {
    headers: {
      'X-Premium-Access': 'true',
      'X-Universal-Access': hasUniversalAccess ? 'true' : 'false',
      'X-Payment-Method': manualAccess ? 'MANUAL' : 'ONLINE',
      'X-Exam-Id': String(examId)
    }
  };
};

/**
 * Direct check for premium status from localStorage
 * This is used to avoid waiting for the hook to load
 */
const getPremiumStatusFromStorage = () => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('pharmacyhub_premium_status') === 'true';
  } catch (e) {
    console.error('Error reading premium status from localStorage:', e);
    return false;
  }
};

/**
 * Hook for fetching exam questions with premium access support
 * Fixed to prevent infinite refreshes and handle API errors better
 */
export const useExamQuestions = (examId: number) => {
  // Keep track of request count and prevent excessive refreshes
  const requestCountRef = useRef(0);
  const hasRefreshedRef = useRef(false);
  
  // Check for manual payment access
  const { data: manualAccessData } = useCheckManualExamAccess(examId);
  const hasManualAccess = manualAccessData?.hasAccess || false;
  
  // Check for global premium status (pay once, access all)
  const { isPremium, refreshPremiumStatus, isLoading: isPremiumLoading } = usePremiumStatus({
    forceCheck: false // Don't force check to avoid unnecessary API calls
  });
  
  // Also check localStorage directly as a backup
  const storageAccessRef = useRef(getPremiumStatusFromStorage());
  
  // Combine access flags - either manual access for this exam or universal premium access
  const hasUniversalAccess = isPremium || storageAccessRef.current;
  
  // For debugging purposes, log access status (only once)
  useEffect(() => {
    // Check localStorage again
    storageAccessRef.current = getPremiumStatusFromStorage();
    
    // Only log on initial render or significant changes
    console.log(`Access status for exam ${examId}:`, {
      manualAccess: hasManualAccess,
      universalAccess: hasUniversalAccess,
      fromHook: isPremium,
      fromStorage: storageAccessRef.current,
      loadingPremium: isPremiumLoading
    });
  }, [examId, hasManualAccess, hasUniversalAccess, isPremium, isPremiumLoading]);

  // Make sure we have the latest premium status before making API calls
  // But limit to a single refresh to prevent infinite loops
  useEffect(() => {
    // Only refresh once
    if (!hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      requestCountRef.current = 1;
      console.log(`Refreshing premium status (attempt: ${requestCountRef.current})`);
      refreshPremiumStatus().catch(e => {
        console.error('Error refreshing premium status:', e);
      });
    }
  }, [refreshPremiumStatus]);

  return examApiHooks.useCustomQuery<Question[]>(
    'questions',
    ['questions', examId],
    {
      // Force question mapping to use the 'questions' property of the response
      // This ensures we get the right data structure regardless of backend changes
      select: (data: any) => {
        // Handle various possible data structures
        if (data?.data?.questions && Array.isArray(data.data.questions)) {
          return data.data.questions;
        }
        if (data?.questions && Array.isArray(data.questions)) {
          return data.questions;
        }
        if (data?.data && Array.isArray(data.data)) {
          return data.data;
        }
        if (Array.isArray(data)) {
          return data;
        }
        
        console.warn('Could not find questions array in response:', data);
        return [];
      },
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes (increased to reduce refreshes)
      urlParams: {
        examId: examId ? String(parseInt(examId.toString())) : '0' // Ensure proper Long format
      },
      config: addPremiumAccessHeaders(examId, hasUniversalAccess, hasManualAccess),
      retry: 1, // Reduced retries to prevent excessive requests
      retryDelay: 1000, // 1 second between retries
      onError: (error) => {
        console.error(`Error fetching questions for exam ${examId}:`, error);
        // If we get a 402 error and haven't tried refreshing yet, try once
        if (error?.response?.status === 402 && requestCountRef.current < 2) {
          requestCountRef.current += 1;
          console.log(`Payment required error - refreshing premium status (attempt: ${requestCountRef.current})`);
          refreshPremiumStatus().catch(e => {
            console.error('Error refreshing premium status:', e);
          });
        }
      }
    }
  );
};

/**
 * Hook for fetching exam statistics
 */
export const useExamStats = () => {
  return examApiHooks.useCustomQuery<ExamStats>(
    'examStats',
    'stats',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for publishing an exam
 */
export const usePublishExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.publishExam.replace(':id', examId.toString());

  return examApiHooks.useAction<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
        queryClient.invalidateQueries(examQueryKeys.lists());
        queryClient.invalidateQueries(examQueryKeys.published());
      }
    }
  );
};

/**
 * Hook for archiving an exam
 */
export const useArchiveExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.archiveExam.replace(':id', examId.toString());

  return examApiHooks.useAction<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
        queryClient.invalidateQueries(examQueryKeys.lists());
        queryClient.invalidateQueries(examQueryKeys.published());
      }
    }
  );
};

/**
 * Hook for updating a question in an exam
 */
export const useUpdateQuestionMutation = (examId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.updateQuestion
    .replace(':examId', examId.toString())
    .replace(':questionId', questionId.toString());

  return examApiHooks.useAction<Question, Partial<Question>>(
    endpoint,
    {
      method: 'PUT',
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.questions(examId));
      }
    }
  );
};

/**
 * Hook for deleting a question from an exam
 */
export const useDeleteQuestionMutation = (examId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.deleteQuestion
    .replace(':examId', examId.toString())
    .replace(':questionId', questionId.toString());

  return examApiHooks.useAction<void, void>(
    endpoint,
    {
      method: 'DELETE',
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.questions(examId));
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
      }
    }
  );
};

// Export standard CRUD hooks with more descriptive names
export const {
  useList: useExamsList,
  useDetail: useExamDetail,
  useCreate: useCreateExam,
  useUpdate: useUpdateExam,
  usePatch: usePatchExam,
  useDelete: useDeleteExam,
} = examApiHooks;

// Export everything as a combined object for convenience
export const examHooks = {
  // Standard CRUD hooks
  useExamsList,
  useExamDetail,
  useCreateExam,
  useUpdateExam,
  usePatchExam,
  useDeleteExam,

  // Specialized exam hooks
  usePublishedExams,
  useExamsByStatus,
  useExamQuestions,
  useExamStats,

  // Action hooks
  usePublishExamMutation,
  useArchiveExamMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,

  // Query keys
  queryKeys: examQueryKeys,
};

export default examHooks;
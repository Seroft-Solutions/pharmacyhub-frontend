/**
 * Mutation Factory for Exams Preparation
 * 
 * This module provides factory functions for creating consistent mutation hooks
 * that leverage the core API mutation utilities.
 */
import { QueryClient } from '@tanstack/react-query';
import { 
  useApiMutation, 
  useApiPut, 
  useApiPatch 
} from '@/core/api/hooks/mutation/useApiMutation';
import { UseApiMutationOptions } from '@/core/api/types/hooks';
import { handleExamError } from './errorHandler';
import { ENDPOINTS } from '../constants';

/**
 * Create mutation options with standard error handling
 * 
 * @param context Context information for error handling
 * @param options Additional mutation options
 * @returns Enhanced mutation options with error handling
 */
export function createMutationOptions<TData, TVariables = unknown, TError = Error, TContext = unknown>(
  context: {
    action: string;
    endpoint: string;
    examId?: number;
    attemptId?: number;
    questionId?: number;
    paperId?: number;
  },
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> = {}
): UseApiMutationOptions<TData, TError, TVariables, TContext> {
  return {
    ...options,
    onError: (error, variables, context) => {
      // Use core error handling with exam-specific context
      handleExamError(error, {
        ...context,
        action: context.action,
        endpoint: context.endpoint,
        examId: context.examId,
        attemptId: context.attemptId,
        questionId: context.questionId,
        paperId: context.paperId
      });
      
      // Call the original onError if provided
      if (options.onError) {
        options.onError(error, variables, context);
      }
    }
  };
}

/**
 * Create a standard POST mutation hook
 * 
 * @template TData Response data type
 * @template TVariables Request variables type
 * @param endpoint API endpoint string or function
 * @param context Context information for error handling
 * @param options Additional mutation options
 * @returns Mutation hook with standardized behavior
 */
export function createPostMutation<TData, TVariables = unknown>(
  endpoint: string | ((params: TVariables) => string),
  context: {
    action: string;
    examId?: number;
    attemptId?: number;
    questionId?: number;
    paperId?: number;
  },
  options: UseApiMutationOptions<TData, Error, TVariables> = {}
) {
  // Determine the endpoint string for error context
  const endpointStr = typeof endpoint === 'string' 
    ? endpoint 
    : '[dynamic endpoint]';
    
  return useApiMutation<TData, TVariables>(
    endpoint,
    {
      ...options,
      // Enhanced error handling
      onError: (error, variables, mutationContext) => {
        // Use core error handling with exam-specific context
        handleExamError(error, {
          ...context,
          endpoint: endpointStr,
        });
        
        // Call the original onError if provided
        if (options.onError) {
          options.onError(error, variables, mutationContext);
        }
      }
    }
  );
}

/**
 * Create a standard PUT mutation hook
 * 
 * @template TData Response data type
 * @template TVariables Request variables type
 * @param endpoint API endpoint string or function
 * @param context Context information for error handling
 * @param options Additional mutation options
 * @returns Mutation hook with standardized behavior
 */
export function createPutMutation<TData, TVariables = unknown>(
  endpoint: string | ((params: TVariables) => string),
  context: {
    action: string;
    examId?: number;
    attemptId?: number;
    questionId?: number;
    paperId?: number;
  },
  options: UseApiMutationOptions<TData, Error, TVariables> = {}
) {
  // Determine the endpoint string for error context
  const endpointStr = typeof endpoint === 'string' 
    ? endpoint 
    : '[dynamic endpoint]';
    
  return useApiPut<TData, TVariables>(
    endpoint,
    {
      ...options,
      // Enhanced error handling
      onError: (error, variables, mutationContext) => {
        // Use core error handling with exam-specific context
        handleExamError(error, {
          ...context,
          endpoint: endpointStr,
        });
        
        // Call the original onError if provided
        if (options.onError) {
          options.onError(error, variables, mutationContext);
        }
      }
    }
  );
}

/**
 * Create a standard DELETE mutation hook
 * 
 * @template TData Response data type
 * @template TVariables Request variables type
 * @param endpoint API endpoint string or function
 * @param context Context information for error handling
 * @param options Additional mutation options
 * @returns Mutation hook with standardized behavior
 */
export function createDeleteMutation<TData, TVariables = unknown>(
  endpoint: string | ((params: TVariables) => string),
  context: {
    action: string;
    examId?: number;
    attemptId?: number;
    questionId?: number;
    paperId?: number;
  },
  options: UseApiMutationOptions<TData, Error, TVariables> = {}
) {
  // Determine the endpoint string for error context
  const endpointStr = typeof endpoint === 'string' 
    ? endpoint 
    : '[dynamic endpoint]';
    
  return useApiMutation<TData, TVariables>(
    endpoint,
    {
      ...options,
      method: 'DELETE',
      // Enhanced error handling
      onError: (error, variables, mutationContext) => {
        // Use core error handling with exam-specific context
        handleExamError(error, {
          ...context,
          endpoint: endpointStr,
        });
        
        // Call the original onError if provided
        if (options.onError) {
          options.onError(error, variables, mutationContext);
        }
      }
    }
  );
}

/**
 * Common exam invalidation patterns
 */
export const examInvalidations = {
  /**
   * Invalidate all exams lists
   */
  allExams: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'list'] });
  },
  
  /**
   * Invalidate a specific exam detail
   */
  examDetail: (queryClient: QueryClient, examId: number) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'detail', examId] });
  },
  
  /**
   * Invalidate exam questions
   */
  examQuestions: (queryClient: QueryClient, examId: number) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'questions', { examId }] });
  },
  
  /**
   * Invalidate published exams
   */
  publishedExams: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'published'] });
  },
  
  /**
   * Invalidate exams by status
   */
  examsByStatus: (queryClient: QueryClient, status: string) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'status', { status }] });
  },
  
  /**
   * Invalidate all paper lists
   */
  allPapers: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'papers', 'list'] });
  },
  
  /**
   * Invalidate a specific paper detail
   */
  paperDetail: (queryClient: QueryClient, paperId: number) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'papers', 'detail', paperId] });
  },
  
  /**
   * Invalidate a specific exam attempt
   */
  examAttempt: (queryClient: QueryClient, attemptId: number) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'attempts', 'detail', attemptId] });
  },
  
  /**
   * Invalidate all attempts for a specific exam
   */
  examAttempts: (queryClient: QueryClient, examId: number) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'attempts', 'byExam', examId] });
  },
  
  /**
   * Invalidate an attempt result
   */
  attemptResult: (queryClient: QueryClient, attemptId: number) => {
    queryClient.invalidateQueries({ queryKey: ['exams-preparation', 'attempts', 'result', attemptId] });
  },
};

/**
 * Exams Query Hooks
 * 
 * This module provides hooks for fetching and manipulating multiple exams
 * using the core API module with proper error handling.
 */
import { useApiQuery, useApiMutation, useApiPaginatedQuery } from '@/core/api/hooks';
import { Exam, ExamStatus } from '../../types';
import { examsQueryKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

/**
 * Hook for fetching all exams with optional filtering and pagination
 */
export interface UseExamsQueryOptions {
  page?: number;
  limit?: number;
  status?: ExamStatus;
  enabled?: boolean;
}

/**
 * Hook for fetching all exams with optional filtering and pagination
 */
export const useExams = ({
  page = 1,
  limit = 10,
  status,
  enabled = true
}: UseExamsQueryOptions = {}) => {
  const params = { page, limit, ...(status ? { status } : {}) };
  
  return useApiPaginatedQuery<Exam[]>(
    examsQueryKeys.lists(status ? { status } : undefined),
    API_ENDPOINTS.EXAMS,
    { page, size: limit },
    {
      enabled,
      params: status ? { status } : undefined,
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-exams',
          endpoint: API_ENDPOINTS.EXAMS
        });
      }
    }
  );
};

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = (
  { page = 1, limit = 10, enabled = true }: Omit<UseExamsQueryOptions, 'status'> = {}
) => {
  return useApiPaginatedQuery<Exam[]>(
    examsQueryKeys.published(),
    API_ENDPOINTS.PUBLISHED,
    { page, size: limit },
    { 
      enabled,
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-published-exams',
          endpoint: API_ENDPOINTS.PUBLISHED
        });
      }
    }
  );
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatus = (
  status: ExamStatus,
  { page = 1, limit = 10, enabled = true }: Omit<UseExamsQueryOptions, 'status'> = {}
) => {
  return useApiPaginatedQuery<Exam[]>(
    examsQueryKeys.byStatus(status),
    API_ENDPOINTS.BY_STATUS(status.toString()),
    { page, size: limit },
    { 
      enabled,
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-exams-by-status',
          endpoint: API_ENDPOINTS.BY_STATUS(status.toString())
        });
      }
    }
  );
};

/**
 * Hook for creating a new exam
 */
export const useCreateExam = () => {
  return useApiMutation<Exam, Partial<Exam>>(
    API_ENDPOINTS.EXAMS,
    {
      onSuccess: (_, __, context) => {
        // Invalidate all exam lists on success
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.lists()
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'create-exam',
          endpoint: API_ENDPOINTS.EXAMS
        });
      }
    }
  );
};

/**
 * Hook for updating an exam
 */
export const useUpdateExam = () => {
  return useApiMutation<Exam, { id: number; exam: Partial<Exam> }>(
    ({ id }) => API_ENDPOINTS.EXAM(id),
    {
      method: 'PUT',
      onSuccess: (data, variables, context) => {
        // Invalidate the specific exam query
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.detail(variables.id)
        });
        
        // Also invalidate exam lists as the update might affect filters/lists
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.lists()
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables.id,
          action: 'update-exam',
          endpoint: API_ENDPOINTS.EXAM(variables.id)
        });
      }
    }
  );
};

/**
 * Hook for deleting an exam
 */
export const useDeleteExam = () => {
  return useApiMutation<void, number>(
    (id) => API_ENDPOINTS.EXAM(id),
    {
      method: 'DELETE',
      onSuccess: (_, __, context) => {
        // Invalidate all exam lists on success
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.lists()
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables,
          action: 'delete-exam',
          endpoint: API_ENDPOINTS.EXAM(variables)
        });
      }
    }
  );
};

/**
 * Hook for publishing an exam
 */
export const usePublishExam = () => {
  return useApiMutation<Exam, number>(
    (id) => API_ENDPOINTS.PUBLISH(id),
    {
      onSuccess: (data, id, context) => {
        // Invalidate specific exam
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.detail(typeof id === 'number' ? id : 0)
        });
        
        // Invalidate published exams list
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.published()
        });
        
        // Invalidate status-based lists that might be affected
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.byStatus(ExamStatus.PUBLISHED)
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables,
          action: 'publish-exam',
          endpoint: API_ENDPOINTS.PUBLISH(variables)
        });
      }
    }
  );
};

/**
 * Hook for archiving an exam
 */
export const useArchiveExam = () => {
  return useApiMutation<Exam, number>(
    (id) => API_ENDPOINTS.ARCHIVE(id),
    {
      onSuccess: (data, id, context) => {
        // Invalidate specific exam
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.detail(typeof id === 'number' ? id : 0)
        });
        
        // Invalidate status-based lists that might be affected
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.byStatus(ExamStatus.ARCHIVED)
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables,
          action: 'archive-exam',
          endpoint: API_ENDPOINTS.ARCHIVE(variables)
        });
      }
    }
  );
};

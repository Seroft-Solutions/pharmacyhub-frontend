/**
 * Exams Query Hooks
 * 
 * This module provides hooks for fetching and manipulating multiple exams
 * leveraging the core API module for data fetching and mutations.
 */
import { createQuery } from '@/core/api/hooks/query/useApiQuery';
import { createMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { apiClient } from '@/core/api/core/apiClient';
import { handleApiError } from '@/core/api/core/error';
import { examsApiHooks, ExamListParams, ExamCreateParams } from '../services/apiHooksFactory';
import { queryKeys } from '../utils';
import { Exam, ExamStatus } from '../../types';

/**
 * Options for useExams hook
 */
export interface UseExamsQueryOptions extends ExamListParams {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Hook for fetching all exams with optional filtering and pagination
 */
export const useExams = ({
  page = 1,
  limit = 10,
  status,
  search,
  sortBy,
  sortDir,
  enabled = true,
  ...options
}: UseExamsQueryOptions = {}) => {
  const params: ExamListParams = { 
    page, 
    limit, 
    ...(status && { status }),
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDir && { sortDir })
  };
  
  return createQuery<Exam[]>({
    queryKey: queryKeys.examsQueryKeys.lists(params),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/v1/exams-preparation', { params });
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'listExams',
            params 
          }
        });
      }
    },
    enabled,
    ...options
  });
};

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = ({
  page = 1,
  limit = 10,
  enabled = true,
  ...options
}: Omit<UseExamsQueryOptions, 'status'> = {}) => {
  return createQuery<Exam[]>({
    queryKey: queryKeys.examsQueryKeys.published(),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/v1/exams-preparation/published', { 
          params: { page, limit }
        });
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'getPublishedExams',
            params: { page, limit }
          }
        });
      }
    },
    enabled,
    ...options
  });
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatus = (
  status: ExamStatus,
  { page = 1, limit = 10, enabled = true, ...options }: Omit<UseExamsQueryOptions, 'status'> = {}
) => {
  return createQuery<Exam[]>({
    queryKey: queryKeys.examsQueryKeys.byStatus(status),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/v1/exams-preparation/status/${status}`, { 
          params: { page, limit }
        });
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'getExamsByStatus',
            status,
            params: { page, limit }
          }
        });
      }
    },
    enabled,
    ...options
  });
};

/**
 * Hook for creating a new exam
 */
export const useCreateExam = () => {
  return createMutation<Exam, ExamCreateParams>({
    mutationFn: async (newExam) => {
      try {
        const { data } = await apiClient.post('/v1/exams-preparation', newExam);
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'createExam'
          }
        });
      }
    },
    onSuccess: (_, __, context) => {
      // Invalidate exams list queries
      context?.queryClient.invalidateQueries({ 
        queryKey: queryKeys.examsQueryKeys.lists() 
      });
    }
  });
};

/**
 * Hook for updating an exam
 */
export const useUpdateExam = (examId?: number) => {
  const updateMutation = createMutation<Exam, Partial<Exam>>({
    mutationFn: async (examData) => {
      try {
        if (!examId && !examData.id) {
          throw new Error('Exam ID is required for updating');
        }
        
        const id = examId || examData.id;
        const { data } = await apiClient.put(`/v1/exams-preparation/${id}`, examData);
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'updateExam',
            examId: examId || examData.id
          }
        });
      }
    },
    onSuccess: (_, variables, context) => {
      const id = examId || variables.id;
      if (id) {
        // Invalidate specific exam
        context?.queryClient.invalidateQueries({
          queryKey: queryKeys.examsQueryKeys.detail(id)
        });
      }
      
      // Invalidate exams list queries
      context?.queryClient.invalidateQueries({ 
        queryKey: queryKeys.examsQueryKeys.lists() 
      });
    }
  });
  
  // Provide a convenience function for when using with an object that includes ID
  return {
    ...updateMutation,
    mutate: (variables: Partial<Exam>) => updateMutation.mutate(variables),
    mutateAsync: (variables: Partial<Exam>) => updateMutation.mutateAsync(variables)
  };
};

/**
 * Hook for deleting an exam
 */
export const useDeleteExam = () => {
  return createMutation<void, number>({
    mutationFn: async (id) => {
      try {
        await apiClient.delete(`/v1/exams-preparation/${id}`);
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'deleteExam',
            examId: id
          }
        });
      }
    },
    onSuccess: (_, id, context) => {
      // Invalidate specific exam
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.examsQueryKeys.detail(id)
      });
      
      // Invalidate exams list queries
      context?.queryClient.invalidateQueries({ 
        queryKey: queryKeys.examsQueryKeys.lists() 
      });
    }
  });
};

/**
 * Hook for publishing an exam
 */
export const usePublishExam = () => {
  return createMutation<Exam, number>({
    mutationFn: async (id) => {
      try {
        const { data } = await apiClient.post(`/v1/exams-preparation/${id}/publish`);
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'publishExam',
            examId: id
          }
        });
      }
    },
    onSuccess: (_, id, context) => {
      // Invalidate specific exam
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.examsQueryKeys.detail(id)
      });
      
      // Invalidate published exams list
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.examsQueryKeys.published()
      });
      
      // Invalidate status-based lists that might be affected
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.examsQueryKeys.byStatus(ExamStatus.PUBLISHED)
      });
      
      // Invalidate general exams list
      context?.queryClient.invalidateQueries({ 
        queryKey: queryKeys.examsQueryKeys.lists() 
      });
    }
  });
};

/**
 * Hook for archiving an exam
 */
export const useArchiveExam = () => {
  return createMutation<Exam, number>({
    mutationFn: async (id) => {
      try {
        const { data } = await apiClient.post(`/v1/exams-preparation/${id}/archive`);
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'archiveExam',
            examId: id
          }
        });
      }
    },
    onSuccess: (_, id, context) => {
      // Invalidate specific exam
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.examsQueryKeys.detail(id)
      });
      
      // Invalidate status-based lists that might be affected
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.examsQueryKeys.byStatus(ExamStatus.ARCHIVED)
      });
      
      // Invalidate general exams list
      context?.queryClient.invalidateQueries({ 
        queryKey: queryKeys.examsQueryKeys.lists() 
      });
    }
  });
};

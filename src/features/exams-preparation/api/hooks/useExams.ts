/**
 * Exams Query Hooks
 * 
 * This module provides hooks for fetching and manipulating multiple exams
 * using the core API hooks factory.
 */
import { examsApiHooks, ExamListParams } from '../services/apiHooksFactory';
import { Exam, ExamStatus } from '../../types';

/**
 * Hook for fetching all exams with optional filtering and pagination
 */
export interface UseExamsQueryOptions extends ExamListParams {
  enabled?: boolean;
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
  enabled = true
}: UseExamsQueryOptions = {}) => {
  const params: ExamListParams = { 
    page, 
    limit, 
    ...(status && { status }),
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDir && { sortDir })
  };
  
  return examsApiHooks.useList<Exam[]>(params, { enabled });
};

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = (
  { page = 1, limit = 10, enabled = true }: Omit<UseExamsQueryOptions, 'status'> = {}
) => {
  return examsApiHooks.useCustomQuery<Exam[]>(
    'published',
    'published',
    {
      enabled,
      params: { page, limit }
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
  return examsApiHooks.useCustomQuery<Exam[]>(
    'byStatus',
    ['status', status.toString()],
    {
      urlParams: { status: status.toString() },
      enabled,
      params: { page, limit }
    }
  );
};

/**
 * Hook for creating a new exam
 */
export const useCreateExam = () => {
  return examsApiHooks.useCreate();
};

/**
 * Hook for updating an exam
 */
export const useUpdateExam = () => {
  return {
    mutate: (variables: { id: number; exam: Partial<Exam> }) => {
      const { id, exam } = variables;
      const updateHook = examsApiHooks.useUpdate(id);
      return updateHook.mutate(exam);
    },
    mutation: (id: number) => examsApiHooks.useUpdate(id)
  };
};

/**
 * Hook for deleting an exam
 */
export const useDeleteExam = () => {
  return examsApiHooks.useDelete();
};

/**
 * Hook for publishing an exam
 */
export const usePublishExam = () => {
  return examsApiHooks.useAction<Exam, number>(
    (id: number) => examsApiHooks.queryKeys.custom('publish', id),
    {
      method: 'POST',
      onSuccess: (_, id, context) => {
        // Invalidate specific exam
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.detail(id)
        });
        
        // Invalidate published exams list
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.custom('published')
        });
        
        // Invalidate status-based lists that might be affected
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.custom('status', ExamStatus.PUBLISHED.toString())
        });
      }
    }
  );
};

/**
 * Hook for archiving an exam
 */
export const useArchiveExam = () => {
  return examsApiHooks.useAction<Exam, number>(
    (id: number) => examsApiHooks.queryKeys.custom('archive', id),
    {
      method: 'POST',
      onSuccess: (_, id, context) => {
        // Invalidate specific exam
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.detail(id)
        });
        
        // Invalidate status-based lists that might be affected
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.custom('status', ExamStatus.ARCHIVED.toString())
        });
      }
    }
  );
};

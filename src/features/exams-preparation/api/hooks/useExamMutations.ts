/**
 * Exam Mutations Hooks
 * 
 * This module provides hooks for creating, updating, and deleting exams.
 * It leverages the core API module for data mutations and query invalidation.
 */
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam } from '../../types';

/**
 * Interface for exam creation payload
 */
export interface CreateExamPayload {
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  status: string;
  isPremium: boolean;
  price?: number;
  // Add other fields as needed
}

/**
 * Interface for exam update payload
 */
export interface UpdateExamPayload {
  title?: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  status?: string;
  isPremium?: boolean;
  price?: number;
  // Add other fields as needed
}

/**
 * Hook for creating a new exam
 * 
 * @returns TanStack Mutation hook for creating exams
 */
export function useCreateExamMutation() {
  return useApiMutation<Exam, CreateExamPayload>(
    EXAM_ENDPOINTS.CREATE,
    {
      onSuccess: (_, __, context) => {
        // Invalidate the exams list queries to refetch after creation
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
      }
    }
  );
}

/**
 * Hook for updating an existing exam
 * 
 * @returns TanStack Mutation hook for updating exams
 */
export function useUpdateExamMutation() {
  return useApiMutation<Exam, { id: number; data: UpdateExamPayload }>(
    ({ id }) => EXAM_ENDPOINTS.UPDATE(id),
    {
      method: 'PUT',
      onSuccess: (_, variables, context) => {
        // Invalidate both the list queries and the specific exam query
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
        
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.detail(variables.id),
        });
      }
    }
  );
}

/**
 * Hook for deleting an exam
 * 
 * @returns TanStack Mutation hook for deleting exams
 */
export function useDeleteExamMutation() {
  return useApiMutation<void, number>(
    (id) => EXAM_ENDPOINTS.DELETE(id),
    {
      method: 'DELETE',
      onSuccess: (_, id, context) => {
        // Invalidate the exams list queries after deletion
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
        
        // Also invalidate the specific exam query
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.detail(id),
        });
      }
    }
  );
}

/**
 * Hook for publishing an exam (changing status to published)
 * 
 * @returns TanStack Mutation hook for publishing exams
 */
export function usePublishExamMutation() {
  return useApiMutation<Exam, number>(
    (id) => `${EXAM_ENDPOINTS.DETAIL(id)}/publish`,
    {
      method: 'POST',
      onSuccess: (_, id, context) => {
        // Invalidate the relevant queries after publishing
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.detail(id),
        });
        
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
        
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.published(),
        });
      }
    }
  );
}

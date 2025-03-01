import { useApiMutation, useQueryClient } from '@/features/tanstack-query-api';
import { examQueryKeys } from '../core/queryKeys';
import { ExamAttempt, ExamResult, UserAnswer } from '../../model/mcqTypes';

/**
 * Hook for starting an exam attempt
 */
export const useStartExamMutation = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExamAttempt, { examId: number }>(
    `/api/v1/exams/:examId/start`,
    {
      onMutate: async ({ examId }) => {
        // Update the URL before the mutation completes
        return { examId };
      },
      onSuccess: (data, { examId }) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
      }
    }
  );
};

/**
 * Hook for submitting an exam attempt
 */
export const useSubmitExamMutation = (attemptId: number) => {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExamResult, UserAnswer[]>(
    `/api/v1/exams/attempts/${attemptId}/submit`,
    {
      onSuccess: () => {
        // Invalidate results queries
        queryClient.invalidateQueries(examQueryKeys.result(attemptId));
      }
    }
  );
};

/**
 * Hook for flagging a question
 */
export const useFlagQuestionMutation = (attemptId: number) => {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, { questionId: number }>(
    `/api/v1/exams/attempts/${attemptId}/flag/:questionId`,
    {
      onSuccess: () => {
        // Invalidate flagged questions query
        queryClient.invalidateQueries(examQueryKeys.flags(attemptId));
      }
    }
  );
};

/**
 * Hook for unflagging a question
 */
export const useUnflagQuestionMutation = (attemptId: number) => {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, { questionId: number }>(
    `/api/v1/exams/attempts/${attemptId}/flag/:questionId`,
    {
      onSuccess: () => {
        // Invalidate flagged questions query
        queryClient.invalidateQueries(examQueryKeys.flags(attemptId));
      }
    }
  );
};

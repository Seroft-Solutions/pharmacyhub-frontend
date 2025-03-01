import { createQueryKeys } from '@/features/tanstack-query-api';
import { ExamStatusType } from '../../model/mcqTypes';

/**
 * Exam-related query keys for TanStack Query cache management
 */
export const examQueryKeys = createQueryKeys({
  all: () => ['exams'] as const,
  lists: () => [...examQueryKeys.all(), 'list'] as const,
  list: (filters: Record<string, unknown> = {}) => [...examQueryKeys.lists(), filters] as const,
  published: () => [...examQueryKeys.lists(), 'published'] as const,
  details: () => [...examQueryKeys.all(), 'detail'] as const,
  detail: (id: number) => [...examQueryKeys.details(), id] as const,
  attempts: () => [...examQueryKeys.all(), 'attempts'] as const,
  attempt: (id: number) => [...examQueryKeys.attempts(), id] as const,
  flags: (attemptId: number) => [...examQueryKeys.attempts(), attemptId, 'flags'] as const,
  results: () => [...examQueryKeys.all(), 'results'] as const,
  result: (attemptId: number) => [...examQueryKeys.results(), attemptId] as const,
  byStatus: (status: ExamStatusType) => [...examQueryKeys.lists(), 'status', status] as const,
});

export default examQueryKeys;

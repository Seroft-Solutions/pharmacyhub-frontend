/**
 * Query keys for exam-related queries
 * 
 * These keys are used to identify queries in the cache
 */

export const examQueryKeys = {
  // Base keys
  all: ['exams'] as const,
  lists: () => [...examQueryKeys.all, 'list'] as const,
  detail: (id: number) => [...examQueryKeys.all, 'detail', id] as const,
  
  // Derived keys
  published: () => [...examQueryKeys.lists(), 'published'] as const,
  byStatus: (status: string) => [...examQueryKeys.lists(), 'status', status] as const,
  questions: (examId: number) => [...examQueryKeys.detail(examId), 'questions'] as const,
  
  // Attempt keys
  attempts: () => [...examQueryKeys.all, 'attempts'] as const,
  userAttempts: () => [...examQueryKeys.attempts(), 'user'] as const,
  userAttemptsForExam: (examId: number) => [...examQueryKeys.attempts(), 'exam', examId] as const,
  attempt: (attemptId: number) => [...examQueryKeys.attempts(), 'detail', attemptId] as const,
  result: (attemptId: number) => [...examQueryKeys.attempt(attemptId), 'result'] as const,
  flags: (attemptId: number) => [...examQueryKeys.attempt(attemptId), 'flags'] as const,
}

export const paperQueryKeys = {
  // Base keys
  all: ['papers'] as const,
  lists: () => [...paperQueryKeys.all, 'list'] as const,
  detail: (id: number) => [...paperQueryKeys.all, 'detail', id] as const,
  
  // Derived keys
  model: () => [...paperQueryKeys.lists(), 'model'] as const,
  past: () => [...paperQueryKeys.lists(), 'past'] as const,
  subject: () => [...paperQueryKeys.lists(), 'subject'] as const,
  practice: () => [...paperQueryKeys.lists(), 'practice'] as const,
  
  // Statistics
  stats: () => [...paperQueryKeys.all, 'stats'] as const,
}
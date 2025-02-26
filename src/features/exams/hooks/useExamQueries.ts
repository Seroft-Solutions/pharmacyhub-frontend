import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examApi } from '../api/examApi';
import { Exam, UserAnswer } from '../model/mcqTypes';
import { useMcqExamStore } from '../store/mcqExamStore';

// Query keys
export const EXAM_KEYS = {
  all: ['exams'] as const,
  lists: () => [...EXAM_KEYS.all, 'list'] as const,
  list: (filters: string) => [...EXAM_KEYS.lists(), { filters }] as const,
  details: () => [...EXAM_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...EXAM_KEYS.details(), id] as const,
  questions: (examId: number) => [...EXAM_KEYS.detail(examId), 'questions'] as const,
  attempts: () => [...EXAM_KEYS.all, 'attempts'] as const,
  attempt: (attemptId: number) => [...EXAM_KEYS.attempts(), attemptId] as const,
  results: () => [...EXAM_KEYS.all, 'results'] as const,
  result: (attemptId: number) => [...EXAM_KEYS.results(), attemptId] as const,
};

/**
 * Hook for fetching all exams
 */
export function useExams() {
  return useQuery({
    queryKey: EXAM_KEYS.lists(),
    queryFn: examApi.getAllExams,
  });
}

/**
 * Hook for fetching published exams
 */
export function usePublishedExams() {
  return useQuery({
    queryKey: EXAM_KEYS.list('published'),
    queryFn: examApi.getPublishedExams,
  });
}

/**
 * Hook for fetching a single exam by ID
 */
export function useExam(examId: number | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.detail(examId as number),
    queryFn: () => examApi.getExamById(examId as number),
    enabled: !!examId,
  });
}

/**
 * Hook for fetching exam questions
 */
export function useExamQuestions(examId: number | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.questions(examId as number),
    queryFn: () => examApi.getExamQuestions(examId as number),
    enabled: !!examId,
  });
}

/**
 * Hook providing complete exam functionality
 * - Fetches exam and questions
 * - Provides mutations for starting and submitting exams
 */
export function useExamSession(examId: number | undefined) {
  const queryClient = useQueryClient();
  
  // Fetch exam details
  const examQuery = useExam(examId);
  
  // Fetch exam questions
  const questionsQuery = useExamQuestions(examId);
  
  // Start exam mutation
  const startExamMutation = useMutation({
    mutationFn: ({ userId }: { userId: number }) => 
      examApi.startExam(examId as number, userId),
    onSuccess: (data) => {
      // Update local state
      useMcqExamStore.getState().startExam(Number(examId));
    },
  });
  
  // Submit exam mutation
  const submitExamMutation = useMutation({
    mutationFn: ({ userId, answers }: { userId: number; answers: UserAnswer[] }) =>
      examApi.submitExam(examId as number, userId, answers),
    onSuccess: (data) => {
      // Reset local state
      useMcqExamStore.getState().resetExam();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.result(data.attemptId) });
    },
  });
  
  // Get exam result
  const getExamResult = (attemptId: number) => 
    useQuery({
      queryKey: EXAM_KEYS.result(attemptId),
      queryFn: () => examApi.getExamResult(attemptId),
      enabled: !!attemptId,
    });
  
  return {
    // Queries
    exam: examQuery.data,
    questions: questionsQuery.data,
    isLoading: examQuery.isLoading || questionsQuery.isLoading,
    error: examQuery.error || questionsQuery.error,
    
    // Mutations
    startExam: startExamMutation.mutate,
    submitExam: submitExamMutation.mutate,
    isStarting: startExamMutation.isLoading,
    isSubmitting: submitExamMutation.isLoading,
    startError: startExamMutation.error,
    submitError: submitExamMutation.error,
    
    // Extra utilities
    getExamResult,
    
    // Refresh data
    refetch: () => {
      examQuery.refetch();
      questionsQuery.refetch();
    }
  };
}

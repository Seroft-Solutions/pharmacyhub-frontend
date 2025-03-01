import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examApi } from '../api/examApi';
import { Exam, Question, ExamAttempt, UserAnswer, ExamResult, FlaggedQuestion } from '../model/mcqTypes';
import { useExamStore } from '../store/examStore';

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
  userAttempts: (userId: string) => [...EXAM_KEYS.attempts(), 'user', userId] as const,
  examAttempts: (examId: number, userId: string) => [...EXAM_KEYS.attempts(), 'exam', examId, 'user', userId] as const,
  flagged: (attemptId: number) => [...EXAM_KEYS.attempt(attemptId), 'flagged'] as const,
  results: () => [...EXAM_KEYS.all, 'results'] as const,
  result: (attemptId: number) => [...EXAM_KEYS.results(), attemptId] as const,
  stats: () => [...EXAM_KEYS.all, 'stats'] as const,
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
 * Hook for fetching exams by status
 */
export function useExamsByStatus(status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
  return useQuery({
    queryKey: EXAM_KEYS.list(status),
    queryFn: () => examApi.getExamsByStatus(status),
    enabled: !!status,
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
 * Hook for fetching user's exam attempts
 */
export function useUserAttempts(userId: string | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.userAttempts(userId as string),
    queryFn: () => examApi.getUserAttempts(userId as string),
    enabled: !!userId,
  });
}

/**
 * Hook for fetching exam attempts by a specific user
 */
export function useExamAttemptsByUser(examId: number | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.examAttempts(examId as number, userId as string),
    queryFn: () => examApi.getExamAttemptsByUser(examId as number, userId as string),
    enabled: !!examId && !!userId,
  });
}

/**
 * Hook for fetching flagged questions for an attempt
 */
export function useFlaggedQuestions(attemptId: number | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.flagged(attemptId as number),
    queryFn: () => examApi.getFlaggedQuestions(attemptId as number),
    enabled: !!attemptId,
  });
}

/**
 * Hook for fetching exam result
 */
export function useExamResult(attemptId: number | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.result(attemptId as number),
    queryFn: () => examApi.getExamResult(attemptId as number),
    enabled: !!attemptId,
  });
}

/**
 * Hook for fetching exam statistics
 */
export function useExamStats() {
  return useQuery({
    queryKey: EXAM_KEYS.stats(),
    queryFn: examApi.getExamStats,
  });
}

/**
 * Hook providing complete exam functionality
 * - Fetches exam and questions
 * - Provides mutations for starting, answering, flagging, and submitting exams
 */
export function useExamSession(examId: number | undefined) {
  const queryClient = useQueryClient();
  const examStore = useExamStore();
  
  // Fetch exam details
  const examQuery = useExam(examId);
  
  // Fetch exam questions
  const questionsQuery = useExamQuestions(examId);
  
  // Start exam mutation
  const startExamMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) => 
      examApi.startExam(examId as number, userId),
    onSuccess: (data, variables) => {
      // Store attempt ID in exam store
      examStore.setAttemptId(data.id);
      
      // Start exam in local store
      if (questionsQuery.data) {
        examStore.startExam(
          examId as number, 
          questionsQuery.data, 
          examQuery.data?.duration || 60
        );
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: EXAM_KEYS.userAttempts(variables.userId)
      });
      queryClient.invalidateQueries({ 
        queryKey: EXAM_KEYS.examAttempts(examId as number, variables.userId)
      });
    },
  });
  
  // Save answer mutation
  const saveAnswerMutation = useMutation({
    mutationFn: ({ answer }: { answer: UserAnswer }) => 
      examApi.saveAnswer(examStore.attemptId as number, answer),
  });
  
  // Flag question mutation
  const flagQuestionMutation = useMutation({
    mutationFn: ({ questionId }: { questionId: number }) => 
      examApi.flagQuestion(examStore.attemptId as number, questionId),
    onSuccess: (data, variables) => {
      // Update local store
      examStore.toggleFlagQuestion(variables.questionId);
      
      // Invalidate flagged questions query
      queryClient.invalidateQueries({ 
        queryKey: EXAM_KEYS.flagged(examStore.attemptId as number)
      });
    },
  });
  
  // Unflag question mutation
  const unflagQuestionMutation = useMutation({
    mutationFn: ({ questionId }: { questionId: number }) => 
      examApi.unflagQuestion(examStore.attemptId as number, questionId),
    onSuccess: (data, variables) => {
      // Update local store
      examStore.toggleFlagQuestion(variables.questionId);
      
      // Invalidate flagged questions query
      queryClient.invalidateQueries({ 
        queryKey: EXAM_KEYS.flagged(examStore.attemptId as number)
      });
    },
  });
  
  // Submit exam mutation
  const submitExamMutation = useMutation({
    mutationFn: () => {
      // Convert answers from record to array
      const answers = Object.values(examStore.answers);
      return examApi.submitExam(examStore.attemptId as number, answers);
    },
    onSuccess: (data) => {
      // Mark exam as completed in local store
      examStore.completeExam();
      
      // Invalidate result query
      queryClient.invalidateQueries({ 
        queryKey: EXAM_KEYS.result(examStore.attemptId as number)
      });
    },
  });
  
  // Handle exam timer
  const handleTimeExpired = () => {
    if (!examStore.isCompleted && examStore.attemptId) {
      submitExamMutation.mutate();
    }
  };
  
  return {
    // Queries
    exam: examQuery.data,
    questions: questionsQuery.data,
    isLoading: examQuery.isLoading || questionsQuery.isLoading,
    error: examQuery.error || questionsQuery.error,
    
    // State from store
    currentQuestionIndex: examStore.currentQuestionIndex,
    answers: examStore.answers,
    flaggedQuestions: examStore.flaggedQuestions,
    timeRemaining: examStore.timeRemaining,
    isCompleted: examStore.isCompleted,
    
    // Navigation actions
    navigateToQuestion: examStore.navigateToQuestion,
    nextQuestion: examStore.nextQuestion,
    previousQuestion: examStore.previousQuestion,
    
    // Question actions
    answerQuestion: (questionId: number, optionIndex: number) => {
      // Update local store
      examStore.answerQuestion(questionId, optionIndex);
      
      // Save to server (optional, can be done only on submit)
      saveAnswerMutation.mutate({ 
        answer: { 
          questionId, 
          selectedOption: optionIndex 
        } 
      });
    },
    
    toggleFlagQuestion: (questionId: number) => {
      const isFlagged = examStore.isFlagged(questionId);
      
      if (isFlagged) {
        unflagQuestionMutation.mutate({ questionId });
      } else {
        flagQuestionMutation.mutate({ questionId });
      }
    },
    
    // Exam session actions
    startExam: startExamMutation.mutate,
    submitExam: submitExamMutation.mutate,
    handleTimeExpired,
    
    // UI actions
    toggleSummary: examStore.toggleSummary,
    showSummary: examStore.showSummary,
    
    // Mutation states
    isStarting: startExamMutation.isPending,
    isSubmitting: submitExamMutation.isPending,
    isSaving: saveAnswerMutation.isPending,
    isFlagging: flagQuestionMutation.isPending || unflagQuestionMutation.isPending,
    startError: startExamMutation.error,
    submitError: submitExamMutation.error,
    
    // Helper getters
    hasAnswer: examStore.hasAnswer,
    isFlagged: examStore.isFlagged,
    getAnsweredQuestionsCount: examStore.getAnsweredQuestionsCount,
    getFlaggedQuestionsCount: examStore.getFlaggedQuestionsCount,
    getCompletionPercentage: examStore.getCompletionPercentage,
    
    // Refresh data
    refetch: () => {
      examQuery.refetch();
      questionsQuery.refetch();
    }
  };
}

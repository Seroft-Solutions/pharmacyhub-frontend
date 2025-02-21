import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useExamStore } from '@/store/examStore';

export function useExam(examId: string) {
  const examQuery = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => api.getExam(examId),
  });

  const questionsQuery = useQuery({
    queryKey: ['examQuestions', examId],
    queryFn: () => api.getExamQuestions(examId),
    enabled: !!examId,
  });

  const startExamMutation = useMutation({
    mutationFn: (userId: string) => api.startExam(examId, userId),
    onSuccess: (data) => {
      // Update Zustand store
      useExamStore.getState().startExam(examId);
    },
  });

  const submitExamMutation = useMutation({
    mutationFn: ({userId, answers}: {userId: string; answers: any[]}) => 
      api.submitExam(examId, userId, answers),
    onSuccess: (data) => {
      // Update cache and store
      useExamStore.getState().resetExam();
    },
  });

  return {
    exam: examQuery.data,
    questions: questionsQuery.data,
    isLoading: examQuery.isLoading || questionsQuery.isLoading,
    error: examQuery.error || questionsQuery.error,
    startExam: startExamMutation.mutate,
    submitExam: submitExamMutation.mutate,
    isSubmitting: submitExamMutation.isLoading,
  };
}
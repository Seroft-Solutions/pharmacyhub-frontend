/**
 * TanStack Query hooks for exams feature
 * 
 * This hook provides a centralized entry point for using the TanStack Query API
 * for all exam-related operations, abstracting away the implementation details.
 */
import {
  useExams,
  usePublishedExams,
  useExamsByStatus,
  useExam,
  useExamQuestions,
  useStartExam,
  useSaveAnswer,
  useSubmitExam,
  useExamResult,
  useUserAttempts,
  useExamAttemptsByUser,
  useFlagQuestion,
  useUnflagQuestion,
  useFlaggedQuestions,
  usePaginatedExams,
  useExamStats,
  useExamSession,
  examQueryKeys
} from '../api/tanstack';

import { useExamStore } from '../store/examStore';
import { ExamStatusType } from '../types';
import { useEffect } from 'react';
import { UserAnswer } from '../model/mcqTypes';

/**
 * Hook providing a unified interface to all exam operations using TanStack Query
 */
export function useTanstackExams() {
  // Re-export all hooks
  return {
    // Query keys for manual cache operations
    queryKeys: examQueryKeys,
    
    // Data fetching hooks
    useExams,
    usePublishedExams,
    useExamsByStatus,
    useExam,
    useExamQuestions,
    useExamResult,
    useUserAttempts,
    useExamAttemptsByUser,
    useFlaggedQuestions,
    usePaginatedExams,
    useExamStats,
    
    // Mutation hooks
    useStartExam,
    useSaveAnswer,
    useSubmitExam,
    useFlagQuestion,
    useUnflagQuestion,
    
    // Integrated session hook
    useExamSession
  };
}

/**
 * Hook providing an exam session with TanStack Query and local state integration
 */
export function useTanstackExamSession(examId: number | undefined) {
  const examStore = useExamStore();
  const {
    exam,
    questions,
    isLoading,
    error,
    startExam,
    isStarting,
    startError,
    saveAnswer,
    submitExam,
    isSubmitting,
    submitError,
    flagQuestion,
    unflagQuestion,
    isFlagging,
    refetch
  } = useExamSession(examId);
  
  // Sync questions with local state when they change
  useEffect(() => {
    if (questions && examId && examStore.examId !== examId) {
      examStore.startExam(
        examId, 
        questions, 
        exam?.duration || 60
      );
    }
  }, [questions, examId, exam, examStore]);
  
  // Handle starting an exam
  const handleStartExam = () => {
    if (!examId) return;
    
    startExam(examId, {
      onSuccess: (data) => {
        // Store attempt ID in exam store
        examStore.setAttemptId(data.id);
      }
    });
  };
  
  // Handle answering a question
  const handleAnswerQuestion = (questionId: number, optionIndex: number) => {
    // Update local store
    examStore.answerQuestion(questionId, optionIndex);
    
    // Skip API call if no attempt ID yet (offline mode)
    if (!examStore.attemptId) return;
    
    // Save to server
    const answer: UserAnswer = { 
      questionId, 
      selectedOption: optionIndex 
    };
    
    saveAnswer({ 
      attemptId: examStore.attemptId, 
      answer 
    });
  };
  
  // Handle submitting the exam
  const handleSubmitExam = () => {
    // Skip API call if no attempt ID yet (offline mode)
    if (!examStore.attemptId) {
      examStore.completeExam();
      return;
    }
    
    // Convert answers from record to array
    const answers = Object.entries(examStore.answers).map(([id, option]) => ({
      questionId: parseInt(id),
      selectedOption: option
    }));
    
    submitExam(
      { 
        attemptId: examStore.attemptId, 
        answers 
      },
      {
        onSuccess: () => {
          // Mark exam as completed in local store
          examStore.completeExam();
        }
      }
    );
  };
  
  // Handle flagging a question
  const handleToggleFlagQuestion = (questionId: number) => {
    // Update local store
    examStore.toggleFlagQuestion(questionId);
    
    // Skip API call if no attempt ID yet (offline mode)
    if (!examStore.attemptId) return;
    
    const isFlagged = examStore.isFlagged(questionId);
    
    if (isFlagged) {
      unflagQuestion({ 
        attemptId: examStore.attemptId, 
        questionId 
      });
    } else {
      flagQuestion({ 
        attemptId: examStore.attemptId, 
        questionId 
      });
    }
  };
  
  // Handle timer expiry
  const handleTimeExpired = () => {
    if (!examStore.isCompleted) {
      handleSubmitExam();
    }
  };
  
  return {
    // Data
    exam,
    questions,
    isLoading,
    error,
    isStarting,
    startError,
    isSubmitting,
    submitError,
    isFlagging,
    
    // State from store
    currentQuestionIndex: examStore.currentQuestionIndex,
    answers: examStore.answers,
    flaggedQuestions: examStore.flaggedQuestions,
    timeRemaining: examStore.timeRemaining,
    isCompleted: examStore.isCompleted,
    attemptId: examStore.attemptId,
    
    // Navigation actions
    navigateToQuestion: examStore.navigateToQuestion,
    nextQuestion: examStore.nextQuestion,
    previousQuestion: examStore.previousQuestion,
    
    // Exam actions
    startExam: handleStartExam,
    answerQuestion: handleAnswerQuestion,
    submitExam: handleSubmitExam,
    toggleFlagQuestion: handleToggleFlagQuestion,
    handleTimeExpired,
    
    // UI actions
    toggleSummary: examStore.toggleSummary,
    showSummary: examStore.showSummary,
    
    // Helper getters
    hasAnswer: examStore.hasAnswer,
    isFlagged: examStore.isFlagged,
    getAnsweredQuestionsCount: examStore.getAnsweredQuestionsCount,
    getFlaggedQuestionsCount: examStore.getFlaggedQuestionsCount,
    getCompletionPercentage: examStore.getCompletionPercentage,
    
    // Refresh data
    refetch
  };
}

export default useTanstackExams;

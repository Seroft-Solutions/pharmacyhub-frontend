/**
 * Hook for managing exam session logic
 * Centralizes exam state management logic for use across components
 */
"use client";

import { useCallback, useEffect, useState } from 'react';
import { useExamStore } from '../state/stores';

/**
 * Interface for exam session state and actions
 */
interface UseExamSessionReturn {
  // Exam state
  exam: ReturnType<typeof useExamStore>['exam'];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  isLoading: boolean;
  error: Error | null;
  
  // Current question information
  currentQuestion: {
    id: string;
    text: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect?: boolean;
    }>;
  } | null;
  
  // Navigation state
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  
  // Dialog state
  showFinishDialog: boolean;
  showTimesUpDialog: boolean;
  
  // Actions
  loadExam: (examId: string) => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleSelectOption: (questionId: string, optionId: string) => void;
  handleFinishClick: () => void;
  handleSubmitExam: () => void;
  handleTimeUp: () => void;
  setShowFinishDialog: (show: boolean) => void;
  setShowTimesUpDialog: (show: boolean) => void;
}

/**
 * Hook for managing exam session
 * @param examId - The ID of the exam to load
 * @returns Exam session state and actions
 */
export const useExamSession = (examId: string): UseExamSessionReturn => {
  // Get exam store methods
  const { 
    exam, 
    currentQuestionIndex, 
    userAnswers,
    isLoading,
    error,
    loadExam,
    selectQuestion,
    answerQuestion,
    submitExam
  } = useExamStore();

  // Local dialog state
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showTimesUpDialog, setShowTimesUpDialog] = useState(false);

  // Load exam on mount
  useEffect(() => {
    loadExam(examId);
  }, [examId, loadExam]);

  // Navigation handlers
  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      selectQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, selectQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      selectQuestion(currentQuestionIndex + 1);
    }
  }, [exam, currentQuestionIndex, selectQuestion]);

  // Answer selection handler
  const handleSelectOption = useCallback((questionId: string, optionId: string) => {
    answerQuestion(questionId, optionId);
  }, [answerQuestion]);

  // Dialog handlers
  const handleFinishClick = useCallback(() => {
    setShowFinishDialog(true);
  }, []);

  const handleSubmitExam = useCallback(() => {
    setShowFinishDialog(false);
    submitExam();
  }, [submitExam]);

  const handleTimeUp = useCallback(() => {
    setShowTimesUpDialog(true);
  }, []);

  // Current question
  const currentQuestion = exam?.questions[currentQuestionIndex] || null;

  // Navigation state
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = exam ? currentQuestionIndex === exam.questions.length - 1 : false;

  return {
    // Exam state
    exam,
    currentQuestionIndex,
    userAnswers,
    isLoading,
    error,
    
    // Current question information
    currentQuestion,
    
    // Navigation state
    isFirstQuestion,
    isLastQuestion,
    
    // Dialog state
    showFinishDialog,
    showTimesUpDialog,
    
    // Actions
    loadExam,
    handlePrevQuestion,
    handleNextQuestion,
    handleSelectOption,
    handleFinishClick,
    handleSubmitExam,
    handleTimeUp,
    setShowFinishDialog,
    setShowTimesUpDialog
  };
};

export default useExamSession;

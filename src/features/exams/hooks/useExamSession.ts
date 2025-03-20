/**
 * useExamSession hook
 * 
 * This hook provides comprehensive exam session functionality including:
 * - Loading exam data and questions
 * - Managing answers and flagged questions
 * - Handling exam navigation and submission
 * - Managing exam timer
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useExamStore } from '../store/examStore';
import { Question, UserAnswer } from '../model/mcqTypes';
import { toast } from 'sonner';
import {
  useExamDetail as useExam,
  useExamQuestions,
  useStartExamMutation,
  useAnswerQuestionMutation,
  useFlagQuestionMutation,
  useUnflagQuestionMutation,
  useSubmitExamMutation
} from '../api/hooks';

export const useExamSession = (examId: number) => {
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  // API hooks for the exam session
  const {
    data: exam,
    isLoading: isExamLoading,
    error: examError
  } = useExam(examId);
  
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    error: questionsError 
  } = useExamQuestions(examId);
  
  const {
    mutate: startExamMutation,
    isPending: isStarting,
    error: startError
  } = useStartExamMutation(examId);
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Only initialize these mutations if we have an attemptId
  const {
    mutate: answerQuestionMutation,
    isPending: isSaving
  } = useAnswerQuestionMutation(
    attemptId || 0, 
    currentQuestion?.id || 0
  );
  
  const {
    mutate: flagQuestionMutation,
    isPending: isFlagging
  } = useFlagQuestionMutation(
    attemptId || 0,
    currentQuestion?.id || 0
  );
  
  const {
    mutate: unflagQuestionMutation,
    isPending: isUnflagging
  } = useUnflagQuestionMutation(
    attemptId || 0,
    currentQuestion?.id || 0
  );
  
  const {
    mutate: submitExamMutation,
    isPending: isSubmitting,
    error: submitError
  } = useSubmitExamMutation(attemptId || 0);
  
  // Load state from Zustand store
  useEffect(() => {
    const examStore = useExamStore.getState();
    if (examStore.examId === examId) {
      setCurrentQuestionIndex(examStore.currentQuestionIndex);
      setAnswers(examStore.answers);
      setFlaggedQuestions(examStore.flaggedQuestions);
      setTimeRemaining(examStore.timeRemaining);
      setIsCompleted(examStore.isCompleted);
    }
  }, [examId]);
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeRemaining > 0 && !isCompleted && !showSummary) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1;
          useExamStore.getState().decrementTimer();
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [timeRemaining, isCompleted, showSummary]);
  
  // Actions
  const startExam = useCallback((data: { userId: string }, options?: any) => {
    startExamMutation(data, {
      ...options,
      onSuccess: (response) => {
        // Set the attemptId from the response
        if (response && response.id) {
          setAttemptId(response.id);
        }
        
        // Initialize timer based on exam duration
        if (exam) {
          setTimeRemaining(exam.duration * 60); // Convert minutes to seconds
        }
        
        // Initialize Zustand store with exam data
        if (exam && questions.length > 0 && response && response.id) {
          useExamStore.getState().startExam(examId, questions, exam?.duration || 60);
          useExamStore.getState().setAttemptId(response.id);
        }
        
        if (options?.onSuccess) {
          options.onSuccess(response);
        }
      },
      onError: (error) => {
        toast.error(`Failed to start exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        if (options?.onError) {
          options.onError(error);
        }
      }
    });
  }, [exam, examId, questions, startExamMutation]);
  
  const answerQuestion = useCallback((questionId: number, selectedOption: number) => {
    if (!attemptId) {
      toast.error('Cannot save answer: No active exam attempt');
      return;
    }
    
    // Calculate time spent (for now using a default value)
    // In a future enhancement, we could track time per question
    const timeSpent = 0;
    
    // Update local state
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: {
          questionId,
          selectedOption,
          timeSpent
        }
      };
      
      // Update Zustand store
      useExamStore.getState().answerQuestion(questionId, selectedOption);
      
      return newAnswers;
    });
    
    // Send to API with all required fields
    answerQuestionMutation({ 
      questionId, 
      selectedOptionId: selectedOption.toString(), // Convert to string as API expects
      timeSpent 
    }, {
      onError: (error) => {
        toast.error(`Failed to save answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }, [answerQuestionMutation, attemptId]);
  
  const toggleFlagQuestion = useCallback((questionId: number) => {
    if (!attemptId) {
      toast.error('Cannot flag question: No active exam attempt');
      return;
    }
    
    // Update local state
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      const isFlagged = newFlagged.has(questionId);
      
      if (isFlagged) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      
      // Update Zustand store
      useExamStore.getState().toggleFlagQuestion(questionId);
      
      return newFlagged;
    });
    
    // Flag or unflag based on current state
    const isFlagged = flaggedQuestions.has(questionId);
    
    if (isFlagged) {
      // Call unflag API
      unflagQuestionMutation(undefined, {
        onError: (error) => {
          toast.error(`Failed to unflag question: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });
    } else {
      // Call flag API
      flagQuestionMutation(undefined, {
        onError: (error) => {
          toast.error(`Failed to flag question: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });
    }
  }, [flagQuestionMutation, flaggedQuestions, attemptId]);
  
  const navigateToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      useExamStore.getState().navigateToQuestion(index);
    }
  }, [questions.length]);
  
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      useExamStore.getState().nextQuestion();
    }
  }, [currentQuestionIndex, questions.length]);
  
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      useExamStore.getState().previousQuestion();
    }
  }, [currentQuestionIndex]);
  
  const toggleSummary = useCallback(() => {
    setShowSummary(prev => !prev);
    useExamStore.getState().toggleSummary();
  }, []);
  
  const submitExam = useCallback((data?: any, options?: any) => {
    if (!attemptId) {
      toast.error('Cannot submit exam: No active exam attempt');
      return;
    }
    
    // Prepare answers array for submission
    const answersArray = Object.values(answers).map(answer => ({
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOption,
      timeSpent: answer.timeSpent || 0
    }));
    
    submitExamMutation(answersArray, {
      ...options,
      onSuccess: (data) => {
        setIsCompleted(true);
        useExamStore.getState().completeExam();
        
        if (options?.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`Failed to submit exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        if (options?.onError) {
          options.onError(error);
        }
      }
    });
  }, [submitExamMutation, attemptId, answers]);
  
  const handleTimeExpired = useCallback(() => {
    toast.warning('Time expired! Submitting your exam...');
    submitExam();
  }, [submitExam]);
  
  // Helper functions
  const hasAnswer = useCallback((questionId: number) => {
    return !!answers[questionId];
  }, [answers]);
  
  const isFlagged = useCallback((questionId: number) => {
    return flaggedQuestions.has(questionId);
  }, [flaggedQuestions]);
  
  const getAnsweredQuestionsCount = useCallback(() => {
    return Object.keys(answers).length;
  }, [answers]);
  
  const getFlaggedQuestionsCount = useCallback(() => {
    return flaggedQuestions.size;
  }, [flaggedQuestions]);
  
  const getCompletionPercentage = useCallback(() => {
    if (questions.length === 0) return 0;
    return (Object.keys(answers).length / questions.length) * 100;
  }, [answers, questions.length]);
  
  return {
    // Data
    exam,
    questions,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    isCompleted,
    showSummary,
    
    // Loading states
    isLoading: isExamLoading || isQuestionsLoading,
    error: examError || questionsError,
    isStarting,
    isSubmitting,
    isSaving,
    isFlagging,
    isUnflagging,
    startError,
    submitError,
    
    // Actions
    startExam,
    answerQuestion,
    toggleFlagQuestion,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    toggleSummary,
    submitExam,
    handleTimeExpired,
    
    // Helpers
    hasAnswer,
    isFlagged,
    getAnsweredQuestionsCount,
    getFlaggedQuestionsCount,
    getCompletionPercentage
  };
};
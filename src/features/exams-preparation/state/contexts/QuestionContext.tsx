/**
 * Question Context Provider
 * 
 * This context provides state and actions for question interaction
 * during an exam, including answer selection, navigation, and review.
 */

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Question, ExamAnswer } from '../../types/models/exam';
import { QuestionContextType } from '../../types/state/exam-state';
import { createContextProvider } from '../contextFactory';
import { useExamStore, useCurrentQuestion } from '../stores/examStore';

// Initial state for the question context
const initialQuestionContext: QuestionContextType = {
  currentQuestion: null,
  selectedAnswer: null,
  isAnswered: false,
  isPreviouslyAnswered: false,
  isCorrect: null,
  isReview: false,
  flagged: false,
  timeSpent: 0,
  onAnswerSelect: () => {},
  onNext: () => {},
  onPrevious: () => {},
  onFlag: () => {},
  onFinish: () => {},
};

// Create the context provider and hook
const [QuestionProvider, useQuestionContext] = createContextProvider<
  Omit<QuestionContextType, 'onAnswerSelect' | 'onNext' | 'onPrevious' | 'onFlag' | 'onFinish'>,
  Pick<QuestionContextType, 'onAnswerSelect' | 'onNext' | 'onPrevious' | 'onFlag' | 'onFinish'>
>(
  'Question',
  {
    currentQuestion: null,
    selectedAnswer: null,
    isAnswered: false,
    isPreviouslyAnswered: false,
    isCorrect: null,
    isReview: false,
    flagged: false,
    timeSpent: 0,
  },
  (setState) => {
    return {
      onAnswerSelect: (answer) => {
        setState((state) => ({
          ...state,
          selectedAnswer: answer,
          isAnswered: true,
        }));
      },
      
      onNext: () => {
        // This will be overridden in the component implementation
      },
      
      onPrevious: () => {
        // This will be overridden in the component implementation
      },
      
      onFlag: (flagged) => {
        setState((state) => ({
          ...state,
          flagged,
        }));
      },
      
      onFinish: () => {
        // This will be overridden in the component implementation
      },
    };
  },
  {
    displayName: 'QuestionContext',
  }
);

/**
 * Question Context Provider with Exam Store integration
 * 
 * This is the main export that connects the question context with the exam store.
 */
export const QuestionContextProvider: React.FC<{
  children: ReactNode;
  isReview?: boolean;
}> = ({ children, isReview = false }) => {
  // Get the current question and related state from the exam store
  const currentQuestion = useCurrentQuestion();
  const {
    answerQuestion,
    nextQuestion,
    previousQuestion,
    toggleFlagQuestion,
    completeExam,
    hasAnswer,
    isFlagged,
    getQuestionStatus,
  } = useExamStore();
  
  // Calculate derived state based on the current question
  const questionId = currentQuestion?.id;
  const isAnsweredQuestion = questionId ? hasAnswer(questionId) : false;
  const isFlaggedQuestion = questionId ? isFlagged(questionId) : false;
  const questionStatus = questionId ? getQuestionStatus(questionId) : null;
  const isCorrectAnswer = questionStatus === 'CORRECT';
  
  // Set up action handlers that use the exam store
  const handleAnswerSelect = useCallback(
    (answer: string | string[]) => {
      if (questionId) {
        answerQuestion(questionId, answer);
      }
    },
    [questionId, answerQuestion]
  );
  
  const handleFlagToggle = useCallback(
    (flagged: boolean) => {
      if (questionId) {
        toggleFlagQuestion(questionId);
      }
    },
    [questionId, toggleFlagQuestion]
  );
  
  // Provide the context value with store integration
  const contextValue = useMemo(
    () => ({
      currentQuestion,
      selectedAnswer: currentQuestion?.answers,
      isAnswered: isAnsweredQuestion,
      isPreviouslyAnswered: isAnsweredQuestion,
      isCorrect: isReview ? isCorrectAnswer : null,
      isReview,
      flagged: isFlaggedQuestion,
      timeSpent: 0, // We could track time spent per question in a future implementation
      onAnswerSelect: handleAnswerSelect,
      onNext: nextQuestion,
      onPrevious: previousQuestion,
      onFlag: handleFlagToggle,
      onFinish: completeExam,
    }),
    [
      currentQuestion,
      isAnsweredQuestion,
      isCorrectAnswer,
      isReview,
      isFlaggedQuestion,
      handleAnswerSelect,
      nextQuestion,
      previousQuestion,
      handleFlagToggle,
      completeExam,
    ]
  );
  
  return <QuestionProvider initialState={contextValue}>{children}</QuestionProvider>;
};

// Export the hook for components to use
export { useQuestionContext };

// Default export for convenience
export default QuestionContextProvider;

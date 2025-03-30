/**
 * Exam Store
 * 
 * This store manages the state for exam execution including
 * active exam sessions, answers, and quiz navigation.
 */

import { createStore } from '../storeFactory';
import { Question, ExamAttempt, ExamAnswer } from '../../types/models/exam';
import { QuestionStatus } from '../../types/api/enums';
import { calculateExamScore, formatTimeVerbose } from '../../utils';
import logger from '@/core/utils/logger';

// State interface
interface ExamState {
  // Exam data
  examId: number | null;
  attemptId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  startTime: string | null;
  endTime: string | null;
  
  // User interactions
  answers: Record<number, ExamAnswer>;
  flaggedQuestions: Set<number>;
  visitedQuestions: Set<number>;
  
  // UI state
  isPaused: boolean;
  isCompleted: boolean;
  showSummary: boolean;
  reviewMode: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ExamState = {
  // Exam data
  examId: null,
  attemptId: null,
  questions: [],
  currentQuestionIndex: 0,
  timeRemaining: 0,
  startTime: null,
  endTime: null,
  
  // User interactions
  answers: {},
  flaggedQuestions: new Set<number>(),
  visitedQuestions: new Set<number>(),
  
  // UI state
  isPaused: false,
  isCompleted: false,
  showSummary: false,
  reviewMode: false,
  isLoading: false,
  error: null,
};

// Actions interface
interface ExamActions {
  // Exam session actions
  startExam: (examId: number, questions: Question[], durationInMinutes: number) => void;
  setAttemptId: (attemptId: string) => void;
  answerQuestion: (questionId: number, selectedOptions: string | string[]) => void;
  toggleFlagQuestion: (questionId: number) => void;
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  pauseExam: () => void;
  resumeExam: () => void;
  decrementTimer: () => void;
  toggleSummary: () => void;
  setReviewMode: (isReview: boolean) => void;
  completeExam: () => void;
  
  // UI actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  hasAnswer: (questionId: number) => boolean;
  isFlagged: (questionId: number) => boolean;
  getAnsweredQuestionsCount: () => number;
  getFlaggedQuestionsCount: () => number;
  getCompletionPercentage: () => number;
  getQuestionStatus: (questionId: number) => QuestionStatus;
  getRemainingTimeFormatted: () => string;
  
  // Management actions
  resetExam: () => void;
  forceResetExamState: () => void; // Complete reset including localStorage
}

// Create the store
export const useExamStore = createStore<ExamState, ExamActions>(
  'exam',
  initialState,
  (set, get) => ({
    // Exam session actions
    startExam: (examId, questions, durationInMinutes) => {
      // First, force a complete state reset including localStorage
      get().forceResetExamState();
      
      // Then set the new exam state
      set({
        examId,
        questions,
        timeRemaining: durationInMinutes * 60,
        currentQuestionIndex: 0,
        startTime: new Date().toISOString(),
        answers: {},
        flaggedQuestions: new Set<number>([]),
        visitedQuestions: new Set<number>([0]), // Mark first question as visited
        isPaused: false,
        isCompleted: false,
        showSummary: false,
        reviewMode: false,
        isLoading: false,
        error: null,
      });
      
      logger.info('Exam started', { examId, questionCount: questions.length });
    },
    
    setAttemptId: (attemptId) => {
      set({ attemptId });
      logger.debug('Attempt ID set', { attemptId });
    },
    
    answerQuestion: (questionId, selectedOptions) => {
      set((state) => {
        // Normalize to array for consistent handling
        const optionsArray = Array.isArray(selectedOptions) 
          ? selectedOptions 
          : [selectedOptions];
        
        logger.debug('Question answered', { 
          questionId, 
          selectedOptions: optionsArray
        });
        
        return {
          answers: {
            ...state.answers,
            [questionId]: { 
              questionId, 
              selectedOptions: optionsArray,
            },
          },
        };
      });
    },
    
    toggleFlagQuestion: (questionId) => {
      set((state) => {
        const newFlagged = new Set(state.flaggedQuestions);
        
        if (newFlagged.has(questionId)) {
          newFlagged.delete(questionId);
          logger.debug('Question unflagged', { questionId });
        } else {
          newFlagged.add(questionId);
          logger.debug('Question flagged', { questionId });
        }
        
        return { flaggedQuestions: newFlagged };
      });
    },
    
    navigateToQuestion: (index) => {
      const { questions, visitedQuestions } = get();
      
      if (index >= 0 && index < questions.length) {
        // Mark the question as visited
        const newVisited = new Set(visitedQuestions);
        newVisited.add(index);
        
        set({ 
          currentQuestionIndex: index,
          visitedQuestions: newVisited
        });
        
        logger.debug('Navigated to question', { index });
      }
    },
    
    nextQuestion: () => {
      const { currentQuestionIndex, questions, visitedQuestions } = get();
      
      if (currentQuestionIndex < questions.length - 1) {
        const newIndex = currentQuestionIndex + 1;
        
        // Mark the next question as visited
        const newVisited = new Set(visitedQuestions);
        newVisited.add(newIndex);
        
        set({ 
          currentQuestionIndex: newIndex,
          visitedQuestions: newVisited
        });
        
        logger.debug('Navigated to next question', { 
          from: currentQuestionIndex, 
          to: newIndex 
        });
      }
    },
    
    previousQuestion: () => {
      const { currentQuestionIndex } = get();
      
      if (currentQuestionIndex > 0) {
        const newIndex = currentQuestionIndex - 1;
        set({ currentQuestionIndex: newIndex });
        
        logger.debug('Navigated to previous question', { 
          from: currentQuestionIndex, 
          to: newIndex 
        });
      }
    },
    
    pauseExam: () => {
      set({ isPaused: true });
      logger.debug('Exam paused');
    },
    
    resumeExam: () => {
      set({ isPaused: false });
      logger.debug('Exam resumed');
    },
    
    decrementTimer: () => {
      set((state) => {
        const newTimeRemaining = Math.max(0, state.timeRemaining - 1);
        
        // Log at regular intervals for debugging
        if (newTimeRemaining % 60 === 0) {
          logger.debug('Timer update', { 
            minutesRemaining: newTimeRemaining / 60 
          });
        }
        
        return { timeRemaining: newTimeRemaining };
      });
    },
    
    toggleSummary: () => {
      set((state) => ({ 
        showSummary: !state.showSummary 
      }));
      
      logger.debug('Summary view toggled', { 
        showSummary: !get().showSummary 
      });
    },
    
    setReviewMode: (isReview) => {
      set({ reviewMode: isReview });
      logger.debug('Review mode set', { reviewMode: isReview });
    },
    
    completeExam: () => {
      set({ 
        isCompleted: true,
        endTime: new Date().toISOString(),
      });
      
      logger.info('Exam completed', { 
        examId: get().examId,
        attemptId: get().attemptId,
        answeredQuestions: get().getAnsweredQuestionsCount(),
        totalQuestions: get().questions.length,
      });
    },
    
    // UI actions
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => {
      set({ error });
      if (error) {
        logger.error('Exam error', { error });
      }
    },
    
    // Getters
    hasAnswer: (questionId) => {
      return !!get().answers[questionId];
    },
    
    isFlagged: (questionId) => {
      return get().flaggedQuestions.has(questionId);
    },
    
    getAnsweredQuestionsCount: () => {
      return Object.keys(get().answers).length;
    },
    
    getFlaggedQuestionsCount: () => {
      return get().flaggedQuestions.size;
    },
    
    getCompletionPercentage: () => {
      const { questions, answers } = get();
      if (questions.length === 0) return 0;
      return (Object.keys(answers).length / questions.length) * 100;
    },
    
    getQuestionStatus: (questionId) => {
      const { answers, reviewMode, questions } = get();
      
      // If not answered, it's unanswered
      if (!answers[questionId]) {
        return QuestionStatus.UNANSWERED;
      }
      
      // If not in review mode, it's pending (we don't show correctness)
      if (!reviewMode) {
        return QuestionStatus.ANSWERED_PENDING;
      }
      
      // In review mode, determine if correct
      const answer = answers[questionId];
      const question = questions.find(q => q.id === questionId);
      
      if (!question || !question.correctAnswers) {
        return QuestionStatus.ANSWERED_PENDING;
      }
      
      // Check if answer is correct
      const correctAnswers = new Set(question.correctAnswers);
      const answeredCorrectly = answer.selectedOptions?.every(option => 
        correctAnswers.has(option)
      ) && answer.selectedOptions.length === correctAnswers.size;
      
      return answeredCorrectly
        ? QuestionStatus.ANSWERED_CORRECT
        : QuestionStatus.ANSWERED_INCORRECT;
    },
    
    getRemainingTimeFormatted: () => {
      return formatTimeVerbose(get().timeRemaining);
    },
    
    // Management actions
    resetExam: () => {
      logger.info('Exam state reset');
      set(initialState);
    },
    
    forceResetExamState: () => {
      logger.info('Forcing complete exam state reset');
      
      // Try to clear persisted state in localStorage
      try {
        if (typeof window !== 'undefined') {
          // Remove persisted state by looking for exam-related keys
          const possibleKeys = [
            'exams-prep-exam',
            'exam-store',
            'exam-state',
            'zustand-exam',
          ];
          
          // Try to remove known keys
          for (const key of possibleKeys) {
            try {
              localStorage.removeItem(key);
              logger.debug(`Cleared persisted state for key: ${key}`);
            } catch (e) {
              // Ignore individual key errors
            }
          }
        }
      } catch (error) {
        logger.error('Failed to clear localStorage:', error);
      }
      
      // Reset the store state
      set(initialState);
    },
  }),
  {
    persist: true,
    storageKey: 'exams-prep-exam',
    partialize: (state) => ({
      // Only persist these fields
      examId: state.examId,
      attemptId: state.attemptId,
      questions: state.questions,
      currentQuestionIndex: state.currentQuestionIndex,
      timeRemaining: state.timeRemaining,
      startTime: state.startTime,
      answers: state.answers,
      flaggedQuestions: Array.from(state.flaggedQuestions),
      visitedQuestions: Array.from(state.visitedQuestions),
      isPaused: state.isPaused,
      isCompleted: state.isCompleted,
    }),
    onRehydrateStorage: () => {
      return (rehydratedState, error) => {
        if (error) {
          logger.error('Error rehydrating exam store:', error);
        } else if (rehydratedState) {
          // Convert arrays back to Sets after rehydration
          rehydratedState.flaggedQuestions = new Set(
            rehydratedState.flaggedQuestions || []
          );
          rehydratedState.visitedQuestions = new Set(
            rehydratedState.visitedQuestions || []
          );
          
          logger.debug('Exam store rehydrated successfully');
        }
      };
    },
  }
);

// Selectors for better performance and component optimization
export const useExamId = () => useExamStore(state => state.examId);
export const useAttemptId = () => useExamStore(state => state.attemptId);
export const useCurrentQuestion = () => useExamStore(state => {
  const { questions, currentQuestionIndex } = state;
  return questions[currentQuestionIndex];
});
export const useExamProgress = () => useExamStore(state => ({
  current: state.currentQuestionIndex + 1,
  total: state.questions.length,
  percentage: state.getCompletionPercentage(),
  answered: state.getAnsweredQuestionsCount(),
}));
export const useExamTimer = () => useExamStore(state => ({
  timeRemaining: state.timeRemaining,
  formatted: state.getRemainingTimeFormatted(),
  isPaused: state.isPaused,
}));
export const useExamNavigation = () => useExamStore(state => ({
  currentIndex: state.currentQuestionIndex,
  hasNext: state.currentQuestionIndex < state.questions.length - 1,
  hasPrevious: state.currentQuestionIndex > 0,
  goToNext: state.nextQuestion,
  goToPrevious: state.previousQuestion,
  goToQuestion: state.navigateToQuestion,
}));

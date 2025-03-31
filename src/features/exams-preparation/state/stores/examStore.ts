/**
 * @file Exam Store
 * 
 * This store manages the state for exam execution including
 * active exam sessions, answers, navigation, timing, and results.
 * 
 * It follows the core state management patterns and leverages the
 * feature-specific store factory for consistent implementation.
 * 
 * @module examStore
 */

import { createSelectors } from '@/core/state';
import { createExamsStore } from '../storeFactory';
import { 
  Question, 
  ExamAttempt, 
  ExamAnswer 
} from '../../types/models/exam';
import { QuestionStatus } from '../../types/api/enums';
import { 
  calculateExamScore, 
  formatTimeVerbose 
} from '../../utils';
import logger from '@/core/utils/logger';
import { ExtractState } from '../storeFactory';

/**
 * Enumeration of exam storage keys for persistence
 * Using a const object to ensure consistency and avoid string literals
 * 
 * @enum {string}
 */
export const ExamStorageKeys = {
  MAIN: 'exams-preparation-exam',
  LEGACY: 'exam-store',
  DEPRECATED_1: 'exams-prep-exam',
  DEPRECATED_2: 'zustand-exam',
} as const;

/**
 * Interface for the exam state
 * 
 * @interface ExamState
 */
export interface ExamState {
  /** The ID of the current exam */
  examId: number | null;
  
  /** The ID of the current attempt */
  attemptId: string | null;
  
  /** Array of questions in the exam */
  questions: Question[];
  
  /** Current question index (0-based) */
  currentQuestionIndex: number;
  
  /** Time remaining in seconds */
  timeRemaining: number;
  
  /** Start time of the exam (ISO string) */
  startTime: string | null;
  
  /** End time of the exam (ISO string) */
  endTime: string | null;
  
  /** 
   * Map of answers by question ID 
   * 
   * @example
   * ```
   * {
   *   123: { questionId: 123, selectedOptions: ['A'] },
   *   456: { questionId: 456, selectedOptions: ['B', 'C'] }
   * }
   * ```
   */
  answers: Record<number, ExamAnswer>;
  
  /** Set of flagged question indexes */
  flaggedQuestions: Set<number>;
  
  /** Set of visited question indexes */
  visitedQuestions: Set<number>;
  
  /** Whether the exam is paused */
  isPaused: boolean;
  
  /** Whether the exam is completed */
  isCompleted: boolean;
  
  /** Whether to show the summary view */
  showSummary: boolean;
  
  /** Whether the exam is in review mode */
  reviewMode: boolean;
  
  /** Whether the store is loading data */
  isLoading: boolean;
  
  /** Error message if any */
  error: string | null;
}

/**
 * Initial state for the exam store
 * 
 * @const initialState
 */
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

/**
 * Interface for the exam statistics
 * Provides detailed information about exam performance
 * 
 * @interface ExamStatistics
 */
export interface ExamStatistics {
  /** Total number of questions */
  total: number;
  
  /** Number of answered questions */
  answered: number;
  
  /** Number of correctly answered questions */
  correct: number;
  
  /** Number of incorrectly answered questions */
  incorrect: number;
  
  /** Number of unanswered questions */
  unanswered: number;
  
  /** Score after applying penalties */
  score: number;
  
  /** Score as a percentage */
  percentage: number;
  
  /** Penalty deducted for incorrect answers */
  penalty: number;
  
  /** Time spent on the exam in seconds */
  timeSpent: number;
  
  /** Counts of questions by status */
  statusCounts: Record<QuestionStatus, number>;
}

/**
 * Interface for a question with additional status information
 * Used for the useQuestionsWithStatuses selector
 * 
 * @interface QuestionWithStatus
 */
export interface QuestionWithStatus extends Question {
  /** Status of the question */
  status: QuestionStatus;
  
  /** User's answer to the question */
  userAnswer?: ExamAnswer;
}

/**
 * Interface for the exam actions
 * 
 * @interface ExamActions
 */
export interface ExamActions {
  /**
   * Start a new exam
   * 
   * @param examId - The ID of the exam
   * @param questions - Array of questions in the exam
   * @param durationInMinutes - Duration of the exam in minutes
   */
  startExam: (examId: number, questions: Question[], durationInMinutes: number) => void;
  
  /**
   * Set the attempt ID for the current exam
   * 
   * @param attemptId - The ID of the attempt
   */
  setAttemptId: (attemptId: string) => void;
  
  /**
   * Answer a question in the exam
   * 
   * @param questionId - The ID of the question
   * @param selectedOptions - Selected option(s) for the question
   */
  answerQuestion: (questionId: number, selectedOptions: string | string[]) => void;
  
  /**
   * Toggle the flagged status of a question
   * 
   * @param questionId - The ID of the question
   */
  toggleFlagQuestion: (questionId: number) => void;
  
  /**
   * Navigate to a specific question by index
   * 
   * @param index - The index of the question to navigate to
   */
  navigateToQuestion: (index: number) => void;
  
  /**
   * Navigate to the next question
   */
  nextQuestion: () => void;
  
  /**
   * Navigate to the previous question
   */
  previousQuestion: () => void;
  
  /**
   * Pause the exam timer
   */
  pauseExam: () => void;
  
  /**
   * Resume the exam timer
   */
  resumeExam: () => void;
  
  /**
   * Decrement the timer by 1 second
   * This is typically called by a timer interval
   */
  decrementTimer: () => void;
  
  /**
   * Toggle the summary view
   */
  toggleSummary: () => void;
  
  /**
   * Set the review mode
   * 
   * @param isReview - Whether to enable review mode
   */
  setReviewMode: (isReview: boolean) => void;
  
  /**
   * Mark the exam as completed
   */
  completeExam: () => void;
  
  /**
   * Set the loading state
   * 
   * @param isLoading - Whether the store is loading
   */
  setLoading: (isLoading: boolean) => void;
  
  /**
   * Set an error message
   * 
   * @param error - Error message or null to clear
   */
  setError: (error: string | null) => void;
  
  /**
   * Check if a question has been answered
   * 
   * @param questionId - The ID of the question
   * @returns Whether the question has been answered
   */
  hasAnswer: (questionId: number) => boolean;
  
  /**
   * Check if a question is flagged
   * 
   * @param questionId - The ID of the question
   * @returns Whether the question is flagged
   */
  isFlagged: (questionId: number) => boolean;
  
  /**
   * Get the count of answered questions
   * 
   * @returns The number of answered questions
   */
  getAnsweredQuestionsCount: () => number;
  
  /**
   * Get the count of flagged questions
   * 
   * @returns The number of flagged questions
   */
  getFlaggedQuestionsCount: () => number;
  
  /**
   * Get the completion percentage of the exam
   * 
   * @returns The percentage of questions answered (0-100)
   */
  getCompletionPercentage: () => number;
  
  /**
   * Get the status of a question
   * 
   * @param questionId - The ID of the question
   * @returns The status of the question
   */
  getQuestionStatus: (questionId: number) => QuestionStatus;
  
  /**
   * Get the formatted remaining time
   * 
   * @returns The remaining time formatted as string (e.g., "1h 30m")
   */
  getRemainingTimeFormatted: () => string;
  
  /**
   * Get detailed statistics about the exam
   * 
   * @returns Detailed exam statistics
   */
  getExamStatistics: () => ExamStatistics;
  
  /**
   * Reset the exam state to initial values
   */
  resetExam: () => void;
  
  /**
   * Force a complete reset of the exam state
   * This includes clearing localStorage persistence
   */
  forceResetExamState: () => void;
}

/**
 * Create the exam store using the feature-specific store factory
 * 
 * @const useExamStore
 */
export const useExamStore = createExamsStore<ExamState, ExamActions>(
  'exam',
  initialState,
  (set, get) => ({
    /**
     * Start a new exam
     */
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
      
      logger.info('[ExamStore] Exam started', { 
        examId, 
        questionCount: questions.length,
        durationInMinutes
      });
    },
    
    /**
     * Set the attempt ID for the current exam
     */
    setAttemptId: (attemptId) => {
      set({ attemptId });
      logger.debug('[ExamStore] Attempt ID set', { attemptId });
    },
    
    /**
     * Answer a question in the exam
     */
    answerQuestion: (questionId, selectedOptions) => {
      set((state) => {
        // Normalize to array for consistent handling
        const optionsArray = Array.isArray(selectedOptions) 
          ? selectedOptions 
          : [selectedOptions];
        
        logger.debug('[ExamStore] Question answered', { 
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
    
    /**
     * Toggle the flagged status of a question
     */
    toggleFlagQuestion: (questionId) => {
      set((state) => {
        const newFlagged = new Set(state.flaggedQuestions);
        
        if (newFlagged.has(questionId)) {
          newFlagged.delete(questionId);
          logger.debug('[ExamStore] Question unflagged', { questionId });
        } else {
          newFlagged.add(questionId);
          logger.debug('[ExamStore] Question flagged', { questionId });
        }
        
        return { flaggedQuestions: newFlagged };
      });
    },
    
    /**
     * Navigate to a specific question by index
     */
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
        
        logger.debug('[ExamStore] Navigated to question', { index });
      } else {
        logger.warn('[ExamStore] Invalid navigation attempt', { 
          index, 
          questionsLength: questions.length 
        });
      }
    },
    
    /**
     * Navigate to the next question
     */
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
        
        logger.debug('[ExamStore] Navigated to next question', { 
          from: currentQuestionIndex, 
          to: newIndex 
        });
      } else {
        logger.debug('[ExamStore] Already at last question', { 
          currentIndex: currentQuestionIndex 
        });
      }
    },
    
    /**
     * Navigate to the previous question
     */
    previousQuestion: () => {
      const { currentQuestionIndex } = get();
      
      if (currentQuestionIndex > 0) {
        const newIndex = currentQuestionIndex - 1;
        set({ currentQuestionIndex: newIndex });
        
        logger.debug('[ExamStore] Navigated to previous question', { 
          from: currentQuestionIndex, 
          to: newIndex 
        });
      } else {
        logger.debug('[ExamStore] Already at first question', { 
          currentIndex: currentQuestionIndex 
        });
      }
    },
    
    /**
     * Pause the exam timer
     */
    pauseExam: () => {
      set({ isPaused: true });
      logger.debug('[ExamStore] Exam paused');
    },
    
    /**
     * Resume the exam timer
     */
    resumeExam: () => {
      set({ isPaused: false });
      logger.debug('[ExamStore] Exam resumed');
    },
    
    /**
     * Decrement the timer by 1 second
     */
    decrementTimer: () => {
      set((state) => {
        // Don't decrement if paused or already at 0
        if (state.isPaused || state.timeRemaining <= 0) {
          return state;
        }
        
        const newTimeRemaining = Math.max(0, state.timeRemaining - 1);
        
        // Check if the timer reached 0
        if (newTimeRemaining === 0 && state.timeRemaining > 0) {
          logger.info('[ExamStore] Exam time expired');
          
          // Consider auto-completing the exam when time expires
          // This could be made configurable
          return { 
            timeRemaining: 0,
            isCompleted: true,
            endTime: new Date().toISOString(),
          };
        }
        
        // Log at regular intervals for debugging
        if (newTimeRemaining % 60 === 0) {
          logger.debug('[ExamStore] Timer update', { 
            minutesRemaining: newTimeRemaining / 60 
          });
        }
        
        return { timeRemaining: newTimeRemaining };
      });
    },
    
    /**
     * Toggle the summary view
     */
    toggleSummary: () => {
      set((state) => ({ 
        showSummary: !state.showSummary 
      }));
      
      logger.debug('[ExamStore] Summary view toggled', { 
        showSummary: !get().showSummary 
      });
    },
    
    /**
     * Set the review mode
     */
    setReviewMode: (isReview) => {
      set({ reviewMode: isReview });
      logger.debug('[ExamStore] Review mode set', { 
        reviewMode: isReview 
      });
    },
    
    /**
     * Mark the exam as completed
     */
    completeExam: () => {
      set({ 
        isCompleted: true,
        endTime: new Date().toISOString(),
      });
      
      // Calculate final statistics for logging
      const state = get();
      const answeredCount = state.getAnsweredQuestionsCount();
      const totalQuestions = state.questions.length;
      const completionPercentage = state.getCompletionPercentage();
      
      logger.info('[ExamStore] Exam completed', { 
        examId: state.examId,
        attemptId: state.attemptId,
        answeredQuestions: answeredCount,
        totalQuestions,
        completionPercentage,
        timeSpent: state.startTime 
          ? Math.floor((Date.now() - new Date(state.startTime).getTime()) / 1000)
          : null
      });
    },
    
    /**
     * Set the loading state
     */
    setLoading: (isLoading) => {
      set({ isLoading });
      logger.debug('[ExamStore] Loading state changed', { isLoading });
    },
    
    /**
     * Set an error message
     */
    setError: (error) => {
      set({ error });
      if (error) {
        logger.error('[ExamStore] Error set', { error });
      } else {
        logger.debug('[ExamStore] Error cleared');
      }
    },
    
    /**
     * Check if a question has been answered
     */
    hasAnswer: (questionId) => {
      return !!get().answers[questionId];
    },
    
    /**
     * Check if a question is flagged
     */
    isFlagged: (questionId) => {
      return get().flaggedQuestions.has(questionId);
    },
    
    /**
     * Get the count of answered questions
     */
    getAnsweredQuestionsCount: () => {
      return Object.keys(get().answers).length;
    },
    
    /**
     * Get the count of flagged questions
     */
    getFlaggedQuestionsCount: () => {
      return get().flaggedQuestions.size;
    },
    
    /**
     * Get the completion percentage of the exam
     */
    getCompletionPercentage: () => {
      const { questions, answers } = get();
      if (questions.length === 0) return 0;
      return (Object.keys(answers).length / questions.length) * 100;
    },
    
    /**
     * Get the status of a question
     */
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
    
    /**
     * Get the formatted remaining time
     */
    getRemainingTimeFormatted: () => {
      return formatTimeVerbose(get().timeRemaining);
    },
    
    /**
     * Get detailed statistics about the exam
     */
    getExamStatistics: () => {
      const state = get();
      const { questions, answers, reviewMode } = state;
      
      // Count questions by status
      const statusCounts = {
        [QuestionStatus.UNANSWERED]: 0,
        [QuestionStatus.ANSWERED_PENDING]: 0,
        [QuestionStatus.ANSWERED_CORRECT]: 0,
        [QuestionStatus.ANSWERED_INCORRECT]: 0,
      };
      
      // Calculate statistics for each question
      questions.forEach(question => {
        const status = state.getQuestionStatus(question.id);
        statusCounts[status]++;
      });
      
      // Calculate total statistics
      const total = questions.length;
      const answered = state.getAnsweredQuestionsCount();
      const correct = statusCounts[QuestionStatus.ANSWERED_CORRECT];
      const incorrect = statusCounts[QuestionStatus.ANSWERED_INCORRECT];
      const unanswered = statusCounts[QuestionStatus.UNANSWERED];
      
      // Calculate score if in review mode
      let score = 0;
      let percentage = 0;
      let penalty = 0;
  
      if (reviewMode) {
        // Calculate score with penalty for incorrect answers
        const totalPoints = questions.reduce((sum, q) => sum + (q.pointValue || 1), 0);
        const earnedPoints = questions
          .filter(q => state.getQuestionStatus(q.id) === QuestionStatus.ANSWERED_CORRECT)
          .reduce((sum, q) => sum + (q.pointValue || 1), 0);
        
        // Apply penalty (-0.25 per incorrect answer)
        penalty = incorrect * 0.25;
        score = Math.max(0, earnedPoints - penalty);
        percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
      }
      
      // Calculate time spent
      let timeSpent = 0;
      if (state.startTime) {
        const endTime = state.endTime ? new Date(state.endTime) : new Date();
        const startTime = new Date(state.startTime);
        timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      }
      
      // Return statistics object
      return {
        total,
        answered,
        correct,
        incorrect,
        unanswered,
        score,
        percentage,
        penalty,
        timeSpent,
        statusCounts,
      };
    },
    
    /**
     * Reset the exam state to initial values
     */
    resetExam: () => {
      logger.info('[ExamStore] Exam state reset');
      set(initialState);
    },
    
    /**
     * Force a complete reset of the exam state
     * This includes clearing localStorage persistence
     */
    forceResetExamState: () => {
      logger.info('[ExamStore] Forcing complete exam state reset');
      
      // Try to clear persisted state in localStorage
      try {
        if (typeof window !== 'undefined') {
          // Remove persisted state by looking for exam-related keys
          const possibleKeys = [
            ExamStorageKeys.MAIN,
            ExamStorageKeys.LEGACY,
            ExamStorageKeys.DEPRECATED_1,
            ExamStorageKeys.DEPRECATED_2,
          ];
          
          // Try to remove known keys
          for (const key of possibleKeys) {
            try {
              localStorage.removeItem(key);
              logger.debug(`[ExamStore] Cleared persisted state for key: ${key}`);
            } catch (e) {
              // Ignore individual key errors
              logger.warn(`[ExamStore] Failed to clear localStorage for key ${key}:`, e);
            }
          }
        }
      } catch (error) {
        logger.error('[ExamStore] Failed to clear localStorage:', error);
      }
      
      // Reset the store state
      set(initialState);
    },
  }),
  {
    persist: true,
    storageKey: ExamStorageKeys.MAIN,
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
          logger.error('[ExamStore] Error rehydrating exam store:', error);
        } else if (rehydratedState) {
          try {
            // Convert arrays back to Sets after rehydration
            rehydratedState.flaggedQuestions = new Set(
              rehydratedState.flaggedQuestions || []
            );
            rehydratedState.visitedQuestions = new Set(
              rehydratedState.visitedQuestions || []
            );
            
            logger.debug('[ExamStore] Exam store rehydrated successfully', {
              examId: rehydratedState.examId,
              questionsCount: rehydratedState.questions?.length || 0,
              answersCount: Object.keys(rehydratedState.answers || {}).length,
              timeRemaining: rehydratedState.timeRemaining,
            });
          } catch (conversionError) {
            logger.error('[ExamStore] Error converting arrays to Sets after rehydration:', conversionError);
          }
        } else {
          logger.debug('[ExamStore] No state to rehydrate');
        }
      };
    },
  }
);

/**
 * Export the store type for easier usage in components
 */
export type ExamStoreType = ExtractState<typeof useExamStore>;

/**
 * Create selectors for better performance and component optimization
 */
export const { createSelector } = createSelectors(useExamStore);

/**
 * Get the current exam ID
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when examId changes
 * const ExamInfo = () => {
 *   const examId = useExamId();
 *   return <div>Current Exam: {examId}</div>;
 * };
 * ```
 */
export const useExamId = createSelector(state => state.examId);

/**
 * Get the current attempt ID
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when attemptId changes
 * const AttemptInfo = () => {
 *   const attemptId = useAttemptId();
 *   return <div>Attempt ID: {attemptId}</div>;
 * };
 * ```
 */
export const useAttemptId = createSelector(state => state.attemptId);

/**
 * Get the current question
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when the current question changes
 * const QuestionDisplay = () => {
 *   const question = useCurrentQuestion();
 *   return <div>{question?.text}</div>;
 * };
 * ```
 */
export const useCurrentQuestion = createSelector(state => {
  const { questions, currentQuestionIndex } = state;
  return questions[currentQuestionIndex];
});

/**
 * Get exam progress information
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when progress changes
 * const ProgressBar = () => {
 *   const { current, total, percentage } = useExamProgress();
 *   return (
 *     <div>
 *       Question {current} of {total} ({percentage.toFixed(0)}% complete)
 *     </div>
 *   );
 * };
 * ```
 */
export const useExamProgress = createSelector(state => ({
  current: state.currentQuestionIndex + 1,
  total: state.questions.length,
  percentage: state.getCompletionPercentage(),
  answered: state.getAnsweredQuestionsCount(),
  flagged: state.getFlaggedQuestionsCount(),
}));

/**
 * Get exam timer information
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when timer changes
 * const TimerDisplay = () => {
 *   const { formatted, isPaused } = useExamTimer();
 *   return (
 *     <div>
 *       Time Remaining: {formatted}
 *       {isPaused && <span> (Paused)</span>}
 *     </div>
 *   );
 * };
 * ```
 */
export const useExamTimer = createSelector(state => ({
  timeRemaining: state.timeRemaining,
  formatted: state.getRemainingTimeFormatted(),
  isPaused: state.isPaused,
  startTime: state.startTime,
  endTime: state.endTime,
}));

/**
 * Get exam navigation information
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when navigation state changes
 * const NavigationControls = () => {
 *   const { currentIndex, hasNext, hasPrevious, goToNext, goToPrevious } = useExamNavigation();
 *   return (
 *     <div>
 *       <button onClick={goToPrevious} disabled={!hasPrevious}>Previous</button>
 *       <span>Question {currentIndex + 1}</span>
 *       <button onClick={goToNext} disabled={!hasNext}>Next</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useExamNavigation = createSelector(state => ({
  currentIndex: state.currentQuestionIndex,
  hasNext: state.currentQuestionIndex < state.questions.length - 1,
  hasPrevious: state.currentQuestionIndex > 0,
  goToNext: state.nextQuestion,
  goToPrevious: state.previousQuestion,
  goToQuestion: state.navigateToQuestion,
}));

/**
 * Get all question statuses
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when question statuses change
 * const StatusOverview = () => {
 *   const statuses = useQuestionStatuses();
 *   return (
 *     <div>
 *       {Object.entries(statuses).map(([id, status]) => (
 *         <div key={id}>Question {id}: {status}</div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useQuestionStatuses = createSelector(state => {
  const { questions, getQuestionStatus } = state;
  return questions.reduce((acc, question) => {
    acc[question.id] = getQuestionStatus(question.id);
    return acc;
  }, {} as Record<number, QuestionStatus>);
});

/**
 * Get exam status information
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when exam status changes
 * const ExamStatus = () => {
 *   const { isCompleted, isPaused, isLoading, error } = useExamStatus();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       Status: {isCompleted ? 'Completed' : isPaused ? 'Paused' : 'In Progress'}
 *     </div>
 *   );
 * };
 * ```
 */
export const useExamStatus = createSelector(state => ({
  isCompleted: state.isCompleted,
  isPaused: state.isPaused,
  isLoading: state.isLoading,
  error: state.error,
  showSummary: state.showSummary,
  reviewMode: state.reviewMode,
}));

/**
 * Get exam answers
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when answers change
 * const AnswersSummary = () => {
 *   const answers = useExamAnswers();
 *   return (
 *     <div>
 *       <h3>Your Answers</h3>
 *       {Object.entries(answers).map(([id, answer]) => (
 *         <div key={id}>
 *           Question {id}: {answer.selectedOptions.join(', ')}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useExamAnswers = createSelector(state => state.answers);

/**
 * Calculate statistics about the exam
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when statistics change
 * const ExamStatistics = () => {
 *   const stats = useExamStatistics();
 *   return (
 *     <div>
 *       <div>Total Questions: {stats.total}</div>
 *       <div>Answered: {stats.answered}</div>
 *       <div>Correct: {stats.correct}</div>
 *       <div>Incorrect: {stats.incorrect}</div>
 *       <div>Unanswered: {stats.unanswered}</div>
 *       <div>Score: {stats.score.toFixed(2)} ({stats.percentage.toFixed(2)}%)</div>
 *       <div>Time Spent: {formatTimeVerbose(stats.timeSpent)}</div>
 *     </div>
 *   );
 * };
 * ```
 */
export const useExamStatistics = createSelector(
  state => state.getExamStatistics()
);

/**
 * Get all questions with their statuses
 * 
 * @example
 * ```tsx
 * // Component that only re-renders when questions or their statuses change
 * const QuestionList = () => {
 *   const questions = useQuestionsWithStatuses();
 *   return (
 *     <div>
 *       {questions.map(q => (
 *         <div key={q.id}>
 *           Question {q.id}: {q.text} - {q.status}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useQuestionsWithStatuses = createSelector(state => {
  const { questions, getQuestionStatus, answers } = state;
  return questions.map(question => ({
    ...question,
    status: getQuestionStatus(question.id),
    userAnswer: answers[question.id],
  }));
});

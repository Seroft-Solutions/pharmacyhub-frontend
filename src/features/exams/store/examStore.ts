import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question, ExamSession, UserAnswer } from '../model/mcqTypes';
import logger from '@/shared/lib/logger';

// Create a throttled storage adapter to prevent excessive localStorage operations
const throttledStorage = {
  getItem: createJSONStorage(() => localStorage).getItem,
  setItem: (name: string, value: string) => {
    // Use a debounce technique with setTimeout for better performance
    if (typeof window !== 'undefined') {
      // Clear any existing timeout to prevent multiple pending updates
      const existingTimeout = (window as any).__EXAM_STORAGE_TIMEOUT;
      if (existingTimeout) {
        window.clearTimeout(existingTimeout);
      }
      
      // Set a new timeout to batch localStorage updates
      (window as any).__EXAM_STORAGE_TIMEOUT = window.setTimeout(() => {
        localStorage.setItem(name, value);
        (window as any).__EXAM_STORAGE_TIMEOUT = null;
      }, 500); // 500ms debounce time
    }
  },
  removeItem: createJSONStorage(() => localStorage).removeItem
};

interface ExamState {
  // Exam data
  examId?: number;
  attemptId?: number;
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  startTime?: Date;
  endTime?: Date;
  
  // User interactions
  answers: Record<number, UserAnswer>;
  flaggedQuestions: Set<number>;
  visitedQuestions: Set<number>;
  
  // UI state
  isPaused: boolean;
  isCompleted: boolean;
  showSummary: boolean;
  reviewMode: boolean;
  
  // Actions
  startExam: (examId: number, questions: Question[], durationInMinutes: number) => void;
  setAttemptId: (attemptId: number) => void;
  answerQuestion: (questionId: number, optionIndex: number) => void;
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
  resetExam: () => void;
  forceResetExamState: () => void; // New method for complete reset including localStorage
  
  // Getters
  hasAnswer: (questionId: number) => boolean;
  isFlagged: (questionId: number) => boolean;
  getAnsweredQuestionsCount: () => number;
  getFlaggedQuestionsCount: () => number;
  getCompletionPercentage: () => number;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial state
      questions: [],
      currentQuestionIndex: 0,
      timeRemaining: 0,
      answers: {},
      flaggedQuestions: new Set<number>(),
      visitedQuestions: new Set<number>(),
      isPaused: false,
      isCompleted: false,
      showSummary: false,
      reviewMode: false,
      
      // Actions
      startExam: (examId, questions, durationInMinutes) => {
        // First, force a complete state reset including localStorage
        get().forceResetExamState();
        
        // Then set the new exam state
        set({
          examId,
          questions,
          timeRemaining: durationInMinutes * 60,
          currentQuestionIndex: 0,
          startTime: new Date(),
          answers: {},
          flaggedQuestions: new Set<number>(),
          visitedQuestions: new Set<number>([0]), // Mark first question as visited
          isPaused: false,
          isCompleted: false,
          showSummary: false,
          reviewMode: false,
        });
      },
      
      setAttemptId: (attemptId) => {
        set({ attemptId });
      },
      
      answerQuestion: (questionId, optionIndex) => {
        set((state) => {
          // Calculate time spent on this question
          const timeSpent = 0; // Implement time tracking per question if needed
          
          return {
            answers: {
              ...state.answers,
              [questionId]: { 
                questionId, 
                selectedOption: optionIndex,
                timeSpent
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
          } else {
            newFlagged.add(questionId);
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
        }
      },
      
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },
      
      pauseExam: () => set({ isPaused: true }),
      
      resumeExam: () => set({ isPaused: false }),
      
      decrementTimer: () => {
        set((state) => ({
          timeRemaining: Math.max(0, state.timeRemaining - 1)
        }));
      },
      
      toggleSummary: () => {
        set((state) => ({ showSummary: !state.showSummary }));
      },
      
      setReviewMode: (isReview) => {
        set({ reviewMode: isReview });
      },
      
      completeExam: () => {
        set({ 
          isCompleted: true,
          endTime: new Date() 
        });
      },
      
      resetExam: () => {
        set({
          examId: undefined,
          attemptId: undefined,
          questions: [],
          currentQuestionIndex: 0,
          timeRemaining: 0,
          startTime: undefined,
          endTime: undefined,
          answers: {},
          flaggedQuestions: new Set<number>(),
          visitedQuestions: new Set<number>(),
          isPaused: false,
          isCompleted: false,
          showSummary: false,
          reviewMode: false,
        });
      },
      
      forceResetExamState: () => {
        logger.info('examStore: Forcing complete exam state reset');
        
        // 1. Clear any persisted state in localStorage
        try {
          if (typeof window !== 'undefined') {
            // Remove any persisted state in localStorage by looking for exam-related keys
            const possibleKeys = [
              'exam-store',
              'exam-store-state',
              'mcq-exam-store',
              'mcq-exam-store-state',
              'examStore',
              'useExamStore',
              'mcqExamStore',
              'useMcqExamStore',
              'zustand-exam',
              'zustand-mcq'
            ];
            
            // Try to remove known keys
            for (const key of possibleKeys) {
              try {
                localStorage.removeItem(key);
                logger.debug(`examStore: Cleared persisted state for key: ${key}`);
              } catch (e) {
                // Ignore individual key errors
              }
            }
            
            // Also try to find and remove any keys containing 'exam' or 'mcq'
            try {
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.toLowerCase().includes('exam') || key.toLowerCase().includes('mcq'))) {
                  localStorage.removeItem(key);
                  logger.debug(`examStore: Cleared matching state for key: ${key}`);
                }
              }
            } catch (e) {
              logger.warn('examStore: Failed to search localStorage keys:', e);
            }
          }
        } catch (error) {
          logger.error('examStore: Failed to clear localStorage:', error);
        }
        
        // 2. Reset the store state
        get().resetExam();
        
        // 3. Also try to reset mcqExamStore if it exists
        try {
          if (typeof window !== 'undefined' && window['useMcqExamStore'] && typeof window['useMcqExamStore'].getState === 'function') {
            // Use as any type since we're dynamically accessing it
            const mcqStore = (window['useMcqExamStore'] as any);
            if (mcqStore.getState().resetExam) {
              mcqStore.getState().resetExam();
              logger.debug('examStore: Reset mcqExamStore state');
            }
          }
        } catch (error) {
          logger.warn('examStore: Failed to reset mcqExamStore:', error);
        }
        
        logger.info('examStore: State reset completed');
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
    }),
    {
      name: 'exam-store',
      storage: createJSONStorage(() => throttledStorage),
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
      onRehydrateStorage: (state) => {
        // Convert arrays back to Sets after rehydration
        if (state) {
          return (rehydratedState, error) => {
            if (error) {
              console.error('Error rehydrating exam store:', error);
            } else if (rehydratedState) {
              // Convert arrays back to Sets
              rehydratedState.flaggedQuestions = new Set(rehydratedState.flaggedQuestions || []);
              rehydratedState.visitedQuestions = new Set(rehydratedState.visitedQuestions || []);
            }
          };
        }
      },
    }
  )
);

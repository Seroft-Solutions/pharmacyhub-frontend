import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question, ExamSession, UserAnswer } from '../model/mcqTypes';
import { throttledStorage } from '@/features/core/storage';
import logger from '@/shared/lib/logger';

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
  hasUnsavedChanges: boolean; // Track unsaved changes
  
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
  markChangesUnsaved: () => void; // Mark that there are unsaved changes
  markChangesSaved: () => void; // Mark that changes have been saved
  saveExamProgress: () => Promise<boolean>; // Save exam progress to server
  
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
      hasUnsavedChanges: false,
      
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
          hasUnsavedChanges: false,
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
            hasUnsavedChanges: true, // Mark changes as unsaved
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
          return { 
            flaggedQuestions: newFlagged,
            hasUnsavedChanges: true // Mark changes as unsaved
          };
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
          hasUnsavedChanges: false,
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
      
      // Methods for tracking changes
      markChangesUnsaved: () => set({ hasUnsavedChanges: true }),
      
      markChangesSaved: () => set({ hasUnsavedChanges: false }),
      
      // Save exam progress to server
      saveExamProgress: async () => {
        try {
          const { attemptId, answers, flaggedQuestions } = get();
          
          if (!attemptId) {
            console.error('Cannot save progress: No active attempt');
            return false;
          }
          
          // Convert flaggedQuestions set to array
          const flaggedArray = [...flaggedQuestions].map(id => ({ questionId: id }));
          
          // Convert answers object to array of { questionId, selectedOption }
          const answersArray = Object.entries(answers).map(([questionId, data]) => ({
            questionId: parseInt(questionId, 10),
            selectedOption: data.selectedOption
          }));
          
          // Make API calls to save answers and flags
          const saveAnswersPromise = fetch(`/api/v1/exams/attempts/${attemptId}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answersArray)
          });
          
          const saveFlagsPromise = fetch(`/api/v1/exams/attempts/${attemptId}/flags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flaggedArray)
          });
          
          // Wait for both API calls to complete
          const [answersResponse, flagsResponse] = await Promise.all([
            saveAnswersPromise,
            saveFlagsPromise
          ]);
          
          // Check if both calls were successful
          const success = answersResponse.ok && flagsResponse.ok;
          
          if (success) {
            // Mark changes as saved
            set({ hasUnsavedChanges: false });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Error saving exam progress:', error);
          return false;
        }
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
        hasUnsavedChanges: state.hasUnsavedChanges,
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

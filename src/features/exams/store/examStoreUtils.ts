'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import logger from '@/shared/lib/logger';

// Define the exam state interface
interface ExamState {
  // Core state
  examId: number | null;
  userId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  // UI state
  showExplanation: boolean;
  highlightedAnswerId: number | null;

  // Helper functions
  onTryAgain: () => void;
}

// Define the actions interface
interface ExamActions {
  // Core actions
  setExamId: (examId: number) => void;
  setUserId: (userId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  
  // UI actions
  setShowExplanation: (show: boolean) => void;
  setHighlightedAnswerId: (id: number | null) => void;
  resetQuestionUI: () => void;
  
  // Helper actions
  setOnTryAgain: (callback: () => void) => void;
  
  // Reset actions
  resetExamState: () => void;
  forceResetExamState: () => void;
}

// Create the combined interface
type ExamStore = ExamState & ExamActions;

// Create the initial state
const initialState: ExamState = {
  examId: null,
  userId: null,
  isLoading: false,
  error: null,
  showExplanation: false,
  highlightedAnswerId: null,
  onTryAgain: () => {
    logger.info('Default onTryAgain called - no implementation provided');
  },
};

// Create the store with persistence
export const useExamStore = create<ExamStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Core actions
      setExamId: (examId) => set({ examId }),
      setUserId: (userId) => set({ userId }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // UI actions
      setShowExplanation: (showExplanation) => set({ showExplanation }),
      setHighlightedAnswerId: (highlightedAnswerId) => set({ highlightedAnswerId }),
      resetQuestionUI: () => {
        logger.debug('Resetting question UI state');
        set({ 
          showExplanation: false,
          highlightedAnswerId: null
        });
      },
      
      // Helper actions
      setOnTryAgain: (callback) => set({ onTryAgain: callback }),
      
      // Reset actions
      resetExamState: () => {
        logger.info('Resetting exam state');
        set(initialState);
      },
      
      forceResetExamState: () => {
        logger.info('Force resetting exam state and clearing localStorage');
        
        // Clear localStorage keys related to exams
        if (typeof window !== 'undefined') {
          try {
            // Clear specific known keys
            const keysToRemove = [
              'exam-store',
              'mcq-exam-store',
              'zustand-exam-store',
              'zustand-mcq-store'
            ];
            
            for (const key of keysToRemove) {
              try {
                localStorage.removeItem(key);
                logger.debug(`Cleared persisted state for key: ${key}`);
              } catch (e) {
                // Ignore individual key errors
              }
            }
          } catch (err) {
            logger.warn('Failed to clear localStorage:', err);
          }
        }
        
        // Reset state
        set(initialState);
      }
    }),
    {
      name: 'exam-store',
      partialize: (state) => ({
        examId: state.examId,
        userId: state.userId,
      }),
    }
  )
);

// Create selectors for derived state
export const selectExamId = (state: ExamState) => state.examId;
export const selectUserId = (state: ExamState) => state.userId;
export const selectIsLoading = (state: ExamState) => state.isLoading;
export const selectError = (state: ExamState) => state.error;
export const selectShowExplanation = (state: ExamState) => state.showExplanation;
export const selectHighlightedAnswerId = (state: ExamState) => state.highlightedAnswerId;
export const selectOnTryAgain = (state: ExamState) => state.onTryAgain;
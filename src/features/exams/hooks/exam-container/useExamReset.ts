/**
 * useExamReset Hook
 * 
 * A custom hook that centralizes the logic for resetting the exam state.
 */

import { useCallback } from 'react';
import logger from '@/shared/lib/logger';
import { useExamStore } from '../../store/examStore';
import { useMcqExamStore } from '../../store/mcqExamStore';
import { resetLocalStorageExamState } from '../../utils/examUtils';

/**
 * Hook for managing exam state reset operations
 */
export function useExamReset() {
  /**
   * Reset exam state
   * 
   * Performs a complete reset of exam state across stores and localStorage
   */
  const resetExamState = useCallback(() => {
    logger.info('Performing complete exam state reset');
    
    try {
      // First, try to reset through examStore which has our enhanced method
      if (typeof useExamStore !== 'undefined' && useExamStore.getState().forceResetExamState) {
        useExamStore.getState().forceResetExamState();
        logger.debug('Reset exam state through forceResetExamState');
      } else {
        // Clear localStorage
        resetLocalStorageExamState();
        
        // Manually reset each store
        if (typeof useExamStore !== 'undefined' && useExamStore.getState().resetExam) {
          useExamStore.getState().resetExam();
          logger.debug('Reset exam state through resetExam');
        }
        
        if (typeof useMcqExamStore !== 'undefined' && useMcqExamStore.getState().resetExam) {
          useMcqExamStore.getState().resetExam();
          logger.debug('Reset exam state through mcqExamStore.resetExam');
        }
        
        if (typeof useMcqExamStore !== 'undefined' && useMcqExamStore.getState().resetExamState) {
          useMcqExamStore.getState().resetExamState();
          logger.debug('Reset exam state through mcqExamStore.resetExamState');
        }
      }
    } catch (error) {
      logger.warn('Error during manual exam state reset:', error);
    }
  }, []);

  return { resetExamState };
}

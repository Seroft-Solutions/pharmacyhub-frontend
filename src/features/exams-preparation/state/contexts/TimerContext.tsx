/**
 * Timer Context Provider
 * 
 * This context provides state and actions for managing exam timers,
 * including pausing, resuming, and tracking the remaining time.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TimerContextType } from '../../types/state/exam-state';
import { createContextProvider } from '../contextFactory';
import { useExamStore } from '../stores/examStore';
import { formatTime } from '../../utils';

// Initial state for the timer context
const initialTimerContext: TimerContextType = {
  timeRemaining: 0,
  totalTime: 0,
  isPaused: false,
  isExpired: false,
  pauseTimer: () => {},
  resumeTimer: () => {},
  resetTimer: () => {},
};

// Create the context provider and hook
const [TimerProvider, useTimerContextBase] = createContextProvider<
  Omit<TimerContextType, 'pauseTimer' | 'resumeTimer' | 'resetTimer'>,
  Pick<TimerContextType, 'pauseTimer' | 'resumeTimer' | 'resetTimer'>
>(
  'Timer',
  {
    timeRemaining: 0,
    totalTime: 0,
    isPaused: false,
    isExpired: false,
  },
  (setState) => {
    return {
      pauseTimer: () => {
        setState((state) => ({
          ...state,
          isPaused: true,
        }));
      },
      
      resumeTimer: () => {
        setState((state) => ({
          ...state,
          isPaused: false,
        }));
      },
      
      resetTimer: (seconds) => {
        setState((state) => ({
          ...state,
          timeRemaining: seconds,
          totalTime: seconds,
          isPaused: false,
          isExpired: false,
        }));
      },
    };
  },
  {
    displayName: 'TimerContext',
  }
);

/**
 * Timer Context Provider with Exam Store integration
 * 
 * This is the main export that connects the timer context with the exam store.
 */
export const TimerContextProvider: React.FC<{
  children: ReactNode;
  onTimeExpired?: () => void;
}> = ({ children, onTimeExpired }) => {
  // Get timer state from the exam store
  const { 
    timeRemaining, 
    isPaused, 
    decrementTimer,
    pauseExam,
    resumeExam,
    updateTimeRemaining,
    isCompleted,
  } = useExamStore();
  
  // Remember the total time when the timer starts
  const [totalTime, setTotalTime] = useState(timeRemaining);
  
  // When the time remaining changes and it's greater than the total time,
  // update the total time (e.g., when a new exam starts)
  useEffect(() => {
    if (timeRemaining > totalTime) {
      setTotalTime(timeRemaining);
    }
  }, [timeRemaining, totalTime]);
  
  // Calculate if the timer has expired
  const isExpired = timeRemaining <= 0;
  
  // Set up the timer interval
  useEffect(() => {
    // Don't run the timer if it's paused, expired, or the exam is completed
    if (isPaused || isExpired || isCompleted) {
      return;
    }
    
    // Set up interval to decrement the timer
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    
    // Call the onTimeExpired callback when the timer reaches 0
    if (isExpired && onTimeExpired) {
      onTimeExpired();
    }
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [
    isPaused,
    isExpired,
    isCompleted,
    decrementTimer,
    onTimeExpired,
  ]);
  
  // Set up action handlers that use the exam store
  const handlePauseTimer = useCallback(() => {
    pauseExam();
  }, [pauseExam]);
  
  const handleResumeTimer = useCallback(() => {
    resumeExam();
  }, [resumeExam]);
  
  const handleResetTimer = useCallback(
    (seconds: number) => {
      updateTimeRemaining(seconds);
      setTotalTime(seconds);
    },
    [updateTimeRemaining]
  );
  
  // Provide the context value with store integration
  const contextValue = {
    timeRemaining,
    totalTime,
    isPaused,
    isExpired,
    pauseTimer: handlePauseTimer,
    resumeTimer: handleResumeTimer,
    resetTimer: handleResetTimer,
  };
  
  return <TimerProvider initialState={contextValue}>{children}</TimerProvider>;
};

// Create a hook that adds additional timer utilities
export const useTimerContext = () => {
  const context = useTimerContextBase();
  
  // Add formatted time utilities
  const formattedTimeRemaining = formatTime(context.timeRemaining);
  const percentageRemaining = 
    context.totalTime > 0 ? (context.timeRemaining / context.totalTime) * 100 : 0;
  
  return {
    ...context,
    formattedTimeRemaining,
    percentageRemaining,
  };
};

// Default export for convenience
export default TimerContextProvider;

/**
 * Exam Timer Hook
 * 
 * This hook provides timer functionality for exams, including
 * countdown, formatting, and time tracking.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime, formatTimeVerbose } from '../utils';

interface ExamTimerOptions {
  initialTime?: number; // Time in seconds
  autoStart?: boolean;
  onTimeExpired?: () => void;
  onTick?: (remainingTime: number) => void;
}

interface ExamTimer {
  // Timer state
  timeRemaining: number;
  formattedTime: string;
  formattedTimeVerbose: string;
  isRunning: boolean;
  isExpired: boolean;
  progress: number; // 0-100 percentage
  
  // Timer controls
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: (newTime?: number) => void;
  addTime: (seconds: number) => void;
}

/**
 * Hook for exam timer functionality
 */
export const useExamTimer = ({
  initialTime = 3600, // Default 1 hour
  autoStart = false,
  onTimeExpired,
  onTick,
}: ExamTimerOptions = {}): ExamTimer => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [totalTime, setTotalTime] = useState(initialTime);
  
  // Use ref for interval to ensure it can be cleared properly
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate if timer is expired
  const isExpired = timeRemaining <= 0;
  
  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Set up timer interval
  useEffect(() => {
    if (isRunning && !isExpired) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = Math.max(0, prevTime - 1);
          
          // Call onTick callback if provided
          if (onTick) {
            onTick(newTime);
          }
          
          // Check if timer expired
          if (newTime === 0 && onTimeExpired) {
            onTimeExpired();
            setIsRunning(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isExpired, onTimeExpired, onTick]);
  
  // Timer control functions
  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const resumeTimer = useCallback(() => {
    if (!isExpired) {
      setIsRunning(true);
    }
  }, [isExpired]);
  
  const resetTimer = useCallback((newTime?: number) => {
    const time = newTime ?? initialTime;
    setTimeRemaining(time);
    setTotalTime(time);
    setIsRunning(false);
  }, [initialTime]);
  
  const addTime = useCallback((seconds: number) => {
    setTimeRemaining((prevTime) => prevTime + seconds);
  }, []);
  
  // Calculate progress percentage
  const progress = Math.min(100, Math.max(0, (timeRemaining / totalTime) * 100));
  
  // Format time for display
  const formattedTime = formatTime(timeRemaining);
  const formattedTimeVerbose = formatTimeVerbose(timeRemaining);
  
  return {
    timeRemaining,
    formattedTime,
    formattedTimeVerbose,
    isRunning,
    isExpired,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime,
  };
};

export default useExamTimer;

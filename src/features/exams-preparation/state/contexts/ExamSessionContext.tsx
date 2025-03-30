/**
 * ExamSession context for managing exam timing and session state
 */

import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { ExamSessionContextType } from '../../types/state/exam-state';
import { createContextProvider } from '../contextFactory';

/**
 * Create the exam session context provider for managing timing and session state
 */
export const [ExamSessionProvider, useExamSession] = createContextProvider<
  {
    isTimerActive: boolean;
    remainingTime: number | null; // in seconds
    elapsedTime: number; // in seconds
  },
  {
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: (duration: number) => void;
    setElapsedTime: (time: number) => void;
  }
>(
  'ExamSession', // Context name
  {
    isTimerActive: false,
    remainingTime: null,
    elapsedTime: 0,
  },
  (setState) => ({
    // Start the timer
    startTimer: () => setState((state) => ({
      ...state,
      isTimerActive: true,
    })),
    
    // Pause the timer
    pauseTimer: () => setState((state) => ({
      ...state,
      isTimerActive: false,
    })),
    
    // Reset the timer with a new duration
    resetTimer: (duration: number) => setState((state) => ({
      ...state,
      remainingTime: duration,
      isTimerActive: false,
      elapsedTime: 0,
    })),

    // Update elapsed time
    setElapsedTime: (time: number) => setState((state) => ({
      ...state,
      elapsedTime: time,
    })),
  }),
  {
    displayName: 'ExamSessionContext',
  }
);

/**
 * Extended exam session provider that handles timer ticking
 */
export const ExamTimerProvider: React.FC<{
  children: ReactNode;
  initialTime?: number;
  onTimeExpired?: () => void;
}> = ({ 
  children, 
  initialTime = null,
  onTimeExpired,
}) => {
  // Last tick time reference
  const lastTickTimeRef = useRef<number | null>(null);
  
  // Function to handle timer tick
  const handleTimerTick = useCallback((
    isActive: boolean,
    remainingTime: number | null,
    elapsedTime: number,
    setElapsedTime: (time: number) => void
  ) => {
    if (!isActive) {
      lastTickTimeRef.current = null;
      return;
    }
    
    const now = Date.now();
    
    if (lastTickTimeRef.current === null) {
      lastTickTimeRef.current = now;
      return;
    }
    
    const deltaTime = Math.floor((now - lastTickTimeRef.current) / 1000);
    
    if (deltaTime >= 1) {
      // Update elapsed time
      const newElapsedTime = elapsedTime + deltaTime;
      setElapsedTime(newElapsedTime);
      
      // Update remaining time if it exists
      if (remainingTime !== null) {
        const newRemainingTime = Math.max(0, remainingTime - deltaTime);
        
        if (newRemainingTime === 0 && remainingTime > 0 && onTimeExpired) {
          onTimeExpired();
        }
      }
      
      lastTickTimeRef.current = now;
    }
  }, [onTimeExpired]);
  
  // Use the session context
  return (
    <ExamSessionProvider initialState={{ remainingTime: initialTime }}>
      <TimerEffect onTick={handleTimerTick} />
      {children}
    </ExamSessionProvider>
  );
};

/**
 * Effect component to handle timer ticking
 */
const TimerEffect: React.FC<{
  onTick: (
    isActive: boolean,
    remainingTime: number | null,
    elapsedTime: number,
    setElapsedTime: (time: number) => void
  ) => void;
}> = ({ onTick }) => {
  const { isTimerActive, remainingTime, elapsedTime, setElapsedTime } = useExamSession();
  
  // Set up timer interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      onTick(isTimerActive, remainingTime, elapsedTime, setElapsedTime);
    }, 500); // Check twice per second for smoother updates
    
    return () => clearInterval(intervalId);
  }, [isTimerActive, remainingTime, elapsedTime, setElapsedTime, onTick]);
  
  return null;
};

/**
 * Hook to format the time to display
 */
export const useFormattedTime = (timeInSeconds: number | null): string => {
  if (timeInSeconds === null) return '--:--';
  
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Example usage of the ExamSessionContext:
 * 
 * ```tsx
 * const ExamTimer = () => {
 *   const { remainingTime, isTimerActive, startTimer, pauseTimer } = useExamSession();
 *   const formattedTime = useFormattedTime(remainingTime);
 *   
 *   return (
 *     <div>
 *       <div>Time Remaining: {formattedTime}</div>
 *       <button onClick={isTimerActive ? pauseTimer : startTimer}>
 *         {isTimerActive ? 'Pause' : 'Resume'}
 *       </button>
 *     </div>
 *   );
 * };
 * 
 * // In the parent component:
 * <ExamTimerProvider initialTime={1800} onTimeExpired={() => console.log('Time expired!')}>
 *   <ExamTimer />
 *   <ExamContent />
 * </ExamTimerProvider>
 * ```
 */

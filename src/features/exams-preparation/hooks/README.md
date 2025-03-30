# Exams Preparation Hooks

This directory contains custom React hooks specific to the exams-preparation feature.

## Purpose

- Encapsulate and reuse stateful logic across components
- Separate concerns between UI and business logic
- Provide a consistent interface for common operations

## Guidelines

1. Keep hooks focused on a single responsibility
2. Follow React hooks naming convention (use* prefix)
3. Document parameters and return values
4. Leverage core hooks when possible
5. Handle errors appropriately
6. Write unit tests for hooks

## Example Structure

```
hooks/
  useExamTimer.ts         # Hook for managing exam timing
  useExamNavigation.ts    # Hook for question navigation
  useExamSubmission.ts    # Hook for handling exam submission
  useExamProgress.ts      # Hook for tracking progress
  index.ts                # Public exports
```

## Example Usage

```tsx
// Example hook
function useExamTimer(durationInMinutes: number, onTimeExpired: () => void) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Start timer logic
  const startTimer = () => {
    setIsRunning(true);
  };

  // Pause timer logic
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            onTimeExpired();
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining, onTimeExpired]);

  return {
    secondsRemaining,
    isRunning,
    startTimer,
    pauseTimer,
    formattedTime: formatTime(secondsRemaining),
  };
}
```

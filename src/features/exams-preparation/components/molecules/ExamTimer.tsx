// ExamTimer.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { TimeRemainingComponent } from '../atoms/TimeRemainingComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, PauseCircle, PlayCircle } from 'lucide-react';

interface ExamTimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  allowPause?: boolean;
  autoStart?: boolean;
  className?: string;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  duration,
  onTimeUp,
  allowPause = false,
  autoStart = true,
  className = '',
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);

  // Handle timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0 && onTimeUp) {
            onTimeUp();
          }
          return Math.max(0, newTime);
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeRemaining, onTimeUp]);

  // Handle pause/resume
  const togglePause = useCallback(() => {
    if (allowPause) {
      setIsRunning(!isRunning);
      setIsPaused(!isPaused);
    }
  }, [allowPause, isRunning, isPaused]);

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <TimeRemainingComponent 
            timeRemaining={timeRemaining} 
            variant="large" 
          />
        </div>
        
        {allowPause && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePause}
            className="ml-4"
          >
            {isPaused ? (
              <PlayCircle className="h-4 w-4 mr-1" />
            ) : (
              <PauseCircle className="h-4 w-4 mr-1" />
            )}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamTimer;

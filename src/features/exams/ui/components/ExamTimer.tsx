'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play, Clock } from 'lucide-react';

interface ExamTimerProps {
  durationInMinutes: number;
  onTimeExpired: () => void;
  allowPause?: boolean;
}

export function ExamTimer({
  durationInMinutes,
  onTimeExpired,
  allowPause = false,
}: ExamTimerProps) {
  // Convert duration to seconds
  const totalSeconds = durationInMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate percentage of time remaining
  const percentageRemaining = (timeRemaining / totalSeconds) * 100;
  
  // Determine color based on percentage remaining
  const getTimerColor = () => {
    if (percentageRemaining > 50) return 'text-green-500';
    if (percentageRemaining > 25) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Handle timer tick
  const tick = useCallback(() => {
    setTimeRemaining((prevTime) => {
      if (prevTime <= 1) {
        onTimeExpired();
        return 0;
      }
      return prevTime - 1;
    });
  }, [onTimeExpired]);
  
  // Toggle pause state
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };
  
  // Set up timer
  useEffect(() => {
    if (isPaused) return;
    
    const timerId = setInterval(tick, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timerId);
  }, [tick, isPaused]);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Clock className={`mr-2 h-5 w-5 ${getTimerColor()}`} />
          <span className={`font-mono text-lg font-bold ${getTimerColor()}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        
        {allowPause && (
          <Button
            size="sm"
            variant="ghost"
            onClick={togglePause}
            aria-label={isPaused ? "Resume timer" : "Pause timer"}
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

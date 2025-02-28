'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Pause, Play } from 'lucide-react';

interface ExamTimerProps {
  totalTime: number; // total time in seconds
  remainingTime: number; // remaining time in seconds
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onTimeUp: () => void;
}

export function ExamTimer({
  totalTime,
  remainingTime,
  isPaused,
  onPause,
  onResume,
  onTimeUp
}: ExamTimerProps) {
  // Calculate percentage of time remaining
  const progressPercentage = (remainingTime / totalTime) * 100;
  
  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? String(hours).padStart(2, '0') : null,
      String(minutes).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };
  
  // Determine color based on remaining time
  const getColorClass = () => {
    const percentRemaining = (remainingTime / totalTime) * 100;
    if (percentRemaining > 50) return 'text-green-600';
    if (percentRemaining > 25) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Determine progress bar color
  const getProgressColor = () => {
    const percentRemaining = (remainingTime / totalTime) * 100;
    if (percentRemaining > 50) return 'bg-green-600';
    if (percentRemaining > 25) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Time Remaining:</span>
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <span className={`text-lg font-bold ${getColorClass()}`}>
            {formatTime(remainingTime)}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={isPaused ? onResume : onPause}
            className="h-8 px-2"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-1" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            )}
          </Button>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2"
          // Apply the appropriate color class
          style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          <div 
            className={`h-full rounded-full transition-all`}
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: getProgressColor().replace('bg-', '') 
            }}
          />
        </Progress>
      </div>
    </div>
  );
}

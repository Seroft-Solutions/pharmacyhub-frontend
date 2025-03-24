import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Pause, 
  Play,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatTimeDisplay } from '../../utils/formatTime';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExamTimerProps {
  totalTime: number; // Total time in seconds
  remainingTime: number; // Remaining time in seconds
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onTimeUp: () => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  totalTime,
  remainingTime,
  isPaused,
  onPause,
  onResume,
  onTimeUp
}) => {
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);
  
  // Check time thresholds for warnings
  useEffect(() => {
    // Check if total time is valid to avoid division by zero
    if (totalTime <= 0) return;
    
    // Warning at 25% remaining time
    if (remainingTime <= totalTime * 0.25 && remainingTime > totalTime * 0.1) {
      setIsWarning(true);
      setIsDanger(false);
    } 
    // Danger at 10% remaining time
    else if (remainingTime <= totalTime * 0.1) {
      setIsWarning(false);
      setIsDanger(true);
    } else {
      setIsWarning(false);
      setIsDanger(false);
    }
    
    // Time's up
    if (remainingTime <= 0 && !isPaused) {
      onTimeUp();
    }
    
    // Debug info - remove in production
    console.debug(`Timer: ${remainingTime}s / ${totalTime}s (${progressPercentage.toFixed(1)}%)`);
  }, [remainingTime, totalTime, isPaused, onTimeUp, progressPercentage]);
  
  // Calculate progress percentage - ensure it's calculated correctly
  const progressPercentage = Math.max(0, Math.min(100, (remainingTime / totalTime) * 100));
  
  return (
    <div className={`rounded-lg p-4 ${
      isDanger 
        ? 'bg-red-50 border border-red-200' 
        : isWarning 
        ? 'bg-yellow-50 border border-yellow-200' 
        : 'bg-slate-50 border border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Clock className={`h-5 w-5 mr-2 ${
            isDanger 
              ? 'text-red-600' 
              : isWarning 
              ? 'text-yellow-600' 
              : 'text-slate-600'
          }`} />
          <span className="font-medium">Time Remaining</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`${
                  isDanger 
                    ? 'border-red-300 text-red-700 hover:bg-red-100' 
                    : isWarning 
                    ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-100' 
                    : ''
                }`}
                onClick={isPaused ? onResume : onPause}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPaused ? 'Resume timer' : 'Pause timer'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-center mb-2">
        <span className={`text-3xl font-bold ${
          isDanger 
            ? 'text-red-700' 
            : isWarning 
            ? 'text-yellow-700' 
            : 'text-slate-700'
        }`}>
          {formatTimeDisplay(Math.max(0, remainingTime))}
        </span>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className={`h-2 ${
          isDanger 
            ? 'bg-red-200' 
            : isWarning 
            ? 'bg-yellow-200' 
            : 'bg-slate-200'
        }`}
        indicatorClassName={
          isDanger 
            ? 'bg-red-600' 
            : isWarning 
            ? 'bg-yellow-600' 
            : 'bg-blue-600'
        }
      />
      
      {(isWarning || isDanger) && (
        <div className="flex items-center justify-center mt-2 text-sm">
          <AlertTriangle className={`h-3 w-3 mr-1 ${isDanger ? 'text-red-600' : 'text-yellow-600'}`} />
          <span className={isDanger ? 'text-red-600' : 'text-yellow-600'}>
            {isDanger ? 'Time almost up!' : 'Time running low'}
          </span>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { formatTimeDisplay } from '../../utils/formatTime';

interface HeaderTimeRemainingProps {
  totalTime: number; // in seconds
  remainingTime: number; // in seconds
}

/**
 * HeaderTimeRemaining component displays a compact time remaining indicator
 * specifically designed for the exam header
 */
export const HeaderTimeRemaining: React.FC<HeaderTimeRemainingProps> = ({
  totalTime,
  remainingTime
}) => {
  // Ensure times are valid numbers
  const validTotalTime = Math.max(1, totalTime); // Avoid division by zero
  const validRemainingTime = Math.max(0, remainingTime); // Ensure non-negative
  
  // Calculate percentage of time remaining (bounded between 0 and 100)
  const percentageRemaining = Math.min(100, Math.max(0, (validRemainingTime / validTotalTime) * 100));
  
  // Format time display
  const formattedTime = formatTimeDisplay(validRemainingTime);
  
  // Debug logs to help troubleshoot
  console.debug(`HeaderTimeRemaining: ${validRemainingTime}s / ${validTotalTime}s (${percentageRemaining.toFixed(1)}%)`);
  
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-blue-700 font-medium flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Time Remaining
        </span>
        <span className="text-base font-mono font-bold">
          {formattedTime}
        </span>
      </div>
      
      <Progress 
        value={percentageRemaining} 
        className="h-2"
        indicatorClassName={
          percentageRemaining > 50 ? "bg-blue-600" : 
          percentageRemaining > 25 ? "bg-amber-600" : 
          "bg-red-600"
        }
      />
      
      <div className="flex justify-end">
        <span className="text-xs text-gray-500">
          {Math.round(percentageRemaining)}% remaining
        </span>
      </div>
    </div>
  );
};

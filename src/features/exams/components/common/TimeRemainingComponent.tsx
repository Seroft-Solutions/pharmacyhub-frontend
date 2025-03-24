import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeDisplay } from '../../utils/formatTime';

interface TimeRemainingProps {
  totalTime: number; // in seconds
  remainingTime: number; // in seconds
  className?: string;
}

/**
 * TimeRemainingComponent displays the remaining time in a formatted way with a progress bar
 * This is specifically for the right sidebar in the exam interface
 */
export const TimeRemainingComponent: React.FC<TimeRemainingProps> = ({
  totalTime,
  remainingTime,
  className
}) => {
  // Ensure times are valid numbers
  const validTotalTime = Math.max(1, totalTime); // Avoid division by zero
  const validRemainingTime = Math.max(0, remainingTime); // Ensure non-negative
  
  // Calculate percentage of time remaining (bounded between 0 and 100)
  const percentageRemaining = Math.min(100, Math.max(0, (validRemainingTime / validTotalTime) * 100));
  
  // Determine style based on remaining time
  const getTimeStyle = () => {
    if (percentageRemaining > 50) return { color: 'text-blue-700', bg: 'bg-blue-100' };
    if (percentageRemaining > 25) return { color: 'text-amber-700', bg: 'bg-amber-100' };
    return { color: 'text-red-700', bg: 'bg-red-100' };
  };
  
  const timeStyle = getTimeStyle();
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Clock className={`h-4 w-4 mr-1.5 ${timeStyle.color}`} />
          <span className="text-sm font-medium">Time Remaining</span>
        </div>
        <span className={`text-lg font-mono font-bold ${timeStyle.color}`}>
          {formatTimeDisplay(validRemainingTime)}
        </span>
      </div>
      
      <Progress 
        value={percentageRemaining} 
        className="h-2.5"
        indicatorClassName={cn(
          percentageRemaining > 50 ? "bg-blue-600" : 
          percentageRemaining > 25 ? "bg-amber-600" : 
          "bg-red-600"
        )}
      />
      
      <div className="flex justify-end">
        <span className="text-xs text-gray-500">
          {Math.round(percentageRemaining)}% remaining
        </span>
      </div>
    </div>
  );
};

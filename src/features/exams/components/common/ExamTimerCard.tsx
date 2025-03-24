import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TimeRemainingComponent } from './TimeRemainingComponent';

interface ExamTimerCardProps {
  totalTimeInSeconds: number;
  timeRemainingInSeconds: number;
  onTimeExpired: () => void;
  isCompleted?: boolean;
}

/**
 * ExamTimerCard displays the time remaining in a card format
 * This component is used in the exam sidebar
 */
export const ExamTimerCard: React.FC<ExamTimerCardProps> = ({
  totalTimeInSeconds,
  timeRemainingInSeconds,
  onTimeExpired,
  isCompleted = false
}) => {
  // Use a ref to track the timer
  const [internalTimeRemaining, setInternalTimeRemaining] = useState(timeRemainingInSeconds);
  
  // Update internal state when prop changes
  useEffect(() => {
    setInternalTimeRemaining(timeRemainingInSeconds);
    console.debug(`ExamTimerCard received timeRemainingInSeconds update: ${timeRemainingInSeconds}`);
  }, [timeRemainingInSeconds]);
  
  // The timer to count down
  useEffect(() => {
    // Don't start timer if exam is completed or time is already up
    if (isCompleted || internalTimeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setInternalTimeRemaining((prev) => {
        // If time is up, call the callback and stop the timer
        if (prev <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [internalTimeRemaining, isCompleted, onTimeExpired]);
  
  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="pt-4">
        <div className="flex items-center mb-3">
          <Clock className="h-5 w-5 text-blue-600 mr-2" />
          <CardTitle className="text-base font-medium">Exam Timer</CardTitle>
        </div>
        
        <TimeRemainingComponent
          totalTime={totalTimeInSeconds}
          remainingTime={internalTimeRemaining}
        />
      </CardContent>
    </Card>
  );
};

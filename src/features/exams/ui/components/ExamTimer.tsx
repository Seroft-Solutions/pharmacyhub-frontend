import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TimerIcon, AlertCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamTimerProps {
  durationInMinutes: number;
  onTimeExpired: () => void;
  isCompleted?: boolean;
}

export function ExamTimer({
  durationInMinutes,
  onTimeExpired,
  isCompleted = false
}: ExamTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationInMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  
  // Calculate hours, minutes, seconds
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  
  // Format time with leading zeros
  const formattedTime = `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Calculate percentage of time remaining
  const percentageRemaining = (secondsRemaining / (durationInMinutes * 60)) * 100;
  
  // Determine urgency level based on remaining time
  const getUrgencyLevel = () => {
    if (percentageRemaining > 50) return 'normal';
    if (percentageRemaining > 25) return 'warning';
    return 'critical';
  };
  
  const urgencyLevel = getUrgencyLevel();
  
  // Update timer every second
  useEffect(() => {
    if (isCompleted || isPaused || secondsRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [secondsRemaining, isPaused, isCompleted, onTimeExpired]);
  
  return (
    <div className={cn(
      "relative px-3 py-2 rounded-md flex items-center",
      urgencyLevel === 'normal' ? 'bg-blue-50 text-blue-700' :
      urgencyLevel === 'warning' ? 'bg-amber-50 text-amber-700' :
      'bg-red-50 text-red-700'
    )}>
      {urgencyLevel === 'critical' && (
        <div className="absolute inset-0 bg-red-100 animate-pulse rounded-md" style={{ opacity: 0.3 }} />
      )}
      
      <div className="relative flex items-center">
        {urgencyLevel === 'critical' ? (
          <AlertCircleIcon className="h-5 w-5 mr-2 text-red-500" />
        ) : (
          <TimerIcon className={cn(
            "h-5 w-5 mr-2",
            urgencyLevel === 'normal' ? 'text-blue-500' : 'text-amber-500'
          )} />
        )}
        
        <div>
          <span className="font-mono text-lg font-semibold">{formattedTime}</span>
          <span className="ml-2 text-sm font-medium">
            {urgencyLevel === 'critical' ? 'Time running out!' :
             urgencyLevel === 'warning' ? 'Time alert' : 'Remaining'}
          </span>
        </div>
      </div>
    </div>
  );
}
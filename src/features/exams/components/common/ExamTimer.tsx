import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TimerIcon, AlertCircleIcon, Clock8Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ExamTimerProps {
  durationInMinutes: number;
  onTimeExpired: () => void;
  isCompleted?: boolean;
}

export function ExamTimer({
  durationInMinutes = 60, // Default to 60 minutes if not provided
  onTimeExpired,
  isCompleted = false
}: ExamTimerProps) {
  // Ensure durationInMinutes is a number and has a valid value
  const validDuration = typeof durationInMinutes === 'number' && !isNaN(durationInMinutes) && durationInMinutes > 0 
    ? durationInMinutes 
    : 60; // Default to 60 minutes if invalid
    
  const [secondsRemaining, setSecondsRemaining] = useState(validDuration * 60);
  const [isPaused, setIsPaused] = useState(false);
  
  // Calculate hours, minutes, seconds
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  
  // Format time with leading zeros
  const formattedTime = `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Calculate percentage of time remaining
  const percentageRemaining = (secondsRemaining / (validDuration * 60)) * 100;
  
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
    <div className="shadow-md border border-gray-100 rounded-lg overflow-hidden">
      <div className={cn(
        "px-4 py-3 flex items-center justify-between transition-colors",
        urgencyLevel === 'normal' ? 'bg-blue-50 text-blue-700 border-b border-blue-100' :
        urgencyLevel === 'warning' ? 'bg-amber-50 text-amber-700 border-b border-amber-100' :
        'bg-red-50 text-red-700 border-b border-red-100'
      )}>
        <div className="flex items-center">
          {urgencyLevel === 'critical' ? (
            <AlertCircleIcon className="h-5 w-5 mr-2 text-red-500 animate-pulse" />
          ) : urgencyLevel === 'warning' ? (
            <Clock8Icon className="h-5 w-5 mr-2 text-amber-500" />
          ) : (
            <TimerIcon className="h-5 w-5 mr-2 text-blue-500" />
          )}
          <span className="font-medium">
            {urgencyLevel === 'critical' ? 'Time running out!' :
             urgencyLevel === 'warning' ? 'Time alert' : 'Time Remaining'}
          </span>
        </div>
        <div className="font-mono text-lg font-bold">
          {formattedTime}
        </div>
      </div>
      
      <div className="p-3 bg-white">
        <Progress 
          value={percentageRemaining} 
          className="h-2"
          indicatorClassName={cn(
            urgencyLevel === 'normal' ? 'bg-blue-500' :
            urgencyLevel === 'warning' ? 'bg-amber-500' :
            'bg-red-500'
          )}
        />
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>{Math.floor(percentageRemaining)}% remaining</span>
          {urgencyLevel === 'critical' && (
            <span className="text-red-500 font-medium animate-pulse">Hurry up!</span>
          )}
        </div>
      </div>
      
      {/* For extremely low time (< 10%), add a pulsing warning */}
      {percentageRemaining < 10 && (
        <div className="text-xs text-white font-medium bg-red-500 py-1 px-2 text-center animate-pulse">
          Submit your exam soon!
        </div>
      )}
    </div>
  );
}
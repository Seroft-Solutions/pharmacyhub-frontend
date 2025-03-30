// TimeRemainingComponent.tsx
"use client";

import React from 'react';
import { formatTimeVerbose } from '@/features/exams-preparation/utils';

interface TimeRemainingComponentProps {
  timeRemaining: number; // in seconds
  className?: string;
  variant?: 'default' | 'compact' | 'large';
  showIcon?: boolean;
}

export const TimeRemainingComponent: React.FC<TimeRemainingComponentProps> = ({
  timeRemaining,
  className = '',
  variant = 'default',
  showIcon = false,
}) => {
  const formattedTime = formatTimeVerbose(timeRemaining);
  const isLowTime = timeRemaining < 300; // less than 5 minutes
  
  let baseClasses = 'font-mono';
  let sizeClasses = '';
  let colorClasses = isLowTime ? 'text-red-600' : 'text-gray-700';
  
  // Determine size based on variant
  if (variant === 'compact') {
    sizeClasses = 'text-sm';
  } else if (variant === 'large') {
    sizeClasses = 'text-xl font-bold';
  } else {
    sizeClasses = 'text-base';
  }
  
  return (
    <div className={`${baseClasses} ${sizeClasses} ${colorClasses} ${className}`}>
      {showIcon && (
        <span className="inline-block mr-2">⏱️</span>
      )}
      {formattedTime}
    </div>
  );
};

export default TimeRemainingComponent;

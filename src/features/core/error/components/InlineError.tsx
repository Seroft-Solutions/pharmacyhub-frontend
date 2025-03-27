'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineErrorProps {
  message?: string;
  className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({ 
  message, 
  className 
}) => {
  if (!message) {
    return null;
  }
  
  return (
    <div className={cn("text-sm text-red-500 mt-1 flex items-center", className)}>
      <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

interface FormErrorSummaryProps {
  errors: Record<string, string>;
  className?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  className
}) => {
  const errorMessages = Object.values(errors).filter(Boolean);
  
  if (errorMessages.length === 0) {
    return null;
  }
  
  return (
    <div className={cn("bg-red-50 border border-red-200 rounded-md p-4 mb-4", className)}>
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            {errorMessages.length === 1 ? 'There is an error' : `There are ${errorMessages.length} errors`} with your submission
          </h3>
          
          {errorMessages.length > 0 && (
            <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

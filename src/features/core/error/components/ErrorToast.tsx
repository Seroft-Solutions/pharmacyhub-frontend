'use client';

import React, { useEffect } from 'react';
import { useErrorStore } from '../ErrorStore';
import { ErrorSeverity } from '../ErrorHandlingService';
import { AlertCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Style variants based on severity
const toastVariants = cva(
  "fixed bottom-4 right-4 flex items-start p-4 rounded-md shadow-md max-w-md z-50 animate-in slide-in-from-right-5 duration-300",
  {
    variants: {
      severity: {
        info: "bg-blue-50 border border-blue-200 text-blue-800",
        warning: "bg-amber-50 border border-amber-200 text-amber-800",
        error: "bg-red-50 border border-red-200 text-red-800",
        critical: "bg-red-100 border-2 border-red-400 text-red-900",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
);

// Icon mapping based on severity
const SeverityIcon: React.FC<{ severity: ErrorSeverity }> = ({ severity }) => {
  switch (severity) {
    case ErrorSeverity.INFO:
      return <Info className="h-5 w-5 text-blue-500" />;
    case ErrorSeverity.WARNING:
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case ErrorSeverity.ERROR:
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case ErrorSeverity.CRITICAL:
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

interface ErrorToastProps {
  autoHideDuration?: number;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ 
  autoHideDuration = 6000 
}) => {
  const { toastError, hideToastError } = useErrorStore();
  
  useEffect(() => {
    if (toastError && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        hideToastError();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [toastError, hideToastError, autoHideDuration]);
  
  if (!toastError) {
    return null;
  }
  
  return (
    <div className={cn(toastVariants({ severity: toastError.severity }))}>
      <div className="flex-shrink-0 mr-3 pt-0.5">
        <SeverityIcon severity={toastError.severity} />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium mb-1">{toastError.message}</h3>
        {toastError.resolution && (
          <p className="text-sm opacity-90">{toastError.resolution}</p>
        )}
      </div>
      
      <button
        onClick={hideToastError}
        className="flex-shrink-0 ml-2 hover:bg-black/5 p-1 rounded-full"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

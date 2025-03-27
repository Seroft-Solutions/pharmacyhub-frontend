'use client';

import React from 'react';
import { useErrorStore } from '../ErrorStore';
import { ErrorSeverity } from '../ErrorHandlingService';
import { AlertCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Icon mapping based on severity
const SeverityIcon: React.FC<{ severity: ErrorSeverity }> = ({ severity }) => {
  switch (severity) {
    case ErrorSeverity.INFO:
      return <Info className="h-6 w-6 text-blue-500" />;
    case ErrorSeverity.WARNING:
      return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    case ErrorSeverity.ERROR:
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    case ErrorSeverity.CRITICAL:
      return <XCircle className="h-6 w-6 text-red-600" />;
    default:
      return <Info className="h-6 w-6" />;
  }
};

interface ErrorDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRetry?: () => void;
  onClose?: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open: externalOpen,
  onOpenChange,
  onRetry,
  onClose,
}) => {
  const { globalError, setGlobalError } = useErrorStore();
  
  // Determine if the dialog should be open
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : !!globalError;
  
  // Handle dialog close
  const handleClose = () => {
    if (!isControlled) {
      setGlobalError(null);
    }
    
    if (onClose) {
      onClose();
    }
    
    if (onOpenChange) {
      onOpenChange(false);
    }
  };
  
  // Handle retry action
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    handleClose();
  };
  
  if (!globalError && !isControlled) {
    return null;
  }
  
  const error = globalError || {
    message: 'An error occurred',
    resolution: 'Please try again later.',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange || (() => handleClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-3">
          <SeverityIcon severity={error.severity} />
          <DialogTitle className="text-left">{error.message}</DialogTitle>
        </DialogHeader>
        
        {error.resolution && (
          <div className="mt-2 text-sm text-gray-600">
            {error.resolution}
          </div>
        )}
        
        {error.details && Object.keys(error.details).length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs font-mono overflow-auto max-h-32">
            <pre>{JSON.stringify(error.details, null, 2)}</pre>
          </div>
        )}
        
        <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          
          {error.recoverable && onRetry && (
            <Button variant="default" onClick={handleRetry}>
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SessionTerminationResultProps {
  isOpen: boolean;
  success: boolean;
  message?: string;
  errorMessage?: string;
  onClose: () => void;
}

export const SessionTerminationResult: React.FC<SessionTerminationResultProps> = ({
  isOpen,
  success,
  message,
  errorMessage,
  onClose,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4">
            {success ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <XCircle className="w-10 h-10 text-red-500" />
            )}
          </div>
          <AlertDialogTitle className="text-xl">
            {success ? 'Other Devices Logged Out' : 'Error Logging Out Other Devices'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2">
            {success 
              ? (message || 'All other devices have been successfully logged out. You can now continue.')
              : (errorMessage || 'Failed to log out other devices. Please try again or contact support.')}
          </AlertDialogDescription>
          
          {success && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                You will be redirected to your dashboard in a moment.
              </p>
            </div>
          )}
          
          {!success && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Troubleshooting:</strong> Please ensure you have a stable internet connection and try again.
                If the problem persists, contact support.
              </p>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            {success ? 'Continue' : 'Try Again'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

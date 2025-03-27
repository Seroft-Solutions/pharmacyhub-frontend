'use client';

import React from 'react';
import { Clock, RefreshCw, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useErrorStore } from '../ErrorStore';

interface SessionExpiredHandlerProps {
  onLogin: () => void;
  onRefresh: () => void;
}

export const SessionExpiredHandler: React.FC<SessionExpiredHandlerProps> = ({
  onLogin,
  onRefresh,
}) => {
  const { sessionError, setSessionError } = useErrorStore();
  
  // Check if the error is a session expired error
  const isSessionExpired = sessionError?.code === 'ERR_SESSION_EXPIRED' ||
                          sessionError?.code === 'ERR_SESSION_NOT_FOUND';
  
  if (!isSessionExpired) {
    return null;
  }
  
  const handleClose = () => {
    setSessionError(null);
  };
  
  const handleLogin = () => {
    handleClose();
    onLogin();
  };
  
  const handleRefresh = () => {
    handleClose();
    onRefresh();
  };
  
  return (
    <Dialog open={isSessionExpired} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Session Expired</DialogTitle>
        </DialogHeader>
        
        {/* Icon */}
        <div className="flex justify-center mb-4 mt-2">
          <Clock className="w-12 h-12 text-amber-500" />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-center mb-4">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
        
        {/* Explanation box */}
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md mb-6">
          <p className="text-sm text-blue-800">
            <strong>Why did this happen?</strong> For your security, sessions automatically expire after a period of inactivity.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-end">
          <Button 
            variant="outline"
            className="w-full sm:w-auto" 
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

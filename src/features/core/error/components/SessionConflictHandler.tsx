'use client';

import React, { useState } from 'react';
import { LogOut, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useErrorStore } from '../ErrorStore';

interface SessionConflictHandlerProps {
  onForceLogout: () => Promise<void>;
  onCancel: () => void;
}

export const SessionConflictHandler: React.FC<SessionConflictHandlerProps> = ({
  onForceLogout,
  onCancel,
}) => {
  const { sessionError, setSessionError } = useErrorStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if the error is a session conflict
  const isSessionConflict = sessionError?.code === 'ERR_SESSION_CONFLICT';
  
  if (!isSessionConflict) {
    return null;
  }
  
  const handleCancel = () => {
    setSessionError(null);
    onCancel();
  };
  
  const handleForceLogout = async () => {
    setIsProcessing(true);
    try {
      await onForceLogout();
    } catch (error) {
      console.error('Error during force logout:', error);
    } finally {
      setIsProcessing(false);
      setSessionError(null);
    }
  };
  
  return (
    <Dialog open={isSessionConflict} onOpenChange={(open) => {
      if (!open) {
        handleCancel();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Already Logged In Elsewhere</DialogTitle>
        </DialogHeader>
        
        {/* Icon */}
        <div className="flex justify-center mb-4 mt-2">
          <LogOut className="w-12 h-12 text-red-500" />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-center mb-4">
          You are already logged in from another device. For security reasons, PharmacyHub only allows one active session at a time. Please log out from that device or click "Log Out Other Devices" to continue with this session.
        </p>
        
        {/* Explanation box */}
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md mb-6">
          <p className="text-sm text-amber-800">
            <strong>Security Notice:</strong> Choosing "Log Out Other Devices" will immediately terminate all your other active sessions and allow you to continue with this session.
          </p>
          <div className="mt-2 p-2 bg-amber-100 rounded">
            <p className="text-xs text-amber-800 flex items-center">
              <Shield className="h-3 w-3 mr-1" /> This security feature protects your account from unauthorized access.
            </p>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-end">
          <Button 
            variant="outline"
            className="w-full sm:w-auto" 
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={handleForceLogout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> 
                <span>Processing...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out Other Devices
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

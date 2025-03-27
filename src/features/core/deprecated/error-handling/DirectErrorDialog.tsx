/**
 * @deprecated This component is deprecated. Use the new SessionConflictHandler component instead.
 */

'use client';

import React from 'react';
import { LogOut, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

// Keeping the original LoginStatus enum to avoid breaking changes
export enum LoginStatus {
  SUCCESS = 'SUCCESS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SESSION_CONFLICT = 'SESSION_CONFLICT',
  ERROR = 'ERROR'
}

interface DirectErrorDialogProps {
  isOpen: boolean;
  status: LoginStatus;
  message?: string;
  onContinue: () => void;
  onCancel: () => void;
  isTerminating?: boolean;
}

export const DirectErrorDialog: React.FC<DirectErrorDialogProps> = ({
  isOpen,
  status,
  message,
  onContinue,
  onCancel,
  isTerminating = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 m-4 relative">
        {/* Close button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-1"
          disabled={isTerminating}
        >
          <X size={20} />
        </button>
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <LogOut className="w-12 h-12 text-red-500" />
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Already Logged In Elsewhere
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 text-center mb-4">
          {message || 'You are already logged in from another device. For security reasons, PharmacyHub only allows one active session at a time. Please log out from that device or click "Log Out Other Devices" to continue with this session.'}
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
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline"
            className="w-full sm:w-auto" 
            onClick={onCancel}
            disabled={isTerminating}
          >
            Cancel
          </Button>
          
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={onContinue}
            disabled={isTerminating}
          >
            {isTerminating ? (
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
      </div>
    </div>
  );
};

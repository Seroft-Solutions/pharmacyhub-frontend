'use client';

import React from 'react';
import { LoginStatus } from '../../anti-sharing/types';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface InlineErrorMessageProps {
  status: LoginStatus;
  message?: string;
  onContinue: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const InlineErrorMessage: React.FC<InlineErrorMessageProps> = ({
  status,
  message,
  onContinue,
  onCancel,
  isProcessing = false,
}) => {
  const defaultMessage = 'You are already logged in from another device. For security reasons, PharmacyHub only allows one active session at a time. Please log out from that device or click below to force logout other sessions.';

  return (
    <div className="animate-in fade-in duration-300 border border-red-200 rounded-md p-4 my-6 bg-red-50">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <LogOut className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-800">
            Already Logged In Elsewhere
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message || defaultMessage}</p>
          </div>
          <div className="mt-3 bg-red-100 p-2 rounded-md">
            <div className="flex items-center text-xs text-red-800">
              <Shield className="h-3 w-3 mr-1" />
              <span>This security feature protects your account from unauthorized access</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={onContinue}
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner className="mr-2 h-3 w-3" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Log Out Other Devices
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

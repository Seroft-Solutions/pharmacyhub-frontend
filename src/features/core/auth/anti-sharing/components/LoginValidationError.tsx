'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoginStatus } from '../types';
import { LOGIN_VALIDATION_MESSAGES } from '../constants';
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface LoginValidationErrorProps {
  isOpen: boolean;
  status: LoginStatus;
  message?: string;
  onContinue: () => void;
  onCancel: () => void;
  isTerminating?: boolean;
}

export const LoginValidationError: React.FC<LoginValidationErrorProps> = ({
  isOpen,
  status,
  message,
  onContinue,
  onCancel,
  isTerminating = false,
}) => {
  const getTitle = () => {
    switch (status) {
      case LoginStatus.NEW_DEVICE:
        return 'New Device Detected';
      case LoginStatus.SUSPICIOUS_LOCATION:
        return 'Suspicious Login Detected';
      case LoginStatus.TOO_MANY_DEVICES:
        return 'Already Logged In Elsewhere';
      case LoginStatus.OTP_REQUIRED:
        return 'Verification Required';
      default:
        return 'Login Security Alert';
    }
  };

  const getDescription = () => {
    // Use provided message first if available
    return message || LOGIN_VALIDATION_MESSAGES[status] || 'There was a problem with your login.';
  };

  const getIcon = () => {
    switch (status) {
      case LoginStatus.NEW_DEVICE:
        return <Shield className="w-10 h-10 text-blue-500" />;
      case LoginStatus.SUSPICIOUS_LOCATION:
        return <ShieldAlert className="w-10 h-10 text-amber-500" />;
      case LoginStatus.TOO_MANY_DEVICES:
        return <LogOut className="w-10 h-10 text-red-500" />;
      case LoginStatus.OTP_REQUIRED:
        return <Shield className="w-10 h-10 text-blue-500" />;
      default:
        return <ShieldAlert className="w-10 h-10 text-gray-500" />;
    }
  };

  const getContinueText = () => {
    switch (status) {
      case LoginStatus.NEW_DEVICE:
      case LoginStatus.SUSPICIOUS_LOCATION:
      case LoginStatus.OTP_REQUIRED:
        return 'Verify Identity';
      case LoginStatus.TOO_MANY_DEVICES:
        return 'Log Out Other Devices';
      default:
        return 'Continue';
    }
  };

  const getExplanation = () => {
    if (status === LoginStatus.TOO_MANY_DEVICES) {
      return (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Security Notice:</strong> For your account security, we only allow one active session at a time.
          </p>
          <p className="text-sm text-amber-800 mt-1">
            Choosing "Log Out Other Devices" will immediately terminate all your other active sessions and allow you to continue with this session.
          </p>
          <p className="text-sm text-amber-800 mt-1">
            If you did not attempt to log in from another device, please consider changing your password for added security.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4">{getIcon()}</div>
          <AlertDialogTitle className="text-xl">{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2">
            {getDescription()}
          </AlertDialogDescription>
          {getExplanation()}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onCancel}
            className="w-full sm:w-auto"
            disabled={isTerminating}
          >
            Cancel
          </AlertDialogCancel>
          
          <Button
            variant={status === LoginStatus.TOO_MANY_DEVICES ? "destructive" : "default"}
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
                {status === LoginStatus.TOO_MANY_DEVICES && <LogOut className="mr-2 h-4 w-4" />}
                {getContinueText()}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

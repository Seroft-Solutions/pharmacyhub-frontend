'use client';

import React, { useState, useEffect } from 'react';
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
import { LOGIN_VALIDATION_MESSAGES, LOGIN_VALIDATION_EXPLANATIONS } from '../constants';
import { getErrorDetailsForLoginStatus, ErrorCategory } from '../constants/exceptions';
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
  // Create a local state that mirrors isOpen prop
  const [open, setOpen] = useState(isOpen);
  
  // Add debugging logs
  useEffect(() => {
    console.log('[LoginValidationError] Component mounted with props:', {
      isOpen,
      status,
      message,
      open
    });
  }, [isOpen, status, message, open]);
  
  // Update local state whenever the isOpen prop changes
  useEffect(() => {
    console.log('[LoginValidationError] isOpen prop changed:', isOpen);
    setOpen(isOpen);
  }, [isOpen]);

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
    // Get detailed error info from exception constants
    const errorDetails = getErrorDetailsForLoginStatus(status);
    // Use provided message first if available, then error details, then fallback
    return message || errorDetails?.message || LOGIN_VALIDATION_MESSAGES[status] || 'There was a problem with your login.';
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
    // Get action from error details if available
    const errorDetails = getErrorDetailsForLoginStatus(status);
    const explanation = errorDetails?.action || LOGIN_VALIDATION_EXPLANATIONS[status];
    
    if (!explanation) {
      return null;
    }
    
    let bgColor = 'bg-amber-50';
    let borderColor = 'border-amber-200';
    let textColor = 'text-amber-800';
    
    // Use different colors for different status types
    if (status === LoginStatus.TOO_MANY_DEVICES) {
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
      textColor = 'text-amber-800';
    } else if (status === LoginStatus.SUSPICIOUS_LOCATION) {
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      textColor = 'text-red-800';
    } else {
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-200';
      textColor = 'text-blue-800';
    }
    
    return (
      <div className={`mt-2 p-3 ${bgColor} border ${borderColor} rounded-md`}>
        <p className={`text-sm ${textColor}`}>
          <strong>Security Notice:</strong> {explanation}
        </p>
        {status === LoginStatus.TOO_MANY_DEVICES && (
          <div className="mt-2 p-2 bg-amber-100 rounded">
            <p className="text-xs text-amber-800 flex items-center">
              <Shield className="h-3 w-3 mr-1" /> This security feature protects your account from unauthorized access.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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

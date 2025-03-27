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
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Shield,
  ShieldAlert,
  LogOut,
  Clock,
  WifiOff,
  ServerOff,
  AlertCircle,
  Lock,
  ShieldOff,
} from 'lucide-react';
import {
  ErrorDetails,
  ErrorSeverity,
  ErrorCategory,
  getErrorDetails,
  getErrorDetailsByCode,
  getErrorDetailsForLoginStatus,
} from '../constants/exceptions';
import { LoginStatus } from '../types';

interface SessionExceptionHandlerProps {
  isOpen: boolean;
  errorCategory?: ErrorCategory;
  errorKey?: string;
  errorCode?: string;
  loginStatus?: LoginStatus;
  customMessage?: string;
  customAction?: string;
  onAction: () => void;
  onCancel: () => void;
  actionButtonText?: string;
  cancelButtonText?: string;
  isProcessing?: boolean;
}

export const SessionExceptionHandler: React.FC<SessionExceptionHandlerProps> = ({
  isOpen,
  errorCategory,
  errorKey,
  errorCode,
  loginStatus,
  customMessage,
  customAction,
  onAction,
  onCancel,
  actionButtonText,
  cancelButtonText = 'Cancel',
  isProcessing = false,
}) => {
  const [open, setOpen] = useState(isOpen);
  
  // Update local state whenever the isOpen prop changes
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  
  // Determine the error details based on the provided props
  const getRelevantErrorDetails = (): ErrorDetails | undefined => {
    if (errorCategory && errorKey) {
      return getErrorDetails(errorCategory, errorKey);
    }
    
    if (errorCode) {
      return getErrorDetailsByCode(errorCode);
    }
    
    if (loginStatus) {
      return getErrorDetailsForLoginStatus(loginStatus);
    }
    
    return undefined;
  };
  
  const errorDetails = getRelevantErrorDetails();
  
  const getIcon = () => {
    if (!errorDetails?.icon) {
      return <AlertCircle className="w-10 h-10 text-gray-500" />;
    }
    
    const iconMap: Record<string, JSX.Element> = {
      'shield': <Shield className="w-10 h-10 text-blue-500" />,
      'shield-alert': <ShieldAlert className="w-10 h-10 text-amber-500" />,
      'shield-off': <ShieldOff className="w-10 h-10 text-red-500" />,
      'log-out': <LogOut className="w-10 h-10 text-red-500" />,
      'clock': <Clock className="w-10 h-10 text-amber-500" />,
      'wifi-off': <WifiOff className="w-10 h-10 text-red-500" />,
      'server-off': <ServerOff className="w-10 h-10 text-red-500" />,
      'alert-circle': <AlertCircle className="w-10 h-10 text-amber-500" />,
      'lock': <Lock className="w-10 h-10 text-red-500" />,
    };
    
    return iconMap[errorDetails.icon] || <AlertCircle className="w-10 h-10 text-gray-500" />;
  };
  
  const getTitle = () => {
    // Default titles based on category
    if (errorDetails) {
      if (errorCategory === ErrorCategory.SESSION) {
        return 'Session Security Alert';
      }
      if (errorCategory === ErrorCategory.AUTHENTICATION) {
        return 'Authentication Error';
      }
      if (errorCategory === ErrorCategory.NETWORK) {
        return 'Connection Error';
      }
      if (errorCategory === ErrorCategory.VALIDATION) {
        return 'Validation Error';
      }
      if (errorCategory === ErrorCategory.PERMISSION) {
        return 'Permission Error';
      }
    }
    
    // For login status specific titles
    if (loginStatus === LoginStatus.NEW_DEVICE) {
      return 'New Device Detected';
    }
    if (loginStatus === LoginStatus.SUSPICIOUS_LOCATION) {
      return 'Suspicious Login Detected';
    }
    if (loginStatus === LoginStatus.TOO_MANY_DEVICES) {
      return 'Already Logged In Elsewhere';
    }
    if (loginStatus === LoginStatus.OTP_REQUIRED) {
      return 'Verification Required';
    }
    
    return 'Security Alert';
  };
  
  const getMessage = () => {
    return customMessage || errorDetails?.message || 'An unexpected error occurred.';
  };
  
  const getAction = () => {
    return customAction || errorDetails?.action || 'Please try again or contact support.';
  };
  
  const getActionButtonText = () => {
    if (actionButtonText) {
      return actionButtonText;
    }
    
    if (loginStatus === LoginStatus.NEW_DEVICE || loginStatus === LoginStatus.SUSPICIOUS_LOCATION) {
      return 'Verify Identity';
    }
    
    if (loginStatus === LoginStatus.TOO_MANY_DEVICES) {
      return 'Log Out Other Devices';
    }
    
    if (loginStatus === LoginStatus.OTP_REQUIRED) {
      return 'Verify Identity';
    }
    
    return 'Continue';
  };
  
  const getButtonVariant = () => {
    if (!errorDetails) {
      return 'default';
    }
    
    if (errorDetails.severity === ErrorSeverity.CRITICAL || errorDetails.severity === ErrorSeverity.ERROR) {
      return 'destructive';
    }
    
    if (errorDetails.severity === ErrorSeverity.WARNING) {
      return 'default';
    }
    
    return 'default';
  };
  
  // Determine background color for the explanation box based on severity
  const getExplanationColors = () => {
    if (!errorDetails) {
      return {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
      };
    }
    
    if (errorDetails.severity === ErrorSeverity.CRITICAL) {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
      };
    }
    
    if (errorDetails.severity === ErrorSeverity.ERROR) {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
      };
    }
    
    if (errorDetails.severity === ErrorSeverity.WARNING) {
      return {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
      };
    }
    
    return {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
    };
  };
  
  const { bgColor, borderColor, textColor } = getExplanationColors();
  
  // If there's no error to display, don't render anything
  if (!isOpen || (!errorCategory && !errorKey && !errorCode && !loginStatus && !customMessage)) {
    return null;
  }
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4">{getIcon()}</div>
          <AlertDialogTitle className="text-xl">{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2">
            {getMessage()}
          </AlertDialogDescription>
          
          {/* Action guidance box */}
          <div className={`mt-4 p-3 ${bgColor} border ${borderColor} rounded-md`}>
            <p className={`text-sm ${textColor}`}>
              <strong>Action Required:</strong> {getAction()}
            </p>
            
            {/* Additional security notice for session errors */}
            {errorCategory === ErrorCategory.SESSION && (
              <div className="mt-2 p-2 bg-amber-100 rounded">
                <p className="text-xs text-amber-800 flex items-center">
                  <Shield className="h-3 w-3 mr-1" /> This security feature protects your account from unauthorized access.
                </p>
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          {/* Only show cancel button if the error is recoverable */}
          {(errorDetails?.recoverable !== false) && (
            <AlertDialogCancel 
              onClick={onCancel}
              className="w-full sm:w-auto"
              disabled={isProcessing}
            >
              {cancelButtonText}
            </AlertDialogCancel>
          )}
          
          <Button
            variant={getButtonVariant()}
            className="w-full sm:w-auto"
            onClick={onAction}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> 
                <span>Processing...</span>
              </>
            ) : (
              <>
                {loginStatus === LoginStatus.TOO_MANY_DEVICES && <LogOut className="mr-2 h-4 w-4" />}
                {getActionButtonText()}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

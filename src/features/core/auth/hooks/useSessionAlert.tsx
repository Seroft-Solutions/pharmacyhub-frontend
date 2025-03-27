'use client';

/**
 * Custom hook for session alert notifications
 * Provides a standardized way to show session-related alerts
 * and browser notifications using our exception constants
 */

import { useState, useEffect, useCallback } from 'react';
import { SessionExceptionHandler } from '../anti-sharing/components/SessionExceptionHandler';
import { 
  ErrorCategory,
  SESSION_ERRORS, 
  ErrorDetails
} from '../anti-sharing/constants/exceptions';
import { LoginStatus } from '../anti-sharing/types';
import { useAntiSharingStore } from '../anti-sharing/store';

type AlertAction = 'logoutOthers' | 'retry' | 'cancel' | 'dismiss';

interface SessionAlertProps {
  onAction?: (action: AlertAction) => void;
  onTerminate?: () => Promise<boolean>;
}

export const useSessionAlert = ({ onAction, onTerminate }: SessionAlertProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [customAction, setCustomAction] = useState<string | null>(null);
  const loginStatus = useAntiSharingStore(state => state.loginStatus);
  
  // Reset alert state
  const resetAlert = useCallback(() => {
    setIsVisible(false);
    setIsProcessing(false);
    setErrorDetails(null);
    setCustomMessage(null);
    setCustomAction(null);
  }, []);
  
  // Show alert by loginStatus
  const showAlertByLoginStatus = useCallback((status: LoginStatus) => {
    // Update store with current status
    const { setLoginStatus } = useAntiSharingStore.getState();
    setLoginStatus(status);
    
    setIsVisible(true);
  }, []);
  
  // Show alert by error category and key
  const showAlertByError = useCallback((category: ErrorCategory, errorKey: string) => {
    const error = category === ErrorCategory.SESSION ? 
      SESSION_ERRORS[errorKey] : 
      undefined;
    
    if (error) {
      setErrorDetails(error);
      setIsVisible(true);
    }
  }, []);
  
  // Show alert with custom message
  const showCustomAlert = useCallback((message: string, action?: string) => {
    setCustomMessage(message);
    if (action) {
      setCustomAction(action);
    }
    setIsVisible(true);
  }, []);
  
  // Handle action button click
  const handleAction = useCallback(async () => {
    if (onAction) {
      // Set processing state
      setIsProcessing(true);
      
      // If login status is TOO_MANY_DEVICES, handle termination
      if (loginStatus === LoginStatus.TOO_MANY_DEVICES && onTerminate) {
        try {
          const success = await onTerminate();
          
          if (success) {
            // Reset processing state and hide alert
            setIsProcessing(false);
            setIsVisible(false);
            onAction('logoutOthers');
          } else {
            // Reset processing state but keep alert visible
            setIsProcessing(false);
            onAction('retry');
          }
        } catch (error) {
          console.error('Error during termination:', error);
          setIsProcessing(false);
          onAction('retry');
        }
      } else {
        // Handle other actions
        setIsProcessing(false);
        setIsVisible(false);
        onAction('dismiss');
      }
    } else {
      // No action handler provided, just close the alert
      setIsProcessing(false);
      setIsVisible(false);
    }
  }, [loginStatus, onAction, onTerminate]);
  
  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setIsVisible(false);
    if (onAction) {
      onAction('cancel');
    }
  }, [onAction]);
  
  return {
    isVisible,
    isProcessing,
    errorDetails,
    customMessage,
    customAction,
    loginStatus,
    showAlertByLoginStatus,
    showAlertByError,
    showCustomAlert,
    resetAlert,
    
    // Alert component that can be directly used in components
    SessionAlert: useCallback(() => 
      isVisible ? (
        <SessionExceptionHandler
          isOpen={isVisible}
          errorCategory={errorDetails ? ErrorCategory.SESSION : undefined}
          errorKey={errorDetails ? Object.keys(SESSION_ERRORS).find(
            key => SESSION_ERRORS[key].code === errorDetails.code
          ) : undefined}
          loginStatus={!errorDetails ? loginStatus : undefined}
          customMessage={customMessage || undefined}
          customAction={customAction || undefined}
          onAction={handleAction}
          onCancel={handleCancel}
          isProcessing={isProcessing}
          actionButtonText={loginStatus === LoginStatus.TOO_MANY_DEVICES ? 
            "Log Out Other Devices" : "Continue"}
        />
      ) : null,
    [isVisible, errorDetails, loginStatus, customMessage, customAction, handleAction, handleCancel, isProcessing])
  };
};

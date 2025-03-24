/**
 * Hook for validating session and handling login status
 */

import { useCallback } from 'react';
import { useAntiSharingStore } from '../store';
import { useLoginValidation } from '../api/sessionApiHooks';
import { LoginStatus } from '../types';
import { LOGIN_VALIDATION_MESSAGES } from '../constants';

export const useSessionValidation = () => {
  const { 
    deviceId, 
    loginStatus, 
    setLoginStatus, 
    setIsLoading, 
    setError 
  } = useAntiSharingStore();
  
  const { mutateAsync: validateLogin, isPending } = useLoginValidation();
  
  // Handle login validation with the current device ID
  const validateSession = useCallback(async (userId: string) => {
    if (!deviceId || !userId) {
      return { valid: false, requiresOtp: false };
    }
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      const userAgent = navigator.userAgent;
      
      const result = await validateLogin({ 
        userId, 
        deviceId, 
        userAgent 
      });
      
      setLoginStatus(result.status);
      
      // Set appropriate error message based on status
      if (result.status !== LoginStatus.OK) {
        const message = result.message || LOGIN_VALIDATION_MESSAGES[result.status];
        setError(message);
      }
      
      return { 
        valid: result.status === LoginStatus.OK,
        requiresOtp: result.requiresOtp || false,
        sessionId: result.sessionId
      };
    } catch (error) {
      setLoginStatus(LoginStatus.OK); // Reset to default
      setError('Failed to validate login session');
      return { valid: false, requiresOtp: false };
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, setLoginStatus, setIsLoading, setError, validateLogin]);
  
  return {
    validateSession,
    loginStatus,
    isValidating: isPending,
  };
};

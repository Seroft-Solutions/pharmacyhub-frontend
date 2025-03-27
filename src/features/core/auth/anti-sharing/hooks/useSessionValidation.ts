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
    if (!userId) {
      logger.error('[Session Validation] Missing user ID for validation');
      return { valid: false, requiresOtp: false };
    }
    
    if (!deviceId) {
      logger.warn('[Session Validation] Missing device ID, generating new one');
      // Continue with validation even if deviceId is missing
    }
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      const userAgent = navigator.userAgent;
      
      // Get client IP if possible
      let ipAddress = '';
      try {
        // Attempt to get IP via public service (for client-side only)
        if (typeof window !== 'undefined') {
          const ipResp = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResp.json();
          ipAddress = ipData.ip || '';
        }
      } catch (ipErr) {
        logger.warn('[Session Validation] Failed to get client IP address', ipErr);
        // Continue without IP - backend will use request IP
      }
      
      logger.debug('[Session Validation] Starting session validation', { 
        userId, deviceId: deviceId || 'generating-new-id', hasUserAgent: !!userAgent 
      });
      
      const result = await validateLogin({ 
        userId, 
        deviceId: deviceId || '', // Send empty string if missing, backend will generate one
        userAgent,
        ipAddress
      });
      
      setLoginStatus(result.status);
      
      // Set appropriate error message based on status
      if (result.status !== LoginStatus.OK) {
        const message = result.message || LOGIN_VALIDATION_MESSAGES[result.status];
        setError(message);
        logger.warn('[Session Validation] Validation failed:', { status: result.status, message });
      } else {
        logger.debug('[Session Validation] Validation successful');
      }
      
      return { 
        valid: result.status === LoginStatus.OK,
        requiresOtp: result.requiresOtp || false,
        sessionId: result.sessionId
      };
    } catch (error) {
      logger.error('[Session Validation] Failed to validate login session', error);
      setLoginStatus(LoginStatus.OK); // Reset to default
      setError('Failed to validate login session');
      return { valid: true, requiresOtp: false }; // Continue as valid in case of service error
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

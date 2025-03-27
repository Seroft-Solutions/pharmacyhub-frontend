"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { tokenManager } from '../core/tokenManager';
import { apiClient } from '@/features/core/tanstack-query-api';
import { AUTH_ENDPOINTS } from '../api/constants';
import { useDeviceId } from '../anti-sharing/hooks/useDeviceId';
import { useSessionValidation } from '../anti-sharing/hooks/useSessionValidation';
import { useAntiSharingStore } from '../anti-sharing/store';
import { LoginStatus } from '../anti-sharing/types';
import { logger } from '@/shared/lib/logger';

export const useLoginForm = (redirectPath = '/dashboard') => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Anti-sharing states
  const [showOtpChallenge, setShowOtpChallenge] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showTerminationResult, setShowTerminationResult] = useState(false);
  const [terminationSuccess, setTerminationSuccess] = useState(false);
  const [terminationError, setTerminationError] = useState<string | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const { login } = useAuth();
  
  // Anti-sharing hooks
  const { deviceId, getDeviceInfo } = useDeviceId();
  const { validateSession, loginStatus } = useSessionValidation();
  const setSessionId = useAntiSharingStore(state => state.setSessionId);
  const antiSharingError = useAntiSharingStore(state => state.error);

  // Update error if anti-sharing validation fails
  useEffect(() => {
    if (antiSharingError) {
      setError(antiSharingError);
    }
  }, [antiSharingError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Get device information for anti-sharing protection
      const deviceInfo = getDeviceInfo();
      
      console.log('Attempting login with:', { 
        email, 
        endpoint: AUTH_ENDPOINTS.LOGIN,
        deviceId: deviceInfo.deviceId
      });
      
      // Log API details for debugging
      console.debug('API details:', {
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        apiPath: process.env.NEXT_PUBLIC_API_PATH_PREFIX,
        endpoint: AUTH_ENDPOINTS.LOGIN,
        fullEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`
      });
      
      // Now use the Auth context login with device info
      const loginResponse = await login(email, password, deviceInfo);
      
      // Validate session for anti-sharing protection
      // Store validation result for later reference
      let validationResult = { valid: false, requiresOtp: false, sessionId: null };
      
      if (loginResponse?.user?.id) {
        const userId = loginResponse.user.id.toString();
        // Store the user ID for later use (e.g., in handleValidationContinue)
        setCurrentUserId(userId);
        
        logger.debug('[Auth] Validating session for user', {
          userId: userId,
          loginStatus: loginStatus
        });
        
        validationResult = await validateSession(userId);
        
        // Enhanced handling of validation result
        if (!validationResult.valid) {
          setIsLoading(false);
          logger.info('[Auth] Session validation failed', {
            status: loginStatus,
            requiresOtp: validationResult.requiresOtp
          });
          
          if (loginStatus === LoginStatus.TOO_MANY_DEVICES) {
            // User is already logged in from another device
            // Show validation error dialog with specific message about device limit
            const tooManyDevicesMessage = 'You are already logged in from another device. '
              + 'For security reasons, we only allow one active session at a time. '
              + 'Please log out from that device or click Continue to force logout other sessions.';
            
            logger.warn('[Auth] Login blocked due to too many devices', {
              userId: currentUserId,
              deviceId: deviceId,
              loginStatus: loginStatus
            });
            
            setError(tooManyDevicesMessage);
            setShowValidationError(true);
            return;
          } else if (validationResult.requiresOtp) {
            // Show OTP challenge modal for verification
            setShowOtpChallenge(true);
            return;
          } else {
            // Show general validation error dialog
            setShowValidationError(true);
            return;
          }
        }
        
        // Store session ID if provided
if (validationResult.sessionId) {
        logger.debug('[Auth] Storing session ID', { 
        sessionId: validationResult.sessionId
        });
        // First store it in global state
        setSessionId(validationResult.sessionId);
  // Then store it in tokenManager for inclusion in API requests
  tokenManager.setSessionId(validationResult.sessionId);
  
  // Verify that the session ID was properly stored
  const storedSessionId = tokenManager.getSessionId();
  if (storedSessionId !== validationResult.sessionId) {
    logger.error('[Auth] Session ID storage failure', { 
      expected: validationResult.sessionId,
      actual: storedSessionId
    });
  } else {
    logger.debug('[Auth] Session ID successfully stored and will be used for all API requests');
  }
}
      }
      
      // If we reach here, login and validation were successful
      
      // Ensure session ID is stored before redirecting
      const sessionId = tokenManager.getSessionId();
      if (sessionId) {
        logger.debug('[Auth] Using existing session ID for login:', { sessionId });
      } else if (validationResult?.sessionId) {
        // If tokenManager doesn't have sessionId but validation provided one, store it again
        logger.debug('[Auth] Setting session ID from validation result', { 
          sessionId: validationResult.sessionId 
        });
        tokenManager.setSessionId(validationResult.sessionId);
      } else {
        logger.warn('[Auth] No session ID available after successful login');
      }
      
      router.push(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      
      if (err instanceof Error) {
        // Enhanced error handling with specific focus on anti-sharing violations
        logger.debug('[Auth] Processing login error', { 
          errorMessage: err.message,
          hasResponseData: !!(err as any).response?.data,
          hasErrorData: !!(err as any).data
        });

        // Get the detailed error message from response if available
        let errorMessage = err.message;
        let errorData: any = null;
        
        // Try to extract detailed error info based on different error structures
        if ((err as any).response?.data) {
          errorData = (err as any).response.data;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else if ((err as any).data) {
          errorData = (err as any).data;
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
        
        logger.debug('[Auth] Processing login error details', { 
          errorMessage,
          errorData,
          statusCode: (err as any).status || (err as any).statusCode || ((err as any).response?.status),
          hasAntiSharingText: (
            errorMessage.includes('already logged in') || 
            errorMessage.includes('another device') || 
            errorMessage.includes('TOO_MANY_DEVICES') ||
            errorMessage.includes('too many devices') ||
            errorMessage.includes('You are already logged in')
          )
        });
        
        // Check for anti-sharing specific error message or 401 Unauthorized with specific text
        const statusCode = (err as any).status || (err as any).statusCode || ((err as any).response?.status);
        const isAntiSharingError = 
          errorMessage.includes('already logged in') || 
          errorMessage.includes('another device') || 
          errorMessage.includes('TOO_MANY_DEVICES') ||
          errorMessage.includes('too many devices') ||
          errorMessage.includes('You are already logged in') ||
          errorMessage === 'You are already logged in from another device. Please log out from that device first.' ||
          (errorData && errorData.status === 'TOO_MANY_DEVICES') ||
          (statusCode === 401 && errorMessage.includes('already logged in')) ||
          (statusCode === 401 && errorMessage.includes('another device'));
        if (isAntiSharingError) {
          // This is an anti-sharing violation
          logger.warn('[Auth] Detected anti-sharing violation', { 
            errorMessage, 
            statusCode,
            deviceId 
          });
          
          // Set the proper login status from useSessionValidation hook
          const { setLoginStatus } = useAntiSharingStore.getState();
          setLoginStatus(LoginStatus.TOO_MANY_DEVICES);
          
          // Show user-friendly message
          const tooManyDevicesMessage = 'You are already logged in from another device. ' +
            'For security reasons, we only allow one active session at a time. ' +
            'Please log out from that device or click "Log Out Other Devices" to continue with this session.';
          
          setError(tooManyDevicesMessage);
          
          // Show the validation error dialog
          setShowValidationError(true);
          return;
        }
        if (errorMessage.includes('unverified') || errorMessage.includes('not verified') || errorMessage.includes('verification')) {
          setError('Your account has not been verified. Please check your email for verification instructions.');
          // Offer option to resend verification
          console.debug('Account verification required for:', email);
        } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
          setError('Access forbidden - check API permissions and CORS settings');
        } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          setError('Invalid email or password');
        } else if (errorMessage.includes('Network Error')) {
          setError(`Network error - check if the backend server is running at ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
        } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
          setError(`API endpoint not found - check if /api/auth/login is the correct path`);
        } else if (errorMessage.includes('timeout')) {
          setError('Request timed out - server may be overloaded or unreachable');
        } else if (errorMessage.includes('Invalid login response')) {
          setError('API response format mismatch - The server returned data in a different format than expected');
          console.error('Response format mismatch - API may be returning a nested structure:', { 
            message: errorMessage,
            apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
            endpoint: AUTH_ENDPOINTS.LOGIN
          });
        } else {
          // Show more detailed error message
          setError(`Login error: ${errorMessage}`);
        }
        
        // Log additional details for debugging
        console.debug('Login error details:', { 
          message: err.message,
          apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
          endpoint: AUTH_ENDPOINTS.LOGIN,
          payload: { emailAddress: email, password: '[REDACTED]' }
        });
      } else {
        setError('Invalid email or password - unexpected error format');
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router, redirectPath, getDeviceInfo, validateSession, setSessionId]);

  const handleSocialLogin = useCallback((provider: 'google') => {
    // Get Google configuration value
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '919555990168-5ncdcjifms0qoepfs0pnuo66d3d0ad1u.apps.googleusercontent.com';
    
    // Set up callback URL
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
    
    // Add state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2);
    // Store state in sessionStorage for validation in the callback
    sessionStorage.setItem('oauth_state', state);
    
    // Google OAuth 2.0 parameters
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const googleParams = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      state: state,
      access_type: 'offline',
      prompt: 'select_account'
    });
    
    // Log redirect for debugging
    console.log(`[Auth] Redirecting to Google OAuth, callback: ${window.location.origin}/auth/callback`);
    
    // Redirect to Google OAuth
    window.location.href = `${googleAuthUrl}?${googleParams.toString()}`;
  }, []);

  // Handle OTP verification
  const handleOtpVerification = async (otp: string): Promise<boolean> => {
    try {
      // Call the OTP verification API
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp,
          deviceId,
          userAgent: navigator.userAgent
        }),
      });
      
      if (!response.ok) {
        return false;
      }
      
      const result = await response.json();
      
      // Store session ID if provided
      if (result.sessionId) {
        setSessionId(result.sessionId);
      }
      
      // Redirect after successful verification
      router.push(redirectPath);
      
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  // Handle validation error continuation
  const handleValidationContinue = async () => {
    if (loginStatus === LoginStatus.TOO_MANY_DEVICES) {
      // Set UI state for termination in progress
      setIsTerminating(true);
      
      try {
        // Force logout from other devices
        logger.info('[Auth] Forcing logout from other devices');
        
        // Get current session ID if available
        const sessionId = tokenManager.getSessionId();
        
        if (!sessionId) {
          logger.warn('[Auth] Session ID not available, generating temporary ID');
          // Generate a temporary session ID if needed
          const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
          tokenManager.setSessionId(tempSessionId);
        }
        
        // Get the session ID again (might be the original or newly generated)
        const currentSessionId = tokenManager.getSessionId();
        
        // Call API to terminate other sessions
        if (currentSessionId) {
          try {
            // Import the terminateOtherSessions function
            const { terminateOtherSessions } = await import('../anti-sharing/api/sessionApi');
            
            // Call the API to terminate other sessions
            // Use the stored userId from state
            if (currentUserId) {
              logger.debug('[Auth] Terminating other sessions for user', {
                userId: currentUserId,
                sessionId: currentSessionId
              });
              
              const result = await terminateOtherSessions(currentUserId, currentSessionId);
              
              if (result && result.success) {
                logger.debug('[Auth] Successfully terminated other sessions', result);
                
                // Show success result
                setTerminationSuccess(true);
                setTerminationError(null);
                setShowValidationError(false);
                setShowTerminationResult(true);
                
                // Redirect after showing success message
                setTimeout(() => {
                  setShowTerminationResult(false);
                  router.push(redirectPath);
                }, 3000);
              } else {
                throw new Error('Failed to terminate other sessions: ' + (result?.message || 'Unknown error'));
              }
            } else {
              throw new Error('User ID not available for terminating sessions');
            }
          } catch (terminateError) {
            logger.error('[Auth] Failed to terminate other sessions', terminateError);
            
            // Show error result
            setTerminationSuccess(false);
            setTerminationError(terminateError instanceof Error ? 
              terminateError.message : 
              'Failed to terminate other sessions. Please try again or contact support.');
            setShowValidationError(false);
            setShowTerminationResult(true);
          }
        } else {
          logger.error('[Auth] No session ID available for terminating other sessions');
          
          // Show error result
          setTerminationSuccess(false);
          setTerminationError('Session information not available. Please try logging in again.');
          setShowValidationError(false);
          setShowTerminationResult(true);
        }
      } catch (error) {
        logger.error('[Auth] Error in validation continuation', error);
        
        // Show error result
        setTerminationSuccess(false);
        setTerminationError('Failed to continue login process. Please try again.');
        setShowValidationError(false);
        setShowTerminationResult(true);
      } finally {
        setIsTerminating(false);
      }
    } else {
      // For other validation statuses, just show OTP challenge
      setShowValidationError(false);
      setShowOtpChallenge(true);
    }
  };

  // Cancel login attempt
  const handleCancel = () => {
    setShowValidationError(false);
    setShowOtpChallenge(false);
    setShowTerminationResult(false);
  };
  
  // Handle termination result close
  const handleTerminationResultClose = () => {
    setShowTerminationResult(false);
    
    // If termination was successful, redirect to dashboard
    if (terminationSuccess) {
      router.push(redirectPath);
    }
    // If termination failed, allow user to try again
    else {
      setShowValidationError(true);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    isLoading,
    handleSubmit,
    handleSocialLogin,
    // Anti-sharing properties
    showOtpChallenge,
    showValidationError,
    setShowValidationError, // Expose this for direct control
    showTerminationResult,
    terminationSuccess,
    terminationError,
    isTerminating,
    loginStatus,
    handleOtpVerification,
    handleValidationContinue,
    handleCancel,
    handleTerminationResultClose
  };
};
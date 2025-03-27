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

export const useLoginForm = (redirectPath = '/dashboard') => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Anti-sharing states
  const [showOtpChallenge, setShowOtpChallenge] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
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
        // More detailed error handling
        if (err.message.includes('unverified') || err.message.includes('not verified') || err.message.includes('verification')) {
          setError('Your account has not been verified. Please check your email for verification instructions.');
          // Offer option to resend verification
          console.debug('Account verification required for:', email);
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          setError('Access forbidden - check API permissions and CORS settings');
        } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('Invalid email or password');
        } else if (err.message.includes('Network Error')) {
          setError(`Network error - check if the backend server is running at ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
        } else if (err.message.includes('404') || err.message.includes('Not Found')) {
          setError(`API endpoint not found - check if /api/auth/login is the correct path`);
        } else if (err.message.includes('timeout')) {
          setError('Request timed out - server may be overloaded or unreachable');
        } else if (err.message.includes('Invalid login response')) {
          setError('API response format mismatch - The server returned data in a different format than expected');
          console.error('Response format mismatch - API may be returning a nested structure:', { 
            message: err.message,
            apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
            endpoint: AUTH_ENDPOINTS.LOGIN
          });
        } else {
          // Show more detailed error message
          setError(`Login error: ${err.message}`);
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
    setShowValidationError(false);
    setIsLoading(true);
    
    try {
      if (loginStatus === LoginStatus.TOO_MANY_DEVICES) {
        // Force logout from other devices
        logger.info('[Auth] Forcing logout from other devices');
        
        // Get current session ID if available
        const sessionId = tokenManager.getSessionId();
        
        // Call API to terminate other sessions
        if (sessionId) {
          try {
            // Import the terminateOtherSessions function
            const { terminateOtherSessions } = await import('../anti-sharing/api/sessionApi');
            
            // Call the API to terminate other sessions
            // Use the stored userId from state
            if (currentUserId) {
              logger.debug('[Auth] Terminating other sessions for user', {
                userId: currentUserId,
                sessionId: sessionId
              });
              
              const result = await terminateOtherSessions(currentUserId, sessionId);
              
              if (result && result.success) {
                logger.debug('[Auth] Successfully terminated other sessions', result);
                // Show confirmation to user
                setError('Other sessions have been terminated. You can now proceed with login.');
                setTimeout(() => {
                  // Try logging in again after a short delay to allow the user to see the message
                  router.push(redirectPath);
                }, 2000);
              } else {
                throw new Error('Failed to terminate other sessions: ' + (result?.message || 'Unknown error'));
              }
            } else {
              throw new Error('User ID not available for terminating sessions');
            }
          } catch (terminateError) {
            logger.error('[Auth] Failed to terminate other sessions', terminateError);
            setError('Failed to terminate other sessions. Please try again or contact support.');
            // Don't continue with login if termination fails - user should try again
          }
        } else {
          logger.error('[Auth] No session ID available for terminating other sessions');
          setError('Session information not available. Please try logging in again.');
        }
      } else {
        // Show OTP challenge for other validation errors
        setShowOtpChallenge(true);
      }
    } catch (error) {
      logger.error('[Auth] Error in validation continuation', error);
      setError('Failed to continue login process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel login attempt
  const handleCancel = () => {
    setShowValidationError(false);
    setShowOtpChallenge(false);
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
    loginStatus,
    handleOtpVerification,
    handleValidationContinue,
    handleCancel
  };
};
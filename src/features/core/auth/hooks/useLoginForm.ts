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
      
      logger.info('Attempting login with:', { 
        email, 
        endpoint: AUTH_ENDPOINTS.LOGIN,
        deviceId: deviceInfo.deviceId ? '[PRESENT]' : '[MISSING]'
      });
      
      // Log API details for debugging
      logger.debug('API details:', {
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        apiPath: process.env.NEXT_PUBLIC_API_PATH_PREFIX,
        endpoint: AUTH_ENDPOINTS.LOGIN
      });
      
      // Now use the Auth context login with device info
      const loginResponse = await login(email, password, deviceInfo);
      
      // Validate session for anti-sharing protection
      if (loginResponse?.user?.id) {
        const validationResult = await validateSession(loginResponse.user.id.toString());
        
        // Handle validation result
        if (!validationResult.valid) {
          setIsLoading(false);
          
          if (validationResult.requiresOtp) {
            // Show OTP challenge modal
            setShowOtpChallenge(true);
            return;
          } else {
            // Show validation error dialog
            setShowValidationError(true);
            return;
          }
        }
        
        // Store session ID if provided
        if (validationResult.sessionId) {
          setSessionId(validationResult.sessionId);
        }
      }
      
      // If we reach here, login and validation were successful
      router.push(redirectPath);
    } catch (err) {
      logger.error('Login error:', err);
      
      if (err instanceof Error) {
        // More detailed error handling
        if (err.message.includes('unverified') || err.message.includes('not verified') || err.message.includes('verification')) {
          setError('Your account has not been verified. Please check your email for verification instructions.');
          // Offer option to resend verification
          logger.debug('Account verification required for:', email);
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
          logger.error('Response format mismatch - API may be returning a nested structure:', { 
            message: err.message,
            apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
            endpoint: AUTH_ENDPOINTS.LOGIN
          });
        } else {
          // Show more detailed error message
          setError(`Login error: ${err.message}`);
        }
        
        // Log additional details for debugging
        logger.debug('Login error details:', { 
          message: err.message,
          apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
          endpoint: AUTH_ENDPOINTS.LOGIN
        });
      } else {
        setError('Invalid email or password - unexpected error format');
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router, redirectPath, getDeviceInfo, validateSession, setSessionId]);

  const handleSocialLogin = useCallback((provider: 'google') => {
    try {
      // Get Google configuration value with fallback
      const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '919555990168-5ncdcjifms0qoepfs0pnuo66d3d0ad1u.apps.googleusercontent.com';
      
      // Set up callback URL
      const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
      
      // Add state parameter for CSRF protection
      const state = Math.random().toString(36).substring(2);
      // Store state in sessionStorage for validation in the callback
      sessionStorage.setItem('oauth_state', state);
      
      // Store device info in sessionStorage for the callback
      if (deviceId) {
        sessionStorage.setItem('oauth_device_id', deviceId);
      }
      
      // Google OAuth 2.0 parameters - simplified to reduce potential browser extension interference
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const googleParams = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `${window.location.origin}/auth/callback`,
        response_type: 'code',
        scope: 'email profile',
        state: state,
        prompt: 'select_account'
      });
      
      logger.info(`[Auth] Redirecting to Google OAuth: ${googleAuthUrl}?client_id=REDACTED&redirect_uri=${callbackUrl}`);
      
      // Use a normal redirect instead of location.href to avoid potential interference
      // from browser extensions or security settings
      const redirectUrl = `${googleAuthUrl}?${googleParams.toString()}`;
      
      // Open in the same window, using a straightforward method
      window.location.href = redirectUrl;
    } catch (error) {
      logger.error('[Auth] Error initiating social login:', error);
      setError('Failed to start Google login. Please try again.');
    }
  }, [deviceId]);

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
      logger.error('OTP verification error:', error);
      return false;
    }
  };

  // Handle validation error continuation
  const handleValidationContinue = () => {
    setShowValidationError(false);
    
    if (loginStatus === LoginStatus.TOO_MANY_DEVICES) {
      // Redirect to device management page
      router.push('/account/devices');
    } else {
      // Show OTP challenge for other validation errors
      setShowOtpChallenge(true);
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
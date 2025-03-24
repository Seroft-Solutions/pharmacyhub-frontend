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
      console.error('Login error:', err);
      
      if (err instanceof Error) {
        // More detailed error handling
        if (err.message.includes('403') || err.message.includes('Forbidden')) {
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

  const handleSocialLogin = useCallback((provider: 'google' | 'facebook') => {
    // For social login, we'll redirect to Keycloak's login page with the selected provider
    const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL || 'http://localhost:8080';
    const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pharmacyhub';
    const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pharmacyhub-client';

    // Direct backend callback URL
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const identityProvider = provider === 'google' ? 'google' : 'facebook';

    window.location.href = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid&kc_idp_hint=${identityProvider}`;
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

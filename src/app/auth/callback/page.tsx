'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/core/auth/hooks/useAuth';
import { useDeviceId } from '@/features/core/auth/anti-sharing/hooks/useDeviceId';
import { useSessionValidation } from '@/features/core/auth/anti-sharing/hooks/useSessionValidation';
import { useAntiSharingStore } from '@/features/core/auth/anti-sharing/store';
import { LoginStatus } from '@/features/core/auth/anti-sharing/types';
import { logger } from '@/shared/lib/logger';

// Loading component for suspense fallback
function AuthCallbackLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="animate-pulse space-y-4">
          <div className="rounded-full bg-blue-100 h-16 w-16 mx-auto"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with search params
function AuthCallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error_param = searchParams.get('error');
  
  // Get anti-sharing hooks
  const { deviceId, getDeviceInfo } = useDeviceId();
  const { validateSession, loginStatus } = useSessionValidation();
  const setSessionId = useAntiSharingStore(state => state.setSessionId);
  
  // Get auth hooks
  const { processSocialLogin } = useAuth();

  useEffect(() => {
    // Check for errors in the callback params
    if (error_param) {
      logger.error('[Social Auth] Error in callback params:', error_param);
      setError(`Authentication error: ${error_param}`);
      setLoading(false);
      return;
    }

    // If no code is present, something went wrong
    if (!code) {
      logger.error('[Social Auth] No authentication code received');
      setError('No authentication code received');
      setLoading(false);
      return;
    }
    
    // Validate the state parameter to protect against CSRF attacks
    const storedState = sessionStorage.getItem('oauth_state');
    const receivedState = state;
    
    if (!storedState || !receivedState || storedState !== receivedState) {
      logger.error('[Social Auth] State validation failed');
      setError('Security validation failed. Please try again.');
      setLoading(false);
      return;
    }
    
    // Clear the stored state after validation
    sessionStorage.removeItem('oauth_state');

    const handleSocialLoginCallback = async () => {
      try {
        logger.info('[Social Auth] Processing callback with authorization code');
        
        // Get device information for anti-sharing protection
        const deviceInfo = getDeviceInfo();
        logger.debug('[Social Auth] Device info for login:', { 
          deviceId: deviceInfo.deviceId ? '[PRESENT]' : '[MISSING]',
          hasUserAgent: !!deviceInfo.userAgent
        });
        
        // Process social login
        const loginResponse = await processSocialLogin(code, deviceInfo);
        logger.info('[Social Auth] Received login response:', { 
          success: !!loginResponse,
          hasUser: !!loginResponse?.user,
          hasTokens: !!loginResponse?.tokens
        });
        
        // Store session ID if provided in the response
        if (loginResponse?.sessionId) {
          logger.info('[Social Auth] Session ID received directly from login response:', loginResponse.sessionId);
          sessionStorage.setItem('sessionId', loginResponse.sessionId);
          setSessionId(loginResponse.sessionId);
        }
        
        // Validate session for anti-sharing protection if no session ID yet
        if (!loginResponse?.sessionId && loginResponse?.user?.id) {
          logger.debug('[Social Auth] No session ID in response, validating session for user:', loginResponse.user.id);
          const validationResult = await validateSession(loginResponse.user.id.toString());
          
          // Handle session validation
          if (!validationResult.valid) {
            logger.warn('[Social Auth] Session validation failed:', validationResult.status);
            
            if (validationResult.requiresOtp) {
              // Redirect to OTP verification page
              logger.info('[Social Auth] Redirecting to OTP verification');
              router.push(`/auth/verify-otp?sessionId=${validationResult.sessionId}`);
              return;
            } else if (validationResult.status === LoginStatus.TOO_MANY_DEVICES) {
              // Redirect to session conflict page
              logger.info('[Social Auth] Redirecting to session conflict page');
              router.push('/auth/session-conflict');
              return;
            }
          }
          
          // Store session ID if provided
          if (validationResult.sessionId) {
            logger.debug('[Social Auth] Storing session ID from validation result:', validationResult.sessionId);
            sessionStorage.setItem('sessionId', validationResult.sessionId);
            setSessionId(validationResult.sessionId);
          }
        }
        
        // Redirect to dashboard on success
        logger.info('[Social Auth] Login successful, redirecting to dashboard');
        router.push('/dashboard');
      } catch (err) {
        logger.error('[Social Auth] Social login error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process social login');
      } finally {
        setLoading(false);
      }
    };

    handleSocialLoginCallback();
  }, [code, state, router, processSocialLogin, getDeviceInfo, validateSession, setSessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-800">Authenticating...</h2>
          <p className="mt-2 text-gray-600">We're processing your Google login credentials.</p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-left text-gray-600">Validating credentials</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-left text-gray-600">Setting up secure session</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
              <p className="text-sm text-left text-gray-600">Preparing dashboard</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-center text-gray-800">Login Error</h2>
          <p className="mb-6 text-center text-gray-600">{error}</p>
          <div className="space-y-3 text-sm text-gray-600">
            <p>Some common causes for authentication errors:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your security token may have expired</li>
              <li>There might be a network connectivity issue</li>
              <li>The authentication server might be temporarily unavailable</li>
            </ul>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-center text-gray-800">Authentication Successful!</h2>
        <p className="mb-6 text-center text-gray-600">You've been successfully authenticated. Redirecting you to the dashboard...</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Export the wrapped component
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

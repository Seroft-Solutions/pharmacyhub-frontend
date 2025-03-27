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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Loading authentication details...</p>
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Processing your login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Login Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Redirecting...</p>
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

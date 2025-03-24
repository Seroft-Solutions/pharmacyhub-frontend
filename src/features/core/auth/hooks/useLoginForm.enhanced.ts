/**
 * Enhanced useLoginForm hook with anti-sharing protection
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { storeTokens } from '../core/tokenManager.enhanced';
import { useDeviceId } from '../anti-sharing/hooks/useDeviceId';
import { useSessionValidation } from '../anti-sharing/hooks/useSessionValidation';
import { LoginStatus } from '../anti-sharing/types';
import { useAntiSharingStore } from '../anti-sharing/store/antiSharingStore';

// Login form validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface UseLoginFormOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useLoginForm = (options: UseLoginFormOptions = {}) => {
  const { redirectTo = '/dashboard', onSuccess, onError } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpChallenge, setShowOtpChallenge] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  // Anti-sharing hooks
  const { deviceId, getDeviceInfo } = useDeviceId();
  const { validateSession, loginStatus } = useSessionValidation();
  const setSessionId = useAntiSharingStore(state => state.setSessionId);
  
  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  // Handle login form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Call the login API with device information
      const deviceInfo = getDeviceInfo();
      
      // Merge form data with device information
      const loginPayload = {
        ...data,
        deviceId: deviceInfo.deviceId,
        userAgent: navigator.userAgent,
      };
      
      // Make login request to the server
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const responseData = await response.json();
      
      // Store auth tokens
      storeTokens(responseData.accessToken, responseData.refreshToken);
      
      // Validate the login session
      const { userId } = responseData;
      const validationResult = await validateSession(userId);
      
      // Handle validation result
      if (!validationResult.valid) {
        if (validationResult.requiresOtp) {
          // Show OTP challenge
          setShowOtpChallenge(true);
        } else {
          // Show validation error dialog
          setShowValidationError(true);
        }
        return;
      }
      
      // Store session ID if provided
      if (validationResult.sessionId) {
        setSessionId(validationResult.sessionId);
      }
      
      // Success handling
      toast({
        title: 'Login successful',
        description: 'You have been logged in successfully.',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect after successful login
      router.push(redirectTo);
      
    } catch (error) {
      // Error handling
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      
      // Success handling
      toast({
        title: 'Verification successful',
        description: 'Your identity has been verified.',
      });
      
      // Redirect after successful verification
      router.push(redirectTo);
      
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  // Handle validation error continuation
  const handleValidationContinue = () => {
    if (loginStatus === LoginStatus.TOO_MANY_DEVICES) {
      // Redirect to device management page
      router.push('/account/devices');
    } else {
      // Show OTP challenge for other validation errors
      setShowValidationError(false);
      setShowOtpChallenge(true);
    }
  };

  // Cancel login attempt
  const handleCancel = () => {
    setShowValidationError(false);
    setShowOtpChallenge(false);
    form.reset();
  };

  return {
    form,
    isLoading,
    onSubmit,
    showOtpChallenge,
    showValidationError,
    loginStatus,
    handleOtpVerification,
    handleValidationContinue,
    handleCancel,
  };
};

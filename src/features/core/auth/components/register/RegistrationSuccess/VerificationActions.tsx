"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  LogIn,
  Home
} from 'lucide-react';
import { authService } from '@/features/core/auth/api/services/authService';
import { ROUTES } from '@/features/core/auth/config/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VerificationActionsProps {
  email: string;
}

export const VerificationActions: React.FC<VerificationActionsProps> = ({ 
  email 
}) => {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCount, setResendCount] = useState(0);
  
  // Get the resend verification mutation
  const { mutateAsync: resendVerification } = authService.useResendVerification();
  
  const handleResendVerification = async () => {
    // Don't allow multiple resend attempts while one is in progress
    if (isResending) return;
    
    // Limit resend attempts to prevent abuse
    if (resendCount >= 3) {
      setResendStatus('error');
      setErrorMessage('Too many verification attempts. Please try again later or contact support.');
      return;
    }
    
    setIsResending(true);
    setResendStatus('idle');
    setErrorMessage('');
    
    try {
      // Get device info
      const deviceId = `web-${Math.random().toString(36).substring(2, 9)}`;
      const userAgent = navigator.userAgent;
      
      // Call the resend verification endpoint
      await resendVerification({ 
        emailAddress: email,
        deviceId,
        userAgent,
        ipAddress: window.location.hostname
      });
      
      // Show success message
      setResendStatus('success');
      setResendCount(prev => prev + 1);
      
      // Reset after 10 seconds
      setTimeout(() => {
        setResendStatus('idle');
      }, 10000);
    } catch (error) {
      console.error('Error resending verification email:', error);
      
      // Show appropriate error message
      setResendStatus('error');
      
      if (error instanceof Error) {
        // Determine user-friendly error message based on error
        let message = 'Failed to resend verification email';
        
        const errorText = error.message.toLowerCase();
        if (errorText.includes('too many requests') || 
            errorText.includes('rate limit')) {
          message = 'Please wait before requesting another verification email';
        } else if (errorText.includes('already verified')) {
          message = 'This email has already been verified';
        } else if (errorText.includes('not found')) {
          message = 'Email address not found. Please register again';
        }
        
        setErrorMessage(message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setIsResending(false);
    }
  };
  
  // Function to go to login page
  const goToLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  // Function to go to home page
  const goToHome = () => {
    router.push('/');
  };
  
  return (
    <div className="w-full">
      {/* Status alerts */}
      {resendStatus === 'success' && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertTitle className="text-green-800 font-medium">
            Email Sent Successfully
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Verification email has been sent to {email}.
          </AlertDescription>
        </Alert>
      )}
      
      {resendStatus === 'error' && (
        <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle className="text-red-800 font-medium">
            Email Send Failed
          </AlertTitle>
          <AlertDescription className="text-red-700">
            {errorMessage || 'Failed to resend verification email. Please try again later.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          variant="outline"
          onClick={goToHome}
          className="w-full"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={goToLogin}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Go to Login
        </Button>
      </div>
      
      {/* Resend verification button */}
      <div className="flex justify-center mt-6">
        <Button
          variant="ghost"
          size="sm"
          disabled={isResending || resendStatus === 'success' || resendCount >= 3}
          onClick={handleResendVerification}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : resendCount >= 3 ? (
            <>
              Max attempts reached
            </>
          ) : (
            <>
              <Send className="mr-2 h-3 w-3" />
              Resend verification email
            </>
          )}
        </Button>
      </div>

      {/* Attempts counter */}
      {resendCount > 0 && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Resend attempts: {resendCount}/3
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationActions;

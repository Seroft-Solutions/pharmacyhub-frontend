"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Send, 
  MailOpen, 
  Loader2, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { authService } from '@/features/core/auth/api/services/authService';
import { ROUTES } from '@/features/core/auth/config/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  
  // Get the resend verification mutation
  const { mutateAsync: resendVerification } = authService.useResendVerification();
  
  const handleResendVerification = async () => {
    // Don't allow multiple resend attempts while one is in progress
    if (isResending) return;
    
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
      
      // Reset after 5 seconds
      setTimeout(() => {
        setResendStatus('idle');
      }, 5000);
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
  
  // Function to open default email client
  const openEmailClient = () => {
    window.location.href = `mailto:${email}`;
  };
  
  // Function to go to login page
  const goToLogin = () => {
    router.push(ROUTES.LOGIN);
  };
  
  return (
    <div className="w-full max-w-md">
      {/* Status alerts */}
      {resendStatus === 'success' && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Verification email sent successfully! Please check your inbox.
          </AlertDescription>
        </Alert>
      )}
      
      {resendStatus === 'error' && (
        <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {errorMessage || 'Failed to resend verification email. Please try again later.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={goToLogin}
          className="flex-1"
        >
          Go to Login
        </Button>
        
        <Button
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={openEmailClient}
        >
          <MailOpen className="mr-2 h-4 w-4" />
          Open Email App
        </Button>
      </div>
      
      {/* Resend verification button */}
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          disabled={isResending || resendStatus === 'success'}
          onClick={handleResendVerification}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-3 w-3" />
              Resend verification email
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

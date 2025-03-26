"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AUTH_ENDPOINTS } from '@/features/core/auth/api/constants';
import { authService } from '@/features/core/auth/api/services/authService';
import { ResetStep } from '../../model/types';
import { apiClient } from '@/features/core/tanstack-query-api';

// Import shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Import icons
import { 
  KeyRound, 
  Mail, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  CheckCircle,
  MailOpen
} from 'lucide-react';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<ResetStep>('request');
  
  // Use the auth service hook directly
  const { mutateAsync: requestPasswordReset, isPending } = authService.useRequestPasswordReset();
  
  // Debug mode for development
  const [debugMode, setDebugMode] = useState(false);
  const [lastRequestData, setLastRequestData] = useState<any>(null);

  // Get user's browser/device info to help with debugging
  const getUserAgent = () => {
    if (typeof window !== 'undefined') {
      return window.navigator.userAgent;
    }
    return 'unknown';
  };
  
  const getRequestData = () => {
    // Format data as the backend expects it
    return { 
      emailAddress: email,
      ipAddress: '',
      userAgent: getUserAgent(),
      deviceId: 'web-' + Math.random().toString(36).substring(2, 9)
    };
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      // For backend compatibility, use the emailAddress property instead of email
      const requestData = getRequestData();
      setLastRequestData(requestData);
      
      try {
        // Primary method: Use the hook with email parameter
        // It will be transformed to emailAddress in the hook
        await requestPasswordReset({ email });
      } catch (hookError) {
        console.error("Hook method failed, trying direct API call", hookError);
        
        // Fallback method: If the hook failed, try a direct API call
        await apiClient.post(AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, requestData);
      }
      
      setCurrentStep('success');
    } catch (err) {
      // Store full error for debug display
      const fullError = err instanceof Error ? err.message : String(err);
      console.error("Password reset request error:", fullError);
      
      // User-friendly error message
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes('not found')) {
          setError('Account with this email not found');
        } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
          setError('Too many reset attempts. Please try again later.');
        } else if (errorMessage.includes('no endpoint') || errorMessage.includes('404')) {
          setError('Service temporarily unavailable. Please try again later.');
        } else if (errorMessage.includes('400') || errorMessage.includes('bad request')) {
          setError('Invalid email format or missing required information.');
        } else if (errorMessage.includes('validation')) {
          setError('Validation failed. Please check your input.');
        } else {
          setError(err.message || 'Failed to send reset email');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      
      // Set debug info
      if (process.env.NODE_ENV === 'development') {
        setDebugMode(true); // Automatically show debug info on error
      }
    }
  };

  const renderRequestStep = () => (
    <form onSubmit={handleRequestReset} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-gray-300 bg-white"
            required
          />
        </div>
        <p className="text-xs text-gray-500">
          We'll send a password reset link to this email address
        </p>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          <>
            Send reset link
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-900">Check your email</h3>
        <p className="text-sm text-gray-600">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-left">
          <div className="flex items-start">
            <MailOpen className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Next steps:</p>
              <ol className="list-decimal text-sm text-blue-700 ml-5 mt-1 space-y-1">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the reset link in the email</li>
                <li>Create a new secure password</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 space-y-3">
        <Button
          onClick={() => window.location.href = '/login'}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Return to login
        </Button>
        
        <p className="text-sm text-gray-500">
          Didn't receive the email?{' '}
          <button
            type="button"
            onClick={() => setCurrentStep('request')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try again
          </button>
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'request':
        return renderRequestStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderRequestStep();
    }
  };

  return (
    <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/90">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex justify-center mb-4">
          <div className="size-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-4 shadow-lg">
            <KeyRound className="text-white h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Reset your password
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          {currentStep === 'request' && "Enter your email to receive a password reset link"}
          {currentStep === 'success' && "Check your email for password reset instructions"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-6 p-3 rounded flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {renderCurrentStep()}
        
        {/* Debug information in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-2 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setDebugMode(!debugMode)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            {debugMode && (
              <div className="mt-2 p-2 bg-gray-50 text-left rounded text-xs font-mono overflow-auto max-h-60">
                <p>Endpoint: {AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET}</p>
                <p>isPending: {isPending ? 'true' : 'false'}</p>
                <p>Error: {error || 'None'}</p>
                <p>Email: {email || 'Not entered'}</p>
                <p>Current Step: {currentStep}</p>
                {lastRequestData && (
                  <>
                    <p className="mt-2 text-blue-500">Last Request Data:</p>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(lastRequestData, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {currentStep === 'request' && (
        <CardFooter className="flex flex-col items-center justify-center p-6 border-t bg-gray-50 rounded-b-lg">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to login
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

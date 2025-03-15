"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePasswordResetRequestMutation as useRequestPasswordReset } from '@/features/core/auth/api/mutations';
import { ResetStep } from '../../model/types';

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
  Lock
} from 'lucide-react';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<ResetStep>('request');
  
  const requestResetMutation = useRequestPasswordReset();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      await requestResetMutation.mutateAsync({ email });
      setCurrentStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // In a real implementation, we would call an API endpoint here
      // For now, we'll just simulate a successful verification
      setCurrentStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
        disabled={requestResetMutation.isPending}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {requestResetMutation.isPending ? (
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

  const renderVerificationStep = () => (
    <form onSubmit={handleVerifyCode} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
        <p className="text-sm text-blue-800">
          We&apos;ve sent a verification code to <strong>{email}</strong>. 
          Please check your inbox and enter the code below.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verification-code" className="text-gray-700">
            Verification code
          </Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="pl-10 border-gray-300 bg-white"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-gray-700">
            New password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 border-gray-300 bg-white"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-gray-700">
            Confirm new password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 border-gray-300 bg-white"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Reset password
        </Button>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setCurrentStep('request')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Different email? Go back
          </button>
        </div>
      </div>
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
        <h3 className="text-xl font-medium text-gray-900">Password reset successful</h3>
        <p className="text-sm text-gray-600">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
      </div>
      
      <Button
        onClick={() => window.location.href = '/login'}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        Return to login
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'request':
        return renderRequestStep();
      case 'verification':
        return renderVerificationStep();
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
          {currentStep === 'success' ? 'Password Reset Complete' : 'Reset your password'}
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          {currentStep === 'request' && "Enter your email to receive a password reset link"}
          {currentStep === 'verification' && "Enter the verification code and set a new password"}
          {currentStep === 'success' && "You&apos;ve successfully reset your password"}
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
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center p-6 border-t bg-gray-50 rounded-b-lg">
        <p className="text-sm text-gray-600">
          {currentStep !== 'success' && (
            <>
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Back to login
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

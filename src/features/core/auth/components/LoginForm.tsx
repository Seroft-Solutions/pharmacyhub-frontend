'use client';

import React, { useEffect } from 'react';
import { useLoginForm } from '../hooks/useLoginForm.enhanced';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { OTPChallenge } from '../anti-sharing/components';
import { SessionTerminationResult } from '../anti-sharing/components';
import { InlineErrorMessage } from './login/InlineErrorMessage';

interface LoginFormProps {
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  const {
    form,
    isLoading,
    onSubmit,
    showOtpChallenge,
    showValidationError,
    showTerminationResult,
    terminationSuccess,
    terminationError,
    isTerminating,
    loginStatus,
    handleOtpVerification,
    handleValidationContinue,
    handleCancel,
    handleTerminationResultClose,
  } = useLoginForm({ redirectTo });

  // Debug useEffect to verify state changes
  useEffect(() => {
    console.log('[Debug] LoginForm state:', { 
      showValidationError, 
      showOtpChallenge, 
      loginStatus,
      isLoading 
    });
  }, [showValidationError, showOtpChallenge, loginStatus, isLoading]);

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Display inline error message when anti-sharing violation is detected */}
          {showValidationError && (
            <InlineErrorMessage
              status={loginStatus}
              onContinue={handleValidationContinue}
              onCancel={handleCancel}
              isProcessing={isTerminating}
            />
          )}
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading || showValidationError}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
      
      {/* OTP challenge dialog */}
      {showOtpChallenge && (
        <OTPChallenge
          isOpen={showOtpChallenge}
          onVerify={handleOtpVerification}
          onCancel={handleCancel}
        />
      )}
      
      {/* Session termination result dialog */}
      {showTerminationResult && (
        <SessionTerminationResult
          isOpen={showTerminationResult}
          success={terminationSuccess}
          errorMessage={terminationError}
          onClose={handleTerminationResultClose}
        />
      )}
    </div>
  );
};

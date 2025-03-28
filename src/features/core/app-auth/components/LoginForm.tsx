'use client';

import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm.enhanced';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LoginValidationError, OTPChallenge } from '../anti-sharing/components';

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
    loginStatus,
    handleOtpVerification,
    handleValidationContinue,
    handleCancel,
  } = useLoginForm({ redirectTo });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
      
      {/* Login validation error dialog */}
      <LoginValidationError
        isOpen={showValidationError}
        status={loginStatus}
        onContinue={handleValidationContinue}
        onCancel={handleCancel}
      />
      
      {/* OTP challenge dialog */}
      <OTPChallenge
        isOpen={showOtpChallenge}
        onVerify={handleOtpVerification}
        onCancel={handleCancel}
      />
    </>
  );
};

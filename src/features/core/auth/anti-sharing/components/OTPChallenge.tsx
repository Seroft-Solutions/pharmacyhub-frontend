'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAntiSharingStore } from '../store';
import {InputOTP} from "@/components/ui/input-otp";

// OTP input validation schema
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OTPChallengeProps {
  isOpen: boolean;
  onVerify: (otp: string) => Promise<boolean>;
  onCancel: () => void;
}

export const OTPChallenge: React.FC<OTPChallengeProps> = ({ isOpen, onVerify, onCancel }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deviceId } = useAntiSharingStore();

  // Initialize form with react-hook-form
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: OtpFormValues) => {
    setIsVerifying(true);
    setError(null);

    try {
      const isSuccess = await onVerify(data.otp);
      
      if (!isSuccess) {
        setError('Invalid verification code. Please try again.');
        form.reset();
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit verification code that was sent to your email or phone.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      containerClassName="flex justify-center gap-2"
                      inputClassName="w-10 h-12 text-center border rounded"
                    />
                  </FormControl>
                  {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <div className="text-sm text-gray-500 mt-4">
          <p>This device will be registered as a trusted device for your account.</p>
          <p className="mt-2">Device ID: {deviceId.substring(0, 8)}...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from URL query parameters
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setErrorMessage('No verification token provided.');
          return;
        }

        // Make the verification request
        const response = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage('The verification link is invalid or has expired.');
        }
      } catch (error) {
        console.error('Error during verification:', error);
        setStatus('error');
        setErrorMessage('A network error occurred while trying to verify your email.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <h1 className="text-xl font-medium text-gray-800 mb-2">Verifying your email</h1>
            <p className="text-gray-600">Please wait while we process your verification...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-red-700 mb-2">Verification Failed</h1>
            <p className="text-center text-gray-700 mb-4">{errorMessage}</p>
            <p className="text-center text-gray-600 mb-6">
              The email verification link may have expired or is invalid.
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
                Back to Home
              </Button>
              <Button className="w-full" onClick={() => router.push('/login')}>
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-green-700 mb-2">Email Verified Successfully!</h1>
          <p className="text-center text-gray-700 mb-6">
            Your email has been verified. You can now log in to your account.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Proceed to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

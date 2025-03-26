"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Email Verification Page
 * 
 * This page handles email verification with token in query parameter format
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't do anything if there's no token
    if (!token) {
      setError('No verification token provided');
      setIsLoading(false);
      return;
    }

    // Function to verify the email
    const verifyEmail = async () => {
      try {
        // Make a direct GET request to the backend
        const response = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // Handle response
        if (response.ok) {
          setIsVerified(true);
        } else {
          // Try to parse error from response
          try {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to verify email');
          } catch (parseError) {
            setError(`Verification failed with status: ${response.status}`);
          }
        }
      } catch (err) {
        console.error('Email verification error:', err);
        setError('Failed to connect to the verification service');
      } finally {
        setIsLoading(false);
      }
    };

    // Call the verification function
    verifyEmail();
  }, [token]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
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
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-red-700 mb-2">Verification Failed</h1>
            <p className="text-gray-700 mb-4 text-center">{error}</p>
            <p className="mb-6 text-gray-600 text-center">
              The email verification link may have expired or is invalid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
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
  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-green-700 mb-2">Email Verified Successfully!</h1>
            <p className="text-gray-700 mb-6 text-center">
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

  return null;
}

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../api/services/authService';
import { Button } from '@/components/ui/button';
import { ROUTES } from '../../config/auth';

interface EmailVerificationViewProps {
  token: string;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({ token }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('No verification token provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await authService.verifyEmail(token);
        setIsVerified(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify email');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const handleRedirect = () => {
    router.push(ROUTES.LOGIN);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <p className="font-bold">Verification Failed</p>
          <p>{error}</p>
        </div>
        <p className="mb-4 text-gray-600">
          The email verification link may have expired or is invalid.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}>
            Request New Link
          </Button>
          <Button onClick={() => router.push(ROUTES.LOGIN)}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 max-w-md">
          <p className="font-bold">Email Verified Successfully!</p>
          <p>Your email has been verified. You can now log in to your account.</p>
        </div>
        <Button onClick={handleRedirect} className="mt-4">
          Proceed to Login
        </Button>
      </div>
    );
  }

  return null;
};

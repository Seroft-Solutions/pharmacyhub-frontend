"use client";

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerificationFailedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-red-700 mb-2">Verification Failed</h1>
          <p className="text-center text-gray-700 mb-4">
            The email verification link is invalid or has expired.
          </p>
          <p className="text-center text-gray-600 mb-6">
            Please try again or contact customer support if the problem persists.
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

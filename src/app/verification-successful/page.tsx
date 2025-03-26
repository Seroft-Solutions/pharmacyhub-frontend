"use client";

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerificationSuccessPage() {
  const router = useRouter();

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

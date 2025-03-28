"use client";

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Loading component for suspense fallback
function VerificationLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <h1 className="text-xl font-medium text-gray-800 mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we prepare your verification...</p>
        </div>
      </div>
    </div>
  );
}

// Main component with search params
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.push('/verification-failed');
      return;
    }

    // Redirect directly to backend verification endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    window.location.href = `${backendUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <h1 className="text-xl font-medium text-gray-800 mb-2">Redirecting...</h1>
          <p className="text-gray-600">Please wait while we verify your email...</p>
        </div>
      </div>
    </div>
  );
}

// Export the wrapped component
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

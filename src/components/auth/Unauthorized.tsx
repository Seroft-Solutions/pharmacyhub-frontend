'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

interface UnauthorizedProps {
  message?: string;
  showBackButton?: boolean;
}

export const Unauthorized: FC<UnauthorizedProps> = ({
  message = "You don't have permission to access this page.",
  showBackButton = true,
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-red-600 text-4xl font-bold mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <div className="flex flex-col space-y-4">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
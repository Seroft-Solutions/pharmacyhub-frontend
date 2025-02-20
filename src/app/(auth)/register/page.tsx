"use client";

import { useEffect, useState } from 'react';
import { RegisterForm } from '@/features/auth/ui/register/RegisterForm';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [error, setError] = useState<Error | null>(null);

  // Global error boundary for the register page
  useEffect(() => {
    // Reset error state when component mounts
    setError(null);

    // Add global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setError(event.error);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <AuthLayout>
        <Card className="border-red-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Registration Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We encountered an error during registration. Please try again later or contact support.</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

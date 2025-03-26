"use client";

// Import Toaster component to ensure toasts work correctly
import { Toaster } from '@/components/ui/toaster';

import { ResetPasswordForm } from '@/features/core/auth/components/passwordRecovery/ResetPasswordForm';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/features/core/auth/api/services/authService';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordTokenPage({ params }: ResetPasswordPageProps) {
  const { token } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // We'll use this effect to handle missing or empty tokens
  useEffect(() => {
    if (!token || token.length < 5) {
      console.error("Invalid token detected in URL");
      // Redirect to forgot password page if token is missing or invalid
      router.push('/forgot-password?error=invalid_token&from=reset_token');
    } else {
      setIsLoading(false);
    }
  }, [token, router]);
  
  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
      <Toaster />
    </AuthLayout>
  );
}

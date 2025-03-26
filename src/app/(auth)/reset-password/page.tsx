"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';
import { ResetPasswordForm } from '@/features/core/auth/components/passwordRecovery/ResetPasswordForm';
import { ROUTES } from '@/features/core/auth/config/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  // Redirect to forgot password if no token provided
  useEffect(() => {
    if (!token) {
      router.replace(ROUTES.FORGOT_PASSWORD);
    }
  }, [token, router]);

  if (!token) {
    return null; // Don't render anything while redirecting
  }

  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

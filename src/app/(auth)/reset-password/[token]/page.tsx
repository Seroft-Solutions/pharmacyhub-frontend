"use client";

import { ResetPasswordForm } from '@/features/core/auth/components/passwordRecovery/ResetPasswordForm';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';

// @ts-ignore - Next.js type issues
export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const { token } = params;
  
  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

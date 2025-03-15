"use client";

import { ResetPasswordForm } from '@/features/core/auth/components/passwordRecovery/ResetPasswordForm';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = params;
  
  return (
    <AuthLayout title="Set New Password">
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

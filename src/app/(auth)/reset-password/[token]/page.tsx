"use client";

import { ResetPasswordForm } from '@/features/auth/components/passwordRecovery/ResetPasswordForm';
import { AuthLayout } from '@/features/auth/components/layout/AuthLayout';

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

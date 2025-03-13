"use client";

import { ResetPasswordForm } from '@/features/auth/ui/passwordRecovery/ResetPasswordForm';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';

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

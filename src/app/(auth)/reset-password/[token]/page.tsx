"use client";

import { ResetPasswordForm } from '@/features/auth/ui/password-recovery/ResetPasswordForm';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = params;
  
  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

"use client";

import { ResetPasswordForm } from '@/features/core/auth/components/passwordRecovery/ResetPasswordForm';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordTokenPage({ params }: ResetPasswordPageProps) {
  const { token } = params;
  
  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

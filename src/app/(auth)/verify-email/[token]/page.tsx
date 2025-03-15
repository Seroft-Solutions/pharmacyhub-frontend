"use client";

import { EmailVerificationView } from '@/features/core/auth/components';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';

interface VerifyEmailPageProps {
  params: {
    token: string;
  };
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = params;
  
  return (
    <AuthLayout title="Verify Email">
      <EmailVerificationView token={token} />
    </AuthLayout>
  );
}

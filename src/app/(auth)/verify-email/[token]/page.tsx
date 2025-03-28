"use client";

import { EmailVerificationView } from '@/features/core/app-auth/components';
import { AuthLayout } from '@/features/core/app-auth/components/layout/AuthLayout';

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

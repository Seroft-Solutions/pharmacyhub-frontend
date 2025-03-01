"use client";

import { EmailVerificationView } from '@/features/auth/ui';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';

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

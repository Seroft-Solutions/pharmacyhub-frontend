"use client";

import { ForgotPasswordForm } from '@/features/core/auth/components/passwordRecovery/ForgotPasswordForm';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset Password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

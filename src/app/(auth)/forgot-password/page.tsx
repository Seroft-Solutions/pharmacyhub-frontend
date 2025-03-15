"use client";

import { ForgotPasswordForm } from '@/features/auth/components/passwordRecovery/ForgotPasswordForm';
import { AuthLayout } from '@/features/auth/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset Password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

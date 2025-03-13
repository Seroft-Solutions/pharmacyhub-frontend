"use client";

import { ForgotPasswordForm } from '@/features/auth/ui/passwordRecovery/ForgotPasswordForm';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset Password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

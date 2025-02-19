"use client";

import { ForgotPasswordForm } from '@/features/auth/ui/password-recovery/ForgotPasswordForm';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

"use client";

import { ForgotPasswordForm } from '@/features/core/app-auth/components/passwordRecovery/ForgotPasswordForm';
import { AuthLayout } from '@/features/core/app-auth/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

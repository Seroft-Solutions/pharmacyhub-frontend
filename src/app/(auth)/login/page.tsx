"use client";

import { LoginForm } from '@/features/core/auth/components/login/LoginForm';
import { AuthLayout } from '@/features/core/auth/components/layout/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout >
      <LoginForm />
    </AuthLayout>
  );
}

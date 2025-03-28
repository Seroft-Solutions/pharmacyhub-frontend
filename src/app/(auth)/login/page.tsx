"use client";

import { LoginForm } from '@/features/core/app-auth/components/login/LoginForm';
import { AuthLayout } from '@/features/core/app-auth/components/layout/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout >
      <LoginForm />
    </AuthLayout>
  );
}

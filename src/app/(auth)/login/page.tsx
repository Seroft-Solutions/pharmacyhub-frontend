"use client";

import { LoginForm } from '@/features/auth/components/login/LoginForm';
import { AuthLayout } from '@/features/auth/components/layout/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout >
      <LoginForm />
    </AuthLayout>
  );
}

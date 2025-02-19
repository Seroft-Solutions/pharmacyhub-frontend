"use client";

import { LoginForm } from '@/features/auth/ui/login/LoginForm';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

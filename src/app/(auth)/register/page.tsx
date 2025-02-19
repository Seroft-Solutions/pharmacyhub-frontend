"use client";

import { RegisterForm } from '@/features/auth/ui/register/RegisterForm';
import { AuthLayout } from '@/features/auth/ui/layout/AuthLayout';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

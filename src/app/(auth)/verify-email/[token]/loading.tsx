"use client";

import { AuthLayout } from '@/features/auth/components/layout/AuthLayout';

export default function Loading() {
  return (
    <AuthLayout title="Verify Email">
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </AuthLayout>
  );
}

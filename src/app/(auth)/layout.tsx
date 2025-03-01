"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/features/auth/config/auth';
import { useAuth } from '@/features/auth/hooks';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is authenticated
    if (user) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, router]);

  // Show loading state while checking auth
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only render children when not authenticated
  return (
    <div className="min-h-screen bg-gray-100">
      {!user && children}
    </div>
  );
}

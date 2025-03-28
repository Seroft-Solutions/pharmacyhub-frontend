"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/features/core/app-auth/hooks';

// Define ROUTES directly to avoid the undefined issue
const ROUTES = {
  DASHBOARD: '/dashboard'
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is authenticated
    if (user) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, router]);

  // Show loading state while checking auth
  if (isLoading) {
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

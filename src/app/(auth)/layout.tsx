"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/config/auth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if explicitly authenticated
    if (status === 'authenticated' && session?.user) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [status, session, router]);

  // Show loading state
  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  // Only render children when explicitly unauthenticated or checking auth
  return (
    <div className="min-h-screen bg-gray-100">
      {(status === 'unauthenticated' || status === 'loading') && children}
    </div>
  );
}
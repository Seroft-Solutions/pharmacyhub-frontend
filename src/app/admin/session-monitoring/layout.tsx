"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/core/app-auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SessionMonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { hasRole } = useAuth();
  
  // Check if user has admin role
  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');
  
  if (!isAdmin) {
    // Redirect to dashboard if not an admin
    router.push('/dashboard');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/admin')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

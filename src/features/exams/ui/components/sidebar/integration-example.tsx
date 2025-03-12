"use client";

// This is an example showing how to integrate the ExamSidebar into the app's actual dashboard layout
// This file is for reference only and is not meant to be used directly

import React from 'react';
import Link from "next/link";
import { Bell } from "lucide-react";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePermissions } from "@/features/rbac/hooks";
import { useIsMobile } from "@/features/ui/hooks";
import { useSession } from "@/features/auth/hooks";
import { ExamSidebar } from "./ExamSidebar";

function Notifications() {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission("view_reports")) return null;

  return (
    <Button variant="ghost" size="default" className="relative">
      <Bell className="h-5 w-5" />
      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
    </Button>
  );
}

export default function ExamDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoadingUser } = useSession({ required: true });
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = React.useState(false);
  
  // This ensures we only render the authenticated content after the component mounts on the client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoadingUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="font-bold text-xl text-blue-600">
                  <ModernMinimalistLogo />
                </Link>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" className="border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <ExamSidebar 
                  collapsible="offcanvas" 
                  variant="floating"
                />
              )}
              <Link href="/dashboard" className="font-bold text-xl text-blue-600">
                <ModernMinimalistLogo />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Notifications />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Hide sidebar on mobile - it's shown in the Sheet component */}
          <div className="hidden md:block">
            <ExamSidebar collapsible="icon" />
          </div>

          <main className="flex-1 min-w-0">
            <Breadcrumbs />
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

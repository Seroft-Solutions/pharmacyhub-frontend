"use client";

import { useSession } from "@/features/auth/hooks";
import Link from "next/link";
import { Bell } from "lucide-react";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { Sidebar } from "@/components/dashboard/Sidebar";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/features/rbac/hooks";
import { useIsMobile } from "@/features/ui/hooks";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useSession({ required: true });
  const isMobile = useIsMobile();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {isMobile && <Sidebar />}
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
            <Sidebar />
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
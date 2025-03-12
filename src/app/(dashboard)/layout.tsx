"use client";

import { AppLayout } from "@/features/shell";
import { DASHBOARD_NAVIGATION } from "@/features/dashboard/navigation";

/**
 * This layout component wraps all dashboard routes.
 * It uses the AppLayout from the shell feature for consistent navigation
 * and directly provides the dashboard navigation items.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout 
      requireAuth={true} 
      appName="Dashboard" 
      features={[DASHBOARD_NAVIGATION]}
    >
      {children}
    </AppLayout>
  );
}

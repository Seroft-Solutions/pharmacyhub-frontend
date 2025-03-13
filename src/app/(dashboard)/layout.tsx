"use client";

import { AppLayout } from "@/features/shell";
import { DEFAULT_FEATURES } from "@/features/shell/navigation/features";
import { RoleProvider } from "@/features/shell/components/sidebar/useRole";

/**
 * This layout component wraps all dashboard routes.
 * It uses the AppLayout from the shell feature for consistent navigation.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <AppLayout 
        requireAuth={true} 
        appName="Dashboard" 
        features={DEFAULT_FEATURES}
      >
        {children}
      </AppLayout>
    </RoleProvider>
  );
}

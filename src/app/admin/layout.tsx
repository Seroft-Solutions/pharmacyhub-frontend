"use client";

import { AppLayout } from "@/features/shell";
import { RoleProvider } from "@/features/shell/Hooks/useRole";
import { ADMIN_FEATURES } from "@/features/shell/navigation/adminFeatures";
import { AuthProvider } from "../../features/core/auth";

/**
 * This layout component wraps all admin routes.
 * It uses the AppLayout from the shell feature for consistent navigation
 * and provides the admin navigation items.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <AppLayout 
        requireAuth={true} 
        appName="Admin Portal" 
        features={ADMIN_FEATURES}
      >
        {children}
      </AppLayout>
    </RoleProvider>
  );
}

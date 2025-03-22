"use client";

import { useEffect, useState } from "react";
import { usePermissions, useAccess } from "@/features/core/rbac/hooks";
import { useSession, useAuth } from "@/features/core/auth/hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/features/shell/store/roleStore";
import {ExamDashboard} from "@/features/exams";
import ExamDashboardPage from "@/app/(exams)/exam/dashboard/page";
import { logger } from "@/shared/lib/logger";

function DashboardMetrics() {
  // Using useAccess for feature-specific checks
  const canViewMetrics = useAccess({
    permissions: ['view_reports'],
  });

  if (!canViewMetrics) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-700">Total Orders</h3>
        <p className="text-2xl font-bold">1,234</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-700">Revenue</h3>
        <p className="text-2xl font-bold">$45,678</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-700">Active Users</h3>
        <p className="text-2xl font-bold">567</p>
      </div>
    </div>
  );
}

function InventorySection() {
  const { hasPermission } = usePermissions();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Inventory Overview</h2>
        {hasPermission('manage_inventory') && (
          <Button variant="outline">Manage Inventory</Button>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span>Low Stock Items</span>
          <span className="font-semibold">12</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>Out of Stock Items</span>
          <span className="font-semibold">3</span>
        </div>
        <div className="flex justify-between">
          <span>Total Products</span>
          <span className="font-semibold">456</span>
        </div>
      </div>
    </div>
  );
}

function AdminSection() {
  const { isAdmin } = usePermissions();

  if (!isAdmin) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline">Manage Users</Button>
        <Button variant="outline">System Settings</Button>
        <Button variant="outline">Access Logs</Button>
        <Button variant="outline">Backup Database</Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { session } = useSession({ required: true });
  const { hasRole } = usePermissions();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check if user has admin role - using the RBAC system directly
  const isAdmin = hasRole('ADMIN') || hasRole('PER_ADMIN');
  
  useEffect(() => {
    // Let the page load first, then check for admin status
    setIsInitialized(true);
  }, []);
  
  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (isInitialized && isAdmin) {
      logger.debug("[Dashboard] User is admin, redirecting to admin dashboard", {
        userRoles: session?.user?.roles
      });
      router.push("/admin/dashboard");
    }
  }, [isAdmin, router, isInitialized, session]);
  
  // If user is admin, don't render the regular dashboard
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to admin dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || session?.user?.email}</h1>
        <p className="text-gray-600 mt-1">
          User Dashboard
        </p>
      </div>

      {/* Metrics Section */}
      <ExamDashboardPage />

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <AdminSection />
      </div>
    </div>
  );
}
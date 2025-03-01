"use client";

import { usePermissions, useAccess } from "@/features/rbac/hooks";
import { useSession } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";

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
  const { isManager } = usePermissions();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
        <p className="text-gray-600 mt-1">
          {isManager ? 'Manager Dashboard' : 'Dashboard'}
        </p>
      </div>

      {/* Metrics Section */}
      <DashboardMetrics />

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <InventorySection />
        <AdminSection />
      </div>
    </div>
  );
}
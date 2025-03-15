"use client";

import { AdminGuard } from "@/features/core/rbac/components";
import { FeatureGuard } from "../../../features/core/rbac";
import { useAuth } from "@/features/core/auth/hooks";

// Basic settings component that's protected by admin role
function BasicSettings() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
      <div className="space-y-4">
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Logged in as: {user?.email}</p>
          <p className="text-sm text-gray-600">Role: {user?.roles.join(', ')}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

// Advanced settings component that requires system management permission
function AdvancedSettings() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
      <div className="space-y-4">
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Permissions: {user?.permissions.join(', ')}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">API Configuration</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">System Backup</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your pharmacy system settings
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Basic settings - requires admin role */}
        <AdminGuard>
          <BasicSettings />
        </AdminGuard>

        {/* Advanced settings - requires manage_system permission */}
        <FeatureGuard permissions={['manage_system']}>
          <AdvancedSettings />
        </FeatureGuard>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { AccessCheck } from '@/components/security/PermissionCheck';

/**
 * Admin component for viewing and managing permissions
 * Only accessible to users with MANAGE_PERMISSIONS permission
 */
export default function PermissionAdmin() {
  // Simplified version for now
  return (
    <AccessCheck
      permissions={['manage:permissions']}
      verifyOnBackend={true}
      fallback={
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>You don't have permission to view this page.</p>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">System Permissions</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="mb-4">This is a placeholder for the permissions management page.</p>
          <p className="text-gray-600">The complete implementation will load permissions from the API service.</p>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Sample Permissions</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      manage:users
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Allows management of user accounts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      USER
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      view:reports
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Allows viewing of system reports
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      REPORT
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      manage:exams
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Allows creation and management of exams
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      EXAM
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AccessCheck>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { securityService } from '@/services/api';
import { PERMISSION_CATEGORIES } from '@/constants/permissions';
import { AccessCheck } from '@/components/security/PermissionCheck';

interface Permission {
  name: string;
  description: string;
  resourceType: string;
  operationType: string;
  requiresApproval: boolean;
}

/**
 * Admin component for viewing and managing permissions
 * Only accessible to users with MANAGE_PERMISSIONS permission
 */
export default function PermissionAdmin() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await securityService.getAvailablePermissions();
        setPermissions(data);
      } catch (error) {
        console.error('Failed to load permissions', error);
        setError('Failed to load permissions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, []);
  
  // Group permissions by resource type for display
  const permissionsByResource = permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.resourceType]) {
      acc[permission.resourceType] = [];
    }
    acc[permission.resourceType].push(permission);
    return acc;
  }, {});
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
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
        
        {Object.keys(permissionsByResource).sort().map(resourceType => (
          <div key={resourceType} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{resourceType}</h2>
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
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requires Approval
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissionsByResource[resourceType]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(permission => (
                      <tr key={permission.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {permission.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.operationType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {permission.requiresApproval ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </AccessCheck>
  );
}
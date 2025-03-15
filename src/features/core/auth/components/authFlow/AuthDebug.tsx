'use client';

import { FC } from 'react';
import { useAuth } from '@/features/core/auth/hooks';

interface AuthDebugProps {
  showRoles?: boolean;
  showPermissions?: boolean;
}

/**
 * Debug component for displaying auth state
 * Only use in development, not in production
 */
export const AuthDebug: FC<AuthDebugProps> = ({
  showRoles = true,
  showPermissions = true,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  if (isLoading) {
    return <div className="bg-yellow-100 p-4 rounded">Loading auth state...</div>;
  }
  
  if (!isAuthenticated) {
    return <div className="bg-red-100 p-4 rounded">Not authenticated</div>;
  }
  
  return (
    <div className="bg-blue-50 p-4 rounded border border-blue-200 text-sm font-mono">
      <h3 className="font-semibold mb-2">Auth Debug</h3>
      <div>
        <strong>User:</strong> {user?.email || 'No email'} (ID: {user?.id || 'unknown'})
      </div>
      
      {showRoles && user?.roles && (
        <div className="mt-2">
          <strong>Roles:</strong>
          <ul className="list-disc pl-5">
            {user.roles.map((role: string) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
      )}
      
      {showPermissions && user?.permissions && (
        <div className="mt-2">
          <strong>Permissions:</strong>
          <ul className="list-disc pl-5">
            {user.permissions.map((perm: string) => (
              <li key={perm}>{perm}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
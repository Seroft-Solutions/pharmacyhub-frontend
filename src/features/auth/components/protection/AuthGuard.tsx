'use client';

import React from 'react';
import { RequireAuth } from './RequireAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAll?: boolean;
}

/**
 * Route guard that combines authentication and authorization
 * 
 * Redirects to login if user is not authenticated
 * Redirects to unauthorized if user is authenticated but doesn't have required access
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requiredRoles = [],
  requiredPermissions = [],
  requireAll = true
}) => {
  return (
    <RequireAuth
      requiredRoles={requiredRoles}
      requiredPermissions={requiredPermissions}
      requireAll={requireAll}
      fallback={fallback}
    >
      {children}
    </RequireAuth>
  );
};

export default AuthGuard;

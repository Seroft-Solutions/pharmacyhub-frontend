'use client';

import React, { useState, useEffect } from 'react';
import { securityService } from '@/features/auth/api';
import { useAuth } from '@/features/auth/hooks';

interface PermissionCheckProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  verifyOnBackend?: boolean;
}

/**
 * Component to conditionally render content based on user permissions
 * Can verify permissions on the backend for critical operations
 */
export function PermissionCheck({ 
  permission, 
  children, 
  fallback = null,
  verifyOnBackend = false
}: PermissionCheckProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission: checkClientPermission } = useAuth();
  
  useEffect(() => {
    const checkPermission = async () => {
      if (verifyOnBackend) {
        try {
          const result = await securityService.checkPermissions([permission]);
          setHasPermission(result[permission] || false);
        } catch (error) {
          console.error(`Failed to check permission: ${permission}`, error);
          setHasPermission(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use client-side permission check
        setHasPermission(checkClientPermission(permission));
        setIsLoading(false);
      }
    };
    
    checkPermission();
  }, [permission, verifyOnBackend, checkClientPermission]);
  
  if (isLoading) return null;
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

interface RoleCheckProps {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  verifyOnBackend?: boolean;
}

/**
 * Component to conditionally render content based on user roles
 * Can verify roles on the backend for critical operations
 */
export function RoleCheck({ 
  role, 
  children, 
  fallback = null,
  verifyOnBackend = false
}: RoleCheckProps) {
  const [hasRole, setHasRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { hasRole: checkClientRole } = useAuth();
  
  useEffect(() => {
    const checkRole = async () => {
      if (verifyOnBackend) {
        try {
          const result = await securityService.checkAccess([role], [], false);
          setHasRole(result);
        } catch (error) {
          console.error(`Failed to check role: ${role}`, error);
          setHasRole(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use client-side role check
        setHasRole(checkClientRole(role));
        setIsLoading(false);
      }
    };
    
    checkRole();
  }, [role, verifyOnBackend, checkClientRole]);
  
  if (isLoading) return null;
  
  return hasRole ? <>{children}</> : <>{fallback}</>;
}

interface AccessCheckProps {
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  verifyOnBackend?: boolean;
}

/**
 * Component to conditionally render content based on complex access rules
 * Supports checking multiple roles and permissions
 */
export function AccessCheck({ 
  roles = [], 
  permissions = [], 
  requireAll = true,
  children, 
  fallback = null,
  verifyOnBackend = false
}: AccessCheckProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { hasAccess: checkClientAccess } = useAuth();
  
  useEffect(() => {
    const checkAccess = async () => {
      if (verifyOnBackend) {
        try {
          const result = await securityService.checkAccess(roles, permissions, requireAll);
          setHasAccess(result);
        } catch (error) {
          console.error('Failed to check access', error);
          setHasAccess(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use client-side access check
        setHasAccess(checkClientAccess(roles as any[], permissions as any[]));
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [roles, permissions, requireAll, verifyOnBackend, checkClientAccess]);
  
  if (isLoading) return null;
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
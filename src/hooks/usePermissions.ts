"use client";

import {useSession} from './useSession';
import {Permission, Role} from '@/types/auth';
import {useCallback, useMemo} from 'react';

interface AccessConfig {
  permissions?: Permission[];
  roles?: Role[];
  requireAll?: boolean;
}

export function usePermissions() {
  const {session} = useSession();
  const user = session?.user;

  const hasPermission = useCallback((permission: Permission) => {
    return user?.permissions?.includes(permission) ?? false;
  }, [user?.permissions]);

  const hasRole = useCallback((role: Role) => {
    return user?.roles?.includes(role) ?? false;
  }, [user?.roles]);

  const checkPermissions = useCallback((requiredPermissions: Permission[]) => {
    return requiredPermissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  const checkRoles = useCallback((requiredRoles: Role[]) => {
    return requiredRoles.some(role => hasRole(role));
  }, [hasRole]);

  const canAccess = useCallback((config: AccessConfig) => {
    const {permissions = [], roles = [], requireAll = true} = config;

    if (!permissions.length && !roles.length) return true;

    const hasRequiredPermissions = permissions.length ? checkPermissions(permissions) : true;
    const hasRequiredRoles = roles.length ? checkRoles(roles) : true;

    return requireAll
      ? hasRequiredPermissions && hasRequiredRoles
      : hasRequiredPermissions || hasRequiredRoles;
  }, [checkPermissions, checkRoles]);

  const permissions = useMemo(() => user?.permissions || [], [user?.permissions]);
  const roles = useMemo(() => user?.roles || [], [user?.roles]);

  const isAdmin = useMemo(() => {
    return roles.some(role => ['ADMIN', 'SUPER_ADMIN'].includes(role));
  }, [roles]);

  const isManager = useMemo(() => {
    return roles.some(role => ['MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(role));
  }, [roles]);

  return {
    hasPermission,
    hasRole,
    checkPermissions,
    checkRoles,
    canAccess,
    permissions,
    roles,
    isAdmin,
    isManager,
    isAuthenticated: !!user,
  };
}

// Hook for checking specific access patterns
export function useAccess(config: AccessConfig) {
  const {canAccess} = usePermissions();
  return useMemo(() => canAccess(config), [canAccess, config]);
}

// Hook for admin-only access
export function useAdminAccess() {
  const {isAdmin} = usePermissions();
  return isAdmin;
}

// Hook for manager-only access
export function useManagerAccess() {
  const {isManager} = usePermissions();
  return isManager;
}
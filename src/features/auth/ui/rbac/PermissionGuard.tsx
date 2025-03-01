/**
 * Permission-based access control components
 * 
 * These components help restrict access to UI elements based on
 * user permissions. They use the central permission constants
 * to enforce consistent access control throughout the application.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../core/AuthContext';
import { Permission, Role } from '../../constants/permissions';

// Component that renders children only if user has the required permission
export const PermissionGuard: React.FC<{
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permission, fallback = null, children }) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has the required permission
    if (user && user.permissions) {
      setCanAccess(user.permissions.includes(permission));
    } else {
      setCanAccess(false);
    }
  }, [user, permission]);
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has any of the required permissions
export const AnyPermissionGuard: React.FC<{
  permissions: Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permissions, fallback = null, children }) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has any of the required permissions
    if (user && user.permissions && permissions.length > 0) {
      setCanAccess(permissions.some(permission => user.permissions.includes(permission)));
    } else {
      setCanAccess(false);
    }
  }, [user, permissions]);
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has all of the required permissions
export const AllPermissionsGuard: React.FC<{
  permissions: Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permissions, fallback = null, children }) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has all of the required permissions
    if (user && user.permissions && permissions.length > 0) {
      setCanAccess(permissions.every(permission => user.permissions.includes(permission)));
    } else {
      setCanAccess(false);
    }
  }, [user, permissions]);
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has the required role
export const RoleGuard: React.FC<{
  role: Role;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ role, fallback = null, children }) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has the required role
    if (user && user.roles) {
      setCanAccess(user.roles.includes(role));
    } else {
      setCanAccess(false);
    }
  }, [user, role]);
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has any of the required roles
export const AnyRoleGuard: React.FC<{
  roles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ roles, fallback = null, children }) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has any of the required roles
    if (user && user.roles && roles.length > 0) {
      setCanAccess(roles.some(role => user.roles.includes(role)));
    } else {
      setCanAccess(false);
    }
  }, [user, roles]);
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Custom hook for permission checking
export const usePermission = (permission: Permission) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has the required permission
    if (user && user.permissions) {
      setCanAccess(user.permissions.includes(permission));
    } else {
      setCanAccess(false);
    }
  }, [user, permission]);
  
  return { canAccess };
};

// Custom hook for role checking
export const useRole = (role: Role) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has the required role
    if (user && user.roles) {
      setCanAccess(user.roles.includes(role));
    } else {
      setCanAccess(false);
    }
  }, [user, role]);
  
  return { canAccess };
};

/**
 * Permission-based access control components
 * 
 * These components help restrict access to UI elements based on
 * user permissions. They use the central permission constants
 * to enforce consistent access control throughout the application.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Permission, Role } from './permissions';

// Component that renders children only if user has the required permission
export const PermissionGuard: React.FC<{
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permission, fallback = null, children }) => {
  const { hasPermission } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const allowed = await hasPermission(permission);
        setCanAccess(allowed);
      } catch (error) {
        console.error(`Permission check error for ${permission}:`, error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermission();
  }, [hasPermission, permission]);
  
  if (loading) {
    return null; // Or a loading spinner if preferred
  }
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has any of the required permissions
export const AnyPermissionGuard: React.FC<{
  permissions: Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permissions, fallback = null, children }) => {
  const { hasPermission } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check each permission until one returns true
        for (const permission of permissions) {
          const allowed = await hasPermission(permission);
          if (allowed) {
            setCanAccess(true);
            return;
          }
        }
        setCanAccess(false);
      } catch (error) {
        console.error('Permission check error:', error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermissions();
  }, [hasPermission, permissions]);
  
  if (loading) {
    return null; // Or a loading spinner if preferred
  }
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has all of the required permissions
export const AllPermissionsGuard: React.FC<{
  permissions: Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permissions, fallback = null, children }) => {
  const { hasPermission } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // All permissions must return true
        for (const permission of permissions) {
          const allowed = await hasPermission(permission);
          if (!allowed) {
            setCanAccess(false);
            return;
          }
        }
        setCanAccess(true);
      } catch (error) {
        console.error('Permission check error:', error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermissions();
  }, [hasPermission, permissions]);
  
  if (loading) {
    return null; // Or a loading spinner if preferred
  }
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has the required role
export const RoleGuard: React.FC<{
  role: Role;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ role, fallback = null, children }) => {
  const { hasRole } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const allowed = await hasRole(role);
        setCanAccess(allowed);
      } catch (error) {
        console.error(`Role check error for ${role}:`, error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkRole();
  }, [hasRole, role]);
  
  if (loading) {
    return null; // Or a loading spinner if preferred
  }
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Component that renders children only if user has any of the required roles
export const AnyRoleGuard: React.FC<{
  roles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ roles, fallback = null, children }) => {
  const { hasRole } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkRoles = async () => {
      try {
        // Check each role until one returns true
        for (const role of roles) {
          const allowed = await hasRole(role);
          if (allowed) {
            setCanAccess(true);
            return;
          }
        }
        setCanAccess(false);
      } catch (error) {
        console.error('Role check error:', error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkRoles();
  }, [hasRole, roles]);
  
  if (loading) {
    return null; // Or a loading spinner if preferred
  }
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

// Custom hook for permission checking
export const usePermission = (permission: Permission) => {
  const { hasPermission } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const allowed = await hasPermission(permission);
        setCanAccess(allowed);
      } catch (error) {
        console.error(`Permission check error for ${permission}:`, error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermission();
  }, [hasPermission, permission]);
  
  return { canAccess, loading };
};

// Custom hook for role checking
export const useRole = (role: Role) => {
  const { hasRole } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const allowed = await hasRole(role);
        setCanAccess(allowed);
      } catch (error) {
        console.error(`Role check error for ${role}:`, error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkRole();
  }, [hasRole, role]);
  
  return { canAccess, loading };
};

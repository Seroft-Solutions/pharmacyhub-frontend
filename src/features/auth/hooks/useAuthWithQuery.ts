/**
 * Auth Hooks with Query Integration
 * 
 * Hooks for authentication and authorization using TanStack Query
 */
import { Permission, Role } from "@/types/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { queryClient } from '@/features/tanstack-query-api';
import { useUserProfile, authApiHooks } from "../api/hooks";
// Use the query keys from the new API hooks
const authKeys = authApiHooks.queryKeys;
import { useAuth as useBaseAuth } from './useAuth';
import { tokenManager } from '../core/tokenManager';

/**
 * Main hook for auth state and operations with query integration
 */
export function useAuth() {
  const baseAuth = useBaseAuth();

  // Use TanStack Query to fetch the user profile
  const { 
    data: extendedProfile, 
    isLoading: isProfileLoading, 
    refetch: refetchProfile
  } = useUserProfile();

  // Get roles from extended profile or base auth
  const getRoles = (): Role[] => {
    if (extendedProfile?.roles) {
      return extendedProfile.roles as Role[];
    }
    return baseAuth.user?.roles as Role[] || [];
  };

  // Get permissions from extended profile or base auth
  const getPermissions = (): Permission[] => {
    if (extendedProfile?.permissions) {
      return extendedProfile.permissions as Permission[];
    }
    return baseAuth.user?.permissions as Permission[] || [];
  };

  const hasPermission = (permission: Permission) => {
    const permissions = getPermissions();
    return permissions.includes(permission);
  };

  const hasRole = (role: Role) => {
    const roles = getRoles();
    return roles.includes(role);
  };

  const hasAccess = (requiredRoles?: Role[], requiredPermissions?: Permission[]) => {
    if (!requiredRoles?.length && !requiredPermissions?.length) {
      return true;
    }

    const hasRequiredRole = requiredRoles?.some(role => hasRole(role)) ?? true;
    const hasRequiredPermission = requiredPermissions?.every(permission =>
      hasPermission(permission)
    ) ?? true;

    return hasRequiredRole && hasRequiredPermission;
  };

  const refreshProfile = async () => {
    try {
      // Use the refetch function provided by useQuery
      const result = await refetchProfile();
      
      // Return the fresh data
      return result.data;
    } catch (error) {
      console.error('Failed to refresh user profile', error);
      throw error;
    }
  };

  const extendedLogout = async () => {
    try {
      // Clear query cache for auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.me() });
      
      // Call base auth logout
      await baseAuth.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if server call fails
      tokenManager.removeToken();
      window.location.href = '/login';
    }
  };

  const combinedAuth = {
    ...baseAuth,
    user: extendedProfile ? {
      ...baseAuth.user,
      ...extendedProfile,
    } : baseAuth.user,
    isLoading: baseAuth.isLoggingIn || isProfileLoading,
    hasPermission,
    hasRole,
    hasAccess,
    refreshProfile,
    logout: extendedLogout,
  };

  return combinedAuth;
}

type BackendVerification = {
  error?: string;
  data?: {
    hasAccess: boolean;
  };
};

/**
 * Custom hook to protect components
 */
export function useRequireAuth(
  requiredRoles?: Role[],
  requiredPermissions?: Permission[],
  options?: { verifyOnBackend?: boolean }
) {
  const { hasAccess, isLoading, refreshProfile } = useAuth();
  const [backendVerified, setBackendVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // If backend verification is requested, check with the backend
    const verifyAccess = async () => {
      if (options?.verifyOnBackend && !isLoading && !backendVerified) {
        setIsVerifying(true);
        try {
          // Make API call to verify access
          const response = await fetch('/api/auth/verify-access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              roles: requiredRoles || [],
              permissions: requiredPermissions || [],
            }),
          });

          const result = (await response.json()) as BackendVerification;
          
          if (result.error) {
            console.error('Error verifying access:', result.error);
            redirect("/unauthorized");
          }
          
          if (!result.data?.hasAccess) {
            redirect("/unauthorized");
          }
          
          setBackendVerified(true);
        } catch (error) {
          console.error('Failed to verify access with backend', error);
          redirect("/unauthorized");
        } finally {
          setIsVerifying(false);
        }
      }
    };

    verifyAccess();
  }, [isLoading, options?.verifyOnBackend, backendVerified, requiredRoles, requiredPermissions]);

  // First do client-side check
  if (isLoading || isVerifying) {
    return { isLoading: true };
  }

  // If not verifying with backend, just check client-side
  if (!options?.verifyOnBackend) {
    const hasRequiredAccess = hasAccess(requiredRoles, requiredPermissions);
    if (!hasRequiredAccess) {
      redirect("/unauthorized");
    }
  }

  return { isLoading: false, refreshProfile };
}

/**
 * Auth Hooks
 * 
 * Hooks for authentication and authorization using TanStack Query
 */
import {signOut, useSession} from "next-auth/react";
import {Permission, Role} from "@/types/auth";
import {redirect} from "next/navigation";
import { useEffect, useState } from "react";
import { queryClient } from '@/features/tanstack-query-api';
import { useUserProfile } from "../api/hooks/queries";
import { authQueryKeys } from "../api/queryKeys";
import { securityService } from "../api/services/securityService";

/**
 * Main hook for auth state and operations
 */
export function useAuth() {
  const {data: session, status} = useSession({
    required: false,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  // Use TanStack Query to fetch the user profile
  const { 
    data: extendedProfile, 
    isLoading: isProfileLoading, 
    refetch: refetchProfile
  } = useUserProfile({
    // Only fetch profile when user is authenticated
    enabled: !!session?.user,
    // Suppress automatic error handling since we handle it here
    onError: (error) => {
      console.error('Failed to load user profile', error);
    }
  });

  // Get roles either from extended profile or session
  const getRoles = (): Role[] => {
    if (extendedProfile?.roles) {
      return extendedProfile.roles as Role[];
    }
    return session?.user?.roles as Role[] || [];
  };

  // Get permissions either from extended profile or session
  const getPermissions = (): Permission[] => {
    if (extendedProfile?.permissions) {
      return extendedProfile.permissions as Permission[];
    }
    return session?.user?.permissions as Permission[] || [];
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

  const logout = async () => {
    // Clear query cache for auth-related queries
    queryClient.removeQueries({ queryKey: authQueryKeys.user.profile() });
    
    await signOut({
      callbackUrl: "/login",
      redirect: true
    });
  };

  // Combined user data from session and extended profile
  const user = extendedProfile ? {
    ...session?.user,
    ...extendedProfile,
  } : session?.user;

  return {
    user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading" || isProfileLoading,
    hasPermission,
    hasRole,
    hasAccess,
    refreshProfile,
    logout,
    session,
    status
  };
}

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
          const response = await securityService.checkAccess(
            requiredRoles || [], 
            requiredPermissions || []
          );
          
          if (response.error) {
            console.error('Error verifying access:', response.error);
            redirect("/unauthorized");
          }
          
          if (!response.data?.hasAccess) {
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

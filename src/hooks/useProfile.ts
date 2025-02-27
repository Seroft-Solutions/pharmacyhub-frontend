import {useCallback} from 'react';
import {useAuth} from '@/shared/auth';
import {AuthUser, Role, Permission} from '@/types/auth';

interface UseProfileResult {
  profile: AuthUser | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<AuthUser | null>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const mapProfileToAuthUser = (data: any): AuthUser => ({
  id: data.id.toString(),
  email: data.emailAddress,
  name: `${data.firstName} ${data.lastName}`,
  firstName: data.firstName,
  lastName: data.lastName,
  phoneNumber: data.contactNumber,
  roles: data.roles,
  permissions: data.permissions,
  userType: data.userType
});

/**
 * Hook for accessing user profile data
 * This is a wrapper around useAuth that maps the data to AuthUser format
 * 
 * IMPORTANT: This hook now uses AuthContext to avoid redundant API calls
 */
export const useProfile = (): UseProfileResult => {
  const { user, isAuthenticated, isLoading, error, refreshUserProfile } = useAuth();

  // Map user data to AuthUser format
  const mappedProfile = user ? mapProfileToAuthUser(user) : null;

  // Refresh profile function
  const refetch = useCallback(async () => {
    const refreshedUser = await refreshUserProfile();
    return refreshedUser ? mapProfileToAuthUser(refreshedUser) : null;
  }, [refreshUserProfile]);

  // Update profile function (placeholder, to be implemented as needed)
  const updateProfile = async (updateData: Partial<AuthUser>) => {
    // This would need to be implemented based on your API
    console.warn('Profile update not implemented');
  };

  return {
    profile: mappedProfile,
    loading: isLoading,
    error,
    refetch,
    updateProfile
  };
};

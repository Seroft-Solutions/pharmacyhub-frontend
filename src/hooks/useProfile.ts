import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/shared/auth';
import {AuthUser, Role, Permission} from '@/types/auth';
import {createAuthHeaders} from '@/shared/auth/utils';
import { TOKEN_CONFIG, API_CONFIG, AUTH_ENDPOINTS } from '@/shared/auth/apiConfig';

interface UserProfileResponse {
  id: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  userType: string;
  registered: boolean;
  openToConnect: boolean;
  verified: boolean;
  roles: Role[];
  permissions: Permission[];
}

interface UseProfileResult {
  profile: AuthUser | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const mapProfileToAuthUser = (data: UserProfileResponse): AuthUser => ({
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

export const useProfile = (): UseProfileResult => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAccessToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    if (!token) {
      console.warn('Access token not found in localStorage');
      return null;
    }
    return token;
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    try {
      setLoading(true);
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('Fetching profile with token:', token?.substring(0, 10) + '...'); // Debug log

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.USER_PROFILE}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error('Profile fetch failed with status:', response.status, response.statusText);
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Error parsing error response:', e);
          errorData = {};
        }
        console.error('Error details:', errorData);
        throw new Error(
          errorData.error || errorData.message || `Failed to fetch profile: ${response.status} ${response.statusText}`
        );
      }
      
      console.log('Profile fetch successful!');

      const responseData: UserProfileResponse = await response.json();
      const mappedProfile = mapProfileToAuthUser(responseData);
      setProfile(mappedProfile);
    } catch (err) {
      console.error('Profile fetch error:', err); // Debug log
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, getAccessToken]);

  const updateProfile = async (updateData: Partial<AuthUser>) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.USER_PROFILE}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update profile: ${response.status} ${response.statusText}`
        );
      }

      const responseData: UserProfileResponse = await response.json();
      const mappedProfile = mapProfileToAuthUser(responseData);
      setProfile(mappedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, authLoading, profile, fetchProfile]);

  // Initialize profile from user if available
  useEffect(() => {
    if (user && !profile && !loading) {
      setProfile(mapProfileToAuthUser(user as unknown as UserProfileResponse));
    }
  }, [user, profile, loading]);

  return {
    profile,
    loading: loading || authLoading,
    error,
    refetch: fetchProfile,
    updateProfile
  };
};

import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/shared/auth';
import {AuthUser} from '@/types/auth';
import {createAuthHeaders} from '@/shared/auth/utils';
import { TOKEN_CONFIG } from '@/shared/auth/apiConfig';

interface UseProfileResult {
  profile: AuthUser | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

export const useProfile = (): UseProfileResult => {
  const {user, isAuthenticated} = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  };

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/profile`,
        {headers: createAuthHeaders(token)}
      );

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/profile`,
        {
          method: 'PATCH',
          headers: createAuthHeaders(token),
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, profile, fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile
  };
};

/*
Usage Example:

const ProfileComponent = () => {
  const { 
    profile, 
    loading, 
    error, 
    updateProfile 
  } = useProfile();

  if (loading) return <ProfileLoading />;
  if (error) return <ErrorMessage error={error} />;
  if (!profile) return null;

  const handleUpdate = async (formData) => {
    try {
      await updateProfile(formData);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <ProfileForm 
      profile={profile} 
      onSubmit={handleUpdate} 
    />
  );
};
*/
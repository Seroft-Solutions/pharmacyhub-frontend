import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthUser } from '@/types/auth';
import { createAuthHeaders } from '@/lib/auth';

interface UseProfileResult {
  profile: AuthUser | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

export const useProfile = (): UseProfileResult => {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token.access) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/profile`,
        { headers: createAuthHeaders(token.access) }
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
  }, [token.access]);

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!token.access) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/profile`,
        {
          method: 'PATCH',
          headers: createAuthHeaders(token.access),
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
    if (token.access && !profile) {
      fetchProfile();
    }
  }, [token.access, profile, fetchProfile]);

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
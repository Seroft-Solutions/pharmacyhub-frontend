"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../model/types';
import authService from '../api/authService';

interface UseSessionOptions {
  required?: boolean;
  redirectTo?: string;
}

interface Session {
  user: UserProfile | null;
}

export function useSession({ required = false, redirectTo = '/login' }: UseSessionOptions = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        try {
          const userProfile = await authService.getUserProfile();
          setSession({
            user: userProfile
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setIsAuthenticated(false);
          if (required) {
            router.push(redirectTo);
          }
        }
      } else if (required) {
        router.push(redirectTo);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [required, redirectTo, router]);

  return { 
    isAuthenticated, 
    session, 
    isLoading 
  };
}

export default useSession;
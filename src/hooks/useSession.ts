"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/shared/auth';

interface UseSessionOptions {
  required?: boolean;
}

interface User {
  name?: string;
  email?: string;
  roles?: string[];
}

interface Session {
  user?: User;
}

export function useSession({ required = false }: UseSessionOptions = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        try {
          const userProfile = await authService.getUserProfile();
          setSession({
            user: {
              name: userProfile.name,
              email: userProfile.email,
              roles: userProfile.roles
            }
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setIsAuthenticated(false);
          if (required) {
            router.push('/login');
          }
        }
      } else if (required) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [required, router]);

  return { isAuthenticated, session };
}
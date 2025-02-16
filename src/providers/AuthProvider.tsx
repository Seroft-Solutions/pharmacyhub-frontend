import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      const isAuthenticated = authService.isAuthenticated();

      setUser(user);
      setIsAuthenticated(isAuthenticated);

      if (!isAuthenticated) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, setUser, setIsAuthenticated]);

  return <>{children}</>;
} 
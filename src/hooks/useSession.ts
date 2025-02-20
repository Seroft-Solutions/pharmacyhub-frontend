"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { keycloakService } from '@/shared/auth';

interface UseSessionOptions {
  required?: boolean;
}

export function useSession({ required = false }: UseSessionOptions = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = keycloakService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (!isAuth && required) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [required, router]);

  return { isAuthenticated };
}
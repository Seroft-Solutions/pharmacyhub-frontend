"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { apiClient } from '@/features/tanstack-query-api';
import { AUTH_ENDPOINTS } from '../api/constants';

export const useLoginForm = (redirectPath = '/dashboard') => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, endpoint: AUTH_ENDPOINTS.login });
      
      // Try direct API call first for debugging
      const directResponse = await apiClient.post(AUTH_ENDPOINTS.login, { 
        emailAddress: email, 
        password 
      });
      
      console.log('Direct API response:', directResponse);
      
      // Now use the Auth context login
      await login(email, password);
      router.push(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      
      if (err instanceof Error) {
        if (err.message.includes('403') || err.message.includes('Forbidden')) {
          setError('Access forbidden - check API permissions and CORS settings');
        } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('Invalid email or password');
        } else if (err.message.includes('Network Error')) {
          setError('Network error - check if the backend server is running');
        } else {
          setError(err.message);
        }
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router, redirectPath]);

  const handleSocialLogin = useCallback((provider: 'google' | 'facebook') => {
    // For social login, we'll redirect to Keycloak's login page with the selected provider
    const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL || 'http://localhost:8080';
    const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pharmacyhub';
    const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pharmacyhub-client';

    // Direct backend callback URL
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const identityProvider = provider === 'google' ? 'google' : 'facebook';

    window.location.href = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid&kc_idp_hint=${identityProvider}`;
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    isLoading,
    handleSubmit,
    handleSocialLogin
  };
};

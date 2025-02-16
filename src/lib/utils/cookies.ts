import Cookies from 'js-cookie';
import { AuthResponse } from '@/services/authService';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  expires: 7, // 7 days
};

export const cookieUtils = {
  setAuthToken: (token: string) => {
    Cookies.set('auth-token', token, COOKIE_OPTIONS);
  },

  getAuthToken: () => {
    return Cookies.get('auth-token');
  },

  setUser: (user: AuthResponse['user']) => {
    Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
  },

  getUser: (): AuthResponse['user'] | null => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  clearAuth: () => {
    Cookies.remove('auth-token', { path: '/' });
    Cookies.remove('user', { path: '/' });
  },
}; 